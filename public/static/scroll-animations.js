// Advanced Scroll Animations - Runamatic Style

// Intersection Observer for reveal animations
const observeElements = () => {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('observed')
        // Optional: unobserve after animation
        // observer.unobserve(entry.target)
      }
    })
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  })

  // Observe all elements with animation classes
  document.querySelectorAll('.observe-fade, .observe-slide-left, .observe-slide-right, .observe-scale').forEach(el => {
    observer.observe(el)
  })
}

// Number counter animation
const animateCounters = () => {
  const counters = document.querySelectorAll('.counter')
  
  counters.forEach(counter => {
    const target = parseInt(counter.getAttribute('data-target'))
    const duration = 2000
    const increment = target / (duration / 16)
    let current = 0

    const updateCounter = () => {
      current += increment
      if (current < target) {
        counter.textContent = Math.floor(current).toLocaleString()
        requestAnimationFrame(updateCounter)
      } else {
        counter.textContent = target.toLocaleString()
      }
    }

    // Start animation when element is visible
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        updateCounter()
        observer.disconnect()
      }
    })

    observer.observe(counter)
  })
}

// Parallax scroll effect
const initParallax = () => {
  const parallaxElements = document.querySelectorAll('.parallax')
  
  window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset
    
    parallaxElements.forEach(el => {
      const speed = el.getAttribute('data-speed') || 0.5
      const yPos = -(scrolled * speed)
      el.style.transform = `translateY(${yPos}px)`
    })
  })
}

// Smooth scroll for anchor links
const initSmoothScroll = () => {
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
}

// Logo carousel continuous scroll
const initLogoCarousel = () => {
  const carousels = document.querySelectorAll('.logo-carousel-wrapper')
  
  carousels.forEach(wrapper => {
    const carousel = wrapper.querySelector('.logo-carousel')
    if (!carousel) return
    
    // Clone items for infinite scroll
    const items = carousel.innerHTML
    carousel.innerHTML = items + items
  })
}

// 3D tilt effect on cards
const init3DTilt = () => {
  const cards = document.querySelectorAll('.tilt-card')
  
  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      
      const centerX = rect.width / 2
      const centerY = rect.height / 2
      
      const rotateX = (y - centerY) / 10
      const rotateY = (centerX - x) / 10
      
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`
    })
    
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)'
    })
  })
}

// Stagger animation for lists
const staggerAnimation = () => {
  const lists = document.querySelectorAll('.stagger-list')
  
  lists.forEach(list => {
    const items = list.querySelectorAll('.stagger-item')
    
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        items.forEach((item, index) => {
          setTimeout(() => {
            item.classList.add('fade-in-up')
          }, index * 100)
        })
        observer.disconnect()
      }
    })
    
    observer.observe(list)
  })
}

// Magnetic button effect
const initMagneticButtons = () => {
  const buttons = document.querySelectorAll('.magnetic-btn')
  
  buttons.forEach(button => {
    button.addEventListener('mousemove', (e) => {
      const rect = button.getBoundingClientRect()
      const x = e.clientX - rect.left - rect.width / 2
      const y = e.clientY - rect.top - rect.height / 2
      
      button.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`
    })
    
    button.addEventListener('mouseleave', () => {
      button.style.transform = 'translate(0, 0)'
    })
  })
}

// Progress bar on scroll
const initScrollProgress = () => {
  const progressBar = document.querySelector('.scroll-progress')
  if (!progressBar) return
  
  window.addEventListener('scroll', () => {
    const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight
    const scrolled = (window.pageYOffset / windowHeight) * 100
    progressBar.style.width = scrolled + '%'
  })
}

// Typewriter effect
const typewriterEffect = (element, text, speed = 50) => {
  let i = 0
  element.textContent = ''
  
  const type = () => {
    if (i < text.length) {
      element.textContent += text.charAt(i)
      i++
      setTimeout(type, speed)
    }
  }
  
  type()
}

// Auto-init typewriter elements
const initTypewriter = () => {
  const elements = document.querySelectorAll('.typewriter-text')
  
  elements.forEach(el => {
    const text = el.getAttribute('data-text') || el.textContent
    const speed = parseInt(el.getAttribute('data-speed')) || 50
    
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        typewriterEffect(el, text, speed)
        observer.disconnect()
      }
    })
    
    observer.observe(el)
  })
}

// Cursor trail effect (optional, premium effect)
let cursorDots = []
const initCursorTrail = () => {
  // Only on desktop
  if (window.innerWidth < 768) return
  
  document.addEventListener('mousemove', (e) => {
    const dot = document.createElement('div')
    dot.className = 'cursor-dot'
    dot.style.left = e.clientX + 'px'
    dot.style.top = e.clientY + 'px'
    document.body.appendChild(dot)
    
    cursorDots.push(dot)
    
    setTimeout(() => {
      dot.style.opacity = '0'
      setTimeout(() => {
        dot.remove()
        cursorDots.shift()
      }, 500)
    }, 100)
    
    // Limit dots
    if (cursorDots.length > 10) {
      cursorDots[0].remove()
      cursorDots.shift()
    }
  })
}

// Gradient animation on hover
const initGradientHover = () => {
  const elements = document.querySelectorAll('.gradient-hover')
  
  elements.forEach(el => {
    el.addEventListener('mousemove', (e) => {
      const rect = el.getBoundingClientRect()
      const x = ((e.clientX - rect.left) / rect.width) * 100
      const y = ((e.clientY - rect.top) / rect.height) * 100
      
      el.style.background = `radial-gradient(circle at ${x}% ${y}%, rgba(99, 102, 241, 0.2), transparent)`
    })
    
    el.addEventListener('mouseleave', () => {
      el.style.background = ''
    })
  })
}

// Initialize all animations
const initAllAnimations = () => {
  observeElements()
  animateCounters()
  initParallax()
  initSmoothScroll()
  initLogoCarousel()
  init3DTilt()
  staggerAnimation()
  initMagneticButtons()
  initScrollProgress()
  initTypewriter()
  initGradientHover()
  // initCursorTrail() // Uncomment for cursor trail effect
}

// Run on DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initAllAnimations)
} else {
  initAllAnimations()
}

// Re-init on page navigation (for SPA)
window.addEventListener('popstate', initAllAnimations)

// Export functions for manual use
window.scrollAnimations = {
  observeElements,
  animateCounters,
  initParallax,
  init3DTilt,
  typewriterEffect
}
