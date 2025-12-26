// Landing page HTML completa profesional
export const completeLandingHTML = `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>AutomatizAI - Automatización Profesional de Redes Sociales y Negocios</title>
  <meta name="description" content="Automatiza tu negocio con IA. 100+ herramientas conectadas, automatizaciones inteligentes para redes sociales, CRM, e-commerce y más.">
  <meta name="keywords" content="automatización, IA, redes sociales, CRM, e-commerce, n8n, make, zapier, automatizar negocio">
  
  <!-- Open Graph -->
  <meta property="og:title" content="AutomatizAI - Automatización Profesional">
  <meta property="og:description" content="Automatiza todo tu negocio con IA. 100+ herramientas conectadas.">
  <meta property="og:type" content="website">
  
  <!-- Styles -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet">
  <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
  <link href="/static/landing-pro.css" rel="stylesheet">
</head>
<body>
  <!-- Scroll Progress Bar -->
  <div id="scroll-progress"></div>

  <!-- Navigation -->
  <nav class="navbar">
    <div class="nav-container">
      <div class="logo">
        <i class="fas fa-robot"></i> AutomatizAI
      </div>
      <ul class="nav-links">
        <li><a href="#integraciones">Integraciones</a></li>
        <li><a href="#casos-uso">Casos de Uso</a></li>
        <li><a href="#precios">Precios</a></li>
        <li><a href="#faq">FAQ</a></li>
        <li><a href="/login">Iniciar Sesión</a></li>
      </ul>
      <a href="#precios" class="nav-cta">Comenzar Gratis</a>
      <button id="mobile-menu-btn">
        <i class="fas fa-bars"></i>
      </button>
    </div>
  </nav>

  <!-- Mobile Menu -->
  <div id="mobile-menu">
    <button id="mobile-menu-close" style="position: absolute; top: 1rem; right: 1rem; background: none; border: none; color: white; font-size: 1.5rem; cursor: pointer;">
      <i class="fas fa-times"></i>
    </button>
    <ul style="list-style: none; margin-top: 3rem;">
      <li style="margin-bottom: 1.5rem;"><a href="#integraciones" style="color: white; font-size: 1.2rem; text-decoration: none;">Integraciones</a></li>
      <li style="margin-bottom: 1.5rem;"><a href="#casos-uso" style="color: white; font-size: 1.2rem; text-decoration: none;">Casos de Uso</a></li>
      <li style="margin-bottom: 1.5rem;"><a href="#precios" style="color: white; font-size: 1.2rem; text-decoration: none;">Precios</a></li>
      <li style="margin-bottom: 1.5rem;"><a href="#faq" style="color: white; font-size: 1.2rem; text-decoration: none;">FAQ</a></li>
      <li style="margin-bottom: 1.5rem;"><a href="/login" style="color: white; font-size: 1.2rem; text-decoration: none;">Iniciar Sesión</a></li>
    </ul>
  </div>

  <!-- Hero Section -->
  <section class="hero">
    <div class="hero-background"></div>
    <div class="hero-content fade-in-up">
      <h1>
        Automatiza <span class="gradient-text">Todo tu Negocio</span><br>con Inteligencia Artificial
      </h1>
      <p class="hero-subtitle">
        Conecta más de 100 herramientas, automatiza tareas repetitivas y enfócate en lo que realmente importa.
        Sin código, sin complicaciones.
      </p>
      <div class="hero-cta">
        <a href="#precios" class="btn-primary">
          <i class="fas fa-rocket"></i> Comenzar Gratis - 14 días
        </a>
        <a href="#demo" class="btn-secondary">
          <i class="fas fa-play"></i> Ver Demo
        </a>
      </div>
      <p style="margin-top: 2rem; color: var(--gray-400); font-size: 0.9rem;">
        ⚡ Configuración en menos de 5 minutos • 🎯 Sin tarjeta de crédito • 🔒 100% seguro
      </p>
    </div>
  </section>

  <!-- Logo Scroll Section -->
  <section class="logos-section" id="integraciones">
    <div class="fade-in-up">
      <h2 class="section-title">Más de <span class="gradient-text">100 integraciones</span></h2>
      <p style="text-align: center; color: var(--gray-300); margin-bottom: 3rem; font-size: 1.1rem;">
        Conecta todas tus herramientas favoritas en un solo lugar
      </p>
    </div>
    <div id="infinite-logos-container"></div>
  </section>

  <!-- Stats Section -->
  <section class="stats-section">
    <div class="stats-container">
      <div class="stat-card fade-in-up">
        <div class="stat-number" data-target="85">0</div>
        <div class="stat-label">% Más Productividad</div>
        <div class="stat-description">Promedio de mejora reportado por nuestros clientes</div>
      </div>
      <div class="stat-card fade-in-up">
        <div class="stat-number" data-target="2500">0</div>
        <div class="stat-label">Horas Ahorradas</div>
        <div class="stat-description">Mensualmente por empresa en promedio</div>
      </div>
      <div class="stat-card fade-in-up">
        <div class="stat-number" data-target="98">0</div>
        <div class="stat-label">% Tasa de Éxito</div>
        <div class="stat-description">En implementación de automatizaciones</div>
      </div>
      <div class="stat-card fade-in-up">
        <div class="stat-number" data-target="450">0</div>
        <div class="stat-label">% ROI Promedio</div>
        <div class="stat-description">Retorno de inversión en el primer año</div>
      </div>
    </div>
    <p style="text-align: center; color: var(--gray-400); margin-top: 2rem; font-size: 0.85rem;">
      * Datos basados en encuestas a 500+ clientes empresariales durante 2024
    </p>
  </section>

  <!-- Features Section -->
  <section class="features-section" id="caracteristicas">
    <div class="features-container">
      <h2 class="section-title fade-in-up">Todo lo que necesitas para <span class="gradient-text">automatizar</span></h2>
      <div class="features-grid">
        <div class="feature-card fade-in-up">
          <div class="feature-icon">🤖</div>
          <h3>Automatización Inteligente</h3>
          <p>Crea flujos de trabajo complejos sin escribir código. Nuestro sistema de IA sugiere optimizaciones automáticas.</p>
          <ul class="feature-list">
            <li>Editor visual drag & drop</li>
            <li>Plantillas prediseñadas</li>
            <li>Lógica condicional avanzada</li>
            <li>Triggers personalizables</li>
            <li>Ejecución en paralelo</li>
          </ul>
        </div>

        <div class="feature-card fade-in-up">
          <div class="feature-icon">📱</div>
          <h3>Gestión de Redes Sociales</h3>
          <p>Programa, publica y analiza contenido en todas tus redes desde un solo lugar.</p>
          <ul class="feature-list">
            <li>Publicación programada</li>
            <li>Calendario editorial visual</li>
            <li>Análisis de engagement</li>
            <li>Respuestas automáticas</li>
            <li>Reportes detallados</li>
          </ul>
        </div>

        <div class="feature-card fade-in-up">
          <div class="feature-icon">💼</div>
          <h3>CRM Automatizado</h3>
          <p>Gestiona leads, clientes y oportunidades con flujos automáticos que nunca dejan escapar una venta.</p>
          <ul class="feature-list">
            <li>Lead scoring automático</li>
            <li>Seguimiento inteligente</li>
            <li>Email sequences</li>
            <li>Pipeline visual</li>
            <li>Sincronización bidireccional</li>
          </ul>
        </div>

        <div class="feature-card fade-in-up">
          <div class="feature-icon">🛍️</div>
          <h3>E-commerce Plus</h3>
          <p>Automatiza inventario, pedidos, facturación y atención al cliente para tu tienda online.</p>
          <ul class="feature-list">
            <li>Gestión de inventario</li>
            <li>Procesamiento de pedidos</li>
            <li>Facturación automática</li>
            <li>Recuperación de carritos</li>
            <li>Notificaciones inteligentes</li>
          </ul>
        </div>

        <div class="feature-card fade-in-up">
          <div class="feature-icon">📊</div>
          <h3>Analytics Avanzado</h3>
          <p>Dashboards en tiempo real con métricas que importan. Toma decisiones basadas en datos.</p>
          <ul class="feature-list">
            <li>Dashboards personalizables</li>
            <li>Reportes automatizados</li>
            <li>Alertas inteligentes</li>
            <li>Exportación de datos</li>
            <li>Integraciones con BI</li>
          </ul>
        </div>

        <div class="feature-card fade-in-up">
          <div class="feature-icon">🔐</div>
          <h3>Seguridad Enterprise</h3>
          <p>Cifrado end-to-end, cumplimiento GDPR y SOC2. Tus datos siempre protegidos.</p>
          <ul class="feature-list">
            <li>Cifrado AES-256</li>
            <li>Autenticación 2FA</li>
            <li>Auditoría completa</li>
            <li>Backups automáticos</li>
            <li>Cumplimiento GDPR/SOC2</li>
          </ul>
        </div>
      </div>
    </div>
  </section>

  <!-- Use Cases Section -->
  <section class="usecases-section" id="casos-uso">
    <div style="max-width: 1280px; margin: 0 auto;">
      <h2 class="section-title fade-in-up">Casos de uso <span class="gradient-text">reales</span></h2>
      <p style="text-align: center; color: var(--gray-300); margin-bottom: 3rem; font-size: 1.1rem;">
        Descubre cómo empresas como la tuya están automatizando y creciendo
      </p>
    </div>
    
    <div class="usecases-grid">
      <div class="usecase-card fade-in-up">
        <div class="usecase-header">
          <div class="usecase-icon">🛒</div>
          <h3>E-commerce</h3>
        </div>
        <div class="roi-badge">+45% en ventas</div>
        <p>
          Tienda online de moda con 1000+ pedidos mensuales. Automatizaron todo el proceso desde la compra hasta la entrega.
        </p>
        <ul class="usecase-features">
          <li>Confirmación de pedidos automática por WhatsApp</li>
          <li>Actualización de inventario en tiempo real</li>
          <li>Facturación y envío a contabilidad</li>
          <li>Email de seguimiento post-compra</li>
          <li>Recuperación de carritos abandonados</li>
          <li>Reseñas automáticas después de 7 días</li>
        </ul>
      </div>

      <div class="usecase-card fade-in-up">
        <div class="usecase-header">
          <div class="usecase-icon">📢</div>
          <h3>Agencias de Marketing</h3>
        </div>
        <div class="roi-badge">10x más clientes</div>
        <p>
          Agencia que gestiona 50+ cuentas de redes sociales. Automatizaron la publicación, análisis y reportes.
        </p>
        <ul class="usecase-features">
          <li>Calendario editorial compartido con clientes</li>
          <li>Publicación multi-plataforma simultánea</li>
          <li>Monitoreo de menciones y comentarios</li>
          <li>Reportes mensuales automatizados</li>
          <li>Aprobación de contenido por cliente</li>
          <li>Análisis de competencia semanal</li>
        </ul>
      </div>

      <div class="usecase-card fade-in-up">
        <div class="usecase-header">
          <div class="usecase-icon">🏢</div>
          <h3>Empresas B2B</h3>
        </div>
        <div class="roi-badge">3x engagement en LinkedIn</div>
        <p>
          Consultora SaaS que genera leads cualificados en LinkedIn. Automatizaron prospección y nutrición.
        </p>
        <ul class="usecase-features">
          <li>Búsqueda automática de prospectos</li>
          <li>Secuencias de mensajes personalizados</li>
          <li>Sincronización con CRM (HubSpot/Salesforce)</li>
          <li>Scoring de leads por interacción</li>
          <li>Notificaciones a ventas de leads calientes</li>
          <li>Content marketing automatizado</li>
        </ul>
      </div>

      <div class="usecase-card fade-in-up">
        <div class="usecase-header">
          <div class="usecase-icon">🎬</div>
          <h3>Creadores de Contenido</h3>
        </div>
        <div class="roi-badge">20h/semana ahorradas</div>
        <p>
          YouTuber con 500K suscriptores. Automatizó distribución de contenido en todas las plataformas.
        </p>
        <ul class="usecase-features">
          <li>Extracción automática de clips del video</li>
          <li>Publicación cross-platform (TikTok, IG, YouTube Shorts)</li>
          <li>Generación de thumbnails con IA</li>
          <li>Transcripción y subtítulos automáticos</li>
          <li>Respuestas automáticas a comentarios frecuentes</li>
          <li>Análisis de rendimiento consolidado</li>
        </ul>
      </div>

      <div class="usecase-card fade-in-up">
        <div class="usecase-header">
          <div class="usecase-icon">💼</div>
          <h3>Consultores</h3>
        </div>
        <div class="roi-badge">+200% clientes sin aumentar equipo</div>
        <p>
          Consultor independiente de productividad. Automatizó onboarding, sesiones y seguimiento de clientes.
        </p>
        <ul class="usecase-features">
          <li>Formulario de intake y diagnóstico inicial</li>
          <li>Agendamiento automático de sesiones</li>
          <li>Recordatorios por email y WhatsApp</li>
          <li>Material personalizado según respuestas</li>
          <li>Seguimiento post-sesión automatizado</li>
          <li>Facturación y pagos recurrentes</li>
        </ul>
      </div>

      <div class="usecase-card fade-in-up">
        <div class="usecase-header">
          <div class="usecase-icon">🏥</div>
          <h3>Servicios Profesionales</h3>
        </div>
        <div class="roi-badge">95% menos tareas manuales</div>
        <p>
          Clínica dental con 3 sedes. Automatizaron agendas, recordatorios y seguimiento de pacientes.
        </p>
        <ul class="usecase-features">
          <li>Reserva online sincronizada con Google Calendar</li>
          <li>Recordatorios automáticos (SMS/WhatsApp/Email)</li>
          <li>Confirmación de citas y reprogramación</li>
          <li>Encuestas de satisfacción post-visita</li>
          <li>Campañas de reactivación de pacientes inactivos</li>
          <li>Gestión de historias clínicas digitales</li>
        </ul>
      </div>
    </div>
  </section>

  <!-- Demo Section -->
  <section id="demo" style="padding: 6rem 2rem; background: rgba(99, 102, 241, 0.05);">
    <div style="max-width: 1280px; margin: 0 auto; text-align: center;">
      <h2 class="section-title fade-in-up">Mira cómo <span class="gradient-text">funciona</span></h2>
      <p style="color: var(--gray-300); margin-bottom: 3rem; font-size: 1.1rem;">
        En menos de 3 minutos puedes tener tu primera automatización funcionando
      </p>
      
      <div class="fade-in-up" style="position: relative; max-width: 900px; margin: 0 auto; border-radius: 1rem; overflow: hidden; box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);">
        <div style="position: relative; padding-bottom: 56.25%; height: 0;">
          <iframe 
            width="100%" 
            height="100%" 
            src="https://www.youtube.com/embed/dQw4w9WgXcQ" 
            frameborder="0" 
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
            allowfullscreen
            style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;">
          </iframe>
        </div>
      </div>

      <div style="margin-top: 3rem;">
        <a href="#precios" class="btn-primary">
          <i class="fas fa-rocket"></i> Comenzar ahora - Es gratis
        </a>
      </div>
    </div>
  </section>

  <!-- Testimonials Section -->
  <section style="padding: 6rem 2rem; background: rgba(0, 0, 0, 0.2);">
    <div style="max-width: 1280px; margin: 0 auto;">
      <h2 class="section-title fade-in-up">Lo que dicen <span class="gradient-text">nuestros clientes</span></h2>
      
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(350px, 1fr)); gap: 2rem; margin-top: 3rem;">
        <div class="fade-in-up" style="background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.05); border-radius: 1rem; padding: 2rem;">
          <div style="display: flex; gap: 0.5rem; margin-bottom: 1rem; color: #f59e0b;">
            ⭐⭐⭐⭐⭐
          </div>
          <p style="color: var(--gray-300); margin-bottom: 1.5rem; line-height: 1.8;">
            "AutomatizAI cambió completamente nuestra operación. Pasamos de procesar 50 pedidos/día manualmente a 500 automáticamente. El ROI fue inmediato."
          </p>
          <div style="display: flex; align-items: center; gap: 1rem;">
            <div style="width: 48px; height: 48px; border-radius: 50%; background: var(--gradient-1);"></div>
            <div>
              <div style="font-weight: 600; color: white;">María González</div>
              <div style="color: var(--gray-400); font-size: 0.9rem;">CEO, TiendaModa.com</div>
            </div>
          </div>
        </div>

        <div class="fade-in-up" style="background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.05); border-radius: 1rem; padding: 2rem;">
          <div style="display: flex; gap: 0.5rem; margin-bottom: 1rem; color: #f59e0b;">
            ⭐⭐⭐⭐⭐
          </div>
          <p style="color: var(--gray-300); margin-bottom: 1.5rem; line-height: 1.8;">
            "Como agencia manejamos 40+ clientes. AutomatizAI nos permite dar un servicio premium sin aumentar el equipo. Imprescindible."
          </p>
          <div style="display: flex; align-items: center; gap: 1rem;">
            <div style="width: 48px; height: 48px; border-radius: 50%; background: var(--gradient-2);"></div>
            <div>
              <div style="font-weight: 600; color: white;">Carlos Martínez</div>
              <div style="color: var(--gray-400); font-size: 0.9rem;">Director, Social Media Pro</div>
            </div>
          </div>
        </div>

        <div class="fade-in-up" style="background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.05); border-radius: 1rem; padding: 2rem;">
          <div style="display: flex; gap: 0.5rem; margin-bottom: 1rem; color: #f59e0b;">
            ⭐⭐⭐⭐⭐
          </div>
          <p style="color: var(--gray-300); margin-bottom: 1.5rem; line-height: 1.8;">
            "La mejor inversión que hicimos este año. Ahorramos 30+ horas semanales y nuestros leads aumentaron 3x. Soporte excepcional."
          </p>
          <div style="display: flex; align-items: center; gap: 1rem;">
            <div style="width: 48px; height: 48px; border-radius: 50%; background: var(--gradient-3);"></div>
            <div>
              <div style="font-weight: 600; color: white;">Ana Rodríguez</div>
              <div style="color: var(--gray-400); font-size: 0.9rem;">Founder, TechConsult</div>
            </div>
          </div>
        </div>
      </div>

      <div class="fade-in-up" style="text-align: center; margin-top: 3rem;">
        <p style="color: var(--gray-400); margin-bottom: 2rem;">Empresas que confían en nosotros:</p>
        <div style="display: flex; justify-content: center; align-items: center; gap: 3rem; flex-wrap: wrap; opacity: 0.6;">
          <div style="font-size: 1.5rem; font-weight: 700;">EMPRESA 1</div>
          <div style="font-size: 1.5rem; font-weight: 700;">EMPRESA 2</div>
          <div style="font-size: 1.5rem; font-weight: 700;">EMPRESA 3</div>
          <div style="font-size: 1.5rem; font-weight: 700;">EMPRESA 4</div>
        </div>
      </div>
    </div>
  </section>

  <!-- Pricing Section -->
  <section class="pricing-section" id="precios">
    <div style="max-width: 1280px; margin: 0 auto;">
      <h2 class="section-title fade-in-up">Precios <span class="gradient-text">transparentes</span></h2>
      <p style="text-align: center; color: var(--gray-300); margin-bottom: 1rem; font-size: 1.1rem;">
        Elige el plan perfecto para tu negocio • Sin costos ocultos • Cancela cuando quieras
      </p>
      <p style="text-align: center; color: var(--accent); margin-bottom: 3rem; font-weight: 600;">
        🎁 14 días de prueba gratis en todos los planes • No se requiere tarjeta de crédito
      </p>
      
      <div class="pricing-grid">
        <div class="pricing-card fade-in-up">
          <h3>Starter</h3>
          <div style="margin: 1.5rem 0;">
            <span class="plan-price" data-monthly="49" data-annual="470">$49</span>
            <span style="color: var(--gray-400);">/mes</span>
          </div>
          <p style="color: var(--gray-400); margin-bottom: 2rem;">Perfecto para emprendedores y freelancers</p>
          <ul class="plan-features">
            <li>5 cuentas de redes sociales</li>
            <li>50 publicaciones programadas/mes</li>
            <li>Hasta 100 automatizaciones/mes</li>
            <li>1 usuario</li>
            <li>Analytics básico</li>
            <li>Soporte por email</li>
            <li>Plantillas básicas incluidas</li>
          </ul>
          <a href="#registro" class="btn-primary" style="width: 100%; margin-top: 2rem; text-align: center;">
            Probar gratis
          </a>
        </div>

        <div class="pricing-card featured fade-in-up">
          <div class="pricing-badge">MÁS POPULAR</div>
          <h3>Growth</h3>
          <div style="margin: 1.5rem 0;">
            <span class="plan-price" data-monthly="89" data-annual="854">$89</span>
            <span style="color: var(--gray-400);">/mes</span>
          </div>
          <p style="color: var(--gray-400); margin-bottom: 2rem;">Ideal para agencias y pequeñas empresas</p>
          <ul class="plan-features">
            <li>15 cuentas de redes sociales</li>
            <li>200 publicaciones programadas/mes</li>
            <li>Hasta 500 automatizaciones/mes</li>
            <li>3 usuarios</li>
            <li>Analytics avanzado con reportes</li>
            <li>Soporte prioritario 24/7</li>
            <li>Todas las plantillas premium</li>
            <li>API access</li>
            <li>Integraciones ilimitadas</li>
          </ul>
          <a href="#registro" class="btn-primary" style="width: 100%; margin-top: 2rem; text-align: center;">
            Probar gratis
          </a>
        </div>

        <div class="pricing-card fade-in-up">
          <h3>Pro</h3>
          <div style="margin: 1.5rem 0;">
            <span class="plan-price" data-monthly="130" data-annual="1248">$130</span>
            <span style="color: var(--gray-400);">/mes</span>
          </div>
          <p style="color: var(--gray-400); margin-bottom: 2rem;">Para equipos que necesitan más poder</p>
          <ul class="plan-features">
            <li>30 cuentas de redes sociales</li>
            <li>500 publicaciones programadas/mes</li>
            <li>Hasta 2000 automatizaciones/mes</li>
            <li>10 usuarios</li>
            <li>Analytics personalizado + BI</li>
            <li>Soporte dedicado + onboarding</li>
            <li>Plantillas custom ilimitadas</li>
            <li>API avanzado + Webhooks</li>
            <li>White-label disponible</li>
            <li>Consultoría mensual incluida</li>
          </ul>
          <a href="#registro" class="btn-primary" style="width: 100%; margin-top: 2rem; text-align: center;">
            Probar gratis
          </a>
        </div>

        <div class="pricing-card fade-in-up">
          <h3>Enterprise</h3>
          <div style="margin: 1.5rem 0;">
            <span class="plan-price" data-monthly="190" data-annual="1824">$190</span>
            <span style="color: var(--gray-400);">/mes</span>
          </div>
          <p style="color: var(--gray-400); margin-bottom: 2rem;">Solución completa para grandes empresas</p>
          <ul class="plan-features">
            <li>Cuentas ilimitadas</li>
            <li>Publicaciones ilimitadas</li>
            <li>Automatizaciones ilimitadas</li>
            <li>Usuarios ilimitados</li>
            <li>Dashboard enterprise personalizado</li>
            <li>Account manager dedicado</li>
            <li>SLA garantizado 99.9%</li>
            <li>Infraestructura dedicada</li>
            <li>Cumplimiento SOC2, GDPR</li>
            <li>Integración custom a medida</li>
            <li>Capacitación del equipo</li>
          </ul>
          <a href="#registro" class="btn-primary" style="width: 100%; margin-top: 2rem; text-align: center;">
            Contactar ventas
          </a>
        </div>
      </div>

      <div class="fade-in-up" style="text-align: center; margin-top: 3rem; padding: 2rem; background: rgba(255, 255, 255, 0.03); border-radius: 1rem; border: 1px solid rgba(255, 255, 255, 0.05);">
        <p style="color: var(--gray-300); margin-bottom: 1rem; font-size: 1.1rem;">
          💳 <strong>Métodos de pago:</strong> Tarjeta de crédito/débito, Mercado Pago, PayPal, transferencia bancaria
        </p>
        <p style="color: var(--gray-400); font-size: 0.9rem;">
          Facturación automática • Cambio de plan en cualquier momento • Garantía de devolución 30 días
        </p>
      </div>
    </div>
  </section>

  <!-- FAQ Section -->
  <section class="faq-section" id="faq">
    <div style="max-width: 1280px; margin: 0 auto;">
      <h2 class="section-title fade-in-up">Preguntas <span class="gradient-text">frecuentes</span></h2>
      <div class="faq-container">
        <div class="faq-item fade-in-up">
          <div class="faq-question">
            <span>¿Necesito conocimientos técnicos para usar AutomatizAI?</span>
            <i class="fas fa-chevron-down"></i>
          </div>
          <div class="faq-answer">
            <p>No, para nada. AutomatizAI está diseñado para ser usado sin conocimientos de programación. Nuestro editor visual te permite crear automatizaciones arrastrando y soltando. Además, tenemos plantillas prediseñadas que puedes activar con un clic.</p>
          </div>
        </div>

        <div class="faq-item fade-in-up">
          <div class="faq-question">
            <span>¿Cuánto tiempo toma implementar una automatización?</span>
            <i class="fas fa-chevron-down"></i>
          </div>
          <div class="faq-answer">
            <p>Con nuestras plantillas, puedes tener tu primera automatización funcionando en menos de 5 minutos. Para automatizaciones personalizadas, el tiempo varía según la complejidad, pero la mayoría se implementan en 10-30 minutos.</p>
          </div>
        </div>

        <div class="faq-item fade-in-up">
          <div class="faq-question">
            <span>¿Qué pasa si supero los límites de mi plan?</span>
            <i class="fas fa-chevron-down"></i>
          </div>
          <div class="faq-answer">
            <p>Te notificaremos cuando estés cerca del límite. Puedes upgradar tu plan en cualquier momento y seguirás teniendo acceso. No detenemos tus automatizaciones activas, pero no podrás crear nuevas hasta upgradar.</p>
          </div>
        </div>

        <div class="faq-item fade-in-up">
          <div class="faq-question">
            <span>¿Mis datos están seguros?</span>
            <i class="fas fa-chevron-down"></i>
          </div>
          <div class="faq-answer">
            <p>Absolutamente. Usamos cifrado AES-256 para todos tus datos, cumplimos con GDPR y SOC2, y realizamos auditorías de seguridad regulares. Nunca compartimos tus datos con terceros y puedes exportar o eliminar tu información en cualquier momento.</p>
          </div>
        </div>

        <div class="faq-item fade-in-up">
          <div class="faq-question">
            <span>¿Puedo cancelar mi suscripción en cualquier momento?</span>
            <i class="fas fa-chevron-down"></i>
          </div>
          <div class="faq-answer">
            <p>Sí, sin compromisos ni penalizaciones. Puedes cancelar desde tu dashboard en cualquier momento y seguirás teniendo acceso hasta el fin del periodo que pagaste. Además, ofrecemos garantía de devolución de 30 días.</p>
          </div>
        </div>

        <div class="faq-item fade-in-up">
          <div class="faq-question">
            <span>¿Ofrecen soporte en español?</span>
            <i class="fas fa-chevron-down"></i>
          </div>
          <div class="faq-answer">
            <p>Sí, nuestro equipo de soporte habla español nativamente. Estamos disponibles por email, chat en vivo y videollamada. Los planes Growth y superiores tienen soporte prioritario 24/7.</p>
          </div>
        </div>

        <div class="faq-item fade-in-up">
          <div class="faq-question">
            <span>¿Puedo migrar desde otras plataformas como Zapier o Make?</span>
            <i class="fas fa-chevron-down"></i>
          </div>
          <div class="faq-answer">
            <p>Sí, ofrecemos migración asistida gratuita para planes Pro y Enterprise. Nuestro equipo te ayudará a recrear tus automatizaciones existentes y optimizarlas para AutomatizAI. Para otros planes, tenemos guías detalladas.</p>
          </div>
        </div>

        <div class="faq-item fade-in-up">
          <div class="faq-question">
            <span>¿Qué diferencia a AutomatizAI de otras plataformas?</span>
            <i class="fas fa-chevron-down"></i>
          </div>
          <div class="faq-answer">
            <p>AutomatizAI está específicamente optimizado para redes sociales y negocios digitales. Tenemos integraciones nativas profundas (no solo básicas), IA que sugiere mejoras, y una interfaz en español diseñada para el mercado latinoamericano. Además, nuestros precios son hasta 40% más competitivos.</p>
          </div>
        </div>

        <div class="faq-item fade-in-up">
          <div class="faq-question">
            <span>¿Ofrecen capacitación o consultoría?</span>
            <i class="fas fa-chevron-down"></i>
          </div>
          <div class="faq-answer">
            <p>Sí. Todos los planes incluyen documentación y tutoriales. Los planes Pro incluyen una sesión de consultoría mensual. Para Enterprise, ofrecemos onboarding completo, capacitación del equipo y un account manager dedicado.</p>
          </div>
        </div>

        <div class="faq-item fade-in-up">
          <div class="faq-question">
            <span>¿Hay descuentos para ONGs, educación o startups?</span>
            <i class="fas fa-chevron-down"></i>
          </div>
          <div class="faq-answer">
            <p>Sí, ofrecemos descuentos de hasta 50% para organizaciones sin fines de lucro, instituciones educativas y startups pre-seed. Contáctanos con la documentación correspondiente para aplicar.</p>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Final CTA Section -->
  <section style="padding: 6rem 2rem; background: var(--gradient-1); text-align: center;">
    <div style="max-width: 900px; margin: 0 auto;">
      <h2 class="fade-in-up" style="font-size: 3rem; font-weight: 800; margin-bottom: 1.5rem;">
        ¿Listo para automatizar tu negocio?
      </h2>
      <p class="fade-in-up" style="font-size: 1.3rem; margin-bottom: 3rem; opacity: 0.9;">
        Únete a 5,000+ empresas que ya están automatizando con AutomatizAI
      </p>
      <div class="fade-in-up" style="display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap;">
        <a href="#precios" style="background: white; color: var(--primary); padding: 1.2rem 3rem; border-radius: 0.75rem; font-weight: 700; font-size: 1.1rem; text-decoration: none; display: inline-block; transition: all 0.3s;">
          <i class="fas fa-rocket"></i> Comenzar gratis ahora
        </a>
        <a href="https://wa.me/1234567890" style="background: rgba(255, 255, 255, 0.15); color: white; padding: 1.2rem 3rem; border-radius: 0.75rem; font-weight: 700; font-size: 1.1rem; text-decoration: none; display: inline-block; border: 2px solid white; transition: all 0.3s;">
          <i class="fab fa-whatsapp"></i> Hablar con ventas
        </a>
      </div>
      <p style="margin-top: 2rem; font-size: 0.95rem; opacity: 0.8;">
        ✓ Sin tarjeta de crédito • ✓ Configuración en 5 minutos • ✓ Soporte en español
      </p>
    </div>
  </section>

  <!-- Footer -->
  <footer class="footer">
    <div class="footer-container">
      <div class="footer-section">
        <h4><i class="fas fa-robot"></i> AutomatizAI</h4>
        <p style="color: var(--gray-400); margin-top: 1rem; line-height: 1.8;">
          La plataforma líder en automatización empresarial para LATAM. Conecta todas tus herramientas y enfócate en crecer tu negocio.
        </p>
        <div style="display: flex; gap: 1rem; margin-top: 1.5rem; font-size: 1.5rem;">
          <a href="#" style="color: var(--gray-400); transition: color 0.3s;"><i class="fab fa-twitter"></i></a>
          <a href="#" style="color: var(--gray-400); transition: color 0.3s;"><i class="fab fa-linkedin"></i></a>
          <a href="#" style="color: var(--gray-400); transition: color 0.3s;"><i class="fab fa-youtube"></i></a>
          <a href="#" style="color: var(--gray-400); transition: color 0.3s;"><i class="fab fa-instagram"></i></a>
        </div>
      </div>

      <div class="footer-section">
        <h4>Producto</h4>
        <ul>
          <li><a href="#caracteristicas">Características</a></li>
          <li><a href="#integraciones">Integraciones</a></li>
          <li><a href="#precios">Precios</a></li>
          <li><a href="/api-docs">API</a></li>
          <li><a href="/changelog">Changelog</a></li>
        </ul>
      </div>

      <div class="footer-section">
        <h4>Casos de Uso</h4>
        <ul>
          <li><a href="#casos-uso">E-commerce</a></li>
          <li><a href="#casos-uso">Agencias</a></li>
          <li><a href="#casos-uso">SaaS</a></li>
          <li><a href="#casos-uso">Creadores</a></li>
          <li><a href="#casos-uso">Consultores</a></li>
        </ul>
      </div>

      <div class="footer-section">
        <h4>Recursos</h4>
        <ul>
          <li><a href="/blog">Blog</a></li>
          <li><a href="/tutoriales">Tutoriales</a></li>
          <li><a href="/plantillas">Plantillas</a></li>
          <li><a href="/webinars">Webinars</a></li>
          <li><a href="/ayuda">Centro de Ayuda</a></li>
        </ul>
      </div>

      <div class="footer-section">
        <h4>Empresa</h4>
        <ul>
          <li><a href="/nosotros">Nosotros</a></li>
          <li><a href="/contacto">Contacto</a></li>
          <li><a href="/carreras">Carreras</a></li>
          <li><a href="/privacidad">Privacidad</a></li>
          <li><a href="/terminos">Términos</a></li>
        </ul>
      </div>
    </div>

    <div class="footer-bottom">
      <p>&copy; 2024 AutomatizAI. Todos los derechos reservados.</p>
      <p style="margin-top: 0.5rem; font-size: 0.85rem;">
        Hecho con ❤️ en LATAM para el mundo
      </p>
    </div>
  </footer>

  <!-- Scripts -->
  <script src="/static/landing-pro.js"></script>
</body>
</html>
`;
