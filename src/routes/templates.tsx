export const templatesPageHTML = `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Templates - AutomatizAI</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
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
<body class="bg-gray-900 text-white">
    <div class="flex h-screen">
        <!-- Sidebar (igual que dashboard) -->
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
                    <a href="/dashboard/templates" class="flex items-center space-x-3 px-4 py-3 rounded-lg bg-primary/20 text-primary">
                        <i class="fas fa-layer-group"></i>
                        <span>Templates</span>
                    </a>
                    <a href="/dashboard/api-keys" class="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-white/5 transition">
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
                    <h1 class="text-3xl font-bold mb-2">Templates de Automatización 🚀</h1>
                    <p class="text-gray-400">Explora y usa templates pre-construidos para empezar rápidamente</p>
                </div>

                <!-- Filters -->
                <div class="mb-8 flex flex-wrap gap-4">
                    <button onclick="filterTemplates('all')" class="filter-btn active px-6 py-2 bg-primary rounded-lg hover:bg-primary/80 transition">
                        Todos
                    </button>
                    <button onclick="filterTemplates('Marketing')" class="filter-btn px-6 py-2 bg-white/5 rounded-lg hover:bg-white/10 transition">
                        Marketing
                    </button>
                    <button onclick="filterTemplates('Comunicación')" class="filter-btn px-6 py-2 bg-white/5 rounded-lg hover:bg-white/10 transition">
                        Comunicación
                    </button>
                    <button onclick="filterTemplates('Productividad')" class="filter-btn px-6 py-2 bg-white/5 rounded-lg hover:bg-white/10 transition">
                        Productividad
                    </button>
                    <button onclick="filterTemplates('Finanzas')" class="filter-btn px-6 py-2 bg-white/5 rounded-lg hover:bg-white/10 transition">
                        Finanzas
                    </button>
                    <button onclick="filterTemplates('Análisis')" class="filter-btn px-6 py-2 bg-white/5 rounded-lg hover:bg-white/10 transition">
                        Análisis
                    </button>
                </div>

                <!-- Templates Grid -->
                <div id="templatesGrid" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <!-- Se llenará dinámicamente -->
                </div>
            </div>
        </main>
    </div>

    <!-- Modal de Template -->
    <div id="templateModal" class="hidden fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div class="bg-gray-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-white/10">
            <div class="p-8">
                <div class="flex justify-between items-start mb-6">
                    <div>
                        <div class="text-4xl mb-3" id="modalIcon">🤖</div>
                        <h2 class="text-2xl font-bold mb-2" id="modalTitle">Template</h2>
                        <div class="flex items-center space-x-3 text-sm">
                            <span class="bg-primary/20 text-primary px-3 py-1 rounded" id="modalCategory">Categoría</span>
                            <span class="bg-white/10 px-3 py-1 rounded" id="modalDifficulty">Nivel</span>
                        </div>
                    </div>
                    <button onclick="closeModal()" class="text-gray-400 hover:text-white text-2xl">
                        <i class="fas fa-times"></i>
                    </button>
                </div>

                <img id="modalImage" src="" alt="" class="w-full h-48 object-cover rounded-lg mb-6">

                <div class="mb-6">
                    <h3 class="font-bold mb-2">Descripción</h3>
                    <p class="text-gray-400" id="modalDescription"></p>
                </div>

                <div class="mb-6">
                    <h3 class="font-bold mb-2">Integraciones Necesarias</h3>
                    <div id="modalIntegrations" class="flex flex-wrap gap-2"></div>
                </div>

                <div class="mb-6">
                    <h3 class="font-bold mb-2">Plan Requerido</h3>
                    <div class="inline-flex items-center bg-yellow-500/20 text-yellow-400 px-3 py-1 rounded">
                        <i class="fas fa-crown mr-2"></i>
                        <span id="modalPlan"></span>
                    </div>
                </div>

                <div class="flex gap-4">
                    <button onclick="useTemplate()" class="flex-1 bg-gradient-to-r from-primary to-secondary px-6 py-3 rounded-lg font-semibold hover:shadow-lg hover:shadow-primary/50 transition">
                        <i class="fas fa-download mr-2"></i>
                        Usar Este Template
                    </button>
                    <button onclick="previewTemplate()" class="px-6 py-3 bg-white/10 rounded-lg hover:bg-white/20 transition">
                        <i class="fas fa-eye"></i>
                    </button>
                </div>
            </div>
        </div>
    </div>

    <script>
        const user = JSON.parse(localStorage.getItem('user') || '{}')
        let currentCategory = 'all'
        let currentTemplate = null

        if (!localStorage.getItem('token')) {
            window.location.href = '/login'
        }

        document.getElementById('userName').textContent = user.fullName || 'Usuario'
        document.getElementById('userPlan').textContent = 'Plan ' + (user.subscriptionPlan || 'free').toUpperCase()

        async function loadTemplates() {
            try {
                const url = currentCategory === 'all' 
                    ? '/api/templates'
                    : \`/api/templates?category=\${currentCategory}\`
                
                const response = await fetch(url)
                const data = await response.json()
                
                const grid = document.getElementById('templatesGrid')
                
                if (data.templates && data.templates.length > 0) {
                    grid.innerHTML = data.templates.map(template => \`
                        <div class="bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 overflow-hidden hover:border-primary/50 transition group cursor-pointer" onclick="openModal(\${template.id})">
                            <div class="relative h-48 overflow-hidden">
                                <img src="\${template.preview_image}" alt="\${template.name}" class="w-full h-full object-cover group-hover:scale-110 transition duration-500">
                                <div class="absolute top-4 right-4 text-4xl">\${template.icon}</div>
                            </div>
                            <div class="p-6">
                                <div class="flex items-center justify-between mb-3">
                                    <span class="text-xs bg-primary/20 text-primary px-2 py-1 rounded">\${template.category}</span>
                                    <span class="text-xs bg-white/10 px-2 py-1 rounded">\${template.difficulty}</span>
                                </div>
                                <h3 class="font-bold text-lg mb-2">\${template.name}</h3>
                                <p class="text-sm text-gray-400 mb-4">\${template.description}</p>
                                <div class="flex items-center justify-between">
                                    <span class="text-xs text-gray-500">
                                        <i class="fas fa-crown mr-1"></i>
                                        \${template.min_plan.toUpperCase()}
                                    </span>
                                    <button class="text-primary hover:text-primary/80">
                                        Ver más →
                                    </button>
                                </div>
                            </div>
                        </div>
                    \`).join('')
                } else {
                    grid.innerHTML = '<div class="col-span-full text-center py-12 text-gray-400">No se encontraron templates</div>'
                }
            } catch (error) {
                console.error('Error loading templates:', error)
            }
        }

        async function openModal(templateId) {
            try {
                const response = await fetch(\`/api/templates/\${templateId}\`)
                const data = await response.json()
                
                if (data.template) {
                    currentTemplate = data.template
                    
                    document.getElementById('modalIcon').textContent = data.template.icon
                    document.getElementById('modalTitle').textContent = data.template.name
                    document.getElementById('modalCategory').textContent = data.template.category
                    document.getElementById('modalDifficulty').textContent = data.template.difficulty
                    document.getElementById('modalImage').src = data.template.preview_image
                    document.getElementById('modalDescription').textContent = data.template.description
                    document.getElementById('modalPlan').textContent = data.template.min_plan.toUpperCase()
                    
                    const integrations = data.template.required_integrations.split(',')
                    document.getElementById('modalIntegrations').innerHTML = integrations.map(int => 
                        \`<span class="bg-white/10 px-3 py-1 rounded-full text-sm">\${int.trim()}</span>\`
                    ).join('')
                    
                    document.getElementById('templateModal').classList.remove('hidden')
                }
            } catch (error) {
                console.error('Error loading template:', error)
            }
        }

        function closeModal() {
            document.getElementById('templateModal').classList.add('hidden')
        }

        function useTemplate() {
            if (currentTemplate) {
                alert(\`Usando template: \${currentTemplate.name}\\n\\nEn la versión completa, esto crearía una nueva automatización basada en este template.\`)
            }
        }

        function previewTemplate() {
            if (currentTemplate) {
                alert(\`Vista previa de: \${currentTemplate.name}\\n\\nEn la versión completa, esto mostraría el flujo de N8N completo.\`)
            }
        }

        function filterTemplates(category) {
            currentCategory = category
            
            // Update button styles
            document.querySelectorAll('.filter-btn').forEach(btn => {
                btn.classList.remove('bg-primary', 'active')
                btn.classList.add('bg-white/5')
            })
            event.target.classList.remove('bg-white/5')
            event.target.classList.add('bg-primary', 'active')
            
            loadTemplates()
        }

        function logout() {
            localStorage.removeItem('token')
            localStorage.removeItem('user')
            window.location.href = '/login'
        }

        // Close modal on ESC key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') closeModal()
        })

        // Load templates on page load
        loadTemplates()
    </script>
</body>
</html>
`
