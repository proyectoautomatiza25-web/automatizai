export const dashboardHTML = `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dashboard - AutomatizAI</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
    <script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js"></script>
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
    <!-- Sidebar -->
    <div class="flex h-screen">
        <aside class="w-64 bg-gray-800/50 backdrop-blur-lg border-r border-white/10">
            <div class="p-6">
                <div class="flex items-center space-x-2 mb-8">
                    <i class="fas fa-robot text-3xl text-primary"></i>
                    <span class="text-xl font-bold">AutomatizAI</span>
                </div>

                <nav class="space-y-2">
                    <a href="/dashboard" class="flex items-center space-x-3 px-4 py-3 rounded-lg bg-primary/20 text-primary">
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
                    <h1 class="text-3xl font-bold mb-2">Bienvenido de Vuelta! 👋</h1>
                    <p class="text-gray-400">Aquí está el resumen de tus automatizaciones</p>
                </div>

                <!-- Stats Grid -->
                <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div class="bg-gradient-to-br from-primary/20 to-primary/5 backdrop-blur-lg rounded-2xl p-6 border border-primary/30">
                        <div class="flex justify-between items-start mb-4">
                            <div class="text-4xl"><i class="fas fa-cogs"></i></div>
                            <div class="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded">+12%</div>
                        </div>
                        <div class="text-3xl font-bold mb-1" id="statsAutomations">0</div>
                        <div class="text-gray-400 text-sm">Automatizaciones Activas</div>
                    </div>

                    <div class="bg-gradient-to-br from-secondary/20 to-secondary/5 backdrop-blur-lg rounded-2xl p-6 border border-secondary/30">
                        <div class="flex justify-between items-start mb-4">
                            <div class="text-4xl"><i class="fas fa-bolt"></i></div>
                            <div class="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded">+28%</div>
                        </div>
                        <div class="text-3xl font-bold mb-1" id="statsExecutions">0</div>
                        <div class="text-gray-400 text-sm">Ejecuciones Este Mes</div>
                    </div>

                    <div class="bg-gradient-to-br from-accent/20 to-accent/5 backdrop-blur-lg rounded-2xl p-6 border border-accent/30">
                        <div class="flex justify-between items-start mb-4">
                            <div class="text-4xl"><i class="fas fa-key"></i></div>
                            <div class="text-xs bg-blue-500/20 text-blue-400 px-2 py-1 rounded">Seguro</div>
                        </div>
                        <div class="text-3xl font-bold mb-1" id="statsApiKeys">0</div>
                        <div class="text-gray-400 text-sm">API Keys Guardadas</div>
                    </div>

                    <div class="bg-gradient-to-br from-yellow-500/20 to-yellow-500/5 backdrop-blur-lg rounded-2xl p-6 border border-yellow-500/30">
                        <div class="flex justify-between items-start mb-4">
                            <div class="text-4xl"><i class="fas fa-clock"></i></div>
                            <div class="text-xs bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded">Ahorro</div>
                        </div>
                        <div class="text-3xl font-bold mb-1">24h</div>
                        <div class="text-gray-400 text-sm">Tiempo Ahorrado</div>
                    </div>
                </div>

                <!-- Charts Row -->
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                    <div class="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10">
                        <h3 class="text-xl font-bold mb-4">Ejecuciones por Día</h3>
                        <canvas id="executionsChart" height="200"></canvas>
                    </div>

                    <div class="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10">
                        <h3 class="text-xl font-bold mb-4">Distribución por Categoría</h3>
                        <canvas id="categoryChart" height="200"></canvas>
                    </div>
                </div>

                <!-- Recent Automations -->
                <div class="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10">
                    <div class="flex justify-between items-center mb-6">
                        <h3 class="text-xl font-bold">Automatizaciones Recientes</h3>
                        <a href="/dashboard/automations" class="text-primary hover:underline">Ver todas →</a>
                    </div>

                    <div id="recentAutomations" class="space-y-4">
                        <!-- Se llenará dinámicamente -->
                    </div>
                </div>
            </div>
        </main>
    </div>

    <script>
        // Check authentication
        const token = localStorage.getItem('token')
        const user = JSON.parse(localStorage.getItem('user') || '{}')

        if (!token) {
            window.location.href = '/login'
        }

        // Set user info
        document.getElementById('userName').textContent = user.fullName || 'Usuario'
        document.getElementById('userPlan').textContent = 'Plan ' + (user.subscriptionPlan || 'free').toUpperCase()

        // Load stats
        async function loadStats() {
            try {
                const response = await fetch('/api/stats', {
                    headers: {
                        'X-User-ID': user.id
                    }
                })
                const data = await response.json()
                
                document.getElementById('statsAutomations').textContent = data.automations || 0
                document.getElementById('statsExecutions').textContent = (data.executions || 0).toLocaleString()
                document.getElementById('statsApiKeys').textContent = data.apiKeys || 0
            } catch (error) {
                console.error('Error loading stats:', error)
            }
        }

        // Load recent automations
        async function loadRecentAutomations() {
            try {
                const response = await fetch('/api/automations', {
                    headers: {
                        'X-User-ID': user.id
                    }
                })
                const data = await response.json()
                
                const container = document.getElementById('recentAutomations')
                
                if (data.automations && data.automations.length > 0) {
                    container.innerHTML = data.automations.slice(0, 5).map(auto => \`
                        <div class="flex items-center justify-between p-4 bg-white/5 rounded-lg hover:bg-white/10 transition">
                            <div class="flex items-center space-x-4">
                                <div class="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
                                    <i class="fas fa-cog text-primary"></i>
                                </div>
                                <div>
                                    <div class="font-semibold">\${auto.name}</div>
                                    <div class="text-sm text-gray-400">\${auto.description || 'Sin descripción'}</div>
                                </div>
                            </div>
                            <div class="flex items-center space-x-4">
                                <span class="text-sm bg-green-500/20 text-green-400 px-3 py-1 rounded-full">
                                    <i class="fas fa-check-circle mr-1"></i>\${auto.status}
                                </span>
                                <button class="text-gray-400 hover:text-white">
                                    <i class="fas fa-ellipsis-v"></i>
                                </button>
                            </div>
                        </div>
                    \`).join('')
                } else {
                    container.innerHTML = \`
                        <div class="text-center py-12 text-gray-400">
                            <i class="fas fa-robot text-5xl mb-4 opacity-50"></i>
                            <p class="mb-4">Aún no tienes automatizaciones</p>
                            <a href="/dashboard/templates" class="inline-block bg-primary px-6 py-2 rounded-lg hover:bg-primary/80 transition text-white">
                                Explorar Templates
                            </a>
                        </div>
                    \`
                }
            } catch (error) {
                console.error('Error loading automations:', error)
            }
        }

        // Initialize charts
        function initCharts() {
            // Executions Chart
            const ctx1 = document.getElementById('executionsChart').getContext('2d')
            new Chart(ctx1, {
                type: 'line',
                data: {
                    labels: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'],
                    datasets: [{
                        label: 'Ejecuciones',
                        data: [120, 190, 150, 280, 200, 150, 180],
                        borderColor: '#6366f1',
                        backgroundColor: 'rgba(99, 102, 241, 0.1)',
                        tension: 0.4,
                        fill: true
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: { display: false }
                    },
                    scales: {
                        y: { 
                            beginAtZero: true,
                            grid: { color: 'rgba(255, 255, 255, 0.1)' },
                            ticks: { color: '#9ca3af' }
                        },
                        x: {
                            grid: { display: false },
                            ticks: { color: '#9ca3af' }
                        }
                    }
                }
            })

            // Category Chart
            const ctx2 = document.getElementById('categoryChart').getContext('2d')
            new Chart(ctx2, {
                type: 'doughnut',
                data: {
                    labels: ['Marketing', 'Comunicación', 'Finanzas', 'Productividad'],
                    datasets: [{
                        data: [30, 25, 20, 25],
                        backgroundColor: [
                            '#6366f1',
                            '#8b5cf6',
                            '#ec4899',
                            '#f59e0b'
                        ]
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'bottom',
                            labels: { color: '#9ca3af' }
                        }
                    }
                }
            })
        }

        function logout() {
            localStorage.removeItem('token')
            localStorage.removeItem('user')
            window.location.href = '/login'
        }

        // Load data
        loadStats()
        loadRecentAutomations()
        initCharts()
    </script>
</body>
</html>
`
