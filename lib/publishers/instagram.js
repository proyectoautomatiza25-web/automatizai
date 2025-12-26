import axios from 'axios';

const GRAPH_API_URL = 'https://graph.facebook.com/v18.0';

/**
 * Validar token de Instagram y obtener info de la cuenta
 * @param {string} accessToken - Token de acceso
 * @returns {Promise<object>} Información de la cuenta
 */
export async function validateInstagramToken(accessToken) {
  try {
    // 1. Obtener ID del usuario
    const meResponse = await axios.get(`${GRAPH_API_URL}/me`, {
      params: { access_token: accessToken }
    });
    
    const userId = meResponse.data.id;
    
    // 2. Obtener cuentas de Instagram vinculadas
    const accountsResponse = await axios.get(`${GRAPH_API_URL}/${userId}/accounts`, {
      params: {
        access_token: accessToken,
        fields: 'instagram_business_account'
      }
    });
    
    if (!accountsResponse.data.data || accountsResponse.data.data.length === 0) {
      throw new Error('No se encontró cuenta de Instagram Business vinculada');
    }
    
    const igAccountId = accountsResponse.data.data[0].instagram_business_account.id;
    
    // 3. Obtener información de la cuenta de Instagram
    const igInfoResponse = await axios.get(`${GRAPH_API_URL}/${igAccountId}`, {
      params: {
        access_token: accessToken,
        fields: 'username,profile_picture_url,followers_count,media_count'
      }
    });
    
    return {
      valid: true,
      accountId: igAccountId,
      accountInfo: {
        username: igInfoResponse.data.username,
        avatar: igInfoResponse.data.profile_picture_url,
        followers: igInfoResponse.data.followers_count,
        mediaCount: igInfoResponse.data.media_count
      }
    };
  } catch (error) {
    console.error('Error validando token de Instagram:', error.response?.data || error.message);
    return {
      valid: false,
      error: error.response?.data?.error?.message || error.message
    };
  }
}

/**
 * Subir media a Instagram (paso 1)
 * @param {string} accessToken - Token de acceso
 * @param {string} igAccountId - ID de la cuenta de Instagram
 * @param {string} imageUrl - URL de la imagen
 * @param {string} caption - Pie de foto
 * @returns {Promise<string>} ID del contenedor de media
 */
async function uploadMedia(accessToken, igAccountId, imageUrl, caption) {
  try {
    const response = await axios.post(`${GRAPH_API_URL}/${igAccountId}/media`, {
      image_url: imageUrl,
      caption: caption,
      access_token: accessToken
    });
    
    return response.data.id;
  } catch (error) {
    console.error('Error subiendo media a Instagram:', error.response?.data || error.message);
    throw new Error(`Error al subir media: ${error.response?.data?.error?.message || error.message}`);
  }
}

/**
 * Publicar media en Instagram (paso 2)
 * @param {string} accessToken - Token de acceso
 * @param {string} igAccountId - ID de la cuenta de Instagram
 * @param {string} creationId - ID del contenedor de media
 * @returns {Promise<string>} ID de la publicación
 */
async function publishMedia(accessToken, igAccountId, creationId) {
  try {
    const response = await axios.post(`${GRAPH_API_URL}/${igAccountId}/media_publish`, {
      creation_id: creationId,
      access_token: accessToken
    });
    
    return response.data.id;
  } catch (error) {
    console.error('Error publicando en Instagram:', error.response?.data || error.message);
    throw new Error(`Error al publicar: ${error.response?.data?.error?.message || error.message}`);
  }
}

/**
 * Publicar post completo en Instagram
 * @param {string} accessToken - Token de acceso
 * @param {string} igAccountId - ID de la cuenta de Instagram
 * @param {string} content - Texto del post
 * @param {string} imageUrl - URL de la imagen
 * @returns {Promise<object>} Resultado de la publicación
 */
export async function publishInstagramPost(accessToken, igAccountId, content, imageUrl) {
  try {
    // Paso 1: Subir media
    const creationId = await uploadMedia(accessToken, igAccountId, imageUrl, content);
    
    // Esperar 3 segundos (Instagram necesita tiempo para procesar)
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Paso 2: Publicar
    const postId = await publishMedia(accessToken, igAccountId, creationId);
    
    return {
      success: true,
      postId,
      postUrl: `https://www.instagram.com/p/${postId}/`
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Obtener estadísticas de un post de Instagram
 * @param {string} accessToken - Token de acceso
 * @param {string} mediaId - ID del post
 * @returns {Promise<object>} Estadísticas del post
 */
export async function getInstagramPostStats(accessToken, mediaId) {
  try {
    const response = await axios.get(`${GRAPH_API_URL}/${mediaId}`, {
      params: {
        access_token: accessToken,
        fields: 'like_count,comments_count,timestamp,permalink'
      }
    });
    
    return {
      likes: response.data.like_count,
      comments: response.data.comments_count,
      timestamp: response.data.timestamp,
      url: response.data.permalink
    };
  } catch (error) {
    console.error('Error obteniendo stats de Instagram:', error.response?.data || error.message);
    return null;
  }
}
