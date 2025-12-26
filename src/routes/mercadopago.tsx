// API Routes para Mercado Pago
import { Hono } from 'hono'

const mercadopagoRoutes = new Hono()

// Configuración de Mercado Pago
const MP_ACCESS_TOKEN = 'TEST-8933865638507692-122521-17505bb0e20e5afcf41b7f0a34e869c0-25579762'
const MP_PUBLIC_KEY = 'TEST-4a3f8b7b-aded-40b1-adfd-dc095d3316d4'

// Planes disponibles
const PLANS = {
  starter: {
    id: 'starter',
    name: 'Starter',
    price: 49,
    currency: 'USD',
    frequency: 'monthly',
    features: [
      '5 cuentas de redes sociales',
      '50 publicaciones programadas/mes',
      'Hasta 100 automatizaciones/mes',
      '1 usuario',
      'Analytics básico',
      'Soporte por email'
    ]
  },
  growth: {
    id: 'growth',
    name: 'Growth',
    price: 89,
    currency: 'USD',
    frequency: 'monthly',
    featured: true,
    features: [
      '15 cuentas de redes sociales',
      '200 publicaciones programadas/mes',
      'Hasta 500 automatizaciones/mes',
      '3 usuarios',
      'Analytics avanzado',
      'Soporte prioritario 24/7',
      'API access'
    ]
  },
  pro: {
    id: 'pro',
    name: 'Pro',
    price: 130,
    currency: 'USD',
    frequency: 'monthly',
    features: [
      '30 cuentas de redes sociales',
      '500 publicaciones programadas/mes',
      'Hasta 2000 automatizaciones/mes',
      '10 usuarios',
      'Analytics personalizado',
      'Soporte dedicado',
      'White-label'
    ]
  },
  enterprise: {
    id: 'enterprise',
    name: 'Enterprise',
    price: 190,
    currency: 'USD',
    frequency: 'monthly',
    features: [
      'Cuentas ilimitadas',
      'Publicaciones ilimitadas',
      'Automatizaciones ilimitadas',
      'Usuarios ilimitados',
      'Dashboard enterprise',
      'Account manager',
      'SLA 99.9%'
    ]
  }
}

// POST /api/mercadopago/create-preference
// Crear preferencia de pago para un plan
mercadopagoRoutes.post('/create-preference', async (c) => {
  try {
    const { planId, userId, userEmail } = await c.req.json()

    if (!planId || !userId || !userEmail) {
      return c.json({ error: 'planId, userId y userEmail son requeridos' }, 400)
    }

    const plan = PLANS[planId as keyof typeof PLANS]
    if (!plan) {
      return c.json({ error: 'Plan no válido' }, 400)
    }

    // Crear preferencia en Mercado Pago
    const preferenceData = {
      items: [
        {
          title: `Plan ${plan.name} - AutomatizAI`,
          description: `Suscripción mensual al plan ${plan.name}`,
          quantity: 1,
          unit_price: plan.price,
          currency_id: plan.currency
        }
      ],
      payer: {
        email: userEmail
      },
      back_urls: {
        success: `https://3000-ityg0nqhf71a8d8104awt-2e77fc33.sandbox.novita.ai/payment-success?plan=${planId}`,
        failure: `https://3000-ityg0nqhf71a8d8104awt-2e77fc33.sandbox.novita.ai/payment-failure`,
        pending: `https://3000-ityg0nqhf71a8d8104awt-2e77fc33.sandbox.novita.ai/payment-pending`
      },
      auto_return: 'approved',
      external_reference: `${userId}_${planId}_${Date.now()}`,
      notification_url: 'https://3000-ityg0nqhf71a8d8104awt-2e77fc33.sandbox.novita.ai/api/mercadopago/webhook',
      statement_descriptor: 'AUTOMATIZAI',
      expires: false
    }

    const response = await fetch('https://api.mercadopago.com/checkout/preferences', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${MP_ACCESS_TOKEN}`
      },
      body: JSON.stringify(preferenceData)
    })

    if (!response.ok) {
      const error = await response.text()
      console.error('Error creando preferencia MP:', error)
      return c.json({ error: 'Error al crear preferencia de pago' }, 500)
    }

    const preference = await response.json()

    // Guardar en DB (opcional)
    // Aquí puedes guardar la preferencia en tu DB para tracking

    return c.json({
      success: true,
      preferenceId: preference.id,
      initPoint: preference.init_point,
      sandboxInitPoint: preference.sandbox_init_point
    })

  } catch (error) {
    console.error('Error en create-preference:', error)
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
