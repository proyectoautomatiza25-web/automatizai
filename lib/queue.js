import { Queue } from 'bullmq';
import { getRedisConnection } from './redis.js';

let queueInstance = null;

/**
 * Obtener instancia de la cola de publicaciones (singleton)
 * @returns {Queue} Instancia de BullMQ Queue
 */
export function getSocialPostsQueue() {
  if (queueInstance) {
    return queueInstance;
  }

  const connection = getRedisConnection();
  
  queueInstance = new Queue('social-posts', {
    connection,
    defaultJobOptions: {
      attempts: 3,
      backoff: {
        type: 'exponential',
        delay: 5000
      },
      removeOnComplete: {
        count: 100, // Mantener últimos 100 completados
        age: 7 * 24 * 3600 // 7 días
      },
      removeOnFail: {
        age: 30 * 24 * 3600 // 30 días
      }
    }
  });

  console.log('✅ Cola BullMQ inicializada');

  return queueInstance;
}

/**
 * Agregar job de publicación a la cola
 * @param {object} postData - Datos del post
 * @param {Date} scheduledTime - Fecha/hora de publicación
 * @returns {Promise<object>} Job creado
 */
export async function addPublishJob(postData, scheduledTime) {
  const queue = getSocialPostsQueue();
  
  const delay = calculateDelay(scheduledTime);
  
  const job = await queue.add('publish', postData, {
    delay,
    jobId: `post-${postData.postId}` // ID único para evitar duplicados
  });

  console.log(`📅 Post programado: ${postData.postId} para ${scheduledTime}`);
  
  return job;
}

/**
 * Cancelar job de publicación
 * @param {string} postId - ID del post
 * @returns {Promise<boolean>} true si se canceló
 */
export async function cancelPublishJob(postId) {
  const queue = getSocialPostsQueue();
  const jobId = `post-${postId}`;
  
  try {
    const job = await queue.getJob(jobId);
    if (job) {
      await job.remove();
      console.log(`🗑️ Job cancelado: ${postId}`);
      return true;
    }
    return false;
  } catch (error) {
    console.error(`Error cancelando job ${postId}:`, error);
    return false;
  }
}

/**
 * Calcular delay en milisegundos hasta la fecha programada
 * @param {Date|string} scheduledTime - Fecha de publicación
 * @returns {number} Delay en ms
 */
function calculateDelay(scheduledTime) {
  const now = Date.now();
  const scheduled = new Date(scheduledTime).getTime();
  const delay = scheduled - now;
  
  // Mínimo 0 (publicar inmediatamente si ya pasó la fecha)
  return Math.max(0, delay);
}

/**
 * Obtener estadísticas de la cola
 * @returns {Promise<object>} Estadísticas
 */
export async function getQueueStats() {
  const queue = getSocialPostsQueue();
  
  const [waiting, active, completed, failed, delayed] = await Promise.all([
    queue.getWaitingCount(),
    queue.getActiveCount(),
    queue.getCompletedCount(),
    queue.getFailedCount(),
    queue.getDelayedCount()
  ]);
  
  return {
    waiting,
    active,
    completed,
    failed,
    delayed,
    total: waiting + active + completed + failed + delayed
  };
}
