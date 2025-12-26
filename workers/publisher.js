import { Worker } from 'bullmq';
import { getRedisConnection } from '../lib/redis.js';
import { decrypt } from '../lib/encryption.js';
import { publishInstagramPost } from '../lib/publishers/instagram.js';
import { publishFacebookPost } from '../lib/publishers/facebook.js';

// Nota: Este worker debe ejecutarse como proceso separado
// En producción: node workers/publisher.js

const connection = getRedisConnection();

console.log('🚀 Iniciando Worker de publicaciones...');

const worker = new Worker('social-posts', async (job) => {
  const { postId, userId, apiKeyId, platform, content, mediaUrls, accountId } = job.data;
  
  console.log(`📝 Procesando publicación ${postId} para ${platform}`);
  
  try {
    // 1. Obtener API key desencriptada de la base de datos
    // Nota: Esto requiere acceso a D1 desde el worker
    // En Cloudflare Workers, esto es más complejo
    // Alternativa: pasar el token ya desencriptado (menos seguro) o usar Supabase
    
    const apiKeyEncrypted = await getApiKeyFromDB(apiKeyId);
    
    if (!apiKeyEncrypted) {
      throw new Error(`API key ${apiKeyId} no encontrada`);
    }
    
    // 2. Desencriptar API key
    const accessToken = decrypt(apiKeyEncrypted);
    
    // 3. Obtener primera URL de media
    const imageUrl = mediaUrls && mediaUrls.length > 0 ? mediaUrls[0] : null;
    
    let result;
    
    // 4. Publicar según la plataforma
    if (platform === 'instagram') {
      result = await publishInstagramPost(accessToken, accountId, content, imageUrl);
    } else if (platform === 'facebook') {
      // Para Facebook, necesitamos el pageAccessToken
      // Podría estar almacenado separadamente o regenerarse
      result = await publishFacebookPost(accessToken, accountId, content, imageUrl);
    } else {
      throw new Error(`Plataforma no soportada: ${platform}`);
    }
    
    // 5. Actualizar base de datos según resultado
    if (result.success) {
      await updatePostInDB(postId, {
        status: 'published',
        published_at: new Date().toISOString(),
        post_url: result.postUrl,
        platform_post_id: result.postId
      });
      
      // 6. Actualizar analytics del usuario
      await updateUserAnalytics(userId);
      
      console.log(`✅ Post ${postId} publicado exitosamente en ${platform}`);
      
      return {
        success: true,
        postId: result.postId,
        postUrl: result.postUrl
      };
    } else {
      throw new Error(result.error || 'Error desconocido al publicar');
    }
  } catch (error) {
    console.error(`❌ Error publicando post ${postId}:`, error);
    
    // Actualizar post como fallido
    await updatePostInDB(postId, {
      status: 'failed',
      error_message: error.message
    });
    
    // Re-lanzar error para que BullMQ lo maneje con retry
    throw error;
  }
}, {
  connection,
  concurrency: 5, // Procesar hasta 5 jobs simultáneamente
  limiter: {
    max: 10, // Máximo 10 jobs
    duration: 60000 // por minuto (rate limiting)
  }
});

// Event listeners del worker
worker.on('completed', (job) => {
  console.log(`✅ Job ${job.id} completado`);
});

worker.on('failed', (job, err) => {
  console.error(`❌ Job ${job.id} falló:`, err.message);
  console.log(`Intentos restantes: ${job.attemptsMade}/${job.opts.attempts}`);
});

worker.on('error', (err) => {
  console.error('❌ Error en worker:', err);
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('🛑 Deteniendo worker...');
  await worker.close();
  process.exit(0);
});

/**
 * Obtener API key de la base de datos
 * NOTA: Esta función necesita acceso a D1
 * En Cloudflare Workers con D1, esto debe hacerse diferente
 * Alternativa: Usar Supabase en lugar de D1 para datos sensibles
 * 
 * @param {number} apiKeyId - ID de la API key
 * @returns {Promise<object>} Datos encriptados
 */
async function getApiKeyFromDB(apiKeyId) {
  // TODO: Implementar según tu setup de BD
  // Opciones:
  // 1. Si usas Supabase: hacer query con supabase-js
  // 2. Si usas D1: necesitas hacer HTTP request a tu API
  // 3. Si usas otro DB: implementar conexión aquí
  
  // Ejemplo con fetch a tu propia API:
  try {
    const response = await fetch(`http://localhost:3000/api/keys/${apiKeyId}/encrypted`, {
      headers: {
        'X-Internal-Secret': process.env.INTERNAL_API_SECRET
      }
    });
    
    if (!response.ok) {
      throw new Error('API key no encontrada');
    }
    
    const data = await response.json();
    return data.encryptedKey;
  } catch (error) {
    console.error('Error obteniendo API key de BD:', error);
    return null;
  }
}

/**
 * Actualizar post en la base de datos
 * 
 * @param {string} postId - ID del post
 * @param {object} updates - Datos a actualizar
 */
async function updatePostInDB(postId, updates) {
  // TODO: Implementar update a tu BD
  try {
    await fetch(`http://localhost:3000/api/posts/${postId}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'X-Internal-Secret': process.env.INTERNAL_API_SECRET
      },
      body: JSON.stringify(updates)
    });
  } catch (error) {
    console.error('Error actualizando post en BD:', error);
  }
}

/**
 * Actualizar analytics del usuario
 * 
 * @param {string} userId - ID del usuario
 */
async function updateUserAnalytics(userId) {
  // TODO: Implementar update de analytics
  try {
    await fetch(`http://localhost:3000/api/analytics/${userId}/increment`, {
      method: 'POST',
      headers: {
        'X-Internal-Secret': process.env.INTERNAL_API_SECRET
      }
    });
  } catch (error) {
    console.error('Error actualizando analytics:', error);
  }
}

console.log('✅ Worker de publicaciones listo y esperando jobs...');
