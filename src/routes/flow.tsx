// API Routes para Flow - Suscripciones Automáticas
import { Hono } from 'hono'

const flowRoutes = new Hono()

// Configuración de Flow - CREDENCIALES DE PRODUCCIÓN
const FLOW_API_KEY = '59657FBA-0397-444D-A320-9C61FC02BL8B'
const FLOW_SECRET_KEY = '797e6007aabb3701b1ebe13c2e453fc9571ae4f6'
const FLOW_API_URL = 'https://www.flow.cl/api'

// Planes disponibles (AutomatizA SUR) - Pesos Chilenos
const PLANS = {
  starter: {
    id: 'plan-starter',
    name: 'Starter',
    price: 49990,
    currency: 'CLP',
    interval: 1,
    intervalUnit: 'month',
    features: [
      '5 automatizaciones activas',
      '1 usuario incluido',
      'Soporte por email',
      'Integraciones básicas',
      'Documentación completa'
    ]
  },
  growth: {
    id: 'plan-growth',
    name: 'Growth',
    price: 89990,
    currency: 'CLP',
    interval: 1,
    intervalUnit: 'month',
    featured: true,
    features: [
      '15 automatizaciones activas',
      '3 usuarios incluidos',
      'Soporte prioritario 24/7',
      'Todas las integraciones',
      'Consultoría mensual (1h)',
      'API access',
      'Reportes avanzados'
    ]
  },
  pro: {
    id: 'plan-pro',
    name: 'Pro',
    price: 129990,
    currency: 'CLP',
    interval: 1,
    intervalUnit: 'month',
    features: [
      '30 automatizaciones activas',
      '10 usuarios incluidos',
      'Soporte dedicado',
      'Integraciones personalizadas',
      'Consultoría mensual (3h)',
      'Capacitación incluida',
      'White-label disponible'
    ]
  },
  enterprise: {
    id: 'plan-enterprise',
    name: 'Enterprise',
    price: 189990,
    currency: 'CLP',
    interval: 1,
    intervalUnit: 'month',
    features: [
      'Automatizaciones ilimitadas',
      'Usuarios ilimitados',
      'Account manager dedicado',
      'SLA garantizado 99.9%',
      'Consultoría ilimitada',
      'Onboarding personalizado',
      'Infraestructura dedicada'
    ]
  }
}



// Función auxiliar para generar la firma de Flow (formato: parámetro1valor1parámetro2valor2...)
async function generateFlowSignature(params: Record<string, any>): Promise<string> {
  // 1. Ordenar parámetros alfabéticamente por llave
  const sortedKeys = Object.keys(params).sort()
  
  // 2. Concatenar llave y valor
  let paramsString = ''
  for (const key of sortedKeys) {
    paramsString += key + params[key]
  }

  // 3. Generar HMAC SHA256
  const encoder = new TextEncoder()
  const keyData = encoder.encode(FLOW_SECRET_KEY)
  const messageData = encoder.encode(paramsString)

  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    keyData,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  )

  const signature = await crypto.subtle.sign('HMAC', cryptoKey, messageData)
  const hashArray = Array.from(new Uint8Array(signature))
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
}

// POST /api/flow/create-subscription
// Crear suscripción recurrente automática con Flow
flowRoutes.post('/create-subscription', async (c) => {
  try {
    const { planId, userEmail, userName } = await c.req.json()

    if (!planId || !userEmail) {
      return c.json({ error: 'planId y userEmail son requeridos' }, 400)
    }

    const plan = PLANS[planId as keyof typeof PLANS]
    if (!plan) {
      return c.json({ error: 'Plan no válido' }, 400)
    }

    console.log(`🔄 Creando suscripción Flow: ${userEmail} - Plan: ${plan.name}`)

    // Parámetros para Flow
    const params = {
      apiKey: FLOW_API_KEY,
      commerceOrder: `ORD-${planId}-${Date.now()}`,
      subject: `Plan ${plan.name} - AutomatizA SUR`,
      currency: plan.currency,
      amount: plan.price,
      email: userEmail,
      urlConfirmation: 'https://automatizasur.cl/api/flow/confirm',
      urlReturn: 'https://automatizasur.cl/subscription-success'
    }

    // Agregar firma
    params['s'] = await generateFlowSignature(params)

    console.log('📤 Creando suscripción en Flow:', JSON.stringify(params, null, 2))

    // Crear payment en Flow
    const formData = new URLSearchParams()
    Object.entries(params).forEach(([key, value]) => {
      formData.append(key, String(value))
    })

    const response = await fetch(`${FLOW_API_URL}/payment/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: formData
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('❌ Error Flow:', errorText)
      return c.json({ 
        error: 'Error al crear suscripción en Flow',
        details: errorText
      }, 500)
    }

    const result = await response.json()
    console.log('✅ Suscripción Flow creada:', result)

    // Flow devuelve:
    // - url: URL de pago donde redirigir al usuario
    // - token: Token único del pago
    // - flowOrder: ID interno de Flow

    return c.json({
      success: true,
      token: result.token,
      flowOrder: result.flowOrder,
      url: result.url, // URL para redirigir al cliente
      message: 'Suscripción creada exitosamente. Redirigiendo a Flow...'
    })

  } catch (error) {
    console.error('❌ Error en create-subscription Flow:', error)
    return c.json({ error: 'Error interno del servidor' }, 500)
  }
})

// POST /api/flow/confirm
// Webhook de confirmación de Flow (cuando el pago es exitoso)
flowRoutes.post('/confirm', async (c) => {
  try {
    const body = await c.req.json()
    console.log('🔔 Webhook Flow recibido:', JSON.stringify(body, null, 2))

    const { token } = body

    if (!token) {
      return c.json({ error: 'Token no proporcionado' }, 400)
    }

    // Verificar el estado del pago en Flow
    const params = {
      apiKey: FLOW_API_KEY,
      token: token
    }
    params['s'] = await generateFlowSignature(params)

    const formData = new URLSearchParams()
    Object.entries(params).forEach(([key, value]) => {
      formData.append(key, String(value))
    })

    const response = await fetch(`${FLOW_API_URL}/payment/getStatus`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: formData
    })

    if (!response.ok) {
      console.error('❌ Error obteniendo estado de Flow')
      return c.json({ error: 'Error verificando pago' }, 500)
    }

    const paymentData = await response.json()
    console.log('💳 Estado del pago Flow:', paymentData)

    // paymentData contiene:
    // - status: 1 (pendiente), 2 (pagado), 3 (rechazado), 4 (anulado)
    // - amount: monto
    // - email: email del cliente
    // - subject: descripción
    // - commerceOrder: orden de comercio

    if (paymentData.status === 2) {
      console.log('✅ Pago aprobado en Flow')
      
      // TODO: Activar suscripción en tu base de datos
      // const { email, commerceOrder } = paymentData
      // INSERT INTO subscriptions (email, plan_id, status, flow_order) 
      // VALUES (email, planId, 'active', commerceOrder)
      
      // Flow automáticamente cobrará cada mes
      console.log(`✅ Suscripción activada para: ${paymentData.email}`)
    } else if (paymentData.status === 3) {
      console.log('❌ Pago rechazado en Flow')
    }

    return c.json({ success: true, status: paymentData.status })

  } catch (error) {
    console.error('❌ Error en webhook Flow:', error)
    return c.json({ error: 'Error procesando confirmación' }, 500)
  }
})

// GET /api/flow/plans
// Obtener lista de planes
flowRoutes.get('/plans', (c) => {
  return c.json({
    success: true,
    plans: Object.values(PLANS)
  })
})

// GET /api/flow/config
// Obtener configuración pública
flowRoutes.get('/config', (c) => {
  return c.json({
    success: true,
    apiKey: FLOW_API_KEY,
    provider: 'Flow'
  })
})

export default flowRoutes
