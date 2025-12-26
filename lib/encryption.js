import crypto from 'crypto';

const ALGORITHM = 'aes-256-gcm';

// Generar key desde ENCRYPTION_KEY env var
// En producción, usar: crypto.randomBytes(32).toString('hex')
function getKey() {
  const envKey = process.env.ENCRYPTION_KEY;
  if (!envKey) {
    throw new Error('ENCRYPTION_KEY no está configurada');
  }
  
  // Si es hex, convertir a buffer
  if (envKey.length === 64) {
    return Buffer.from(envKey, 'hex');
  }
  
  // Si es string, hacer hash para obtener 32 bytes
  return crypto.createHash('sha256').update(envKey).digest();
}

/**
 * Encriptar texto con AES-256-GCM
 * @param {string} text - Texto a encriptar
 * @returns {object} { encrypted, iv, authTag }
 */
export function encrypt(text) {
  const KEY = getKey();
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(ALGORITHM, KEY, iv);
  
  let encrypted = cipher.update(text, 'utf8', 'base64');
  encrypted += cipher.final('base64');
  
  const authTag = cipher.getAuthTag();
  
  return {
    encrypted,
    iv: iv.toString('base64'),
    authTag: authTag.toString('base64')
  };
}

/**
 * Desencriptar texto con AES-256-GCM
 * @param {object} encryptedData - { encrypted, iv, authTag }
 * @returns {string} Texto desencriptado
 */
export function decrypt({ encrypted, iv, authTag }) {
  const KEY = getKey();
  
  const decipher = crypto.createDecipheriv(
    ALGORITHM,
    KEY,
    Buffer.from(iv, 'base64')
  );
  
  decipher.setAuthTag(Buffer.from(authTag, 'base64'));
  
  let decrypted = decipher.update(encrypted, 'base64', 'utf8');
  decrypted += decipher.final('utf8');
  
  return decrypted;
}

// Generar nueva ENCRYPTION_KEY
export function generateEncryptionKey() {
  return crypto.randomBytes(32).toString('hex');
}
