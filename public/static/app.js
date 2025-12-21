// Mobile menu toggle
document.addEventListener('DOMContentLoaded', () => {
  const mobileMenuBtn = document.getElementById('mobile-menu-btn')
  const mobileMenu = document.getElementById('mobile-menu')

  if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener('click', () => {
      mobileMenu.classList.toggle('hidden')
    })

    // Close mobile menu when clicking on a link
    const mobileLinks = mobileMenu.querySelectorAll('a')
    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.add('hidden')
      })
    })

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!mobileMenuBtn.contains(e.target) && !mobileMenu.contains(e.target)) {
        mobileMenu.classList.add('hidden')
      }
    })
  }
})

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault()
    const target = document.querySelector(this.getAttribute('href'))
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      })
    }
  })
})

// Add scroll-based animations
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -100px 0px'
}

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('animate-fade-in-up')
      observer.unobserve(entry.target)
    }
  })
}, observerOptions)

// Observe all sections
document.querySelectorAll('section').forEach(section => {
  observer.observe(section)
})

// Toast notification system
function showToast(message, type = 'info') {
  const toast = document.createElement('div')
  toast.className = 'toast'
  
  let icon = 'fa-info-circle'
  let color = '#6366f1'
  
  switch(type) {
    case 'success':
      icon = 'fa-check-circle'
      color = '#10b981'
      break
    case 'error':
      icon = 'fa-exclamation-circle'
      color = '#ef4444'
      break
    case 'warning':
      icon = 'fa-exclamation-triangle'
      color = '#f59e0b'
      break
  }
  
  toast.innerHTML = `
    <div class="flex items-center space-x-3">
      <i class="fas ${icon}" style="color: ${color}"></i>
      <span>${message}</span>
    </div>
  `
  
  document.body.appendChild(toast)
  
  setTimeout(() => {
    toast.style.animation = 'slide-out-right 0.3s ease-out'
    setTimeout(() => {
      document.body.removeChild(toast)
    }, 300)
  }, 3000)
}

// Loading spinner utility
function showLoading() {
  const loading = document.createElement('div')
  loading.id = 'global-loading'
  loading.className = 'fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50'
  loading.innerHTML = '<div class="spinner"></div>'
  document.body.appendChild(loading)
}

function hideLoading() {
  const loading = document.getElementById('global-loading')
  if (loading) {
    document.body.removeChild(loading)
  }
}

// Copy to clipboard utility
function copyToClipboard(text) {
  navigator.clipboard.writeText(text).then(() => {
    showToast('Copiado al portapapeles', 'success')
  }).catch(() => {
    showToast('Error al copiar', 'error')
  })
}

// Format date utility
function formatDate(dateString) {
  const options = { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }
  return new Date(dateString).toLocaleDateString('es-ES', options)
}

// Format number utility
function formatNumber(num) {
  return new Intl.NumberFormat('es-ES').format(num)
}

// Debounce utility
function debounce(func, wait) {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

// Throttle utility
function throttle(func, limit) {
  let inThrottle
  return function() {
    const args = arguments
    const context = this
    if (!inThrottle) {
      func.apply(context, args)
      inThrottle = true
      setTimeout(() => inThrottle = false, limit)
    }
  }
}

// Local storage helper
const storage = {
  set: (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value))
      return true
    } catch (e) {
      console.error('Storage error:', e)
      return false
    }
  },
  get: (key) => {
    try {
      const item = localStorage.getItem(key)
      return item ? JSON.parse(item) : null
    } catch (e) {
      console.error('Storage error:', e)
      return null
    }
  },
  remove: (key) => {
    try {
      localStorage.removeItem(key)
      return true
    } catch (e) {
      console.error('Storage error:', e)
      return false
    }
  },
  clear: () => {
    try {
      localStorage.clear()
      return true
    } catch (e) {
      console.error('Storage error:', e)
      return false
    }
  }
}

// API helper
const api = {
  get: async (endpoint, headers = {}) => {
    try {
      const response = await fetch(endpoint, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...headers
        }
      })
      return await response.json()
    } catch (error) {
      console.error('API Error:', error)
      throw error
    }
  },
  post: async (endpoint, data, headers = {}) => {
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...headers
        },
        body: JSON.stringify(data)
      })
      return await response.json()
    } catch (error) {
      console.error('API Error:', error)
      throw error
    }
  },
  put: async (endpoint, data, headers = {}) => {
    try {
      const response = await fetch(endpoint, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...headers
        },
        body: JSON.stringify(data)
      })
      return await response.json()
    } catch (error) {
      console.error('API Error:', error)
      throw error
    }
  },
  delete: async (endpoint, headers = {}) => {
    try {
      const response = await fetch(endpoint, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          ...headers
        }
      })
      return await response.json()
    } catch (error) {
      console.error('API Error:', error)
      throw error
    }
  }
}

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
  // Ctrl/Cmd + K for search (if search exists)
  if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
    e.preventDefault()
    const searchInput = document.querySelector('input[type="search"]')
    if (searchInput) {
      searchInput.focus()
    }
  }
})

// Console welcome message
console.log('%c🤖 AutomatizAI', 'font-size: 24px; font-weight: bold; color: #6366f1;')
console.log('%c¡Bienvenido a la plataforma de automatización más avanzada!', 'font-size: 14px; color: #8b5cf6;')
console.log('%cSi encuentras algún bug, por favor repórtalo a soporte@automatizai.com', 'font-size: 12px; color: #9ca3af;')

// Export utilities globally
window.showToast = showToast
window.showLoading = showLoading
window.hideLoading = hideLoading
window.copyToClipboard = copyToClipboard
window.formatDate = formatDate
window.formatNumber = formatNumber
window.storage = storage
window.api = api
