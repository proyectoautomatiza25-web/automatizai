-- Insertar templates de N8N de ejemplo
INSERT OR IGNORE INTO n8n_templates (id, name, description, category, difficulty, icon, preview_image, required_integrations, min_plan) VALUES 
(1, 'Automatización de Email Marketing', 'Envía emails personalizados automáticamente cuando un cliente realiza una compra', 'Marketing', 'Principiante', '📧', 'https://images.unsplash.com/photo-1596526131083-e8c633c948d2?w=400', 'Gmail,Stripe,Google Sheets', 'free'),
(2, 'Bot de WhatsApp Inteligente', 'Responde automáticamente mensajes de WhatsApp con IA y deriva casos complejos', 'Comunicación', 'Intermedio', '💬', 'https://images.unsplash.com/photo-1611746872915-64382b5c76da?w=400', 'WhatsApp,OpenAI,Google Sheets', 'pro'),
(3, 'Sincronización CRM a Sheets', 'Sincroniza automáticamente tus leads desde diferentes fuentes a Google Sheets', 'Productividad', 'Principiante', '📊', 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400', 'Google Sheets,Webhook', 'free'),
(4, 'Generación de Contenido IA', 'Genera contenido para redes sociales con IA y publícalo automáticamente', 'Marketing', 'Avanzado', '🤖', 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400', 'OpenAI,Instagram,Facebook,Twitter', 'enterprise'),
(5, 'Facturación Automática', 'Crea y envía facturas automáticamente cuando se completa una venta', 'Finanzas', 'Intermedio', '💰', 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400', 'Stripe,Gmail,Google Drive', 'pro'),
(6, 'Análisis de Sentimientos', 'Analiza menciones de marca en redes sociales y alertas de crisis', 'Análisis', 'Avanzado', '📈', 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400', 'Twitter,OpenAI,Slack,Google Sheets', 'enterprise'),
(7, 'Lead Scoring Automático', 'Califica leads automáticamente según su comportamiento e interacciones', 'Ventas', 'Intermedio', '🎯', 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=400', 'HubSpot,Google Analytics,Slack', 'pro'),
(8, 'Onboarding de Clientes', 'Automatiza el proceso de bienvenida con emails, tareas y recursos', 'Operaciones', 'Principiante', '👋', 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400', 'Gmail,Google Calendar,Notion', 'free'),
(9, 'Extracción de Datos Web', 'Extrae datos de páginas web y actualiza tu base de datos automáticamente', 'Datos', 'Avanzado', '🕷️', 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400', 'HTTP,Google Sheets,PostgreSQL', 'enterprise'),
(10, 'Notificaciones Instagram', 'Recibe alertas en tiempo real de comentarios y mensajes de Instagram', 'Social Media', 'Principiante', '📱', 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400', 'Instagram,Telegram,Slack', 'free');

-- Insertar usuario de prueba (password: Demo123!)
INSERT OR IGNORE INTO users (id, email, password_hash, full_name, subscription_plan, subscription_status) VALUES 
(1, 'demo@automatizai.com', '$2a$10$YourHashedPasswordHere', 'Usuario Demo', 'pro', 'active');
