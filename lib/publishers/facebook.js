import axios from 'axios';

const GRAPH_API_URL = 'https://graph.facebook.com/v18.0';

/**
 * Validar token de Facebook y obtener info de la página
 * @param {string} accessToken - Token de acceso
 * @returns {Promise<object>} Información de la página
 */
export async function validateFacebookToken(accessToken) {
  try {
    // 1. Obtener ID del usuario
    const meResponse = await axios.get(`${GRAPH_API_URL}/me`, {
      params: { access_token: accessToken }
    });
    
    const userId = meResponse.data.id;
    
    // 2. Obtener páginas del usuario
    const pagesResponse = await axios.get(`${GRAPH_API_URL}/${userId}/accounts`, {
      params: {
        access_token: accessToken,
        fields: 'name,picture,fan_count'
      }
    });
    
    if (!pagesResponse.data.data || pagesResponse.data.data.length === 0) {
      throw new Error('No se encontró ninguna página de Facebook asociada');
    }
    
    // Usar la primera página
    const page = pagesResponse.data.data[0];
    
    return {
      valid: true,
      accountId: page.id,
      pageAccessToken: page.access_token, // Token específico de la página
      accountInfo: {
        username: page.name,
        avatar: page.picture?.data?.url || '',
        followers: page.fan_count || 0
      }
    };
  } catch (error) {
    console.error('Error validando token de Facebook:', error.response?.data || error.message);
    return {
      valid: false,
      error: error.response?.data?.error?.message || error.message
    };
  }
}

/**
 * Publicar foto en página de Facebook
 * @param {string} pageAccessToken - Token de la página
 * @param {string} pageId - ID de la página
 * @param {string} content - Texto del post
 * @param {string} imageUrl - URL de la imagen
 * @returns {Promise<object>} Resultado de la publicación
 */
export async function publishFacebookPost(pageAccessToken, pageId, content, imageUrl) {
  try {
    const params = {
      message: content,
      access_token: pageAccessToken
    };
    
    // Si hay imagen, usar endpoint de photos
    if (imageUrl) {
      params.url = imageUrl;
      
      const response = await axios.post(`${GRAPH_API_URL}/${pageId}/photos`, params);
      
      return {
        success: true,
        postId: response.data.post_id || response.data.id,
        postUrl: `https://www.facebook.com/${response.data.post_id || response.data.id}`
      };
    } else {
      // Si no hay imagen, usar endpoint de feed
      const response = await axios.post(`${GRAPH_API_URL}/${pageId}/feed`, params);
      
      return {
        success: true,
        postId: response.data.id,
        postUrl: `https://www.facebook.com/${response.data.id}`
      };
    }
  } catch (error) {
    console.error('Error publicando en Facebook:', error.response?.data || error.message);
    return {
      success: false,
      error: error.response?.data?.error?.message || error.message
    };
  }
}

/**
 * Obtener estadísticas de un post de Facebook
 * @param {string} accessToken - Token de acceso
 * @param {string} postId - ID del post
 * @returns {Promise<object>} Estadísticas del post
 */
export async function getFacebookPostStats(accessToken, postId) {
  try {
    const response = await axios.get(`${GRAPH_API_URL}/${postId}`, {
      params: {
        access_token: accessToken,
        fields: 'shares,likes.summary(true),comments.summary(true),created_time,permalink_url'
      }
    });
    
    return {
      likes: response.data.likes?.summary?.total_count || 0,
      comments: response.data.comments?.summary?.total_count || 0,
      shares: response.data.shares?.count || 0,
      timestamp: response.data.created_time,
      url: response.data.permalink_url
    };
  } catch (error) {
    console.error('Error obteniendo stats de Facebook:', error.response?.data || error.message);
    return null;
  }
}

/**
 * Programar post en Facebook (usando Graph API Scheduling)
 * @param {string} pageAccessToken - Token de la página
 * @param {string} pageId - ID de la página
 * @param {string} content - Texto del post
 * @param {Date} scheduledTime - Fecha/hora de publicación
 * @param {string} imageUrl - URL de la imagen (opcional)
 * @returns {Promise<object>} Resultado
 */
export async function scheduleFacebookPost(pageAccessToken, pageId, content, scheduledTime, imageUrl) {
  try {
    const timestamp = Math.floor(new Date(scheduledTime).getTime() / 1000);
    
    const params = {
      message: content,
      published: false,
      scheduled_publish_time: timestamp,
      access_token: pageAccessToken
    };
    
    if (imageUrl) {
      params.url = imageUrl;
      const response = await axios.post(`${GRAPH_API_URL}/${pageId}/photos`, params);
      
      return {
        success: true,
        postId: response.data.id,
        message: 'Post programado exitosamente en Facebook'
      };
    } else {
      const response = await axios.post(`${GRAPH_API_URL}/${pageId}/feed`, params);
      
      return {
        success: true,
        postId: response.data.id,
        message: 'Post programado exitosamente en Facebook'
      };
    }
  } catch (error) {
    console.error('Error programando post en Facebook:', error.response?.data || error.message);
    return {
      success: false,
      error: error.response?.data?.error?.message || error.message
    };
  }
}
