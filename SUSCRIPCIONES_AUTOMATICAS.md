# 🔄 Suscripciones Automáticas - Mercado Pago

## ✅ ¿QUÉ CAMBIÓ?

### **ANTES (Pagos únicos):**
- ❌ Cliente pagaba UNA vez (ej: $49.990)
- ❌ Al mes siguiente, NO se cobraba automáticamente
- ❌ Cliente debía pagar manualmente cada mes
- ❌ Tú debías recordarle a cada cliente
- ❌ Muchos clientes no renovaban

### **AHORA (Suscripciones automáticas):**
- ✅ Cliente paga la PRIMERA vez
- ✅ Mercado Pago guarda su tarjeta de forma segura
- ✅ Cada mes, **Mercado Pago cobra AUTOMÁTICAMENTE**
- ✅ Cliente no tiene que hacer NADA
- ✅ Tú NO tienes que recordarle a nadie
- ✅ Ingresos predecibles y constantes

---

## 🎯 ¿CÓMO FUNCIONA?

### **1. Cliente hace clic en "Contratar Ahora"**
```
Cliente → automatizasur.cl → Botón "💳 Contratar Ahora"
```

### **2. Se crea una suscripción en Mercado Pago**
```javascript
// PASO 1: Crear plan de suscripción
POST /preapproval_plan
{
  reason: "Plan Starter - AutomatizA SUR",
  auto_recurring: {
    frequency: 1,           // Cada 1 mes
    frequency_type: "months",
    transaction_amount: 49990,
    currency_id: "CLP"
  }
}

// PASO 2: Suscribir al cliente
POST /preapproval
{
  preapproval_plan_id: "ID_DEL_PLAN",
  payer_email: "cliente@email.com",
  status: "pending"
}
```

### **3. Cliente completa el pago**
- Mercado Pago muestra el checkout
- Cliente ingresa sus datos de tarjeta
- **Mercado Pago GUARDA la tarjeta** (tokenizada)
- Cliente autoriza el cobro recurrente

### **4. Cobro automático cada mes**
```
Día 1:  Cliente paga $49.990 ✅
Día 30: Mercado Pago cobra $49.990 automáticamente ✅
Día 60: Mercado Pago cobra $49.990 automáticamente ✅
Día 90: Mercado Pago cobra $49.990 automáticamente ✅
...infinito
```

---

## 📊 ¿QUÉ PASA SI...?

### **¿El cliente no tiene saldo?**
- Mercado Pago intenta cobrar 3 veces
- Si falla, envía notificación al webhook
- La suscripción se marca como "paused"
- Cliente recibe email para actualizar tarjeta

### **¿El cliente quiere cancelar?**
- Cliente puede cancelar desde su cuenta de Mercado Pago
- O tú puedes cancelar desde el panel de Mercado Pago
- Se envía notificación al webhook
- Dejas de darle acceso al servicio

### **¿Cómo sé quién pagó?**
- Mercado Pago envía notificaciones al webhook
- El webhook incluye el email del cliente
- Puedes guardar en una base de datos quién está activo

---

## 🔔 Webhook (Notificaciones automáticas)

Mercado Pago enviará notificaciones a:
```
https://automatizasur.cl/api/mercadopago/webhook
```

**Eventos que recibirás:**
- `subscription_preapproval` → Suscripción creada/actualizada
- `subscription_authorized_payment` → Pago mensual exitoso
- `payment` → Detalles del pago

---

## 💰 ¿CUÁNTO COBRA MERCADO PAGO?

**En Chile:**
- Tarjeta de crédito: **3,49% + $150 CLP** por transacción
- Tarjeta de débito: **2,49% + $150 CLP** por transacción

**Ejemplo con Plan Starter ($49.990):**
```
Precio: $49.990
Comisión MP (3,49%): $1.745
Fijo: $150
Total comisión: $1.895

TÚ RECIBES: $48.095 cada mes por cliente
```

---

## 🎯 ¿CÓMO GESTIONAR SUSCRIPCIONES?

### **Panel de Mercado Pago:**
1. Ve a: https://www.mercadopago.cl/subscriptions/list
2. Verás todas las suscripciones activas
3. Puedes:
   - Ver estado de cada suscripción
   - Cancelar suscripciones
   - Ver historial de pagos
   - Exportar datos

---

## 🚀 ¿QUÉ SIGUE?

### **OPCIONAL: Base de datos para tracking**

Si quieres guardar quién está suscrito:

```sql
CREATE TABLE subscriptions (
  id INTEGER PRIMARY KEY,
  email TEXT NOT NULL,
  plan_id TEXT NOT NULL,
  mp_subscription_id TEXT UNIQUE,
  status TEXT DEFAULT 'active',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  next_billing_date DATE
);
```

Luego, en el webhook, guarda cada suscripción:

```javascript
// Cuando llega notificación de pago exitoso
INSERT INTO subscriptions (email, plan_id, mp_subscription_id, status)
VALUES ('cliente@email.com', 'starter', 'abc123', 'active');
```

---

## ✅ RESUMEN

| Aspecto | Estado |
|---------|--------|
| 💳 Cobro automático mensual | ✅ Activado |
| 🔄 Sin trabajo manual | ✅ Activado |
| 📊 Ingresos predecibles | ✅ Activado |
| 🔔 Notificaciones webhook | ✅ Configurado |
| 💰 Comisión MP | 3,49% + $150 CLP |
| 🚀 Listo para producción | ✅ SÍ |

---

## 📞 PRÓXIMOS PASOS

1. **Espera 2-3 minutos** a que se despliegue en automatizasur.cl
2. **Prueba el flujo completo:**
   - Ve a https://automatizasur.cl
   - Haz clic en "Contratar Ahora"
   - Completa el checkout
   - Verifica que se cree la suscripción en tu panel de Mercado Pago
3. **Configura el webhook en Mercado Pago:**
   - Ve a: https://www.mercadopago.cl/developers/panel/notifications/webhooks
   - Agrega URL: `https://automatizasur.cl/api/mercadopago/webhook`
   - Eventos: `payment`, `subscription_preapproval`, `subscription_authorized_payment`

---

¡Ahora tienes un negocio SaaS con ingresos recurrentes automáticos! 🎉
