// ==============================================
// CHATBOT PERSUASIVO - AutomatizA SUR
// Bot gratuito estilo humano para convertir visitantes
// ==============================================

class AutomatizA SURChatbot {
  constructor() {
    this.isOpen = false
    this.messages = []
    this.userTyping = false
    this.init()
  }

  init() {
    this.injectCSS()
    this.injectHTML()
    this.setupEventListeners()
    
    // Mensaje de bienvenida después de 3 segundos
    setTimeout(() => {
      this.addBotMessage(
        '👋 ¡Hola! Soy el asistente virtual de AutomatizA SUR. ¿Te gustaría saber cómo podemos automatizar tu negocio?',
        ['Sí, cuéntame más', 'Ver precios', 'Tengo una pregunta']
      )
      this.showNotification()
    }, 3000)
  }

  injectCSS() {
    const style = document.createElement('style')
    style.textContent = \`
      #automatizai-chat-widget {
        position: fixed;
        bottom: 20px;
        right: 20px;
        z-index: 9999;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      }

      #chat-button {
        width: 60px;
        height: 60px;
        border-radius: 50%;
        background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
        border: none;
        box-shadow: 0 4px 12px rgba(99, 102, 241, 0.4);
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.3s ease;
        position: relative;
      }

      #chat-button:hover {
        transform: scale(1.1);
        box-shadow: 0 6px 20px rgba(99, 102, 241, 0.6);
      }

      #chat-button svg {
        width: 28px;
        height: 28px;
        fill: white;
      }

      .chat-notification {
        position: absolute;
        top: -5px;
        right: -5px;
        width: 20px;
        height: 20px;
        background: #ef4444;
        border-radius: 50%;
        border: 2px solid white;
        animation: pulse-notification 2s infinite;
      }

      @keyframes pulse-notification {
        0%, 100% { transform: scale(1); opacity: 1; }
        50% { transform: scale(1.2); opacity: 0.8; }
      }

      #chat-window {
        position: absolute;
        bottom: 80px;
        right: 0;
        width: 380px;
        height: 600px;
        background: white;
        border-radius: 16px;
        box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
        display: none;
        flex-direction: column;
        overflow: hidden;
        animation: slideUp 0.3s ease;
      }

      @keyframes slideUp {
        from {
          opacity: 0;
          transform: translateY(20px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      #chat-window.open {
        display: flex;
      }

      .chat-header {
        background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
        color: white;
        padding: 20px;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      .chat-header-info {
        display: flex;
        align-items: center;
        gap: 12px;
      }

      .chat-avatar {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background: white;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 20px;
      }

      .chat-header-text h3 {
        margin: 0;
        font-size: 16px;
        font-weight: 600;
      }

      .chat-header-text p {
        margin: 0;
        font-size: 12px;
        opacity: 0.9;
      }

      .chat-close {
        background: none;
        border: none;
        color: white;
        font-size: 24px;
        cursor: pointer;
        padding: 0;
        width: 30px;
        height: 30px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        transition: background 0.2s;
      }

      .chat-close:hover {
        background: rgba(255, 255, 255, 0.2);
      }

      .chat-messages {
        flex: 1;
        overflow-y: auto;
        padding: 20px;
        background: #f9fafb;
      }

      .chat-message {
        margin-bottom: 16px;
        animation: fadeIn 0.3s ease;
      }

      @keyframes fadeIn {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
      }

      .message-bot {
        display: flex;
        gap: 10px;
        align-items: flex-start;
      }

      .message-bot .avatar {
        width: 32px;
        height: 32px;
        border-radius: 50%;
        background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
      }

      .message-bot .bubble {
        background: white;
        padding: 12px 16px;
        border-radius: 16px 16px 16px 4px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
        max-width: 75%;
      }

      .message-user {
        display: flex;
        justify-content: flex-end;
      }

      .message-user .bubble {
        background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
        color: white;
        padding: 12px 16px;
        border-radius: 16px 16px 4px 16px;
        max-width: 75%;
      }

      .quick-replies {
        display: flex;
        flex-direction: column;
        gap: 8px;
        margin-top: 8px;
      }

      .quick-reply-btn {
        background: white;
        border: 2px solid #e5e7eb;
        padding: 10px 16px;
        border-radius: 20px;
        cursor: pointer;
        font-size: 14px;
        text-align: left;
        transition: all 0.2s;
        color: #374151;
      }

      .quick-reply-btn:hover {
        border-color: #6366f1;
        background: #f0f1ff;
        transform: translateX(4px);
      }

      .typing-indicator {
        display: flex;
        gap: 4px;
        padding: 12px 16px;
        background: white;
        border-radius: 16px;
        width: fit-content;
      }

      .typing-dot {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: #9ca3af;
        animation: typing 1.4s infinite;
      }

      .typing-dot:nth-child(2) { animation-delay: 0.2s; }
      .typing-dot:nth-child(3) { animation-delay: 0.4s; }

      @keyframes typing {
        0%, 60%, 100% { transform: translateY(0); }
        30% { transform: translateY(-10px); }
      }

      .chat-input-container {
        padding: 16px;
        background: white;
        border-top: 1px solid #e5e7eb;
      }

      .chat-input-wrapper {
        display: flex;
        gap: 8px;
      }

      #chat-input {
        flex: 1;
        padding: 12px 16px;
        border: 2px solid #e5e7eb;
        border-radius: 24px;
        font-size: 14px;
        outline: none;
        transition: border-color 0.2s;
      }

      #chat-input:focus {
        border-color: #6366f1;
      }

      #chat-send {
        width: 44px;
        height: 44px;
        border-radius: 50%;
        background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
        border: none;
        color: white;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.2s;
      }

      #chat-send:hover {
        transform: scale(1.1);
      }

      #chat-send:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }

      @media (max-width: 480px) {
        #chat-window {
          width: calc(100vw - 40px);
          height: calc(100vh - 100px);
        }
      }
    \`
    document.head.appendChild(style)
  }

  injectHTML() {
    const container = document.createElement('div')
    container.id = 'automatizai-chat-widget'
    container.innerHTML = \`
      <button id="chat-button" aria-label="Abrir chat">
        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z"/>
        </svg>
      </button>

      <div id="chat-window">
        <div class="chat-header">
          <div class="chat-header-info">
            <div class="chat-avatar">🤖</div>
            <div class="chat-header-text">
              <h3>Asistente Virtual</h3>
              <p>En línea • Responde en segundos</p>
            </div>
          </div>
          <button class="chat-close" aria-label="Cerrar chat">×</button>
        </div>

        <div class="chat-messages" id="chat-messages"></div>

        <div class="chat-input-container">
          <div class="chat-input-wrapper">
            <input
              type="text"
              id="chat-input"
              placeholder="Escribe tu mensaje..."
              autocomplete="off"
            />
            <button id="chat-send" disabled>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="22" y1="2" x2="11" y2="13"></line>
                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
              </svg>
            </button>
          </div>
        </div>
      </div>
    \`
    document.body.appendChild(container)
  }

  setupEventListeners() {
    const button = document.getElementById('chat-button')
    const closeBtn = document.querySelector('.chat-close')
    const input = document.getElementById('chat-input')
    const sendBtn = document.getElementById('chat-send')

    button.addEventListener('click', () => this.toggleChat())
    closeBtn.addEventListener('click', () => this.toggleChat())
    
    input.addEventListener('input', (e) => {
      sendBtn.disabled = !e.target.value.trim()
    })

    input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter' && input.value.trim()) {
        this.sendMessage(input.value)
      }
    })

    sendBtn.addEventListener('click', () => {
      if (input.value.trim()) {
        this.sendMessage(input.value)
      }
    })
  }

  toggleChat() {
    this.isOpen = !this.isOpen
    const window = document.getElementById('chat-window')
    const notification = document.querySelector('.chat-notification')
    
    if (this.isOpen) {
      window.classList.add('open')
      if (notification) notification.remove()
      
      // Scroll to bottom
      setTimeout(() => {
        const messages = document.getElementById('chat-messages')
        messages.scrollTop = messages.scrollHeight
      }, 100)
    } else {
      window.classList.remove('open')
    }
  }

  showNotification() {
    if (!this.isOpen) {
      const button = document.getElementById('chat-button')
      const notification = document.createElement('div')
      notification.className = 'chat-notification'
      button.appendChild(notification)
    }
  }

  addBotMessage(text, quickReplies = null) {
    const messagesContainer = document.getElementById('chat-messages')
    
    // Show typing indicator
    const typing = document.createElement('div')
    typing.className = 'chat-message message-bot'
    typing.innerHTML = \`
      <div class="avatar">🤖</div>
      <div class="typing-indicator">
        <div class="typing-dot"></div>
        <div class="typing-dot"></div>
        <div class="typing-dot"></div>
      </div>
    \`
    messagesContainer.appendChild(typing)
    this.scrollToBottom()

    // Remove typing and show message
    setTimeout(() => {
      typing.remove()
      
      const message = document.createElement('div')
      message.className = 'chat-message message-bot'
      
      let quickRepliesHTML = ''
      if (quickReplies) {
        quickRepliesHTML = \`
          <div class="quick-replies">
            \${quickReplies.map(reply => 
              \`<button class="quick-reply-btn" onclick="chatbot.handleQuickReply('\${reply}')">\${reply}</button>\`
            ).join('')}
          </div>
        \`
      }
      
      message.innerHTML = \`
        <div class="avatar">🤖</div>
        <div>
          <div class="bubble">\${text}</div>
          \${quickRepliesHTML}
        </div>
      \`
      
      messagesContainer.appendChild(message)
      this.scrollToBottom()
    }, 1000 + Math.random() * 1000)
  }

  addUserMessage(text) {
    const messagesContainer = document.getElementById('chat-messages')
    const message = document.createElement('div')
    message.className = 'chat-message message-user'
    message.innerHTML = \`<div class="bubble">\${text}</div>\`
    messagesContainer.appendChild(message)
    this.scrollToBottom()
  }

  sendMessage(text) {
    const input = document.getElementById('chat-input')
    const sendBtn = document.getElementById('chat-send')
    
    this.addUserMessage(text)
    input.value = ''
    sendBtn.disabled = true
    
    // Process message and respond
    this.processMessage(text)
  }

  handleQuickReply(reply) {
    this.addUserMessage(reply)
    this.processMessage(reply)
  }

  processMessage(message) {
    const msg = message.toLowerCase()
    
    // Respuestas inteligentes y persuasivas
    if (msg.includes('sí') || msg.includes('cuéntame') || msg.includes('más')) {
      setTimeout(() => {
        this.addBotMessage(
          'Perfecto! 🚀 Somos una agencia especializada en automatización empresarial. Ayudamos a empresas a automatizar procesos con herramientas como n8n, Make, WhatsApp, Instagram y Gmail.',
          ['¿Qué pueden automatizar?', 'Ver planes', '¿Cómo funciona?']
        )
      }, 500)
      
    } else if (msg.includes('precio') || msg.includes('plan') || msg.includes('costo') || msg.includes('cuánto')) {
      setTimeout(() => {
        this.addBotMessage(
          '💰 Tenemos 4 planes desde $49/mes hasta $190/mes. Todos incluyen 14 días de prueba gratis. ¿Te gustaría ver los detalles de cada plan?',
          ['Ver planes completos', 'Plan más popular', 'Hablar con un asesor']
        )
      }, 500)
      
    } else if (msg.includes('automati') || msg.includes('qué') || msg.includes('servicio')) {
      setTimeout(() => {
        this.addBotMessage(
          '⚡ Automatizamos todo tipo de procesos: emails, redes sociales, CRM, facturación, reportes, notificaciones y mucho más. Sin código, sin complicaciones.',
          ['Ver casos de uso', 'Ver precios', '¿Necesito conocimientos técnicos?']
        )
      }, 500)
      
    } else if (msg.includes('funciona') || msg.includes('cómo')) {
      setTimeout(() => {
        this.addBotMessage(
          '✨ Es muy simple:\n1. Eliges el plan que necesitas\n2. Nos cuentas qué quieres automatizar\n3. Implementamos las automatizaciones\n4. Empiezas a ahorrar tiempo y dinero\n\n¿Te gustaría comenzar con la prueba gratis?',
          ['Comenzar prueba gratis', 'Ver precios', 'Tengo más preguntas']
        )
      }, 500)
      
    } else if (msg.includes('técnico') || msg.includes('conocimiento') || msg.includes('difícil')) {
      setTimeout(() => {
        this.addBotMessage(
          '🎯 ¡Para nada! Nosotros nos encargamos de TODO. Tú solo nos dices qué necesitas y nosotros lo configuramos. Interfaz visual, sin código.',
          ['Eso suena bien', 'Ver planes', 'Hablar con un asesor']
        )
      }, 500)
      
    } else if (msg.includes('popular') || msg.includes('recomendado')) {
      setTimeout(() => {
        this.addBotMessage(
          '⭐ El plan más popular es el GROWTH ($89/mes):\n• 15 cuentas de RRSS\n• 500 automatizaciones/mes\n• Analytics avanzado\n• Soporte 24/7\n\n¿Te gustaría probarlo 14 días gratis?',
          ['Probar gratis', 'Ver todos los planes', 'Hablar con un asesor']
        )
      }, 500)
      
    } else if (msg.includes('contacto') || msg.includes('asesor') || msg.includes('hablar')) {
      setTimeout(() => {
        this.addBotMessage(
          '📧 Perfecto! Puedes contactarnos por:\n\nEmail: proyecto.automatiza.cl\nWhatsApp: [Tu número]\n\nO llena el formulario de contacto en la página y te respondemos en menos de 1 hora.',
          ['Ir a contacto', 'Ver precios', 'Comenzar prueba']
        )
      }, 500)
      
    } else if (msg.includes('gratis') || msg.includes('prueba')) {
      setTimeout(() => {
        this.addBotMessage(
          '🎁 ¡Excelente decisión! Todos nuestros planes incluyen 14 días GRATIS, sin tarjeta de crédito. ¿Qué plan te gustaría probar?',
          ['Plan Starter $49', 'Plan Growth $89', 'Ver todos los planes']
        )
      }, 500)
      
    } else {
      // Respuesta general persuasiva
      setTimeout(() => {
        this.addBotMessage(
          'Interesante pregunta! 🤔 Déjame ayudarte mejor. ¿Qué te gustaría saber específicamente?',
          ['Ver precios', 'Qué automatizan', 'Hablar con un asesor', 'Comenzar prueba gratis']
        )
      }, 500)
    }
  }

  scrollToBottom() {
    const messages = document.getElementById('chat-messages')
    setTimeout(() => {
      messages.scrollTop = messages.scrollHeight
    }, 100)
  }
}

// Initialize chatbot
let chatbot
document.addEventListener('DOMContentLoaded', () => {
  chatbot = new AutomatizA SURChatbot()
})
