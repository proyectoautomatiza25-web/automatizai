import Redis from 'ioredis';

let redisConnection = null;

/**
 * Obtener conexión a Redis (singleton)
 * @returns {Redis} Instancia de Redis
 */
export function getRedisConnection() {
  if (redisConnection) {
    return redisConnection;
  }

  const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';
  
  redisConnection = new Redis(redisUrl, {
    maxRetriesPerRequest: null, // Requerido por BullMQ
    enableReadyCheck: false,
    retryStrategy: (times) => {
      const delay = Math.min(times * 50, 2000);
      return delay;
    }
  });

  redisConnection.on('error', (err) => {
    console.error('Redis connection error:', err);
  });

  redisConnection.on('connect', () => {
    console.log('✅ Conectado a Redis');
  });

  return redisConnection;
}

/**
 * Cerrar conexión a Redis
 */
export async function closeRedisConnection() {
  if (redisConnection) {
    await redisConnection.quit();
    redisConnection = null;
  }
}
