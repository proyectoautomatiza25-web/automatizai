# AutomatizAI - Plataforma de Automatización con IA

## 🚀 Descripción del Proyecto

AutomatizAI es una plataforma completa de automatización empresarial que integra N8N, inteligencia artificial y múltiples servicios para crear workflows potentes y escalables.

## ✨ Características Implementadas

### 🎨 Frontend
- ✅ Landing page moderna con diseño glassmorphism
- ✅ Animaciones y efectos visuales avanzados
- ✅ Sistema de autenticación (Login/Registro)
- ✅ Dashboard interactivo con estadísticas en tiempo real
- ✅ Galería de templates de N8N con filtros por categoría
- ✅ Gestión segura de API Keys
- ✅ Diseño responsive para móvil, tablet y desktop
- ✅ Sistema de notificaciones toast
- ✅ Gráficas con Chart.js

### 🔧 Backend (Hono Framework)
- ✅ API RESTful completa
- ✅ Sistema de autenticación con tokens
- ✅ CRUD de usuarios
- ✅ Gestión de API keys cifradas
- ✅ CRUD de automatizaciones
- ✅ Sistema de templates de N8N
- ✅ Estadísticas de usuario
- ✅ CORS configurado

### 💾 Base de Datos (Cloudflare D1)
- ✅ Tabla de usuarios con suscripciones
- ✅ Tabla de API keys por usuario
- ✅ Tabla de automatizaciones
- ✅ Tabla de templates de N8N
- ✅ Tabla de sesiones
- ✅ Índices optimizados para rendimiento
- ✅ Migraciones SQL estructuradas

### 🎯 Funcionalidades Principales

1. **Sistema de Usuarios**
   - Registro y login de usuarios
   - Perfiles con planes de suscripción (Free, Pro, Enterprise)
   - Gestión de sesiones

2. **Dashboard de Usuario**
   - Vista general con KPIs
   - Gráficas de ejecuciones
   - Distribución por categorías
   - Automatizaciones recientes

3. **Templates de N8N**
   - 10+ templates pre-configurados
   - Categorías: Marketing, Comunicación, Finanzas, Productividad, etc.
   - Niveles de dificultad (Principiante, Intermedio, Avanzado)
   - Previsualizaciones con imágenes
   - Requisitos de integraciones

4. **Gestión de API Keys**
   - Almacenamiento seguro de claves
   - Soporte para múltiples servicios (OpenAI, WhatsApp, Gmail, etc.)
   - Encriptación en base de datos
   - Interfaz intuitiva para agregar/eliminar

5. **Planes de Suscripción**
   - **Starter (Free)**: 5 automatizaciones, 1K ejecuciones/mes
   - **Pro ($49/mes)**: 50 automatizaciones, 50K ejecuciones/mes
   - **Enterprise ($199/mes)**: Ilimitado

## 🛠️ Stack Tecnológico

- **Framework Backend**: Hono (Cloudflare Workers)
- **Base de Datos**: Cloudflare D1 (SQLite)
- **Frontend**: HTML5 + TailwindCSS + Vanilla JS
- **Gráficas**: Chart.js
- **Iconos**: Font Awesome
- **Deploy**: Cloudflare Pages
- **Dev Server**: Wrangler + PM2

## 📦 Estructura del Proyecto

```
webapp/
├── src/
│   ├── index.tsx           # App principal Hono
│   ├── routes/
│   │   ├── dashboard.tsx   # Vista del dashboard
│   │   ├── templates.tsx   # Vista de templates
│   │   └── api-keys.tsx    # Vista de API keys
├── public/
│   └── static/
│       ├── app.js          # JavaScript global
│       └── styles.css      # Estilos personalizados
├── migrations/
│   └── 0001_initial_schema.sql  # Schema de base de datos
├── ecosystem.config.cjs    # Configuración PM2
├── wrangler.jsonc          # Configuración Cloudflare
├── package.json
└── seed.sql                # Datos de prueba
```

## 🚀 Instalación y Configuración

### 1. Clonar el repositorio (si aplica)
```bash
git clone <tu-repositorio>
cd webapp
```

### 2. Instalar dependencias
```bash
npm install
```

### 3. Configurar Cloudflare D1 (Producción)

**IMPORTANTE**: Necesitas configurar tu API key de Cloudflare primero.

```bash
# Crear base de datos D1 en Cloudflare
npx wrangler d1 create automatizai-production

# Copiar el database_id generado y actualizarlo en wrangler.jsonc
# Buscar la línea: "database_id": "PLACEHOLDER_REPLACE_AFTER_D1_CREATE"
# Reemplazar con el ID generado

# Aplicar migraciones a producción
npm run db:migrate:prod
```

### 4. Desarrollo Local

```bash
# Aplicar migraciones a base de datos local
npm run db:migrate:local

# Insertar datos de prueba (opcional)
npm run db:seed

# Build del proyecto
npm run build

# Iniciar servidor de desarrollo con PM2
npm run clean-port  # Limpiar puerto 3000
pm2 start ecosystem.config.cjs

# Ver logs
pm2 logs automatizai --nostream

# Verificar que funciona
npm run test  # curl http://localhost:3000
```

## 🌐 URLs del Proyecto

### Desarrollo Local
- **App**: http://localhost:3000
- **Dashboard**: http://localhost:3000/dashboard
- **Templates**: http://localhost:3000/dashboard/templates
- **API Keys**: http://localhost:3000/dashboard/api-keys

### Producción (Después del Deploy)
- **App**: https://automatizai.pages.dev
- **Dashboard**: https://automatizai.pages.dev/dashboard

## 📊 Modelos de Datos

### Users
- id, email, password_hash, full_name
- subscription_plan, subscription_status
- subscription_start, subscription_end
- created_at, updated_at

### User API Keys
- id, user_id, service_name
- api_key, api_secret (cifradas)
- created_at, updated_at

### Automations
- id, user_id, name, description
- n8n_workflow_id, workflow_data
- status, executions_count
- last_execution, created_at, updated_at

### N8N Templates
- id, name, description, category
- difficulty, icon, preview_image
- workflow_json, required_integrations
- min_plan, created_at

## 🔐 Seguridad

- ✅ Contraseñas hasheadas (en producción usar bcrypt)
- ✅ API keys cifradas en D1
- ✅ Tokens de sesión
- ✅ CORS configurado
- ✅ Validación de entradas
- ✅ Protección contra SQL injection (prepared statements)

## 📝 Comandos Útiles

```bash
# Desarrollo
npm run dev                 # Servidor Vite (sin D1)
npm run dev:sandbox         # Wrangler con D1 local
npm run build               # Build para producción

# Base de Datos
npm run db:migrate:local    # Migraciones locales
npm run db:migrate:prod     # Migraciones producción
npm run db:seed             # Insertar datos de prueba
npm run db:reset            # Reset completo DB local

# Deploy
npm run deploy              # Deploy a Cloudflare Pages

# Utilidades
npm run clean-port          # Limpiar puerto 3000
npm run test                # Test conexión localhost
npm run git:commit "msg"    # Commit rápido
```

## 🎯 Próximas Funcionalidades

- [ ] Integración real con N8N API
- [ ] Sistema de pagos con Stripe
- [ ] Webhooks para automatizaciones
- [ ] Editor visual de workflows
- [ ] Notificaciones en tiempo real
- [ ] Análisis avanzado de métricas
- [ ] Marketplace de templates
- [ ] API pública para integraciones
- [ ] Sistema de equipos/colaboración
- [ ] Logs detallados de ejecuciones

## 🐛 Bugs Conocidos

Ninguno reportado actualmente.

## 📧 Soporte

Para soporte o preguntas: soporte@automatizai.com

## 📄 Licencia

Propietario - Todos los derechos reservados

## 🙏 Créditos

Desarrollado con ❤️ usando Hono, Cloudflare Workers y mucho café ☕

---

**Última actualización**: Diciembre 2024
**Versión**: 1.0.0
**Estado**: ✅ Funcional - En desarrollo activo
