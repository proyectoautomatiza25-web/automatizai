export const dashboardHTML = `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Dashboard - AutomatizAI</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
  <style>
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
    .animate-spin {
      animation: spin 1s linear infinite;
    }
    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.5; }
    }
    .animate-pulse {
      animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
    }
  </style>
</head>
<body class="bg-gradient-to-br from-purple-50 via-blue-50 to-purple-50">
  
  <!-- Loading State -->
  <div id="loading" class="min-h-screen flex items-center justify-center">
    <div class="text-center">
      <div class="animate-spin rounded-full h-16 w-16 border-b-4 border-purple-600 mx-auto"></div>
      <p class="mt-4 text-gray-600 font-medium">Cargando dashboard...</p>
    </div>
  </div>
  
  <!-- Error State -->
  <div id="error" class="hidden min-h-screen flex items-center justify-center">
    <div class="text-center bg-white p-8 rounded-2xl shadow-xl max-w-md">
      <div class="text-6xl mb-4">⚠️</div>
      <h2 class="text-2xl font-bold text-gray-800 mb-2">Error</h2>
      <p id="error-message" class="text-gray-600 mb-6"></p>
      <button
        onclick="loadDashboardData()"
        class="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-semibold"
      >
        Reintentar
      </button>
    </div>
  </div>
  
  <!-- Main Dashboard -->
  <div id="dashboard" class="hidden min-h-screen">
    
    <!-- Header -->
    <div class="bg-white border-b border-gray-200 sticky top-0 z-10">
      <div class="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">🤖 AutomatizAI</h1>
        </div>
        <button
          onclick="showConnectModal()"
          class="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-semibold transition-all hover:scale-105 shadow-lg"
        >
          + Conectar Cuenta
        </button>
      </div>
    </div>
    
    <div class="max-w-7xl mx-auto px-6 py-8">
      
      <!-- Welcome -->
      <div class="mb-8">
        <h2 class="text-3xl font-bold text-gray-900 mb-2">
          ¡Bienvenido de vuelta! 👋
        </h2>
        <p class="text-gray-600">
          Gestiona tus automatizaciones de redes sociales
        </p>
      </div>
      
      <!-- Analytics Cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        
        <!-- Card 1 -->
        <div class="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow">
          <div class="flex items-start justify-between mb-4">
            <div class="flex-1">
              <p class="text-sm text-gray-500 mb-1">Automatizaciones Activas</p>
              <p id="stat-automations" class="text-4xl font-bold text-purple-600">0</p>
            </div>
            <div class="text-4xl">🤖</div>
          </div>
          <div class="flex items-center text-sm">
            <span class="text-green-600 font-medium">↑ +12%</span>
            <span class="text-gray-500 ml-2">vs mes anterior</span>
          </div>
        </div>
        
        <!-- Card 2 -->
        <div class="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow">
          <div class="flex items-start justify-between mb-4">
            <div class="flex-1">
              <p class="text-sm text-gray-500 mb-1">Posts Publicados</p>
              <p id="stat-posts" class="text-4xl font-bold text-blue-600">0</p>
            </div>
            <div class="text-4xl">📊</div>
          </div>
          <div class="flex items-center text-sm">
            <span class="text-green-600 font-medium">↑ +28%</span>
            <span class="text-gray-500 ml-2">este mes</span>
          </div>
        </div>
        
        <!-- Card 3 -->
        <div class="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow">
          <div class="flex items-start justify-between mb-4">
            <div class="flex-1">
              <p class="text-sm text-gray-500 mb-1">Cuentas Conectadas</p>
              <p id="stat-accounts" class="text-4xl font-bold text-green-600">0</p>
            </div>
            <div class="text-4xl">🔗</div>
          </div>
          <div class="flex items-center text-sm">
            <span class="text-gray-500">Listo para automatizar</span>
          </div>
        </div>
        
        <!-- Card 4 -->
        <div class="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow">
          <div class="flex items-start justify-between mb-4">
            <div class="flex-1">
              <p class="text-sm text-gray-500 mb-1">Tiempo Ahorrado</p>
              <p id="stat-time" class="text-4xl font-bold text-orange-600">0h</p>
            </div>
            <div class="text-4xl">⏰</div>
          </div>
          <div class="flex items-center text-sm">
            <span class="text-gray-500">en total</span>
          </div>
        </div>
        
      </div>
      
      <!-- Cuentas Conectadas -->
      <div class="bg-white rounded-2xl p-8 shadow-lg">
        <div class="flex justify-between items-center mb-6">
          <h3 class="text-2xl font-bold text-gray-900">Cuentas Conectadas</h3>
          <button
            onclick="showConnectModal()"
            class="text-purple-600 hover:text-purple-700 font-semibold"
          >
            + Agregar
          </button>
        </div>
        
        <!-- Empty State -->
        <div id="accounts-empty" class="hidden text-center py-16">
          <div class="text-7xl mb-4">📱</div>
          <h4 class="text-2xl font-bold text-gray-800 mb-3">
            No tienes cuentas conectadas
          </h4>
          <p class="text-gray-600 mb-8 max-w-md mx-auto">
            Conecta tu primera cuenta de Instagram o Facebook para comenzar a automatizar tus publicaciones
          </p>
          <button
            onclick="showConnectModal()"
            class="bg-purple-600 hover:bg-purple-700 text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-lg hover:scale-105 transition-all"
          >
            Conectar Primera Cuenta
          </button>
        </div>
        
        <!-- Accounts Grid -->
        <div id="accounts-grid" class="hidden grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <!-- Accounts will be rendered here -->
        </div>
      </div>
      
    </div>
  </div>
  
  <!-- Modal Conectar Cuenta -->
  <div id="connect-modal" class="hidden fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
    <div class="bg-white rounded-3xl max-w-lg w-full p-8 relative shadow-2xl">
      
      <button
        onclick="hideConnectModal()"
        class="absolute top-6 right-6 text-gray-400 hover:text-gray-600 text-3xl font-bold"
      >
        ×
      </button>
      
      <h2 class="text-3xl font-bold mb-2 text-gray-900">Conectar Cuenta</h2>
      <p class="text-gray-600 mb-8">
        Conecta tu cuenta de redes sociales para comenzar a automatizar
      </p>
      
      <form id="connect-form" class="space-y-6">
        
        <div>
          <label class="block text-sm font-bold text-gray-700 mb-2">
            Plataforma
          </label>
          <select
            id="platform-select"
            class="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-purple-500 focus:border-purple-500 font-medium"
          >
            <option value="instagram">📸 Instagram</option>
            <option value="facebook">👥 Facebook</option>
          </select>
        </div>
        
        <div>
          <label class="block text-sm font-bold text-gray-700 mb-2">
            Access Token
          </label>
          <textarea
            id="api-key-input"
            placeholder="Pega aquí tu Access Token de Meta..."
            rows="5"
            required
            class="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-purple-500 focus:border-purple-500 resize-none font-mono text-sm"
          ></textarea>
          <p class="mt-3 text-xs text-gray-600">
            💡 Obtén tu token desde
            <a
              href="https://developers.facebook.com/tools/explorer"
              target="_blank"
              rel="noopener noreferrer"
              class="text-purple-600 hover:underline font-semibold"
            >
              Meta Graph API Explorer
            </a>
          </p>
        </div>
        
        <div id="modal-error" class="hidden bg-red-50 border-2 border-red-200 text-red-700 px-4 py-3 rounded-xl font-medium">
          <!-- Error message -->
        </div>
        
        <div class="flex gap-3 pt-4">
          <button
            type="button"
            onclick="hideConnectModal()"
            class="flex-1 px-6 py-4 border-2 border-gray-300 rounded-xl font-bold hover:bg-gray-50 transition-all"
          >
            Cancelar
          </button>
          <button
            type="submit"
            id="connect-submit"
            class="flex-1 px-6 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-bold hover:from-purple-700 hover:to-blue-700 shadow-lg hover:scale-105 transition-all"
          >
            Conectar
          </button>
        </div>
        
      </form>
    </div>
  </div>
  
  <script>
    // Configuration
    const API_BASE = 'https://3000-ityg0nqhf71a8d8104awt-2e77fc33.sandbox.novita.ai'
    const TEMP_USER_ID = 'demo-user-123'
    
    let accountsData = []
    let analyticsData = null
    
    // Platform configurations
    const platformColors = {
      instagram: 'from-pink-500 to-purple-500',
      facebook: 'from-blue-500 to-blue-600',
      twitter: 'from-blue-400 to-blue-500',
      linkedin: 'from-blue-600 to-blue-700'
    }
    
    const platformIcons = {
      instagram: '📸',
      facebook: '👥',
      twitter: '🐦',
      linkedin: '💼'
    }
    
    // Load dashboard data
    async function loadDashboardData() {
      showLoading()
      
      try {
        // Obtener cuentas conectadas
        const accountsRes = await fetch(\`\${API_BASE}/api/keys/list?userId=\${TEMP_USER_ID}\`)
        if (accountsRes.ok) {
          const accountsDataRes = await accountsRes.json()
          accountsData = accountsDataRes.accounts || []
        }
        
        // Obtener analytics
        const analyticsRes = await fetch(\`\${API_BASE}/api/analytics?userId=\${TEMP_USER_ID}\`)
        if (analyticsRes.ok) {
          analyticsData = await analyticsRes.json()
        }
        
        renderDashboard()
        
      } catch (err) {
        console.error('Error cargando datos:', err)
        showError('Error al cargar datos del dashboard')
      }
    }
    
    // Render dashboard
    function renderDashboard() {
      hideLoading()
      hideError()
      
      // Update stats
      document.getElementById('stat-automations').textContent = analyticsData?.active_automations || 0
      document.getElementById('stat-posts').textContent = analyticsData?.posts_published || 0
      document.getElementById('stat-accounts').textContent = accountsData.length
      document.getElementById('stat-time').textContent = (analyticsData?.time_saved_hours || 0) + 'h'
      
      // Render accounts
      if (accountsData.length === 0) {
        document.getElementById('accounts-empty').classList.remove('hidden')
        document.getElementById('accounts-grid').classList.add('hidden')
      } else {
        document.getElementById('accounts-empty').classList.add('hidden')
        document.getElementById('accounts-grid').classList.remove('hidden')
        renderAccounts()
      }
      
      document.getElementById('dashboard').classList.remove('hidden')
    }
    
    // Render accounts
    function renderAccounts() {
      const grid = document.getElementById('accounts-grid')
      grid.innerHTML = accountsData.map(account => \`
        <div class="bg-gradient-to-br from-white to-gray-50 border-2 border-gray-200 rounded-2xl p-6 hover:shadow-2xl transition-all hover:scale-105">
          
          <div class="bg-gradient-to-r \${platformColors[account.platform]} text-white px-4 py-3 rounded-xl mb-4 flex items-center justify-between">
            <span class="text-3xl">\${platformIcons[account.platform]}</span>
            <span class="font-bold capitalize text-lg">\${account.platform}</span>
          </div>
          
          <div class="flex items-center gap-4 mb-4">
            \${account.account_avatar
              ? \`<img src="\${account.account_avatar}" alt="\${account.account_name}" class="w-16 h-16 rounded-full object-cover border-4 border-white shadow-lg" />\`
              : \`<div class="w-16 h-16 rounded-full bg-gradient-to-br from-purple-400 to-blue-400 flex items-center justify-center text-3xl shadow-lg">👤</div>\`
            }
            
            <div class="flex-1 min-w-0">
              <h4 class="font-bold text-lg text-gray-900 truncate">
                @\${account.account_name}
              </h4>
              <p class="text-sm text-gray-600">
                \${(account.followers_count || 0).toLocaleString()} seguidores
              </p>
            </div>
          </div>
          
          <div class="mb-4">
            <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold \${
              account.status === 'active' 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
            }">
              <span class="w-2 h-2 rounded-full bg-current mr-2 animate-pulse"></span>
              \${account.status === 'active' ? 'Activa' : 'Inactiva'}
            </span>
          </div>
          
          <div class="flex gap-3">
            <button
              class="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white py-3 rounded-xl font-bold transition-all hover:scale-105 shadow-lg"
            >
              Crear Post
            </button>
            <button
              onclick="deleteAccount('\${account.id}')"
              class="px-4 py-3 border-2 border-red-300 text-red-600 hover:bg-red-50 rounded-xl font-bold transition-all hover:scale-105"
            >
              🗑️
            </button>
          </div>
          
        </div>
      \`).join('')
    }
    
    // Delete account
    async function deleteAccount(accountId) {
      if (!confirm('¿Seguro que quieres desconectar esta cuenta?')) return
      
      try {
        const res = await fetch(\`\${API_BASE}/api/keys/\${accountId}\`, {
          method: 'DELETE'
        })
        
        if (res.ok) {
          loadDashboardData()
        } else {
          alert('Error al eliminar')
        }
      } catch (err) {
        alert('Error al eliminar')
      }
    }
    
    // Modal functions
    function showConnectModal() {
      document.getElementById('connect-modal').classList.remove('hidden')
      document.getElementById('api-key-input').value = ''
      document.getElementById('modal-error').classList.add('hidden')
    }
    
    function hideConnectModal() {
      document.getElementById('connect-modal').classList.add('hidden')
    }
    
    // Submit connect form
    document.getElementById('connect-form').addEventListener('submit', async (e) => {
      e.preventDefault()
      
      const platform = document.getElementById('platform-select').value
      const apiKey = document.getElementById('api-key-input').value
      const submitBtn = document.getElementById('connect-submit')
      const errorDiv = document.getElementById('modal-error')
      
      errorDiv.classList.add('hidden')
      submitBtn.disabled = true
      submitBtn.textContent = 'Conectando...'
      
      try {
        // 1. Validar
        const validateRes = await fetch(\`\${API_BASE}/api/keys/validate\`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ platform, apiKey })
        })
        
        if (!validateRes.ok) {
          const errorData = await validateRes.json()
          throw new Error(errorData.error || 'API Key inválida')
        }
        
        const { accountInfo } = await validateRes.json()
        
        // 2. Guardar
        const saveRes = await fetch(\`\${API_BASE}/api/keys/save\`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            platform,
            apiKey,
            accountInfo,
            userId: TEMP_USER_ID
          })
        })
        
        if (!saveRes.ok) {
          throw new Error('Error al guardar la cuenta')
        }
        
        hideConnectModal()
        loadDashboardData()
        
      } catch (err) {
        errorDiv.textContent = '⚠️ ' + err.message
        errorDiv.classList.remove('hidden')
      } finally {
        submitBtn.disabled = false
        submitBtn.textContent = 'Conectar'
      }
    })
    
    // UI helpers
    function showLoading() {
      document.getElementById('loading').classList.remove('hidden')
      document.getElementById('error').classList.add('hidden')
      document.getElementById('dashboard').classList.add('hidden')
    }
    
    function hideLoading() {
      document.getElementById('loading').classList.add('hidden')
    }
    
    function showError(message) {
      document.getElementById('error-message').textContent = message
      document.getElementById('error').classList.remove('hidden')
      document.getElementById('loading').classList.add('hidden')
      document.getElementById('dashboard').classList.add('hidden')
    }
    
    function hideError() {
      document.getElementById('error').classList.add('hidden')
    }
    
    // Initialize on load
    loadDashboardData()
  </script>
</body>
</html>
`;
