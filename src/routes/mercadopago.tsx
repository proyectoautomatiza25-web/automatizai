// API Routes para Mercado Pago
import { Hono } from 'hono'

const mercadopagoRoutes = new Hono()

// Configuración de Mercado Pago
// TODO: Reemplazar con tus credenciales reales
const MP_ACCESS_TOKEN = 'YOUR_ACCESS_TOKEN' // Reemplazar con tu token
const MP_PUBLIC_KEY = 'TEST-4a3f8b7b-aded-40b1-adfd-dc095d3316d4'

// Planes disponibles (para AutomatizA SUR)
const PLANS = {
  starter: {
    id: 'starter',
    name: 'Starter',
    price: 49,
    currency: 'USD',
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
    price: 89,
    currency: 'USD',
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
    price: 130,
    currency: 'USD',
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
    price: 190,
    currency: 'USD',
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
// Crear suscripción recurrente para un plan
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

    // Paso 1: Crear plan de suscripción en MP (si no existe)
    const planData = {
      reason: `Plan ${plan.name} - AutomatizA SUR`,
      auto_recurring: {
        frequency: plan.frequency,
        frequency_type: plan.frequency_type,
        transaction_amount: plan.price,
        currency_id: plan.currency
      },
      back_url: 'https://3000-ityg0nqhf71a8d8104awt-2e77fc33.sandbox.novita.ai/payment-success',
      payment_methods_allowed: {
        payment_types: [{ id: 'credit_card' }],
        payment_methods: [{ id: 'visa' }, { id: 'master' }]
      }
    }

    const planResponse = await fetch('https://api.mercadopago.com/preapproval_plan', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${MP_ACCESS_TOKEN}`
      },
      body: JSON.stringify(planData)
    })

    if (!planResponse.ok) {
      const error = await planResponse.text()
      console.error('Error creando plan MP:', error)
      return c.json({ error: 'Error al crear plan de suscripción' }, 500)
    }

    const mpPlan = await planResponse.json()

    // Paso 2: Crear preferencia de suscripción para el usuario
    const subscriptionData = {
      preapproval_plan_id: mpPlan.id,
      reason: `Suscripción ${plan.name} - AutomatizA SUR`,
      external_reference: `${planId}_${Date.now()}`,
      payer_email: userEmail,
      back_url: 'https://3000-ityg0nqhf71a8d8104awt-2e77fc33.sandbox.novita.ai/payment-success',
      status: 'pending'
    }

    const subscriptionResponse = await fetch('https://api.mercadopago.com/preapproval', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${MP_ACCESS_TOKEN}`
      },
      body: JSON.stringify(subscriptionData)
    })

    if (!subscriptionResponse.ok) {
      const error = await subscriptionResponse.text()
      console.error('Error creando suscripción MP:', error)
      return c.json({ error: 'Error al crear suscripción' }, 500)
    }

    const subscription = await subscriptionResponse.json()

    return c.json({
      success: true,
      subscriptionId: subscription.id,
      initPoint: subscription.init_point,
      sandboxInitPoint: subscription.sandbox_init_point || subscription.init_point
    })

  } catch (error) {
    console.error('Error en create-subscription:', error)
    return c.json({ error: 'Error interno del servidor' }, 500)
  }
})

// POST /api/mercadopago/webhook
// Webhook para notificaciones de Mercado Pago
mercadopagoRoutes.post('/webhook', async (c) => {
  try {
    const body = await c.req.json()
    console.log('Webhook MP recibido:', JSON.stringify(body, null, 2))

    // Tipos de notificación:
    // - payment: pago creado/actualizado
    // - merchant_order: orden actualizada

    if (body.type === 'payment') {
      const paymentId = body.data.id

      // Obtener detalles del pago
      const paymentResponse = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
        headers: {
          'Authorization': `Bearer ${MP_ACCESS_TOKEN}`
        }
      })

      if (!paymentResponse.ok) {
        console.error('Error obteniendo pago:', await paymentResponse.text())
        return c.json({ error: 'Error obteniendo pago' }, 500)
      }

      const payment = await paymentResponse.json()
      console.log('Detalles del pago:', JSON.stringify(payment, null, 2))

      // Extraer info del external_reference
      const externalReference = payment.external_reference // formato: userId_planId_timestamp
      const [userId, planId] = externalReference.split('_')

      if (payment.status === 'approved') {
        // Pago aprobado - activar suscripción
        console.log(`✅ Pago aprobado para user ${userId}, plan ${planId}`)

        // Aquí actualizar la DB del usuario:
        // UPDATE users SET subscription_plan = planId, subscription_status = 'active', subscription_start = NOW(), subscription_end = NOW() + INTERVAL 1 MONTH

        // Enviar email de confirmación, etc.
      } else if (payment.status === 'rejected') {
        console.log(`❌ Pago rechazado para user ${userId}`)
        // Notificar al usuario
      } else if (payment.status === 'in_process') {
        console.log(`⏳ Pago en proceso para user ${userId}`)
      }
    }

    return c.json({ success: true })

  } catch (error) {
    console.error('Error en webhook:', error)
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
