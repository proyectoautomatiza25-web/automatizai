# 🇨🇱 Configuración de FLOW - Suscripciones Automáticas

## ✅ VENTAJAS DE FLOW

- ✅ **Suscripciones automáticas nativas** (cobra cada mes automáticamente)
- ✅ **Chilena** (optimizada para Chile)
- ✅ **Simple de integrar** (API REST)
- ✅ **Checkout pre-construido** (no necesitas formulario de tarjeta)
- ✅ **Todas las tarjetas chilenas**
- ✅ **WebPay Plus** + tarjetas internacionales
- ✅ **Dashboard para gestionar suscripciones**

**Comisión:** 3,49% + IVA por transacción

---

## 📋 PASO 1: Crear cuenta en Flow

### **1.1 Regístrate:**
👉 https://www.flow.cl/app/web/registro.php

**Datos necesarios:**
- Nombre completo
- RUT (puede ser personal, no necesitas empresa)
- Email
- Teléfono
- Contraseña

**Tipo de cuenta:**
- Selecciona: **"Cuenta personal"** o **"Emprendedor"**

---

## 📋 PASO 2: Obtener credenciales API

### **2.1 Inicia sesión:**
👉 https://www.flow.cl/app/web/login.php

### **2.2 Ve a Configuración → API:**
1. En el menú lateral, busca **"Configuración"** o **"API"**
2. Verás tus credenciales:
   - ✅ **API Key** (clave pública)
   - ✅ **Secret Key** (clave privada)

### **2.3 Copia ambas credenciales**

---

## 📋 PASO 3: Configurar credenciales en el código

### **3.1 Abre el archivo:**
```
/home/user/webapp/src/routes/flow.tsx
```

### **3.2 Reemplaza en las líneas 7-8:**

```typescript
// ANTES:
const FLOW_API_KEY = 'TU_API_KEY_AQUI'
const FLOW_SECRET_KEY = 'TU_SECRET_KEY_AQUI'

// DESPUÉS (con tus credenciales reales):
const FLOW_API_KEY = 'tu_api_key_de_flow'
const FLOW_SECRET_KEY = 'tu_secret_key_de_flow'
```

---

## 📋 PASO 4: Cambiar el frontend para usar Flow

### **4.1 Actualizar el botón de pago:**

En `/home/user/webapp/src/routes/landing-pro-real.tsx`, buscar la línea 672:

```javascript
// CAMBIAR DE:
const response = await fetch('/api/mercadopago/create-subscription', {

// A:
const response = await fetch('/api/flow/create-subscription', {
```

Y cambiar la línea 665:

```javascript
// CAMBIAR DE:
this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Redirigiendo a Mercado Pago...'

// A:
this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Redirigiendo a Flow...'
```

Y cambiar la línea 688:

```javascript
// CAMBIAR DE:
if (data.initPoint) {
  window.location.href = data.initPoint

// A:
if (data.url) {
  window.location.href = data.url
```

---

## 📋 PASO 5: Build y Deploy

```bash
cd /home/user/webapp
npm run build
git add .
git commit -m "feat: Integración de Flow para suscripciones automáticas"
git push origin main
```

Cloudflare Pages desplegará automáticamente en 2-3 minutos.

---

## 🎯 CÓMO FUNCIONA

### **Flujo del usuario:**

1. **Cliente hace clic** en "💳 Contratar Ahora"
2. **Backend crea suscripción** en Flow
3. **Flow devuelve URL** de pago
4. **Cliente es redirigido** al checkout de Flow
5. **Cliente completa pago** con su tarjeta
6. **Flow guarda la tarjeta** (tokenizada y segura)
7. **Cliente autoriza** el cobro recurrente
8. **Flow cobra AUTOMÁTICAMENTE** cada mes

### **Cobro automático:**

```
Día 1:  Cliente paga $49.990 → Suscripción activa ✅
Día 30: Flow cobra $49.990 automáticamente ✅
Día 60: Flow cobra $49.990 automáticamente ✅
Día 90: Flow cobra $49.990 automáticamente ✅
...hasta que el cliente cancele
```

---

## 🔔 Webhook (Notificaciones)

Flow enviará notificaciones a:
```
https://automatizasur.cl/api/flow/confirm
```

**Eventos que recibirás:**
- Pago exitoso
- Pago rechazado
- Suscripción cancelada

---

## 💰 Comisiones de Flow

**En Chile:**
- **3,49% + IVA** por transacción

**Ejemplo Plan Starter ($49.990):**
```
Cobro: $49.990
Comisión Flow (3,49%): ~$1.745
IVA (19%): ~$332
Total comisión: ~$2.077

TÚ RECIBES: ~$47.913 cada mes por cliente
```

---

## 📊 Panel de Flow

Gestiona suscripciones en:
👉 https://www.flow.cl/app/web/miCuenta.php

**Puedes:**
- Ver todas las suscripciones activas
- Cancelar suscripciones
- Ver historial de pagos
- Exportar reportes
- Configurar webhooks

---

## ✅ CHECKLIST

- [ ] Crear cuenta en Flow
- [ ] Obtener API Key
- [ ] Obtener Secret Key
- [ ] Pegar credenciales en `/src/routes/flow.tsx`
- [ ] Cambiar endpoint en landing (mercadopago → flow)
- [ ] Build y deploy
- [ ] Probar compra de prueba
- [ ] Verificar en panel de Flow

---

## 🚀 PRÓXIMOS PASOS

Una vez configurado:

1. **Prueba el flujo completo:**
   - Ve a https://automatizasur.cl
   - Haz clic en "Contratar Ahora"
   - Completa el checkout
   - Verifica en el panel de Flow

2. **Configura el webhook:**
   - En Flow → Configuración → Webhooks
   - Agrega: `https://automatizasur.cl/api/flow/confirm`

3. **Base de datos (opcional):**
   - Guardar suscripciones en D1
   - Tracking de clientes activos
   - Reportes personalizados

---

## 📞 SOPORTE

**Flow:**
- Email: soporte@flow.cl
- Teléfono: +56 2 2573 4000
- Documentación: https://www.flow.cl/docs/

---

¡Listo! Con Flow tendrás suscripciones automáticas funcionando en minutos 🚀
