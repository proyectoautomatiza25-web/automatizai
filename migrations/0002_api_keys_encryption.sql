-- Agregar columnas para encriptación de API keys
ALTER TABLE user_api_keys ADD COLUMN api_key_encrypted TEXT;
ALTER TABLE user_api_keys ADD COLUMN api_key_iv TEXT;
ALTER TABLE user_api_keys ADD COLUMN api_key_auth_tag TEXT;
ALTER TABLE user_api_keys ADD COLUMN account_id TEXT;
ALTER TABLE user_api_keys ADD COLUMN account_avatar TEXT;
ALTER TABLE user_api_keys ADD COLUMN followers_count INTEGER DEFAULT 0;
ALTER TABLE user_api_keys ADD COLUMN status TEXT DEFAULT 'active';
ALTER TABLE user_api_keys ADD COLUMN last_validated DATETIME;

-- Agregar columnas a automatizaciones para publicación
ALTER TABLE automations ADD COLUMN media_urls TEXT;
ALTER TABLE automations ADD COLUMN scheduled_time DATETIME;
ALTER TABLE automations ADD COLUMN published_at DATETIME;
ALTER TABLE automations ADD COLUMN error_message TEXT;
ALTER TABLE automations ADD COLUMN post_url TEXT;
ALTER TABLE automations ADD COLUMN platform_post_id TEXT;

-- Crear índice para búsquedas por fecha programada
CREATE INDEX IF NOT EXISTS idx_automations_scheduled_time ON automations(scheduled_time);
CREATE INDEX IF NOT EXISTS idx_automations_status ON automations(status);
