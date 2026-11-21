import { extractIntent, generateConciergeReply } from './geminiService.js';
import { getNearbySpots } from './spotService.js';
import { cache } from '../utils/cache.js';

/**
 * Handle user concierge query through Gemini + geo query pipeline with 10m caching
 * @param {Object} params
 * @param {string} params.query
 * @param {number} params.lat
 * @param {number} params.lng
 * @param {'hi' | 'en'} [params.lang='hi']
 * @returns {Promise<{ intent: string, reply: string, spots: Array, source: 'gemini' | 'template' }>}
 */
export async function processConciergeQuery({ query, lat, lng, lang = 'hi' }) {
  // 1. Extract Intent (AI or Keyword Fallback)
  const intent = await extractIntent(query);

  // 2. Compute 500m Grid Cell Key for Caching (SPEC Section 5.6)
  const cellLat = (Math.round(lat * 200) / 200).toFixed(3);
  const cellLng = (Math.round(lng * 200) / 200).toFixed(3);
  const cacheKey = `concierge_${intent}_${cellLat}_${cellLng}_${lang}`;

  const cached = cache.get(cacheKey);
  if (cached) {
    return { ...cached, isCached: true };
  }

  // 3. Geo Query: Check local 2000m radius, fallback to wider 50km radius if needed
  let topSpots = [];
  try {
    let nearbyData = await getNearbySpots({
      lat,
      lng,
      radius: 2000,
      category: intent
    });

    topSpots = (nearbyData.spots || []).slice(0, 3);

    // If no spots within 2km, search wider area (e.g. Kanpur or outer NCR)
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

  // Cache for 10 minutes
  cache.set(cacheKey, result, 10);

  return result;
}

export default { processConciergeQuery };
