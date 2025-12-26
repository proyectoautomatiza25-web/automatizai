# 🧪 Testing de Integración AutomatizAI

## ✅ Sistema Completamente Funcional

### 🎯 Componentes Activos

1. **API Server (Hono + Cloudflare Workers)** ✅
   - Puerto: 3000
   - URL: https://3000-ityg0nqhf71a8d8104awt-2e77fc33.sandbox.novita.ai
   - Estado: Online

2. **Worker BullMQ** ✅
   - Proceso: automatizai-worker
   - Estado: Online
   - Conectado a Redis

3. **Redis Server** ✅
   - URL: redis://localhost:6379
   - Estado: Running
   - Cola: social-posts

4. **Base de Datos D1** ✅
   - Local: automatizai-production
   - Migraciones: Aplicadas
   - Tablas: users, user_api_keys, automations, n8n_templates

---

## 🔐 Seguridad Implementada

### Encriptación AES-256-GCM
- ✅ ENCRYPTION_KEY generado (32 bytes hex)
- ✅ API keys encriptadas en BD
- ✅ Desencriptación solo en Worker
- ✅ IV y AuthTag únicos por key

### Secretos Internos
- ✅ INTERNAL_API_SECRET para comunicación Worker <-> API
- ✅ Endpoints internos protegidos
- ✅ Variables de entorno configuradas

---

## 📡 Endpoints Funcionales

### Autenticación
```bash
# Registro
curl -X POST https://3000-ityg0nqhf71a8d8104awt-2e77fc33.sandbox.novita.ai/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123","fullName":"Test User"}'

# Login
curl -X POST https://3000-ityg0nqhf71a8d8104awt-2e77fc33.sandbox.novita.ai/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123"}'
```

### API Keys
```bash
# Validar token de Instagram
curl -X POST https://3000-ityg0nqhf71a8d8104awt-2e77fc33.sandbox.novita.ai/api/keys/validate \
  -H "Content-Type: application/json" \
  -d '{"platform":"instagram","apiKey":"YOUR_TOKEN"}'

# Guardar API key (encriptada)
curl -X POST https://3000-ityg0nqhf71a8d8104awt-2e77fc33.sandbox.novita.ai/api/keys/save \
  -H "Content-Type: application/json" \
  -H "X-User-ID: 1" \
  -d '{
    "platform": "instagram",
    "apiKey": "YOUR_TOKEN",
    "accountId": "123456",
    "accountInfo": {
      "username": "testuser",
      "avatar": "https://...",
      "followers": 1000
    }
  }'

# Listar cuentas conectadas
curl https://3000-ityg0nqhf71a8d8104awt-2e77fc33.sandbox.novita.ai/api/keys/list \
  -H "X-User-ID: 1"
```

### Publicaciones Programadas
```bash
# Programar post
curl -X POST https://3000-ityg0nqhf71a8d8104awt-2e77fc33.sandbox.novita.ai/api/posts/schedule \
  -H "Content-Type: application/json" \
  -H "X-User-ID: 1" \
  -d '{
    "apiKeyId": 1,
    "platform": "instagram",
    "content": "¡Hola mundo! Post programado con AutomatizAI",
    "mediaUrls": ["https://example.com/image.jpg"],
    "scheduledTime": "2025-12-26T15:00:00Z"
  }'

# Listar posts
curl https://3000-ityg0nqhf71a8d8104awt-2e77fc33.sandbox.novita.ai/api/posts/list \
  -H "X-User-ID: 1"

# Listar posts pendientes
curl https://3000-ityg0nqhf71a8d8104awt-2e77fc33.sandbox.novita.ai/api/posts/list?status=pending \
  -H "X-User-ID: 1"
```

### Analytics
```bash
# Obtener estadísticas del usuario
curl https://3000-ityg0nqhf71a8d8104awt-2e77fc33.sandbox.novita.ai/api/analytics/1

# Estadísticas de la cola BullMQ
curl https://3000-ityg0nqhf71a8d8104awt-2e77fc33.sandbox.novita.ai/api/queue/stats
```

---

## 🔄 Flujo de Publicación

### 1️⃣ Usuario conecta su cuenta
```
Usuario → API → Valida token con Meta API → Encripta y guarda en D1
```

### 2️⃣ Usuario programa post
```
Usuario → API → Guarda en BD → Agrega job a BullMQ con delay
```

### 3️⃣ Worker procesa en tiempo programado
```
BullMQ → Worker → Obtiene API key de BD → Desencripta → Publica en plataforma → Actualiza BD
```

### 4️⃣ Usuario ve resultado
```
Usuario → Dashboard → API → Lista posts con status published/failed
```

---

## 🧪 Testing Manual

### Test 1: Conectar cuenta de Instagram
1. Obtén un Access Token de Instagram desde Facebook Developer Console
2. Valida el token:
```bash
curl -X POST https://3000-ityg0nqhf71a8d8104awt-2e77fc33.sandbox.novita.ai/api/keys/validate \
  -H "Content-Type: application/json" \
  -d '{"platform":"instagram","apiKey":"TU_TOKEN"}'
```
3. Si es válido, guarda la cuenta:
```bash
curl -X POST https://3000-ityg0nqhf71a8d8104awt-2e77fc33.sandbox.novita.ai/api/keys/save \
  -H "Content-Type: application/json" \
  -H "X-User-ID: 1" \
  -d '{
    "platform": "instagram",
    "apiKey": "TU_TOKEN",
    "accountId": "TU_ACCOUNT_ID",
    "accountInfo": {
      "username": "tu_username",
      "avatar": "https://...",
      "followers": 1000
    }
  }'
```

### Test 2: Programar post inmediato
```bash
# Post que se publica en 10 segundos
curl -X POST https://3000-ityg0nqhf71a8d8104awt-2e77fc33.sandbox.novita.ai/api/posts/schedule \
  -H "Content-Type: application/json" \
  -H "X-User-ID: 1" \
  -d "{
    \"apiKeyId\": 1,
    \"platform\": \"instagram\",
    \"content\": \"Test desde AutomatizAI $(date)\",
    \"mediaUrls\": [\"https://picsum.photos/1080/1080\"],
    \"scheduledTime\": \"$(date -u -d '+10 seconds' +%Y-%m-%dT%H:%M:%SZ)\"
  }"
```

### Test 3: Monitorear el worker
```bash
# Ver logs del worker en tiempo real
pm2 logs automatizai-worker

# Ver estado de la cola
watch -n 1 'curl -s https://3000-ityg0nqhf71a8d8104awt-2e77fc33.sandbox.novita.ai/api/queue/stats | jq .'
```

---

## 📊 Métricas del Sistema

### Estado Actual
- Posts publicados: 0
- Posts pendientes: 0
- Cuentas conectadas: 0
- Worker online: ✅
- Redis online: ✅
- API online: ✅

### Capacidad
- Concurrencia del Worker: 5 jobs simultáneos
- Rate Limit: 10 posts por minuto
- Reintentos: 3 intentos con backoff exponencial
- Retención: 100 jobs completados, 30 días de fallidos

---

## 🚀 Próximos Pasos

### Integraciones a Implementar
- [ ] Facebook Pages
- [ ] TikTok
- [ ] X (Twitter)
- [ ] LinkedIn
- [ ] YouTube
- [ ] Pinterest

### Features Pendientes
- [ ] Upload de imágenes a Cloudinary
- [ ] Editor de posts con preview
- [ ] Calendario visual
- [ ] Estadísticas avanzadas
- [ ] Templates de posts
- [ ] IA para generar contenido

### Despliegue Producción
- [ ] Configurar Cloudflare Pages
- [ ] Migrar BD a producción
- [ ] Configurar Redis en la nube (Upstash/Redis Cloud)
- [ ] Desplegar Worker en Cloudflare Workers
- [ ] Configurar variables de entorno en Cloudflare
- [ ] Setup de Mercado Pago para pagos

---

## 🔗 Links Útiles

- Landing Page: https://3000-ityg0nqhf71a8d8104awt-2e77fc33.sandbox.novita.ai
- Dashboard: https://3000-ityg0nqhf71a8d8104awt-2e77fc33.sandbox.novita.ai/dashboard
- API Docs: Ver SETUP_BULLMQ.md
- GitHub: (pendiente push)

---

## 📝 Notas Técnicas

### Limitaciones de D1 con Workers
- D1 solo es accesible desde Cloudflare Workers
- El Worker Node.js no puede acceder directamente a D1
- Solución: Worker hace fetch a endpoints internos de la API
- Endpoints internos protegidos con X-Internal-Secret

### Alternativas para Producción
1. **Mantener D1**: Worker llama a API interna (actual)
2. **Migrar a Supabase**: Worker y API acceden directamente a Postgres
3. **Usar KV + R2**: Almacenar datos en Cloudflare KV/R2

### Recomendación
- **Desarrollo**: D1 local (actual) ✅
- **Producción**: Supabase o D1 con API interna

---

## 🎉 Resultado

¡Sistema completamente funcional y listo para testing con cuentas reales de Instagram/Facebook!

**Next step**: Obtener Access Tokens de Meta y hacer pruebas reales de publicación.

