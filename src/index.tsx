import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { serveStatic } from 'hono/cloudflare-workers'
import { dashboardHTML } from './routes/dashboard'
import { templatesPageHTML } from './routes/templates'
import { apiKeysPageHTML } from './routes/api-keys'

type Bindings = {
  DB: D1Database;
}

const app = new Hono<{ Bindings: Bindings }>()

// Enable CORS
app.use('/api/*', cors())

// Serve static files
app.use('/static/*', serveStatic({ root: './public' }))

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
  return c.html(`
    <!DOCTYPE html>
    <html lang="es">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>AutomatizAI - Plataforma de Automatización con IA</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
        <link href="/static/styles.css" rel="stylesheet">
        <script>
          tailwind.config = {
            theme: {
              extend: {
                colors: {
                  primary: '#6366f1',
                  secondary: '#8b5cf6',
                  accent: '#ec4899'
                }
              }
            }
          }
        </script>
    </head>
    <body class="bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 text-white">
        <!-- Navigation -->
        <nav class="fixed w-full z-50 bg-black/20 backdrop-blur-lg border-b border-white/10">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="flex justify-between items-center h-16">
                    <div class="flex items-center space-x-2">
                        <i class="fas fa-robot text-3xl text-primary"></i>
                        <span class="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">AutomatizAI</span>
                    </div>
                    <div class="hidden md:flex items-center space-x-8">
                        <a href="#features" class="hover:text-primary transition">Características</a>
                        <a href="#templates" class="hover:text-primary transition">Templates</a>
                        <a href="#pricing" class="hover:text-primary transition">Precios</a>
                        <a href="/login" class="hover:text-primary transition">Iniciar Sesión</a>
                        <a href="/register" class="bg-gradient-to-r from-primary to-secondary px-6 py-2 rounded-full hover:shadow-lg hover:shadow-primary/50 transition">
                            Comenzar Gratis
                        </a>
                    </div>
                    <button id="mobile-menu-btn" class="md:hidden">
                        <i class="fas fa-bars text-2xl"></i>
                    </button>
                </div>
            </div>
        </nav>

        <!-- Mobile Menu -->
        <div id="mobile-menu" class="hidden fixed inset-0 z-40 bg-black/95 backdrop-blur-lg md:hidden">
            <div class="flex flex-col items-center justify-center h-full space-y-8">
                <a href="#features" class="text-2xl hover:text-primary transition">Características</a>
                <a href="#templates" class="text-2xl hover:text-primary transition">Templates</a>
                <a href="#pricing" class="text-2xl hover:text-primary transition">Precios</a>
                <a href="/login" class="text-2xl hover:text-primary transition">Iniciar Sesión</a>
                <a href="/register" class="bg-gradient-to-r from-primary to-secondary px-8 py-3 rounded-full text-xl">
                    Comenzar Gratis
                </a>
            </div>
        </div>

        <!-- Hero Section -->
        <section class="pt-32 pb-20 px-4">
            <div class="max-w-7xl mx-auto text-center">
                <div class="animate-fade-in-up">
                    <h1 class="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-primary to-accent bg-clip-text text-transparent">
                        Automatiza tu Negocio<br/>con Inteligencia Artificial
                    </h1>
                    <p class="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto">
                        Conecta tus aplicaciones favoritas, crea workflows inteligentes con N8N y lleva tu productividad al siguiente nivel
                    </p>
                    <div class="flex flex-col sm:flex-row gap-4 justify-center items-center">
                        <a href="/register" class="bg-gradient-to-r from-primary to-secondary px-8 py-4 rounded-full text-lg font-semibold hover:shadow-2xl hover:shadow-primary/50 transition transform hover:scale-105">
                            <i class="fas fa-rocket mr-2"></i>
                            Empezar Ahora - Gratis
                        </a>
                        <a href="#templates" class="border-2 border-white/30 px-8 py-4 rounded-full text-lg font-semibold hover:bg-white/10 transition">
                            <i class="fas fa-play mr-2"></i>
                            Ver Templates
                        </a>
                    </div>
                </div>

                <!-- Stats -->
                <div class="grid grid-cols-2 md:grid-cols-4 gap-8 mt-20">
                    <div class="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10">
                        <div class="text-4xl font-bold text-primary mb-2">500+</div>
                        <div class="text-gray-400">Automatizaciones</div>
                    </div>
                    <div class="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10">
                        <div class="text-4xl font-bold text-secondary mb-2">50+</div>
                        <div class="text-gray-400">Integraciones</div>
                    </div>
                    <div class="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10">
                        <div class="text-4xl font-bold text-accent mb-2">1M+</div>
                        <div class="text-gray-400">Ejecuciones</div>
                    </div>
                    <div class="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10">
                        <div class="text-4xl font-bold text-yellow-400 mb-2">99.9%</div>
                        <div class="text-gray-400">Uptime</div>
                    </div>
                </div>
            </div>
        </section>

        <!-- Features Section -->
        <section id="features" class="py-20 px-4">
            <div class="max-w-7xl mx-auto">
                <div class="text-center mb-16">
                    <h2 class="text-4xl md:text-5xl font-bold mb-4">¿Por qué AutomatizAI?</h2>
                    <p class="text-xl text-gray-400">La plataforma más completa para automatizar tu negocio</p>
                </div>

                <div class="grid md:grid-cols-3 gap-8">
                    <div class="bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/10 hover:border-primary/50 transition group">
                        <div class="text-5xl mb-4 group-hover:scale-110 transition">🤖</div>
                        <h3 class="text-2xl font-bold mb-3">IA Integrada</h3>
                        <p class="text-gray-400">Conecta con OpenAI, Claude y más para automatizaciones inteligentes</p>
                    </div>

                    <div class="bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/10 hover:border-secondary/50 transition group">
                        <div class="text-5xl mb-4 group-hover:scale-110 transition">⚡</div>
                        <h3 class="text-2xl font-bold mb-3">N8N Potenciado</h3>
                        <p class="text-gray-400">Workflows visuales con más de 400 integraciones nativas</p>
                    </div>

                    <div class="bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/10 hover:border-accent/50 transition group">
                        <div class="text-5xl mb-4 group-hover:scale-110 transition">🔒</div>
                        <h3 class="text-2xl font-bold mb-3">100% Seguro</h3>
                        <p class="text-gray-400">Tus datos y API keys protegidos con encriptación de nivel empresarial</p>
                    </div>

                    <div class="bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/10 hover:border-primary/50 transition group">
                        <div class="text-5xl mb-4 group-hover:scale-110 transition">📊</div>
                        <h3 class="text-2xl font-bold mb-3">Dashboard Intuitivo</h3>
                        <p class="text-gray-400">Gestiona todas tus automatizaciones desde un solo lugar</p>
                    </div>

                    <div class="bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/10 hover:border-secondary/50 transition group">
                        <div class="text-5xl mb-4 group-hover:scale-110 transition">📱</div>
                        <h3 class="text-2xl font-bold mb-3">Multi-Plataforma</h3>
                        <p class="text-gray-400">WhatsApp, Instagram, Email, CRM y más de 50 integraciones</p>
                    </div>

                    <div class="bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/10 hover:border-accent/50 transition group">
                        <div class="text-5xl mb-4 group-hover:scale-110 transition">🎯</div>
                        <h3 class="text-2xl font-bold mb-3">Templates Listos</h3>
                        <p class="text-gray-400">Más de 100 automatizaciones pre-construidas para usar en minutos</p>
                    </div>
                </div>
            </div>
        </section>

        <!-- Pricing Section -->
        <section id="pricing" class="py-20 px-4">
            <div class="max-w-7xl mx-auto">
                <div class="text-center mb-16">
                    <h2 class="text-4xl md:text-5xl font-bold mb-4">Planes para Cada Necesidad</h2>
                    <p class="text-xl text-gray-400">Empieza gratis y escala cuando lo necesites</p>
                </div>

                <div class="grid md:grid-cols-3 gap-8">
                    <!-- Free Plan -->
                    <div class="bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/10">
                        <h3 class="text-2xl font-bold mb-2">Starter</h3>
                        <div class="text-5xl font-bold mb-6">$0<span class="text-2xl text-gray-400">/mes</span></div>
                        <ul class="space-y-4 mb-8">
                            <li class="flex items-center"><i class="fas fa-check text-green-500 mr-3"></i>5 Automatizaciones</li>
                            <li class="flex items-center"><i class="fas fa-check text-green-500 mr-3"></i>1,000 Ejecuciones/mes</li>
                            <li class="flex items-center"><i class="fas fa-check text-green-500 mr-3"></i>3 Integraciones</li>
                            <li class="flex items-center"><i class="fas fa-check text-green-500 mr-3"></i>Templates básicos</li>
                        </ul>
                        <a href="/register" class="block w-full text-center bg-white/10 px-6 py-3 rounded-full hover:bg-white/20 transition">
                            Comenzar Gratis
                        </a>
                    </div>

                    <!-- Pro Plan -->
                    <div class="bg-gradient-to-br from-primary/20 to-secondary/20 backdrop-blur-lg rounded-2xl p-8 border-2 border-primary transform scale-105">
                        <div class="bg-primary text-white text-sm px-3 py-1 rounded-full inline-block mb-4">MÁS POPULAR</div>
                        <h3 class="text-2xl font-bold mb-2">Pro</h3>
                        <div class="text-5xl font-bold mb-6">$49<span class="text-2xl text-gray-400">/mes</span></div>
                        <ul class="space-y-4 mb-8">
                            <li class="flex items-center"><i class="fas fa-check text-green-500 mr-3"></i>50 Automatizaciones</li>
                            <li class="flex items-center"><i class="fas fa-check text-green-500 mr-3"></i>50,000 Ejecuciones/mes</li>
                            <li class="flex items-center"><i class="fas fa-check text-green-500 mr-3"></i>Integraciones ilimitadas</li>
                            <li class="flex items-center"><i class="fas fa-check text-green-500 mr-3"></i>Todos los templates</li>
                            <li class="flex items-center"><i class="fas fa-check text-green-500 mr-3"></i>Soporte prioritario</li>
                        </ul>
                        <a href="/register" class="block w-full text-center bg-gradient-to-r from-primary to-secondary px-6 py-3 rounded-full hover:shadow-lg hover:shadow-primary/50 transition">
                            Comenzar Prueba Gratis
                        </a>
                    </div>

                    <!-- Enterprise Plan -->
                    <div class="bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/10">
                        <h3 class="text-2xl font-bold mb-2">Enterprise</h3>
                        <div class="text-5xl font-bold mb-6">$199<span class="text-2xl text-gray-400">/mes</span></div>
                        <ul class="space-y-4 mb-8">
                            <li class="flex items-center"><i class="fas fa-check text-green-500 mr-3"></i>Automatizaciones ilimitadas</li>
                            <li class="flex items-center"><i class="fas fa-check text-green-500 mr-3"></i>Ejecuciones ilimitadas</li>
                            <li class="flex items-center"><i class="fas fa-check text-green-500 mr-3"></i>APIs personalizadas</li>
                            <li class="flex items-center"><i class="fas fa-check text-green-500 mr-3"></i>Workflows personalizados</li>
                            <li class="flex items-center"><i class="fas fa-check text-green-500 mr-3"></i>Soporte 24/7</li>
                            <li class="flex items-center"><i class="fas fa-check text-green-500 mr-3"></i>Onboarding dedicado</li>
                        </ul>
                        <a href="/register" class="block w-full text-center bg-white/10 px-6 py-3 rounded-full hover:bg-white/20 transition">
                            Contactar Ventas
                        </a>
                    </div>
                </div>
            </div>
        </section>

        <!-- CTA Section -->
        <section class="py-20 px-4">
            <div class="max-w-4xl mx-auto text-center bg-gradient-to-r from-primary/20 to-secondary/20 backdrop-blur-lg rounded-3xl p-12 border border-primary/30">
                <h2 class="text-4xl md:text-5xl font-bold mb-6">¿Listo para Automatizar?</h2>
                <p class="text-xl text-gray-300 mb-8">Únete a cientos de empresas que ya están ahorrando tiempo y dinero</p>
                <a href="/register" class="inline-block bg-gradient-to-r from-primary to-secondary px-8 py-4 rounded-full text-lg font-semibold hover:shadow-2xl hover:shadow-primary/50 transition transform hover:scale-105">
                    <i class="fas fa-rocket mr-2"></i>
                    Comenzar Ahora - Es Gratis
                </a>
            </div>
        </section>

        <!-- Footer -->
        <footer class="border-t border-white/10 py-12 px-4">
            <div class="max-w-7xl mx-auto text-center text-gray-400">
                <div class="flex justify-center items-center space-x-2 mb-4">
                    <i class="fas fa-robot text-2xl text-primary"></i>
                    <span class="text-xl font-bold text-white">AutomatizAI</span>
                </div>
                <p>© 2024 AutomatizAI. Todos los derechos reservados.</p>
                <div class="flex justify-center space-x-6 mt-4">
                    <a href="#" class="hover:text-primary transition"><i class="fab fa-twitter text-xl"></i></a>
                    <a href="#" class="hover:text-primary transition"><i class="fab fa-linkedin text-xl"></i></a>
                    <a href="#" class="hover:text-primary transition"><i class="fab fa-github text-xl"></i></a>
                </div>
            </div>
        </footer>

        <script src="/static/app.js"></script>
    </body>
    </html>
  `)
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
