import { Hono } from 'hono'
import { encrypt, decrypt } from '../../lib/encryption.js'
import { validateInstagramToken } from '../../lib/publishers/instagram.js'
import { validateFacebookToken } from '../../lib/publishers/facebook.js'
import { addPublishJob, cancelPublishJob, getQueueStats } from '../../lib/queue.js'

type Bindings = {
  DB: D1Database;
}

const apiRoutes = new Hono<{ Bindings: Bindings }>()

// ============================================
// API KEYS ROUTES
// ============================================

// Validar API key de red social
apiRoutes.post('/keys/validate', async (c) => {
  try {
    const { platform, apiKey } = await c.req.json()
    
    if (!platform || !apiKey) {
      return c.json({ error: 'Platform y apiKey son requeridos' }, 400)
    }

    let result

    if (platform === 'instagram') {
      result = await validateInstagramToken(apiKey)
    } else if (platform === 'facebook') {
      result = await validateFacebookToken(apiKey)
    } else {
      return c.json({ error: 'Plataforma no soportada' }, 400)
    }

    return c.json(result)
  } catch (error) {
    console.error('Error validando API key:', error)
    return c.json({ error: 'Error al validar API key' }, 500)
  }
})

// Guardar API key encriptada
apiRoutes.post('/keys/save', async (c) => {
  try {
    const userId = c.req.header('X-User-ID')
    if (!userId) {
      return c.json({ error: 'No autorizado' }, 401)
    }

    const { platform, apiKey, accountId, accountInfo, pageAccessToken } = await c.req.json()
    
    if (!platform || !apiKey || !accountId) {
      return c.json({ error: 'Datos incompletos' }, 400)
    }

    const { DB } = c.env
    
    // Verificar si ya existe una cuenta con este accountId
    const existing = await DB.prepare(
      'SELECT id FROM user_api_keys WHERE user_id = ? AND account_id = ?'
    ).bind(userId, accountId).first()

    if (existing) {
      return c.json({ error: 'Esta cuenta ya está conectada' }, 400)
    }

    // Encriptar API key
    const encrypted = encrypt(apiKey)
    
    // Si es Facebook, también encriptar pageAccessToken
    let encryptedPageToken = null
    if (pageAccessToken) {
      encryptedPageToken = encrypt(pageAccessToken)
    }

    // Guardar en BD
    const result = await DB.prepare(`
      INSERT INTO user_api_keys (
        user_id, service_name, account_id, 
        api_key_encrypted, api_key_iv, api_key_auth_tag,
        account_name, account_avatar, followers_count,
        status, last_validated
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'active', datetime('now'))
    `).bind(
      userId,
      platform,
      accountId,
      encrypted.encrypted,
      encrypted.iv,
      encrypted.authTag,
      accountInfo.username || accountInfo.name,
      accountInfo.avatar,
      accountInfo.followers || 0
    ).run()

    return c.json({ 
      success: true, 
      accountId: result.meta.last_row_id,
      message: 'Cuenta conectada exitosamente'
    }, 201)
  } catch (error) {
    console.error('Error guardando API key:', error)
    return c.json({ error: 'Error al guardar API key' }, 500)
  }
})

// Listar cuentas conectadas (sin mostrar API keys)
apiRoutes.get('/keys/list', async (c) => {
  try {
    const userId = c.req.header('X-User-ID')
    if (!userId) {
      return c.json({ error: 'No autorizado' }, 401)
    }

    const { DB } = c.env
    
    const { results } = await DB.prepare(`
      SELECT 
        id, service_name as platform, account_id, account_name,
        account_avatar, followers_count, status, last_validated,
        created_at
      FROM user_api_keys 
      WHERE user_id = ? AND status = 'active'
      ORDER BY created_at DESC
    `).bind(userId).all()

    return c.json({ accounts: results })
  } catch (error) {
    console.error('Error obteniendo cuentas:', error)
    return c.json({ error: 'Error al obtener cuentas' }, 500)
  }
})

// Obtener API key encriptada (solo para uso interno del worker)
apiRoutes.get('/keys/:id/encrypted', async (c) => {
  try {
    // Verificar secreto interno
    const internalSecret = c.req.header('X-Internal-Secret')
    if (internalSecret !== process.env.INTERNAL_API_SECRET) {
      return c.json({ error: 'No autorizado' }, 401)
    }

    const keyId = c.req.param('id')
    const { DB } = c.env
    
    const apiKey = await DB.prepare(`
      SELECT api_key_encrypted, api_key_iv, api_key_auth_tag
      FROM user_api_keys 
      WHERE id = ?
    `).bind(keyId).first()

    if (!apiKey) {
      return c.json({ error: 'API key no encontrada' }, 404)
    }

    return c.json({ 
      encryptedKey: {
        encrypted: apiKey.api_key_encrypted,
        iv: apiKey.api_key_iv,
        authTag: apiKey.api_key_auth_tag
      }
    })
  } catch (error) {
    console.error('Error obteniendo API key encriptada:', error)
    return c.json({ error: 'Error' }, 500)
  }
})

// Eliminar cuenta conectada
apiRoutes.delete('/keys/:id', async (c) => {
  try {
    const userId = c.req.header('X-User-ID')
    if (!userId) {
      return c.json({ error: 'No autorizado' }, 401)
    }

    const keyId = c.req.param('id')
    const { DB } = c.env
    
    // Marcar como inactiva en lugar de eliminar (para mantener historial)
    await DB.prepare(`
      UPDATE user_api_keys 
      SET status = 'disconnected', updated_at = datetime('now')
      WHERE id = ? AND user_id = ?
    `).bind(keyId, userId).run()

    return c.json({ success: true, message: 'Cuenta desconectada' })
  } catch (error) {
    console.error('Error eliminando API key:', error)
    return c.json({ error: 'Error al eliminar API key' }, 500)
  }
})

// ============================================
// POSTS ROUTES
// ============================================

// Programar publicación
apiRoutes.post('/posts/schedule', async (c) => {
  try {
    const userId = c.req.header('X-User-ID')
    if (!userId) {
      return c.json({ error: 'No autorizado' }, 401)
    }

    const { apiKeyId, platform, content, mediaUrls, scheduledTime } = await c.req.json()
    
    if (!apiKeyId || !platform || !content || !scheduledTime) {
      return c.json({ error: 'Datos incompletos' }, 400)
    }

    const { DB } = c.env
    
    // Verificar que la API key pertenece al usuario
    const apiKey = await DB.prepare(
      'SELECT id, account_id FROM user_api_keys WHERE id = ? AND user_id = ? AND status = "active"'
    ).bind(apiKeyId, userId).first()

    if (!apiKey) {
      return c.json({ error: 'API key no válida' }, 400)
    }

    // Guardar en BD
    const result = await DB.prepare(`
      INSERT INTO automations (
        user_id, name, description, workflow_data,
        status, scheduled_time, media_urls
      ) VALUES (?, ?, ?, ?, 'pending', ?, ?)
    `).bind(
      userId,
      `Post ${platform}`,
      content,
      JSON.stringify({ apiKeyId, platform, accountId: apiKey.account_id }),
      scheduledTime,
      mediaUrls ? JSON.stringify(mediaUrls) : null
    ).run()

    const postId = result.meta.last_row_id

    // Agregar job a BullMQ
    try {
      await addPublishJob({
        postId: postId.toString(),
        userId,
        apiKeyId,
        platform,
        content,
        mediaUrls: mediaUrls || [],
        accountId: apiKey.account_id
      }, new Date(scheduledTime))

      return c.json({ 
        success: true, 
        postId,
        message: 'Post programado exitosamente',
        scheduledTime
      }, 201)
    } catch (queueError) {
      // Si falla agregar a la cola, marcar post como fallido
      await DB.prepare(`
        UPDATE automations 
        SET status = 'failed', error_message = ?
        WHERE id = ?
      `).bind(queueError.message, postId).run()

      throw queueError
    }
  } catch (error) {
    console.error('Error programando post:', error)
    return c.json({ error: 'Error al programar post: ' + error.message }, 500)
  }
})

// Listar posts programados
apiRoutes.get('/posts/list', async (c) => {
  try {
    const userId = c.req.header('X-User-ID')
    if (!userId) {
      return c.json({ error: 'No autorizado' }, 401)
    }

    const status = c.req.query('status') // pending, published, failed

    const { DB } = c.env
    
    let query = `
      SELECT 
        a.id, a.name, a.description as content, 
        a.workflow_data, a.media_urls,
        a.status, a.scheduled_time, a.published_at,
        a.post_url, a.error_message, a.created_at,
        k.service_name as platform, k.account_name, k.account_avatar
      FROM automations a
      LEFT JOIN user_api_keys k ON JSON_EXTRACT(a.workflow_data, '$.apiKeyId') = k.id
      WHERE a.user_id = ?
    `
    
    const params = [userId]
    
    if (status) {
      query += ' AND a.status = ?'
      params.push(status)
    }
    
    query += ' ORDER BY a.scheduled_time DESC LIMIT 100'
    
    const stmt = DB.prepare(query).bind(...params)
    const { results } = await stmt.all()

    // Parsear JSON fields
    const posts = results.map(post => ({
      ...post,
      workflow_data: post.workflow_data ? JSON.parse(post.workflow_data) : null,
      media_urls: post.media_urls ? JSON.parse(post.media_urls) : []
    }))

    return c.json({ posts })
  } catch (error) {
    console.error('Error obteniendo posts:', error)
    return c.json({ error: 'Error al obtener posts' }, 500)
  }
})

// Actualizar status de post (para worker)
apiRoutes.patch('/posts/:id/status', async (c) => {
  try {
    const internalSecret = c.req.header('X-Internal-Secret')
    if (internalSecret !== process.env.INTERNAL_API_SECRET) {
      return c.json({ error: 'No autorizado' }, 401)
    }

    const postId = c.req.param('id')
    const updates = await c.req.json()
    
    const { DB } = c.env
    
    const fields = []
    const values = []
    
    if (updates.status) {
      fields.push('status = ?')
      values.push(updates.status)
    }
    if (updates.published_at) {
      fields.push('published_at = ?')
      values.push(updates.published_at)
    }
    if (updates.post_url) {
      fields.push('post_url = ?')
      values.push(updates.post_url)
    }
    if (updates.platform_post_id) {
      fields.push('platform_post_id = ?')
      values.push(updates.platform_post_id)
    }
    if (updates.error_message) {
      fields.push('error_message = ?')
      values.push(updates.error_message)
    }
    
    fields.push('updated_at = datetime("now")')
    values.push(postId)
    
    await DB.prepare(`
      UPDATE automations 
      SET ${fields.join(', ')}
      WHERE id = ?
    `).bind(...values).run()

    return c.json({ success: true })
  } catch (error) {
    console.error('Error actualizando post:', error)
    return c.json({ error: 'Error' }, 500)
  }
})

// Cancelar post programado
apiRoutes.delete('/posts/:id', async (c) => {
  try {
    const userId = c.req.header('X-User-ID')
    if (!userId) {
      return c.json({ error: 'No autorizado' }, 401)
    }

    const postId = c.req.param('id')
    const { DB } = c.env
    
    // Verificar que el post pertenece al usuario
    const post = await DB.prepare(
      'SELECT id, status FROM automations WHERE id = ? AND user_id = ?'
    ).bind(postId, userId).first()

    if (!post) {
      return c.json({ error: 'Post no encontrado' }, 404)
    }

    if (post.status !== 'pending') {
      return c.json({ error: 'Solo se pueden cancelar posts pendientes' }, 400)
    }

    // Cancelar en BullMQ
    await cancelPublishJob(postId)

    // Actualizar en BD
    await DB.prepare(`
      UPDATE automations 
      SET status = 'cancelled', updated_at = datetime('now')
      WHERE id = ?
    `).bind(postId).run()

    return c.json({ success: true, message: 'Post cancelado' })
  } catch (error) {
    console.error('Error cancelando post:', error)
    return c.json({ error: 'Error al cancelar post' }, 500)
  }
})

// Obtener estadísticas de la cola
apiRoutes.get('/queue/stats', async (c) => {
  try {
    const stats = await getQueueStats()
    return c.json(stats)
  } catch (error) {
    console.error('Error obteniendo stats de cola:', error)
    return c.json({ error: 'Error al obtener estadísticas' }, 500)
  }
})

// ============================================
// ANALYTICS ROUTES
// ============================================

// Obtener analytics del usuario
apiRoutes.get('/analytics/:userId', async (c) => {
  try {
    const userId = c.req.param('userId')
    const { DB } = c.env
    
    // Calcular estadísticas del mes actual
    const currentMonth = new Date().toISOString().substring(0, 7) // YYYY-MM
    
    // Posts publicados este mes
    const postsPublished = await DB.prepare(`
      SELECT COUNT(*) as count
      FROM automations
      WHERE user_id = ? 
        AND status = 'published'
        AND strftime('%Y-%m', published_at) = ?
    `).bind(userId, currentMonth).first()
    
    // Automatizaciones activas (pendientes)
    const activeAutomations = await DB.prepare(`
      SELECT COUNT(*) as count
      FROM automations
      WHERE user_id = ? AND status = 'pending'
    `).bind(userId).first()
    
    // Calcular tiempo ahorrado (0.25 horas por post = 15 minutos)
    const timeSaved = (postsPublished?.count || 0) * 0.25
    
    return c.json({
      posts_published: postsPublished?.count || 0,
      active_automations: activeAutomations?.count || 0,
      time_saved_hours: timeSaved
    })
  } catch (error) {
    console.error('Error obteniendo analytics:', error)
    return c.json({ error: 'Error al obtener analytics' }, 500)
  }
})

// Incrementar contador de analytics (para worker)
apiRoutes.post('/analytics/:userId/increment', async (c) => {
  try {
    const internalSecret = c.req.header('X-Internal-Secret')
    if (internalSecret !== process.env.INTERNAL_API_SECRET) {
      return c.json({ error: 'No autorizado' }, 401)
    }
    
    // Analytics se calculan en tiempo real desde automations table
    // Este endpoint es para futuras expansiones
    return c.json({ success: true })
  } catch (error) {
    console.error('Error incrementando analytics:', error)
    return c.json({ error: 'Error' }, 500)
  }
})

export default apiRoutes
