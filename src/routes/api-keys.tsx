export const apiKeysPageHTML = `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>API Keys - AutomatizAI</title>
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
<body class="bg-gray-900 text-white">
    <div class="flex h-screen">
        <!-- Sidebar -->
        <aside class="w-64 bg-gray-800/50 backdrop-blur-lg border-r border-white/10">
            <div class="p-6">
                <div class="flex items-center space-x-2 mb-8">
                    <i class="fas fa-robot text-3xl text-primary"></i>
                    <span class="text-xl font-bold">AutomatizAI</span>
                </div>

                <nav class="space-y-2">
                    <a href="/dashboard" class="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-white/5 transition">
                        <i class="fas fa-home"></i>
                        <span>Dashboard</span>
                    </a>
                    <a href="/dashboard/automations" class="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-white/5 transition">
                        <i class="fas fa-cogs"></i>
                        <span>Automatizaciones</span>
                    </a>
                    <a href="/dashboard/templates" class="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-white/5 transition">
                        <i class="fas fa-layer-group"></i>
                        <span>Templates</span>
                    </a>
                    <a href="/dashboard/api-keys" class="flex items-center space-x-3 px-4 py-3 rounded-lg bg-primary/20 text-primary">
                        <i class="fas fa-key"></i>
                        <span>API Keys</span>
                    </a>
                    <a href="/dashboard/subscription" class="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-white/5 transition">
                        <i class="fas fa-crown"></i>
                        <span>Suscripción</span>
                    </a>
                </nav>
            </div>

            <div class="absolute bottom-0 w-64 p-6 border-t border-white/10">
                <div class="flex items-center space-x-3 mb-4">
                    <div class="w-10 h-10 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center">
                        <i class="fas fa-user"></i>
                    </div>
                    <div>
                        <div class="font-semibold" id="userName">Usuario</div>
                        <div class="text-sm text-gray-400" id="userPlan">Plan Free</div>
                    </div>
                </div>
                <button onclick="logout()" class="w-full bg-red-500/20 hover:bg-red-500/30 px-4 py-2 rounded-lg transition">
                    <i class="fas fa-sign-out-alt mr-2"></i>
                    Cerrar Sesión
                </button>
            </div>
        </aside>

        <!-- Main Content -->
        <main class="flex-1 overflow-y-auto">
            <div class="p-8">
                <!-- Header -->
                <div class="mb-8">
                    <h1 class="text-3xl font-bold mb-2">Gestión de API Keys 🔑</h1>
                    <p class="text-gray-400">Administra tus claves de API de forma segura</p>
                </div>

                <!-- Add New API Key Card -->
                <div class="bg-gradient-to-br from-primary/20 to-secondary/20 backdrop-blur-lg rounded-2xl p-8 border border-primary/30 mb-8">
                    <h2 class="text-2xl font-bold mb-4">Agregar Nueva API Key</h2>
                    <form id="addApiKeyForm" class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label class="block text-sm mb-2">Servicio</label>
                            <select id="serviceName" required class="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 focus:outline-none focus:border-primary transition">
                                <option value="">Seleccionar servicio...</option>
                                <option value="OpenAI">OpenAI</option>
                                <option value="Claude">Claude (Anthropic)</option>
                                <option value="Google Gemini">Google Gemini</option>
                                <option value="Make">Make</option>
                                <option value="Zapier">Zapier</option>
                                <option value="WhatsApp">WhatsApp Business</option>
                                <option value="Instagram">Instagram Graph API</option>
                                <option value="Gmail">Gmail API</option>
                                <option value="Google Sheets">Google Sheets</option>
                                <option value="Stripe">Stripe</option>
                                <option value="Slack">Slack</option>
                                <option value="Telegram">Telegram Bot</option>
                                <option value="HubSpot">HubSpot</option>
                                <option value="Otro">Otro...</option>
                            </select>
                        </div>

                        <div>
                            <label class="block text-sm mb-2">API Key</label>
                            <input type="text" id="apiKey" required placeholder="sk-..." class="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 focus:outline-none focus:border-primary transition">
                        </div>

                        <div class="md:col-span-2">
                            <label class="block text-sm mb-2">API Secret (Opcional)</label>
                            <input type="text" id="apiSecret" placeholder="Secret key si aplica..." class="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 focus:outline-none focus:border-primary transition">
                        </div>

                        <div class="md:col-span-2">
                            <button type="submit" class="bg-gradient-to-r from-primary to-secondary px-6 py-3 rounded-lg font-semibold hover:shadow-lg hover:shadow-primary/50 transition">
                                <i class="fas fa-plus mr-2"></i>
                                Agregar API Key
                            </button>
                        </div>
                    </form>
                </div>

                <!-- Saved API Keys -->
                <div class="bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/10">
                    <h2 class="text-2xl font-bold mb-6">Tus API Keys Guardadas</h2>
                    
                    <div id="apiKeysList" class="space-y-4">
                        <!-- Se llenará dinámicamente -->
                    </div>
                </div>

                <!-- Security Info -->
                <div class="mt-8 bg-blue-500/10 border border-blue-500/30 rounded-2xl p-6">
                    <div class="flex items-start space-x-4">
                        <i class="fas fa-shield-alt text-3xl text-blue-400"></i>
                        <div>
                            <h3 class="font-bold text-lg mb-2">Seguridad de tus API Keys</h3>
                            <ul class="text-sm text-gray-400 space-y-2">
                                <li><i class="fas fa-check text-green-400 mr-2"></i>Todas las keys se encriptan con AES-256</li>
                                <li><i class="fas fa-check text-green-400 mr-2"></i>Almacenadas de forma segura en Cloudflare D1</li>
                                <li><i class="fas fa-check text-green-400 mr-2"></i>Solo tú puedes ver y usar tus API keys</li>
                                <li><i class="fas fa-check text-green-400 mr-2"></i>Nunca se exponen en logs o respuestas de API</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    </div>

    <script>
        const user = JSON.parse(localStorage.getItem('user') || '{}')

        if (!localStorage.getItem('token')) {
            window.location.href = '/login'
        }

        document.getElementById('userName').textContent = user.fullName || 'Usuario'
        document.getElementById('userPlan').textContent = 'Plan ' + (user.subscriptionPlan || 'free').toUpperCase()

        // Load saved API keys
        async function loadApiKeys() {
            try {
                const response = await fetch('/api/user/api-keys', {
                    headers: {
                        'X-User-ID': user.id
                    }
                })
                const data = await response.json()
                
                const container = document.getElementById('apiKeysList')
                
                if (data.apiKeys && data.apiKeys.length > 0) {
                    container.innerHTML = data.apiKeys.map(key => {
                        const date = new Date(key.created_at).toLocaleDateString('es-ES')
                        return \`
                            <div class="flex items-center justify-between p-4 bg-white/5 rounded-lg hover:bg-white/10 transition">
                                <div class="flex items-center space-x-4">
                                    <div class="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center">
                                        <i class="fas fa-key text-primary text-xl"></i>
                                    </div>
                                    <div>
                                        <div class="font-semibold text-lg">\${key.service_name}</div>
                                        <div class="text-sm text-gray-400">Agregada el \${date}</div>
                                    </div>
                                </div>
                                <div class="flex items-center space-x-3">
                                    <span class="text-xs bg-green-500/20 text-green-400 px-3 py-1 rounded-full">
                                        <i class="fas fa-check-circle mr-1"></i>Activa
                                    </span>
                                    <button onclick="deleteApiKey(\${key.id})" class="text-red-400 hover:text-red-300 transition">
                                        <i class="fas fa-trash"></i>
                                    </button>
                                </div>
                            </div>
                        \`
                    }).join('')
                } else {
                    container.innerHTML = \`
                        <div class="text-center py-12 text-gray-400">
                            <i class="fas fa-key text-5xl mb-4 opacity-50"></i>
                            <p>Aún no tienes API keys guardadas</p>
                            <p class="text-sm mt-2">Agrega tu primera key usando el formulario de arriba</p>
                        </div>
                    \`
                }
            } catch (error) {
                console.error('Error loading API keys:', error)
            }
        }

        // Add new API key
        document.getElementById('addApiKeyForm').addEventListener('submit', async (e) => {
            e.preventDefault()
            
            const serviceName = document.getElementById('serviceName').value
            const apiKey = document.getElementById('apiKey').value
            const apiSecret = document.getElementById('apiSecret').value || null

            try {
                const response = await fetch('/api/user/api-keys', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-User-ID': user.id
                    },
                    body: JSON.stringify({ serviceName, apiKey, apiSecret })
                })

                const data = await response.json()

                if (response.ok) {
                    // Reset form
                    e.target.reset()
                    
                    // Show success message
                    alert('✅ API Key agregada exitosamente')
                    
                    // Reload list
                    loadApiKeys()
                } else {
                    alert('❌ ' + (data.error || 'Error al agregar API key'))
                }
            } catch (error) {
                console.error('Error adding API key:', error)
                alert('❌ Error de conexión')
            }
        })

        // Delete API key
        async function deleteApiKey(keyId) {
            if (!confirm('¿Estás seguro de que quieres eliminar esta API key?')) {
                return
            }

            try {
                const response = await fetch(\`/api/user/api-keys/\${keyId}\`, {
                    method: 'DELETE',
                    headers: {
                        'X-User-ID': user.id
                    }
                })

                const data = await response.json()

                if (response.ok) {
                    alert('✅ API Key eliminada exitosamente')
                    loadApiKeys()
                } else {
                    alert('❌ ' + (data.error || 'Error al eliminar API key'))
                }
            } catch (error) {
                console.error('Error deleting API key:', error)
                alert('❌ Error de conexión')
            }
        }

        function logout() {
            localStorage.removeItem('token')
            localStorage.removeItem('user')
            window.location.href = '/login'
        }

        // Load API keys on page load
        loadApiKeys()
    </script>
</body>
</html>
`
