import { GoogleGenAI } from '@google/genai';
import { ENV } from '../config/env.js';

let aiClient = null;

function getAiClient() {
  if (!aiClient && ENV.GEMINI_API_KEY) {
    try {
      aiClient = new GoogleGenAI({ apiKey: ENV.GEMINI_API_KEY });
    } catch {
      aiClient = null;
    }
  }
  return aiClient;
}

/**
 * Keyword-based fallback for intent extraction when AI is offline
 * @param {string} query 
 * @returns {'water' | 'shade' | 'rest'}
 */
export function extractFallbackIntent(query = '') {
  const q = query.toLowerCase();
  if (q.includes('chhaon') || q.includes('chhao') || q.includes('shade') || q.includes('dhoop') || q.includes('tree') || q.includes('ped')) {
    return 'shade';
  }
  if (q.includes('baith') || q.includes('rest') || q.includes('seat') || q.includes('bench') || q.includes('thak') || q.includes('aaram')) {
    return 'rest';
  }
  return 'water';
}

/**
 * Extract user relief intent using Gemini API or keyword fallback
 * @param {string} query 
 * @returns {Promise<'water' | 'shade' | 'rest'>}
 */
export async function extractIntent(query) {
  const client = getAiClient();
  if (!client) {
    return extractFallbackIntent(query);
  }

  try {
    const prompt = `Classify this user request into exactly one category: "water", "shade", or "rest".
User request: "${query}"
Respond ONLY with a JSON object: {"intent": "water" | "shade" | "rest"}`;

    const response = await client.models.generateContent({
      model: ENV.GEMINI_MODEL,
      contents: prompt,
      config: {
        responseMimeType: 'application/json'
      }
    });

    const parsed = JSON.parse(response.text.trim());
    if (['water', 'shade', 'rest'].includes(parsed.intent)) {
      return parsed.intent;
    }
    return extractFallbackIntent(query);
  } catch {
    return extractFallbackIntent(query);
  }
}

/**
 * Generate conversational response in Hindi or English using Gemini or template
 * @param {Object} params
 * @param {string} params.query
 * @param {string} params.intent
 * @param {Array} params.spots
 * @param {'hi' | 'en'} params.lang
 * @returns {Promise<{ reply: string, source: 'gemini' | 'template' }>}
 */
export async function generateConciergeReply({ query, intent, spots = [], lang = 'hi' }) {
  const client = getAiClient();

  // If no Gemini client, use deterministic template reply
  if (!client) {
    return {
      reply: formatTemplateReply({ intent, spots, lang }),
      source: 'template'
    };
  }

  try {
    const spotSummaries = spots.length > 0
      ? spots.slice(0, 3).map((s) => `${s.name} (${s.distanceM}m away, trust: ${s.trustScore}/100)`).join(', ')
      : 'None nearby within walking radius.';

    const systemPrompt = `You are HeatHaven AI, a helpful, respectful, and empathetic emergency heat relief assistant for outdoor workers and citizens navigating extreme summer heat in Delhi-NCR and Kanpur, India.
User language: ${lang === 'hi' ? 'conversational Hindi/Hinglish' : 'English'}.
Keep the reply concise (max 2 short sentences).
${spots.length > 0 ? `Nearby verified spots: ${spotSummaries}. Mention the closest spot and distance clearly.` : 'If no spots are nearby or user is just saying hello/asking general questions, politely greet them and ask if they are looking for drinking water, shade, or a place to rest.'}
User asked: "${query}"`;

    const response = await client.models.generateContent({
      model: ENV.GEMINI_MODEL,
      contents: systemPrompt
    });

    const reply = response.text ? response.text.trim() : formatTemplateReply({ intent, spots, lang });
    return { reply, source: 'gemini' };
  } catch (err) {
    console.error('generateConciergeReply catch error:', err?.message || err);
    return {
      reply: formatTemplateReply({ intent, spots, lang }),
      source: 'template'
    };
  }
}

/**
 * Generate personalized heat safety advice using Gemini AI or deterministic fallback
 * @param {Object} params
 * @param {number} params.temp - Current apparent temperature in °C
 * @param {number} params.humidity - Relative humidity percentage
 * @param {string} [params.role='outdoor_worker'] - Worker role
 * @param {string} [params.location='Delhi NCR'] - Location name
 * @param {'hi' | 'en'} [params.lang='en'] - Response language
 * @returns {Promise<{ advice: string, riskLevel: string, source: 'gemini' | 'fallback' }>}
 */
export async function getAIHeatAdvisor({ temp = 42, humidity = 30, role = 'outdoor_worker', location = 'Delhi NCR', lang = 'en' }) {
  const riskLevel = temp >= 46 ? 'extreme' : temp >= 42 ? 'danger' : temp >= 38 ? 'warning' : 'moderate';

  const client = getAiClient();
  if (!client) {
    return {
      advice: getHeatAdvisorFallback({ temp, riskLevel, lang }),
      riskLevel,
      source: 'fallback'
    };
  }

  try {
    const prompt = `You are HeatHaven AI, a heat safety advisor for Indian outdoor workers.
Current conditions: Apparent temperature ${temp}°C, humidity ${humidity}%, location ${location}.
Worker role: ${role}. Risk level: ${riskLevel}.
Language: ${lang === 'hi' ? 'Hindi / Hinglish' : 'English'}.

Give 3 specific, actionable safety tips in 2-3 short sentences total. Mention ORS, shade timing, and hydration. Be concise and practical.`;

    const response = await client.models.generateContent({
      model: ENV.GEMINI_MODEL,
      contents: prompt
    });

    const advice = response.text ? response.text.trim() : getHeatAdvisorFallback({ temp, riskLevel, lang });
    return { advice, riskLevel, source: 'gemini' };
  } catch {
    return {
      advice: getHeatAdvisorFallback({ temp, riskLevel, lang }),
      riskLevel,
      source: 'fallback'
    };
  }
}

/**
 * Deterministic fallback for heat safety advice (SPEC Section 5.3)
 */
function getHeatAdvisorFallback({ temp, riskLevel, lang }) {
  if (lang === 'hi') {
    if (riskLevel === 'extreme') {
      return `⚠️ भीषण लू चेतावनी (${temp}°C)! बाहर निकलना टालें। हर 20 मिनट में ORS/नमक-चीनी का पानी पिएं। गीला गमछा सिर पर रखें।`;
    }
    if (riskLevel === 'danger') {
      return `🔥 खतरनाक गर्मी (${temp}°C)। दोपहर 12-4 बजे छांव में रहें। हर 30 मिनट पानी पिएं। सिर ढककर रखें।`;
    }
    return `☀️ गर्मी से सावधान (${temp}°C)। पानी पीते रहें, टोपी/गमछा पहनें, धूप में ज्यादा देर न रहें।`;
  }

  if (riskLevel === 'extreme') {
    return `⚠️ Extreme heat alert (${temp}°C)! Avoid outdoor exposure. Drink ORS/electrolyte water every 20 min. Keep a wet cloth on your head.`;
  }
  if (riskLevel === 'danger') {
    return `🔥 Dangerous heat (${temp}°C). Stay in shade between 12-4 PM. Drink water every 30 min. Keep head covered.`;
  }
  return `☀️ Heat advisory (${temp}°C). Stay hydrated, wear a cap/gamcha, limit sun exposure.`;
}

/**
 * Generate deterministic template reply (SPEC Section 5.6)
 */
export function formatTemplateReply({ intent, spots = [], lang = 'hi' }) {
  if (spots.length === 0) {
    return lang === 'hi'
      ? 'माफ़ कीजिए, आपके नज़दीक अभी कोई वेरीफाइड स्पॉट नहीं मिला।'
      : 'Sorry, no verified relief spots found in this area.';
  }

  const top1 = spots[0];
  const top2 = spots[1];

  const categoryName = {
    water: lang === 'hi' ? 'ठंडा पानी' : 'water',
    shade: lang === 'hi' ? 'छांव' : 'shade',
    rest: lang === 'hi' ? 'बैठने की जगह' : 'resting spot'
  }[intent] || 'राहत';

  if (lang === 'hi') {
    if (top2) {
      return `सबसे पास ${categoryName} "${top1.name}" पर है (${top1.distanceM}m दूर), और दूसरा विकल्प "${top2.name}" (${top2.distanceM}m) है।`;
    }
    return `सबसे नज़दीकी ${categoryName} "${top1.name}" पर उपलब्ध है (${top1.distanceM}m दूर)।`;
  }

  if (top2) {
    return `Closest ${categoryName} is at "${top1.name}" (${top1.distanceM}m away), followed by "${top2.name}" (${top2.distanceM}m).`;
  }
  return `Nearest ${categoryName} is available at "${top1.name}" (${top1.distanceM}m away).`;
}

export default {
  extractIntent,
  extractFallbackIntent,
  generateConciergeReply,
  getAIHeatAdvisor,
  formatTemplateReply
};
