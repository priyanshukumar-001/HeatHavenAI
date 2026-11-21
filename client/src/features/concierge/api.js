import { apiRequest } from '../../lib/apiClient.js';

/**
 * Send query to bilingual AI Concierge
 * @param {Object} params
 * @param {string} params.query
 * @param {number} params.lat
 * @param {number} params.lng
 * @param {'hi' | 'en'} [params.lang='hi']
 */
export async function askConcierge({ query, lat, lng, lang = 'hi' }) {
  return apiRequest('/ai/concierge', {
    method: 'POST',
    body: JSON.stringify({ query, lat, lng, lang })
  });
}

