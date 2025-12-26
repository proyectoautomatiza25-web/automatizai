// Payment result pages

export const paymentSuccessPage = (plan: string) => `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Pago Exitoso - AutomatizAI</title>
  <link href="/static/landing-pro.css" rel="stylesheet">
</head>
<body>
  <div style="min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 2rem;">
    <div style="max-width: 600px; text-align: center; background: rgba(255,255,255,0.05); padding: 3rem; border-radius: 1rem; border: 1px solid rgba(255,255,255,0.1);">
      <div style="font-size: 4rem; margin-bottom: 1rem;">✅</div>
      <h1 style="font-size: 2rem; margin-bottom: 1rem; color: #10b981;">¡Pago Exitoso!</h1>
      <p style="color: var(--gray-300); margin-bottom: 2rem; font-size: 1.1rem;">
        Tu suscripción al plan <strong>${plan.toUpperCase()}</strong> ha sido activada correctamente.
      </p>
      <p style="color: var(--gray-400); margin-bottom: 2rem;">
        Recibirás un email de confirmación en los próximos minutos con todos los detalles.
      </p>
      <a href="/dashboard" class="btn-primary" style="text-decoration: none; display: inline-block;">
        Ir al Dashboard
      </a>
    </div>
  </div>
</body>
</html>
`;

export const paymentFailurePage = `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Pago Fallido - AutomatizAI</title>
  <link href="/static/landing-pro.css" rel="stylesheet">
</head>
<body>
  <div style="min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 2rem;">
    <div style="max-width: 600px; text-align: center; background: rgba(255,255,255,0.05); padding: 3rem; border-radius: 1rem; border: 1px solid rgba(255,255,255,0.1);">
      <div style="font-size: 4rem; margin-bottom: 1rem;">❌</div>
      <h1 style="font-size: 2rem; margin-bottom: 1rem; color: #ef4444;">Pago Fallido</h1>
      <p style="color: var(--gray-300); margin-bottom: 2rem; font-size: 1.1rem;">
        Hubo un problema al procesar tu pago. Por favor, intenta nuevamente.
      </p>
      <div style="display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap;">
        <a href="/#precios" class="btn-primary" style="text-decoration: none; display: inline-block;">
          Intentar de nuevo
        </a>
        <a href="/" class="btn-secondary" style="text-decoration: none; display: inline-block;">
          Volver al inicio
        </a>
      </div>
    </div>
  </div>
</body>
</html>
`;

export const paymentPendingPage = `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Pago Pendiente - AutomatizAI</title>
  <link href="/static/landing-pro.css" rel="stylesheet">
</head>
<body>
  <div style="min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 2rem;">
    <div style="max-width: 600px; text-align: center; background: rgba(255,255,255,0.05); padding: 3rem; border-radius: 1rem; border: 1px solid rgba(255,255,255,0.1);">
      <div style="font-size: 4rem; margin-bottom: 1rem;">⏳</div>
      <h1 style="font-size: 2rem; margin-bottom: 1rem; color: #f59e0b;">Pago Pendiente</h1>
      <p style="color: var(--gray-300); margin-bottom: 2rem; font-size: 1.1rem;">
        Tu pago está siendo procesado. Te notificaremos por email cuando sea confirmado.
      </p>
      <a href="/" class="btn-primary" style="text-decoration: none; display: inline-block;">
        Volver al inicio
      </a>
    </div>
  </div>
</body>
</html>
`;
