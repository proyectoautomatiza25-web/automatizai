// API Routes para Mercado Pago
import { Hono } from 'hono'

const mercadopagoRoutes = new Hono()

// Configuración de Mercado Pago - PRODUCCIÓN
const MP_ACCESS_TOKEN = 'APP_USR-2953236650411033-122523-66fce79545ad006d0f2128c64885389c-25579762'
const MP_PUBLIC_KEY = 'APP_USR-aba28b23-58d8-436e-b1d7-410e5070784f'

// Planes disponibles (para AutomatizA SUR) - Pesos Chilenos
const PLANS = {
  starter: {
    id: 'starter',
    name: 'Starter',
    price: 49990,
    currency: 'CLP',
    frequency: 1,
    frequency_type: 'months',
    features: [
      '5 automatizaciones activas',
      '1 usuario incluido',
      'Soporte por email',
      'Integraciones básicas',
      'Documentación completa'
    ]
  },
  growth: {
    id: 'growth',
    name: 'Growth',
    price: 89990,
    currency: 'CLP',
    frequency: 1,
    frequency_type: 'months',
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
    id: 'pro',
    name: 'Pro',
    price: 129990,
    currency: 'CLP',
    frequency: 1,
    frequency_type: 'months',
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
    id: 'enterprise',
    name: 'Enterprise',
    price: 189990,
    currency: 'CLP',
    frequency: 1,
    frequency_type: 'months',
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

// POST /api/mercadopago/create-subscription
// Crear preferencia de pago (checkout simple, no suscripción recurrente automática)
mercadopagoRoutes.post('/create-subscription', async (c) => {
  try {
    const { planId, userEmail } = await c.req.json()

    if (!planId || !userEmail) {
      return c.json({ error: 'planId y userEmail son requeridos' }, 400)
    }

    const plan = PLANS[planId as keyof typeof PLANS]
    if (!plan) {
      return c.json({ error: 'Plan no válido' }, 400)
    }

    // Crear preferencia de pago simple
    const preferenceData = {
      items: [
        {
          title: `Plan ${plan.name} - AutomatizA SUR (Mensual)`,
          description: `Suscripción mensual - Plan ${plan.name}`,
          quantity: 1,
          unit_price: plan.price,
          currency_id: plan.currency
        }
      ],
      payer: {
        email: userEmail
      },
      back_urls: {
        success: 'https://3000-ityg0nqhf71a8d8104awt-2e77fc33.sandbox.novita.ai/payment-success',
        failure: 'https://3000-ityg0nqhf71a8d8104awt-2e77fc33.sandbox.novita.ai/payment-failure',
        pending: 'https://3000-ityg0nqhf71a8d8104awt-2e77fc33.sandbox.novita.ai/payment-pending'
      },
      auto_return: 'approved',
      external_reference: `${planId}_${Date.now()}_${userEmail}`,
      statement_descriptor: 'AUTOMATIZASUR'
    }

    console.log('📤 Creando preferencia MP:', JSON.stringify(preferenceData, null, 2))

    const response = await fetch('https://api.mercadopago.com/checkout/preferences', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${MP_ACCESS_TOKEN}`
      },
      body: JSON.stringify(preferenceData)
    })

    console.log('📥 Respuesta MP status:', response.status)

    if (!response.ok) {
      const errorText = await response.text()
      console.error('❌ Error MP:', errorText)
      return c.json({ 
        error: 'Error al crear preferencia de pago',
        details: errorText
      }, 500)
    }

    const preference = await response.json()
    console.log('✅ Preferencia creada:', preference.id)

    return c.json({
      success: true,
      preferenceId: preference.id,
      initPoint: preference.init_point,
      sandboxInitPoint: preference.sandbox_init_point || preference.init_point
    })

  } catch (error) {
    console.error('❌ Error en create-subscription:', error)
    return c.json({ error: 'Error interno del servidor' }, 500)
  }
})

// POST /api/mercadopago/webhook
// Webhook para notificaciones de Mercado Pago (Suscripciones)
mercadopagoRoutes.post('/webhook', async (c) => {
  try {
    const body = await c.req.json()
    console.log('🔔 Webhook MP recibido:', JSON.stringify(body, null, 2))

    // Tipos de notificación para suscripciones:
    // - subscription_preapproval: suscripción creada/actualizada
    // - subscription_authorized_payment: pago de suscripción autorizado
    // - payment: pago individual

    if (body.type === 'subscription_preapproval' || body.action === 'subscription_preapproval') {
      const subscriptionId = body.data?.id || body.id
      
      // Obtener detalles de la suscripción
      const subResponse = await fetch(`https://api.mercadopago.com/preapproval/${subscriptionId}`, {
        headers: {
          'Authorization': `Bearer ${MP_ACCESS_TOKEN}`
        }
      })

      if (!subResponse.ok) {
        console.error('Error obteniendo suscripción:', await subResponse.text())
        return c.json({ error: 'Error obteniendo suscripción' }, 500)
      }

      const subscription = await subResponse.json()
      console.log('📋 Detalles de suscripción:', JSON.stringify(subscription, null, 2))

      const externalRef = subscription.external_reference
      const [planId] = externalRef.split('_')
      const userEmail = subscription.payer_email

      if (subscription.status === 'authorized') {
        console.log(`✅ Suscripción AUTORIZADA: ${userEmail} - Plan: ${planId}`)
        
        // TODO: Activar suscripción en tu DB
        // INSERT INTO subscriptions (email, plan_id, status, mp_subscription_id) 
        // VALUES (userEmail, planId, 'active', subscriptionId)
        
      } else if (subscription.status === 'paused') {
        console.log(`⏸️ Suscripción PAUSADA: ${userEmail}`)
        // TODO: Pausar acceso del usuario
        
      } else if (subscription.status === 'cancelled') {
        console.log(`❌ Suscripción CANCELADA: ${userEmail}`)
        // TODO: Desactivar suscripción en DB
      }
    }

    // Notificación de pago de suscripción
    if (body.type === 'payment' || body.action === 'payment.created') {
      const paymentId = body.data?.id || body.id

      const paymentResponse = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
        headers: {
          'Authorization': `Bearer ${MP_ACCESS_TOKEN}`
        }
      })

      if (paymentResponse.ok) {
        const payment = await paymentResponse.json()
        console.log('💳 Pago recibido:', payment.status, 'Monto:', payment.transaction_amount)
        
        if (payment.status === 'approved') {
          console.log('✅ Pago aprobado - Renovación exitosa')
          // TODO: Extender período de suscripción
        }
      }
    }

    return c.json({ success: true })

  } catch (error) {
    console.error('❌ Error en webhook:', error)
    return c.json({ error: 'Error procesando webhook' }, 500)
  }
})

// GET /api/mercadopago/plans
// Obtener lista de planes
mercadopagoRoutes.get('/plans', (c) => {
  return c.json({
    success: true,
    plans: Object.values(PLANS)
  })
})

// GET /api/mercadopago/config
// Obtener configuración pública (public key)
mercadopagoRoutes.get('/config', (c) => {
  return c.json({
    success: true,
    publicKey: MP_PUBLIC_KEY
  })
})

export default mercadopagoRoutes
