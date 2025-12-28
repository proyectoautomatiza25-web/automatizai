import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { serveStatic } from 'hono/cloudflare-workers'
import { dashboardHTML } from './routes/dashboard'
import { templatesPageHTML } from './routes/templates'
import { apiKeysPageHTML } from './routes/api-keys'
import { professionalLandingHTML } from './routes/landing-pro-real'
import { paymentSuccessPage, paymentFailurePage, paymentPendingPage } from './routes/payment-pages'
import apiRoutes from './routes/api-routes'
import mercadopagoRoutes from './routes/mercadopago'

type Bindings = {
  DB: D1Database;
}

const app = new Hono<{ Bindings: Bindings }>()

// Enable CORS
app.use('/api/*', cors())

// Serve static files
app.use('/static/*', serveStatic({ root: './public' }))

// Mount API routes
app.route('/api', apiRoutes)
app.route('/api/mercadopago', mercadopagoRoutes)

// ============================================
// API ROUTES
// ============================================

// Auth Routes
app.post('/api/auth/register', async (c) => {
  try {
    const { email, password, fullName } = await c.req.json()
    
    // Validaciones básicas
    if (!email || !password || !fullName) {
      return c.json({ error: 'Todos los campos son requeridos' }, 400)
    }

    const { DB } = c.env
    
    // Verificar si el usuario ya existe
    const existingUser = await DB.prepare(
      'SELECT id FROM users WHERE email = ?'
    ).bind(email).first()

    if (existingUser) {
      return c.json({ error: 'El email ya está registrado' }, 400)
    }

    // En producción, aquí deberías usar bcrypt para hashear la contraseña
    // Por ahora usamos una versión simple
    const passwordHash = `hashed_${password}_${Date.now()}`

    // Insertar nuevo usuario
    const result = await DB.prepare(`
      INSERT INTO users (email, password_hash, full_name, subscription_plan)
      VALUES (?, ?, ?, 'free')
    `).bind(email, passwordHash, fullName).run()

    return c.json({ 
      success: true, 
      userId: result.meta.last_row_id,
      message: 'Usuario registrado exitosamente'
    }, 201)
  } catch (error) {
    console.error('Error en registro:', error)
    return c.json({ error: 'Error al registrar usuario' }, 500)
  }
})

app.post('/api/auth/login', async (c) => {
  try {
    const { email, password } = await c.req.json()
    
    if (!email || !password) {
      return c.json({ error: 'Email y contraseña requeridos' }, 400)
    }

    const { DB } = c.env
    
    const user = await DB.prepare(
      'SELECT * FROM users WHERE email = ?'
    ).bind(email).first()

    if (!user) {
      return c.json({ error: 'Credenciales inválidas' }, 401)
    }

    // Verificar contraseña (versión simplificada)
    const expectedHash = `hashed_${password}_`
    if (!user.password_hash.startsWith(expectedHash.substring(0, 10))) {
      return c.json({ error: 'Credenciales inválidas' }, 401)
    }

    // Crear token simple (en producción usar JWT)
    const token = `token_${user.id}_${Date.now()}`

    return c.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.full_name,
        subscriptionPlan: user.subscription_plan,
        subscriptionStatus: user.subscription_status
      },
      token
    })
  } catch (error) {
    console.error('Error en login:', error)
    return c.json({ error: 'Error al iniciar sesión' }, 500)
  }
})

// User API Keys Routes
app.get('/api/user/api-keys', async (c) => {
  try {
    const userId = c.req.header('X-User-ID')
    if (!userId) {
      return c.json({ error: 'No autorizado' }, 401)
    }

    const { DB } = c.env
    
    const { results } = await DB.prepare(
      'SELECT id, service_name, created_at FROM user_api_keys WHERE user_id = ? ORDER BY created_at DESC'
    ).bind(userId).all()

    return c.json({ apiKeys: results })
  } catch (error) {
    console.error('Error obteniendo API keys:', error)
    return c.json({ error: 'Error al obtener API keys' }, 500)
  }
})

app.post('/api/user/api-keys', async (c) => {
  try {
    const userId = c.req.header('X-User-ID')
    if (!userId) {
      return c.json({ error: 'No autorizado' }, 401)
    }

    const { serviceName, apiKey, apiSecret } = await c.req.json()
    
    if (!serviceName || !apiKey) {
      return c.json({ error: 'Nombre de servicio y API key son requeridos' }, 400)
    }

    const { DB } = c.env
    
    const result = await DB.prepare(`
      INSERT INTO user_api_keys (user_id, service_name, api_key, api_secret)
      VALUES (?, ?, ?, ?)
    `).bind(userId, serviceName, apiKey, apiSecret || null).run()

    return c.json({ 
      success: true, 
      keyId: result.meta.last_row_id,
      message: 'API key guardada exitosamente'
    }, 201)
  } catch (error) {
    console.error('Error guardando API key:', error)
    return c.json({ error: 'Error al guardar API key' }, 500)
  }
})

// Contact form endpoint
app.post('/api/contact', async (c) => {
  try {
    const { name, email, phone, message, to } = await c.req.json()
    
    // Validación
    if (!name || !email || !message) {
      return c.json({ error: 'Faltan campos requeridos' }, 400)
    }
    
    // Aquí simularemos el envío de email
    // En producción, usar un servicio como Resend, SendGrid, etc.
    console.log('📧 Nuevo mensaje de contacto:', {
      name,
      email,
      phone,
      message,
      to: to || 'proyecto.automatiza.cl',
      timestamp: new Date().toISOString()
    })
    
    // Guardar en base de datos
    const { DB } = c.env
    await DB.prepare(`
      INSERT INTO contacts (name, email, phone, message, created_at)
      VALUES (?, ?, ?, ?, datetime('now'))
    `).bind(name, email, phone || null, message).run()
    
    return c.json({ 
      success: true, 
      message: 'Mensaje recibido. Te contactaremos pronto!' 
    })
  } catch (error) {
    console.error('Error en formulario de contacto:', error)
    return c.json({ error: 'Error al enviar mensaje' }, 500)
  }
})

app.delete('/api/user/api-keys/:id', async (c) => {
  try {
    const userId = c.req.header('X-User-ID')
    if (!userId) {
      return c.json({ error: 'No autorizado' }, 401)
    }

    const keyId = c.req.param('id')
    const { DB } = c.env
    
    await DB.prepare(
      'DELETE FROM user_api_keys WHERE id = ? AND user_id = ?'
    ).bind(keyId, userId).run()

    return c.json({ success: true, message: 'API key eliminada' })
  } catch (error) {
    console.error('Error eliminando API key:', error)
    return c.json({ error: 'Error al eliminar API key' }, 500)
  }
})

// N8N Templates Routes
app.get('/api/templates', async (c) => {
  try {
    const { DB } = c.env
    const category = c.req.query('category')
    
    let query = 'SELECT * FROM n8n_templates'
    const params = []
    
    if (category && category !== 'all') {
      query += ' WHERE category = ?'
      params.push(category)
    }
    
    query += ' ORDER BY created_at DESC'
    
    const stmt = params.length > 0 
      ? DB.prepare(query).bind(...params)
      : DB.prepare(query)
    
    const { results } = await stmt.all()

    return c.json({ templates: results })
  } catch (error) {
    console.error('Error obteniendo templates:', error)
    return c.json({ error: 'Error al obtener templates' }, 500)
  }
})

app.get('/api/templates/:id', async (c) => {
  try {
    const { DB } = c.env
    const templateId = c.req.param('id')
    
    const template = await DB.prepare(
      'SELECT * FROM n8n_templates WHERE id = ?'
    ).bind(templateId).first()

    if (!template) {
      return c.json({ error: 'Template no encontrado' }, 404)
    }

    return c.json({ template })
  } catch (error) {
    console.error('Error obteniendo template:', error)
    return c.json({ error: 'Error al obtener template' }, 500)
  }
})

// User Automations Routes
app.get('/api/automations', async (c) => {
  try {
    const userId = c.req.header('X-User-ID')
    if (!userId) {
      return c.json({ error: 'No autorizado' }, 401)
    }

    const { DB } = c.env
    
    const { results } = await DB.prepare(
      'SELECT * FROM automations WHERE user_id = ? ORDER BY created_at DESC'
    ).bind(userId).all()

    return c.json({ automations: results })
  } catch (error) {
    console.error('Error obteniendo automatizaciones:', error)
    return c.json({ error: 'Error al obtener automatizaciones' }, 500)
  }
})

app.post('/api/automations', async (c) => {
  try {
    const userId = c.req.header('X-User-ID')
    if (!userId) {
      return c.json({ error: 'No autorizado' }, 401)
    }

    const { name, description, workflowData } = await c.req.json()
    
    if (!name) {
      return c.json({ error: 'El nombre es requerido' }, 400)
    }

    const { DB } = c.env
    
    const result = await DB.prepare(`
      INSERT INTO automations (user_id, name, description, workflow_data, status)
      VALUES (?, ?, ?, ?, 'active')
    `).bind(userId, name, description || null, workflowData || null).run()

    return c.json({ 
      success: true, 
      automationId: result.meta.last_row_id,
      message: 'Automatización creada exitosamente'
    }, 201)
  } catch (error) {
    console.error('Error creando automatización:', error)
    return c.json({ error: 'Error al crear automatización' }, 500)
  }
})

// Stats endpoint
app.get('/api/stats', async (c) => {
  try {
    const userId = c.req.header('X-User-ID')
    if (!userId) {
      return c.json({ error: 'No autorizado' }, 401)
    }

    const { DB } = c.env
    
    const automationsCount = await DB.prepare(
      'SELECT COUNT(*) as count FROM automations WHERE user_id = ?'
    ).bind(userId).first()

    const apiKeysCount = await DB.prepare(
      'SELECT COUNT(*) as count FROM user_api_keys WHERE user_id = ?'
    ).bind(userId).first()

    const totalExecutions = await DB.prepare(
      'SELECT SUM(executions_count) as total FROM automations WHERE user_id = ?'
    ).bind(userId).first()

    return c.json({
      automations: automationsCount?.count || 0,
      apiKeys: apiKeysCount?.count || 0,
      executions: totalExecutions?.total || 0
    })
  } catch (error) {
    console.error('Error obteniendo estadísticas:', error)
    return c.json({ error: 'Error al obtener estadísticas' }, 500)
  }
})

// ============================================
// FRONTEND ROUTES
// ============================================

// Landing page
app.get('/', (c) => {
  return c.html(professionalLandingHTML)
})

// Login page
app.get('/login', (c) => {
  return c.html(`
    <!DOCTYPE html>
    <html lang="es">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Iniciar Sesión - AutomatizAI</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
        <script>
          tailwind.config = {
            theme: {
              extend: {
                colors: {
                  primary: '#6366f1',
                  secondary: '#8b5cf6'
                }
              }
            }
          }
        </script>
    </head>
    <body class="bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 min-h-screen flex items-center justify-center p-4">
        <div class="max-w-md w-full">
            <div class="text-center mb-8">
                <i class="fas fa-robot text-5xl text-primary mb-4"></i>
                <h1 class="text-3xl font-bold text-white mb-2">Bienvenido de Vuelta</h1>
                <p class="text-gray-400">Inicia sesión para continuar automatizando</p>
            </div>

            <div class="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
                <form id="loginForm" class="space-y-6">
                    <div id="errorMessage" class="hidden bg-red-500/20 border border-red-500 text-red-200 px-4 py-3 rounded-lg"></div>
                    
                    <div>
                        <label class="block text-gray-300 mb-2">Email</label>
                        <input type="email" id="email" required class="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary transition">
                    </div>

                    <div>
                        <label class="block text-gray-300 mb-2">Contraseña</label>
                        <input type="password" id="password" required class="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary transition">
                    </div>

                    <button type="submit" class="w-full bg-gradient-to-r from-primary to-secondary px-6 py-3 rounded-lg font-semibold hover:shadow-lg hover:shadow-primary/50 transition text-white">
                        <i class="fas fa-sign-in-alt mr-2"></i>
                        Iniciar Sesión
                    </button>
                </form>

                <div class="mt-6 text-center">
                    <p class="text-gray-400">¿No tienes cuenta? <a href="/register" class="text-primary hover:underline">Regístrate aquí</a></p>
                </div>
            </div>

            <div class="text-center mt-6">
                <a href="/" class="text-gray-400 hover:text-white transition">
                    <i class="fas fa-arrow-left mr-2"></i>
                    Volver al inicio
                </a>
            </div>
        </div>

        <script>
            document.getElementById('loginForm').addEventListener('submit', async (e) => {
                e.preventDefault()
                
                const email = document.getElementById('email').value
                const password = document.getElementById('password').value
                const errorDiv = document.getElementById('errorMessage')

                try {
                    const response = await fetch('/api/auth/login', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ email, password })
                    })

                    const data = await response.json()

                    if (response.ok) {
                        localStorage.setItem('token', data.token)
                        localStorage.setItem('user', JSON.stringify(data.user))
                        window.location.href = '/dashboard'
                    } else {
                        errorDiv.textContent = data.error || 'Error al iniciar sesión'
                        errorDiv.classList.remove('hidden')
                    }
                } catch (error) {
                    errorDiv.textContent = 'Error de conexión'
                    errorDiv.classList.remove('hidden')
                }
            })
        </script>
    </body>
    </html>
  `)
})

// Register page
app.get('/register', (c) => {
  return c.html(`
    <!DOCTYPE html>
    <html lang="es">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Registro - AutomatizAI</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
        <script>
          tailwind.config = {
            theme: {
              extend: {
                colors: {
                  primary: '#6366f1',
                  secondary: '#8b5cf6'
                }
              }
            }
          }
        </script>
    </head>
    <body class="bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 min-h-screen flex items-center justify-center p-4">
        <div class="max-w-md w-full">
            <div class="text-center mb-8">
                <i class="fas fa-robot text-5xl text-primary mb-4"></i>
                <h1 class="text-3xl font-bold text-white mb-2">Comienza Gratis</h1>
                <p class="text-gray-400">Crea tu cuenta y empieza a automatizar</p>
            </div>

            <div class="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
                <form id="registerForm" class="space-y-6">
                    <div id="errorMessage" class="hidden bg-red-500/20 border border-red-500 text-red-200 px-4 py-3 rounded-lg"></div>
                    <div id="successMessage" class="hidden bg-green-500/20 border border-green-500 text-green-200 px-4 py-3 rounded-lg"></div>
                    
                    <div>
                        <label class="block text-gray-300 mb-2">Nombre Completo</label>
                        <input type="text" id="fullName" required class="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary transition">
                    </div>

                    <div>
                        <label class="block text-gray-300 mb-2">Email</label>
                        <input type="email" id="email" required class="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary transition">
                    </div>

                    <div>
                        <label class="block text-gray-300 mb-2">Contraseña</label>
                        <input type="password" id="password" required minlength="6" class="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary transition">
                        <p class="text-xs text-gray-400 mt-1">Mínimo 6 caracteres</p>
                    </div>

                    <button type="submit" class="w-full bg-gradient-to-r from-primary to-secondary px-6 py-3 rounded-lg font-semibold hover:shadow-lg hover:shadow-primary/50 transition text-white">
                        <i class="fas fa-rocket mr-2"></i>
                        Crear Cuenta Gratis
                    </button>
                </form>

                <div class="mt-6 text-center">
                    <p class="text-gray-400">¿Ya tienes cuenta? <a href="/login" class="text-primary hover:underline">Inicia sesión</a></p>
                </div>
            </div>

            <div class="text-center mt-6">
                <a href="/" class="text-gray-400 hover:text-white transition">
                    <i class="fas fa-arrow-left mr-2"></i>
                    Volver al inicio
                </a>
            </div>
        </div>

        <script>
            document.getElementById('registerForm').addEventListener('submit', async (e) => {
                e.preventDefault()
                
                const fullName = document.getElementById('fullName').value
                const email = document.getElementById('email').value
                const password = document.getElementById('password').value
                const errorDiv = document.getElementById('errorMessage')
                const successDiv = document.getElementById('successMessage')

                errorDiv.classList.add('hidden')
                successDiv.classList.add('hidden')

                try {
                    const response = await fetch('/api/auth/register', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ fullName, email, password })
                    })

                    const data = await response.json()

                    if (response.ok) {
                        successDiv.textContent = 'Cuenta creada exitosamente. Redirigiendo...'
                        successDiv.classList.remove('hidden')
                        setTimeout(() => window.location.href = '/login', 2000)
                    } else {
                        errorDiv.textContent = data.error || 'Error al crear cuenta'
                        errorDiv.classList.remove('hidden')
                    }
                } catch (error) {
                    errorDiv.textContent = 'Error de conexión'
                    errorDiv.classList.remove('hidden')
                }
            })
        </script>
    </body>
    </html>
  `)
})

// Payment Result Pages
app.get('/payment-success', (c) => {
  const plan = c.req.query('plan') || 'unknown'
  return c.html(paymentSuccessPage(plan))
})

app.get('/payment-failure', (c) => {
  return c.html(paymentFailurePage)
})

app.get('/payment-pending', (c) => {
  return c.html(paymentPendingPage)
})

// Dashboard Routes
app.get('/dashboard', (c) => {
  return c.html(dashboardHTML)
})

app.get('/dashboard/templates', (c) => {
  return c.html(templatesPageHTML)
})

app.get('/dashboard/api-keys', (c) => {
  return c.html(apiKeysPageHTML)
})

app.get('/dashboard/automations', (c) => {
  return c.html(`
    <!DOCTYPE html>
    <html lang="es">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Automatizaciones - AutomatizAI</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
    </head>
    <body class="bg-gray-900 text-white">
        <div class="min-h-screen flex items-center justify-center">
            <div class="text-center">
                <i class="fas fa-cogs text-6xl text-primary mb-4"></i>
                <h1 class="text-3xl font-bold mb-4">Gestión de Automatizaciones</h1>
                <p class="text-gray-400 mb-8">Esta sección está en desarrollo</p>
                <a href="/dashboard" class="bg-primary px-6 py-3 rounded-lg hover:bg-primary/80 transition">
                    Volver al Dashboard
                </a>
            </div>
        </div>
    </body>
    </html>
  `)
})

app.get('/dashboard/subscription', (c) => {
  return c.html(`
    <!DOCTYPE html>
    <html lang="es">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Suscripción - AutomatizAI</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
    </head>
    <body class="bg-gray-900 text-white">
        <div class="min-h-screen flex items-center justify-center">
            <div class="text-center">
                <i class="fas fa-crown text-6xl text-yellow-400 mb-4"></i>
                <h1 class="text-3xl font-bold mb-4">Gestión de Suscripción</h1>
                <p class="text-gray-400 mb-8">Actualiza tu plan o gestiona tu facturación</p>
                <a href="/dashboard" class="bg-primary px-6 py-3 rounded-lg hover:bg-primary/80 transition">
                    Volver al Dashboard
                </a>
            </div>
        </div>
    </body>
    </html>
  `)
})

export default app
