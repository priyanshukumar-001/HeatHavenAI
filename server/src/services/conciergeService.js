import { extractIntent, generateConciergeReply } from './geminiService.js';
import { getNearbySpots } from './spotService.js';
import { cache } from '../utils/cache.js';

/**
 * Handle user concierge query through Gemini + geo query pipeline with smart caching
 * @param {Object} params
 * @param {string} params.query
 * @param {number} params.lat
 * @param {number} params.lng
 * @param {'hi' | 'en'} [params.lang='hi']
 * @returns {Promise<{ intent: string, reply: string, spots: Array, source: 'gemini' | 'template' }>}
 */
export async function processConciergeQuery({ query, lat, lng, lang = 'hi' }) {
  // 1. Extract Intent
  const intent = await extractIntent(query);

  const isReliefSpotQuery = ['water', 'shade', 'rest'].includes(intent);

  // 2. Compute Cache Key (Only cache spot lookups by normalized query + grid cell)
  const cellLat = (Math.round(lat * 200) / 200).toFixed(3);
  const cellLng = (Math.round(lng * 200) / 200).toFixed(3);
  const normalizedQuery = query.toLowerCase().trim().replace(/[^a-z0-9]/g, '');
  const cacheKey = isReliefSpotQuery
    ? `concierge_${intent}_${normalizedQuery}_${cellLat}_${cellLng}_${lang}`
    : null;

  if (cacheKey) {
    const cached = cache.get(cacheKey);
    if (cached) {
      return { ...cached, isCached: true };
    }
  }

  // 3. Geo Query: Only query spots if user is actually looking for relief spots!
  let topSpots = [];
  if (isReliefSpotQuery) {
    try {
      let nearbyData = await getNearbySpots({
        lat,
        lng,
        radius: 2000,
        category: intent
      });

      topSpots = (nearbyData.spots || []).slice(0, 3);

      // If no spots within 2km, search wider area (e.g. outer NCR)
      if (topSpots.length === 0) {
        nearbyData = await getNearbySpots({
          lat,
          lng,
          radius: 50000,
          category: intent
        });
        topSpots = (nearbyData.spots || []).slice(0, 3);
      }

      // If still none in category, search any category
      if (topSpots.length === 0) {
        nearbyData = await getNearbySpots({
          lat,
          lng,
          radius: 50000
        });
        topSpots = (nearbyData.spots || []).slice(0, 3);
      }
    } catch {
      topSpots = [];
    }
  }

  // 4. Generate Short Hindi/English Reply using Gemini
  const replyData = await generateConciergeReply({
    query,
    intent,
    spots: topSpots,
    lang
  });

  const result = {
    intent,
    reply: replyData.reply,
    spots: topSpots,
    source: replyData.source
  };

  // Cache spot results for 10 minutes
  if (cacheKey) {
    cache.set(cacheKey, result, 10);
  }

  return result;
}

export default { processConciergeQuery };
