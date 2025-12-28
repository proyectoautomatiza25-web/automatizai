// Landing Profesional - Agencia de Automatización Real
export const professionalLandingHTML = `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>AutomatizA SUR - Agencia de Automatización Empresarial</title>
  <meta name="description" content="Agencia especializada en automatización empresarial con n8n, Make, WhatsApp, Instagram y Gmail. Optimiza tus procesos y ahorra tiempo.">
  
  <!-- Fonts & Icons -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet">
  <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
  <link href="/static/landing-pro.css" rel="stylesheet">
  
  <style>
    /* Colores naranjas y rosados */
    :root {
      --primary: #ff6b35;
      --secondary: #ff006e;
      --accent: #ff7f50;
      --dark: #0a0a0a;
      --gray-100: #f3f4f6;
      --gray-300: #d1d5db;
      --gray-400: #9ca3af;
    }
    
    .logo-container {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }
    
    .logo-image {
      width: 40px;
      height: 40px;
      border-radius: 8px;
    }
    
    .logo-text {
      font-size: 1.75rem;
      font-weight: 800;
      background: linear-gradient(135deg, #ff6b35 0%, #ff006e 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      letter-spacing: -0.5px;
    }
    
    /* Override colores en toda la página */
    .navbar { background: linear-gradient(135deg, rgba(255, 107, 53, 0.05) 0%, rgba(255, 0, 110, 0.05) 100%); }
    .btn-primary { background: linear-gradient(135deg, #ff6b35 0%, #ff006e 100%); }
    .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 10px 25px rgba(255, 107, 53, 0.3); }
    .gradient-text { background: linear-gradient(135deg, #ff6b35 0%, #ff006e 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
    .nav-cta { background: linear-gradient(135deg, #ff6b35 0%, #ff006e 100%); }
    .pricing-card.featured { border: 2px solid #ff6b35; background: linear-gradient(135deg, rgba(255, 107, 53, 0.05) 0%, rgba(255, 0, 110, 0.05) 100%); }
    .pricing-badge { background: linear-gradient(135deg, #ff6b35 0%, #ff006e 100%); }
  </style>
</head>
<body>
  <div id="scroll-progress"></div>

  <!-- Navigation -->
  <nav class="navbar">
    <div class="nav-container">
      <div class="logo-container">
        <img src="https://www.genspark.ai/api/files/s/U8v18KZv?cache_control=3600" alt="AutomatizA SUR Logo" class="logo-image" />
        <div class="logo-text">AutomatizA SUR</div>
      </div>
      <ul class="nav-links">
        <li><a href="#servicios">Servicios</a></li>
        <li><a href="#herramientas">Herramientas</a></li>
        <li><a href="#precios">Precios</a></li>
        <li><a href="#contacto">Contacto</a></li>
      </ul>
      <a href="#precios" class="nav-cta">Comenzar</a>
      <button id="mobile-menu-btn"><i class="fas fa-bars"></i></button>
    </div>
  </nav>

  <!-- Mobile Menu -->
  <div id="mobile-menu">
    <button id="mobile-menu-close" style="position: absolute; top: 1rem; right: 1rem; background: none; border: none; color: white; font-size: 1.5rem; cursor: pointer;">
      <i class="fas fa-times"></i>
    </button>
    <ul style="list-style: none; margin-top: 3rem;">
      <li style="margin-bottom: 1.5rem;"><a href="#servicios" style="color: white; font-size: 1.2rem; text-decoration: none;">Servicios</a></li>
      <li style="margin-bottom: 1.5rem;"><a href="#herramientas" style="color: white; font-size: 1.2rem; text-decoration: none;">Herramientas</a></li>
      <li style="margin-bottom: 1.5rem;"><a href="#precios" style="color: white; font-size: 1.2rem; text-decoration: none;">Precios</a></li>
      <li style="margin-bottom: 1.5rem;"><a href="#contacto" style="color: white; font-size: 1.2rem; text-decoration: none;">Contacto</a></li>
    </ul>
  </div>

  <!-- Hero -->
  <section class="hero">
    <div class="hero-background"></div>
    <div class="hero-content fade-in-up">
      <h1>
        Agencia de <span class="gradient-text">Automatización</span><br>
        para Empresas
      </h1>
      <p class="hero-subtitle">
        Optimiza tus procesos empresariales con automatizaciones profesionales.<br>
        Especialistas en n8n, Make, WhatsApp, Instagram y Gmail.
      </p>
      <div class="hero-cta">
        <a href="#precios" class="btn-primary">
          <i class="fas fa-rocket"></i> Ver Planes
        </a>
        <a href="#contacto" class="btn-secondary">
          <i class="fas fa-envelope"></i> Contactar
        </a>
      </div>
    </div>
  </section>

  <!-- Herramientas -->
  <section id="herramientas" style="padding: 4rem 2rem; background: rgba(0, 0, 0, 0.02);">
    <div style="max-width: 1280px; margin: 0 auto; text-align: center;">
      <h2 class="section-title fade-in-up">Herramientas que <span class="gradient-text">Dominamos</span></h2>
      <p style="color: var(--gray-400); margin-bottom: 3rem; font-size: 1.1rem;">
        Trabajamos con las mejores plataformas del mercado
      </p>
      
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 2rem;">
        
        <!-- n8n -->
        <div class="fade-in-up" style="background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.05); border-radius: 1rem; padding: 2rem; text-align: center; transition: all 0.3s;">
          <img src="https://sspark.genspark.ai/cfimages?u1=lUl0bZp0rlPhsvHLEpjIFIoVKzRHg0nEWW9cQg6znhRNfi7uHnPGuvX1Qckqg1MrV3enA1cd8VM36ovESqK0eVthNTN%2B7IoAfwP2iV4JkAxn5%2FM55fDM5v9Y3qepC3sEyLouMOYPKnSs&u2=1XdMxOua9icT10hx&width=400" alt="n8n" style="width: 80px; height: 80px; margin: 0 auto 1rem; object-fit: contain;" />
          <h3 style="color: white; margin-bottom: 0.5rem; font-size: 1.5rem;">n8n</h3>
          <p style="color: var(--gray-400); font-size: 0.9rem;">Automatización Open Source</p>
        </div>

        <!-- Make -->
        <div class="fade-in-up" style="background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.05); border-radius: 1rem; padding: 2rem; text-align: center; transition: all 0.3s;">
          <img src="https://sspark.genspark.ai/cfimages?u1=cMtgoIESpjOmnlaP%2B577Qi%2BizrphEy7o5VmqBe%2F%2BiRMQ4gswr1oWdwwDAxdVGvDwIHN4MahBeCYfV0w%2FWnewPrjb8iAeUJAkpO0DRNG3f8HFpknlnrEmQNgCQwso%2ByKA1rijPVcBQ1D%2F&u2=mxj%2FIVe84FdX06nK&width=400" alt="Make" style="width: 80px; height: 80px; margin: 0 auto 1rem; object-fit: contain;" />
          <h3 style="color: white; margin-bottom: 0.5rem; font-size: 1.5rem;">Make</h3>
          <p style="color: var(--gray-400); font-size: 0.9rem;">Integración Avanzada</p>
        </div>

        <!-- WhatsApp -->
        <div class="fade-in-up" style="background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.05); border-radius: 1rem; padding: 2rem; text-align: center; transition: all 0.3s;">
          <img src="https://sspark.genspark.ai/cfimages?u1=kba8GrGToLScqNcV7CGEHoM560JHSZyqumQj2owLoRgPOitAb%2F9KHt0Fm2j72qRm709xepeLXLIBJHzIFftHu8m8zKHkoyShuD9jEP2A9SJAwppAG5dpnpF0RsvqDrt9eQ%3D%3D&u2=qdBC34%2FMiXsKmSPp&width=400" alt="WhatsApp" style="width: 80px; height: 80px; margin: 0 auto 1rem; object-fit: contain;" />
          <h3 style="color: white; margin-bottom: 0.5rem; font-size: 1.5rem;">WhatsApp</h3>
          <p style="color: var(--gray-400); font-size: 0.9rem;">Mensajería Automatizada</p>
        </div>

        <!-- Instagram -->
        <div class="fade-in-up" style="background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.05); border-radius: 1rem; padding: 2rem; text-align: center; transition: all 0.3s;">
          <img src="https://sspark.genspark.ai/cfimages?u1=THS9XBPKzQHP5ZwweZtvtaceowgsdm%2FAXqzj%2BMzBZwYtpvDKuzG8lhmayLRL5L6yntiXYg7H42rG50JZt4p%2BhSaJtJTubMxuhznoD5NB9oUwHFI4UB0%3D&u2=hr9RRc%2Bj4Hj0Z4Aq&width=400" alt="Instagram" style="width: 80px; height: 80px; margin: 0 auto 1rem; object-fit: contain;" />
          <h3 style="color: white; margin-bottom: 0.5rem; font-size: 1.5rem;">Instagram</h3>
          <p style="color: var(--gray-400); font-size: 0.9rem;">Gestión de Redes</p>
        </div>

        <!-- Gmail -->
        <div class="fade-in-up" style="background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.05); border-radius: 1rem; padding: 2rem; text-align: center; transition: all 0.3s;">
          <img src="https://sspark.genspark.ai/cfimages?u1=jdpaPZ%2FxQ81%2B2KLwdqRbNMc6qmalyA7pvt4qCTlBG9E8uAVKEpiW77IGjUT7%2BrHEav71YgEs%2BeVxO8FEmv%2BHj3wEgLdjXbYfRVGezg%3D%3D&u2=%2BMp4o6GufCtZk1ea&width=400" alt="Gmail" style="width: 80px; height: 80px; margin: 0 auto 1rem; object-fit: contain;" />
          <h3 style="color: white; margin-bottom: 0.5rem; font-size: 1.5rem;">Gmail</h3>
          <p style="color: var(--gray-400); font-size: 0.9rem;">Email Automation</p>
        </div>

      </div>
    </div>
  </section>

  <!-- Servicios -->
  <section id="servicios" class="features-section">
    <div class="features-container">
      <h2 class="section-title fade-in-up">Nuestros <span class="gradient-text">Servicios</span></h2>
      <p style="text-align: center; color: var(--gray-300); margin-bottom: 3rem; font-size: 1.1rem;">
        Soluciones completas de automatización para tu empresa
      </p>
      
      <div class="features-grid">
        
        <div class="feature-card fade-in-up">
          <div class="feature-icon">🤖</div>
          <h3>Automatización de Procesos</h3>
          <p>Automatizamos tareas repetitivas para que tu equipo se enfoque en lo importante. Flujos personalizados según tus necesidades.</p>
          <ul class="feature-list">
            <li>Análisis de procesos actuales</li>
            <li>Diseño de flujos optimizados</li>
            <li>Implementación completa</li>
            <li>Soporte continuo</li>
          </ul>
        </div>

        <div class="feature-card fade-in-up">
          <div class="feature-icon">🔗</div>
          <h3>Integraciones Personalizadas</h3>
          <p>Conectamos todas tus herramientas en un ecosistema unificado. APIs, webhooks y sincronización bidireccional.</p>
          <ul class="feature-list">
            <li>Integración de sistemas</li>
            <li>Sincronización de datos</li>
            <li>APIs personalizadas</li>
            <li>Webhooks configurados</li>
          </ul>
        </div>

        <div class="feature-card fade-in-up">
          <div class="feature-icon">💬</div>
          <h3>Automatización de Comunicación</h3>
          <p>WhatsApp, Email, Instagram y más. Respuestas automáticas, seguimiento de clientes y notificaciones inteligentes.</p>
          <ul class="feature-list">
            <li>Bots de WhatsApp</li>
            <li>Email marketing automatizado</li>
            <li>Gestión de RRSS</li>
            <li>Notificaciones multi-canal</li>
          </ul>
        </div>

        <div class="feature-card fade-in-up">
          <div class="feature-icon">📊</div>
          <h3>Reportes y Analytics</h3>
          <p>Dashboards automáticos con tus métricas clave. Reportes programados y alertas en tiempo real.</p>
          <ul class="feature-list">
            <li>Dashboards personalizados</li>
            <li>Reportes automatizados</li>
            <li>Alertas inteligentes</li>
            <li>Exportación de datos</li>
          </ul>
        </div>

        <div class="feature-card fade-in-up">
          <div class="feature-icon">🎓</div>
          <h3>Consultoría y Capacitación</h3>
          <p>Te enseñamos a gestionar y crear tus propias automatizaciones. Soporte técnico y mejores prácticas.</p>
          <ul class="feature-list">
            <li>Sesiones de capacitación</li>
            <li>Documentación detallada</li>
            <li>Soporte técnico dedicado</li>
            <li>Mejores prácticas</li>
          </ul>
        </div>

        <div class="feature-card fade-in-up">
          <div class="feature-icon">🔐</div>
          <h3>Seguridad y Privacidad</h3>
          <p>Implementación segura con cifrado end-to-end. Cumplimiento de normativas y protección de datos.</p>
          <ul class="feature-list">
            <li>Cifrado de datos</li>
            <li>Cumplimiento GDPR</li>
            <li>Backups automáticos</li>
            <li>Auditoría de seguridad</li>
          </ul>
        </div>

      </div>
    </div>
  </section>

  <!-- Pricing -->
  <section class="pricing-section" id="precios">
    <div style="max-width: 1280px; margin: 0 auto;">
      <h2 class="section-title fade-in-up">Planes de <span class="gradient-text">Suscripción</span></h2>
      <p style="text-align: center; color: var(--gray-300); margin-bottom: 1rem; font-size: 1.1rem;">
        Elige el plan que mejor se adapte a tu negocio
      </p>
      <p style="text-align: center; color: var(--accent); margin-bottom: 3rem; font-weight: 600;">
        🎁 14 días de prueba gratis • Cancela cuando quieras
      </p>
      
      <div class="pricing-grid">
        
        <div class="pricing-card fade-in-up">
          <h3>Starter</h3>
          <div style="margin: 1.5rem 0;">
            <span class="plan-price" data-monthly="49" data-annual="470">$49</span>
            <span style="color: var(--gray-400);">/mes</span>
          </div>
          <p style="color: var(--gray-400); margin-bottom: 2rem;">Para emprendedores y pequeñas empresas</p>
          <ul class="plan-features">
            <li>5 automatizaciones activas</li>
            <li>1 usuario incluido</li>
            <li>Soporte por email</li>
            <li>Integraciones básicas</li>
            <li>Documentación completa</li>
          </ul>
          <a href="#registro" class="btn-primary" style="width: 100%; margin-top: 2rem; text-align: center;">
            Comenzar
          </a>
        </div>

        <div class="pricing-card featured fade-in-up">
          <div class="pricing-badge">MÁS POPULAR</div>
          <h3>Growth</h3>
          <div style="margin: 1.5rem 0;">
            <span class="plan-price" data-monthly="89" data-annual="854">$89</span>
            <span style="color: var(--gray-400);">/mes</span>
          </div>
          <p style="color: var(--gray-400); margin-bottom: 2rem;">Para empresas en crecimiento</p>
          <ul class="plan-features">
            <li>15 automatizaciones activas</li>
            <li>3 usuarios incluidos</li>
            <li>Soporte prioritario 24/7</li>
            <li>Todas las integraciones</li>
            <li>Consultoría mensual (1h)</li>
            <li>API access</li>
            <li>Reportes avanzados</li>
          </ul>
          <a href="#registro" class="btn-primary" style="width: 100%; margin-top: 2rem; text-align: center;">
            Comenzar
          </a>
        </div>

        <div class="pricing-card fade-in-up">
          <h3>Pro</h3>
          <div style="margin: 1.5rem 0;">
            <span class="plan-price" data-monthly="130" data-annual="1248">$130</span>
            <span style="color: var(--gray-400);">/mes</span>
          </div>
          <p style="color: var(--gray-400); margin-bottom: 2rem;">Para equipos profesionales</p>
          <ul class="plan-features">
            <li>30 automatizaciones activas</li>
            <li>10 usuarios incluidos</li>
            <li>Soporte dedicado</li>
            <li>Integraciones personalizadas</li>
            <li>Consultoría mensual (3h)</li>
            <li>Capacitación incluida</li>
            <li>White-label disponible</li>
          </ul>
          <a href="#registro" class="btn-primary" style="width: 100%; margin-top: 2rem; text-align: center;">
            Comenzar
          </a>
        </div>

        <div class="pricing-card fade-in-up">
          <h3>Enterprise</h3>
          <div style="margin: 1.5rem 0;">
            <span class="plan-price" data-monthly="190" data-annual="1824">$190</span>
            <span style="color: var(--gray-400);">/mes</span>
          </div>
          <p style="color: var(--gray-400); margin-bottom: 2rem;">Para grandes organizaciones</p>
          <ul class="plan-features">
            <li>Automatizaciones ilimitadas</li>
            <li>Usuarios ilimitados</li>
            <li>Account manager dedicado</li>
            <li>SLA garantizado 99.9%</li>
            <li>Consultoría ilimitada</li>
            <li>Onboarding personalizado</li>
            <li>Infraestructura dedicada</li>
          </ul>
          <a href="#contacto" class="btn-primary" style="width: 100%; margin-top: 2rem; text-align: center;">
            Contactar
          </a>
        </div>

      </div>
    </div>
  </section>

  <!-- Contacto -->
  <section id="contacto" style="padding: 6rem 2rem; background: rgba(0, 0, 0, 0.02);">
    <div style="max-width: 800px; margin: 0 auto;">
      <h2 class="section-title fade-in-up">¿Listo para <span class="gradient-text">Automatizar</span>?</h2>
      <p style="text-align: center; color: var(--gray-300); margin-bottom: 3rem; font-size: 1.1rem;">
        Contáctanos y cuéntanos qué necesitas
      </p>

      <form id="contact-form" class="fade-in-up" style="background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.05); border-radius: 1rem; padding: 3rem;">
        
        <div style="margin-bottom: 1.5rem;">
          <label style="display: block; color: white; margin-bottom: 0.5rem; font-weight: 600;">Nombre Completo</label>
          <input
            type="text"
            name="name"
            required
            style="width: 100%; padding: 1rem; border: 2px solid rgba(255, 255, 255, 0.1); border-radius: 0.5rem; background: rgba(255, 255, 255, 0.05); color: white; font-size: 1rem;"
            placeholder="Tu nombre"
          />
        </div>

        <div style="margin-bottom: 1.5rem;">
          <label style="display: block; color: white; margin-bottom: 0.5rem; font-weight: 600;">Email</label>
          <input
            type="email"
            name="email"
            required
            style="width: 100%; padding: 1rem; border: 2px solid rgba(255, 255, 255, 0.1); border-radius: 0.5rem; background: rgba(255, 255, 255, 0.05); color: white; font-size: 1rem;"
            placeholder="tu@email.com"
          />
        </div>

        <div style="margin-bottom: 1.5rem;">
          <label style="display: block; color: white; margin-bottom: 0.5rem; font-weight: 600;">Teléfono (opcional)</label>
          <input
            type="tel"
            name="phone"
            style="width: 100%; padding: 1rem; border: 2px solid rgba(255, 255, 255, 0.1); border-radius: 0.5rem; background: rgba(255, 255, 255, 0.05); color: white; font-size: 1rem;"
            placeholder="+56 9 1234 5678"
          />
        </div>

        <div style="margin-bottom: 1.5rem;">
          <label style="display: block; color: white; margin-bottom: 0.5rem; font-weight: 600;">¿Qué necesitas automatizar?</label>
          <textarea
            name="message"
            required
            rows="5"
            style="width: 100%; padding: 1rem; border: 2px solid rgba(255, 255, 255, 0.1); border-radius: 0.5rem; background: rgba(255, 255, 255, 0.05); color: white; font-size: 1rem; resize: vertical;"
            placeholder="Cuéntanos qué procesos quieres automatizar..."
          ></textarea>
        </div>

        <div id="contact-status" style="display: none; padding: 1rem; border-radius: 0.5rem; margin-bottom: 1.5rem;"></div>

        <button
          type="submit"
          class="btn-primary"
          style="width: 100%; padding: 1.2rem; font-size: 1.1rem;"
        >
          <i class="fas fa-paper-plane"></i> Enviar Mensaje
        </button>

      </form>
    </div>
  </section>

  <!-- Footer -->
  <footer class="footer">
    <div class="footer-container">
      
      <div class="footer-section">
        <h4 class="logo-text" style="margin-bottom: 1.5rem;">AutomatizA SUR</h4>
        <p style="color: var(--gray-400); margin-bottom: 1.5rem; line-height: 1.8;">
          Agencia especializada en automatización empresarial. Optimiza tus procesos y enfócate en crecer.
        </p>
        <div style="display: flex; gap: 1rem; margin-top: 1.5rem; font-size: 1.5rem;">
          <a href="https://instagram.com/automatizai" target="_blank" style="color: var(--gray-400); transition: color 0.3s;"><i class="fab fa-instagram"></i></a>
          <a href="https://linkedin.com/company/automatizai" target="_blank" style="color: var(--gray-400); transition: color 0.3s;"><i class="fab fa-linkedin"></i></a>
          <a href="https://twitter.com/automatizai" target="_blank" style="color: var(--gray-400); transition: color 0.3s;"><i class="fab fa-twitter"></i></a>
          <a href="https://facebook.com/automatizai" target="_blank" style="color: var(--gray-400); transition: color 0.3s;"><i class="fab fa-facebook"></i></a>
        </div>
      </div>

      <div class="footer-section">
        <h4>Servicios</h4>
        <ul>
          <li><a href="#servicios">Automatización</a></li>
          <li><a href="#servicios">Integraciones</a></li>
          <li><a href="#servicios">Consultoría</a></li>
          <li><a href="#servicios">Capacitación</a></li>
        </ul>
      </div>

      <div class="footer-section">
        <h4>Herramientas</h4>
        <ul>
          <li><a href="#herramientas">n8n</a></li>
          <li><a href="#herramientas">Make</a></li>
          <li><a href="#herramientas">WhatsApp</a></li>
          <li><a href="#herramientas">Instagram</a></li>
          <li><a href="#herramientas">Gmail</a></li>
        </ul>
      </div>

      <div class="footer-section">
        <h4>Contacto</h4>
        <ul>
          <li><a href="#contacto">Formulario de Contacto</a></li>
          <li><a href="#precios">Ver Planes</a></li>
          <li><a href="#servicios">Nuestros Servicios</a></li>
        </ul>
      </div>

    </div>

    <div class="footer-bottom">
      <p>&copy; 2024 AutomatizA SUR. Todos los derechos reservados.</p>
      <p style="margin-top: 0.5rem; font-size: 0.85rem;">
        Agencia de Automatización Empresarial
      </p>
    </div>
  </footer>

  <!-- Scripts -->
  <script src="/static/landing-pro.js"></script>
  <script src="/static/chatbot.js"></script>
  
  <script>
    // Contact form handler
    document.getElementById('contact-form').addEventListener('submit', async (e) => {
      e.preventDefault()
      
      const form = e.target
      const status = document.getElementById('contact-status')
      const submitBtn = form.querySelector('button[type="submit"]')
      
      const formData = {
        name: form.name.value,
        email: form.email.value,
        phone: form.phone.value,
        message: form.message.value,
        to: 'proyecto.automatiza.cl'
      }
      
      submitBtn.disabled = true
      submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...'
      
      try {
        const response = await fetch('/api/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        })
        
        if (response.ok) {
          status.style.display = 'block'
          status.style.background = 'rgba(16, 185, 129, 0.1)'
          status.style.border = '2px solid #10b981'
          status.style.color = '#10b981'
          status.textContent = '✅ Mensaje enviado! Te responderemos pronto.'
          form.reset()
        } else {
          throw new Error('Error al enviar')
        }
      } catch (error) {
        status.style.display = 'block'
        status.style.background = 'rgba(239, 68, 68, 0.1)'
        status.style.border = '2px solid #ef4444'
        status.style.color = '#ef4444'
        status.textContent = '❌ Error al enviar. Por favor, escribe directamente a proyecto.automatiza.cl'
      } finally {
        submitBtn.disabled = false
        submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Enviar Mensaje'
      }
    })
  </script>
</body>
</html>
`;
`;
`;
