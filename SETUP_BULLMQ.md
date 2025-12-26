# 🚀 Setup BullMQ + Redis para AutomatizAI

## 📋 Prerrequisitos

1. **Redis** instalado y corriendo
2. **Node.js** 18+ 
3. Variables de entorno configuradas

---

## 🔧 Instalación de Redis

### macOS
```bash
brew install redis
brew services start redis
```

### Ubuntu/Debian
```bash
sudo apt update
sudo apt install redis-server
sudo systemctl start redis-server
sudo systemctl enable redis-server
```

### Docker
```bash
docker run -d -p 6379:6379 redis:alpine
```

### Verificar que Redis funciona
```bash
redis-cli ping
# Debe retornar: PONG
```

---

## 🔐 Configuración de Variables de Entorno

1. Copiar el archivo de ejemplo:
```bash
cp .env.example .env.local
```

2. Generar ENCRYPTION_KEY:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

3. Editar `.env.local` y completar:
```env
REDIS_URL=redis://localhost:6379
ENCRYPTION_KEY=<key-generada-arriba>
INTERNAL_API_SECRET=<cualquier-string-secreto>
```

---

## 📦 Instalación de Dependencias

```bash
npm install
```

Dependencias instaladas:
- `bullmq`: Sistema de colas
- `ioredis`: Cliente de Redis
- `axios`: HTTP client para APIs de Meta
- `zod`: Validación de datos

---

## 🗄️ Migraciones de Base de Datos

```bash
# Aplicar migraciones
npm run db:migrate:local

# Verificar que las tablas existen
npm run db:console:local
```

En la consola SQL:
```sql
.schema user_api_keys
.schema automations
```

---

## 🏃 Iniciar la Aplicación

### Terminal 1: API Server
```bash
npm run build
pm2 start ecosystem.config.cjs
pm2 logs automatizai
```

### Terminal 2: Worker de BullMQ
```bash
npm run worker
```

O con auto-reload en desarrollo:
```bash
npm run worker:dev
```

---

## 🧪 Probar la Integración

### 1. Verificar Redis
```bash
npm run test:redis
```

### 2. Validar Token de Instagram/Facebook

Obtener token de prueba en:
- Instagram: https://developers.facebook.com/tools/explorer/
- Permisos necesarios: `instagram_basic`, `instagram_content_publish`, `pages_read_engagement`

```bash
curl -X POST http://localhost:3000/api/keys/validate \
  -H "Content-Type: application/json" \
  -d '{
    "platform": "instagram",
    "apiKey": "YOUR_ACCESS_TOKEN"
  }'
```

### 3. Guardar API Key

```bash
curl -X POST http://localhost:3000/api/keys/save \
  -H "Content-Type: application/json" \
  -H "X-User-ID: 1" \
  -d '{
    "platform": "instagram",
    "apiKey": "YOUR_ACCESS_TOKEN",
    "accountId": "INSTAGRAM_ACCOUNT_ID",
    "accountInfo": {
      "username": "tu_cuenta",
      "avatar": "https://...",
      "followers": 1000
    }
  }'
```

### 4. Programar Post

```bash
curl -X POST http://localhost:3000/api/posts/schedule \
  -H "Content-Type: application/json" \
  -H "X-User-ID: 1" \
  -d '{
    "apiKeyId": 1,
    "platform": "instagram",
    "content": "¡Hola desde AutomatizAI! 🚀",
    "mediaUrls": ["https://example.com/image.jpg"],
    "scheduledTime": "2024-12-22T15:00:00Z"
  }'
```

### 5. Ver Cola de BullMQ

```bash
curl http://localhost:3000/api/queue/stats
```

---

## 📊 Monitoreo

### Ver jobs en Redis
```bash
redis-cli keys "bull:social-posts:*"
```

### Ver logs del worker
```bash
# Si usas npm run worker
# Los logs aparecen en consola

# Si usas PM2
pm2 logs automatizai
```

### Dashboard de BullMQ (opcional)
```bash
npm install -g bull-board
bull-board
```

Abre: http://localhost:3000/admin/queues

---

## 🔍 Debugging

### Error: "Redis connection failed"
- Verificar que Redis está corriendo: `redis-cli ping`
- Verificar REDIS_URL en .env.local
- Verificar firewall/puertos

### Error: "ENCRYPTION_KEY no está configurada"
- Generar key y agregarla a .env.local
- Reiniciar servidor

### Posts no se publican
1. Verificar que el worker está corriendo
2. Ver logs del worker para errores
3. Verificar que el token de Meta es válido
4. Verificar la URL de la imagen es accesible públicamente

---

## 🏗️ Arquitectura

```
┌─────────────┐
│   Cliente   │
│  (Browser)  │
└──────┬──────┘
       │
       │ HTTP Request
       ▼
┌─────────────┐
│   Hono API  │
│ (Port 3000) │
└──────┬──────┘
       │
       ├──────────┐
       │          │
       ▼          ▼
┌───────────┐  ┌──────────┐
│Cloudflare │  │  BullMQ  │
│    D1     │  │ + Redis  │
└───────────┘  └─────┬────┘
                     │
                     │ Jobs
                     ▼
              ┌──────────────┐
              │    Worker    │
              │ (publisher.js│
              └──────┬───────┘
                     │
                     ▼
              ┌──────────────┐
              │  Meta Graph  │
              │     API      │
              └──────────────┘
```

---

## 🚀 Deploy a Producción

### 1. Configurar Redis en Producción

Opciones:
- **Upstash Redis**: https://upstash.com (Recomendado para Cloudflare)
- **Redis Cloud**: https://redis.com/cloud
- **AWS ElastiCache**: Para AWS
- **DigitalOcean Managed Redis**: Para DO

### 2. Variables de Entorno en Cloudflare

```bash
# Agregar secrets a Cloudflare Pages
wrangler pages secret put REDIS_URL
wrangler pages secret put ENCRYPTION_KEY
wrangler pages secret put INTERNAL_API_SECRET
```

### 3. Deploy Worker

El worker debe ejecutarse como servicio separado:
- **Cloudflare Workers Cron** (limitado)
- **Servidor Node.js** (VPS/Cloud)
- **Docker container** (cualquier cloud)

---

## 📚 Referencias

- BullMQ Docs: https://docs.bullmq.io
- Meta Graph API: https://developers.facebook.com/docs/graph-api
- Redis Docs: https://redis.io/docs

---

## ❓ FAQ

**P: ¿Puedo usar otro sistema de colas?**
R: Sí, pero tendrías que reescribir queue.js y el worker. BullMQ es el más robusto para Node.js.

**P: ¿Cómo escalo el worker?**
R: Puedes correr múltiples instancias del worker. BullMQ distribuye los jobs automáticamente.

**P: ¿Necesito Redis obligatoriamente?**
R: Sí, BullMQ requiere Redis. Pero es muy ligero y fácil de configurar.

**P: ¿Funciona con TikTok/Twitter/etc?**
R: Necesitas implementar publishers específicos para cada plataforma en `lib/publishers/`.

---

## 🆘 Soporte

Si tienes problemas, revisa:
1. Logs del servidor: `pm2 logs automatizai`
2. Logs del worker: consola donde ejecutas `npm run worker`
3. Redis: `redis-cli monitor`
4. Base de datos: `npm run db:console:local`
