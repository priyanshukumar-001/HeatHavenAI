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
 * @returns {'water' | 'shade' | 'rest' | 'capability' | 'safety_advice' | 'emergency_sos' | 'general_chat'}
 */
export function extractFallbackIntent(query = '') {
  const q = query.toLowerCase();

  // Emergency / Distress
  if (q.includes('sos') || q.includes('ambulance') || q.includes('emergency') || q.includes('behos') || q.includes('unconscious') || q.includes('108') || q.includes('heart') || q.includes('chhati')) {
    return 'emergency_sos';
  }

  // Capability & Introductions
  if (q.includes('what can you do') || q.includes('what can u do') || q.includes('who are you') || q.includes('features') || q.includes('help me') || q.includes('kya kar sakte') || q.includes('kaun ho') || q.includes('capabilities') || q.includes('commands')) {
    return 'capability';
  }

  // Heat Safety & Medical/Hydration tips
  if (q.includes('ors') || q.includes('safety') || q.includes('dizziness') || q.includes('chakkar') || q.includes('cramps') || q.includes('doctor') || q.includes('prevent') || q.includes('symptom') || q.includes('precautions') || q.includes('bache')) {
    return 'safety_advice';
  }

  // Weather / Temperature
  if (q.includes('temperature') || q.includes('how hot') || q.includes('kitni garmi') || q.includes('mausam') || q.includes('weather') || q.includes('aqi') || q.includes('uv index')) {
    return 'weather_heat';
  }

  // Shade
  if (q.includes('chhaon') || q.includes('chhao') || q.includes('shade') || q.includes('dhoop') || q.includes('tree') || q.includes('ped') || q.includes('shelter') || q.includes('canopy')) {
    return 'shade';
  }

  // Rest
  if (q.includes('baith') || q.includes('rest') || q.includes('seat') || q.includes('bench') || q.includes('thak') || q.includes('aaram') || q.includes('relax')) {
    return 'rest';
  }

  // Water
  if (q.includes('pani') || q.includes('paani') || q.includes('water') || q.includes('pyas') || q.includes('chilled') || q.includes('matka') || q.includes('tap') || q.includes('drink') || q.includes('peena')) {
    return 'water';
  }

  // Greeting
  if (q.includes('hello') || q.includes('hi') || q.includes('hey') || q.includes('namaste') || q.includes('pranam') || q.includes('good morning') || q.includes('good afternoon')) {
    return 'general_chat';
  }

  return 'water';
}

/**
 * Extract user intent using Gemini API or keyword fallback
 * @param {string} query 
 * @returns {Promise<'water' | 'shade' | 'rest' | 'capability' | 'safety_advice' | 'emergency_sos' | 'weather_heat' | 'general_chat'>}
 */
export async function extractIntent(query) {
  const client = getAiClient();
  if (!client) {
    return extractFallbackIntent(query);
  }

  try {
    const prompt = `Classify this user request into exactly one category:
- "water": Asking for drinking water, cold water, water kiosk, matka, or tap.
- "shade": Asking for shade, tree canopies, bus stop shelter, escaping direct sun.
- "rest": Asking for a place to sit, benches, cooling rest zones, tired/taking a break.
- "capability": Asking what the AI can do, what features exist, who you are, or how to use the app.
- "safety_advice": Asking for heat safety tips, hydration guidance, ORS recipe, medical symptoms, heat stroke prevention.
- "emergency_sos": Medical emergency, fainting, heat stroke, ambulance, 108.
- "weather_heat": Asking about current temperature, heat levels, heat wave alerts, weather forecast.
- "general_chat": Greetings, pleasantries, questions about life, thank you.

User query: "${query}"

Respond ONLY with a JSON object: {"intent": "water" | "shade" | "rest" | "capability" | "safety_advice" | "emergency_sos" | "weather_heat" | "general_chat"}`;

    const response = await client.models.generateContent({
      model: ENV.GEMINI_MODEL,
      contents: prompt,
      config: {
        responseMimeType: 'application/json'
      }
    });

    const parsed = JSON.parse(response.text.trim());
    const validIntents = ['water', 'shade', 'rest', 'capability', 'safety_advice', 'emergency_sos', 'weather_heat', 'general_chat'];
    if (validIntents.includes(parsed.intent)) {
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
      reply: formatTemplateReply({ intent, spots, lang, query }),
      source: 'template'
    };
  }

  try {
    const isReliefQuery = ['water', 'shade', 'rest'].includes(intent);
    const spotSummaries = (spots && spots.length > 0)
      ? spots.slice(0, 3).map((s) => `• ${s.name} (${s.distanceM}m away, Category: ${s.category}, Trust: ${s.trustScore}/100)`).join('\n')
      : 'None nearby in current walking radius.';

    const systemPrompt = `You are HeatHaven AI, an intelligent, empathetic, and proactive real-time urban heat relief concierge for outdoor workers (Zomato/Swiggy riders, street vendors, laborers) and daily commuters in Delhi-NCR, India.

User query: "${query}"
Intent: ${intent}
Language: ${lang === 'hi' ? 'conversational Hindi/Hinglish (Devanagari or Romanized according to what user typed)' : 'clear, concise English'}.

Response Guidelines:
1. If the user asks what you can do ("what can you do", "who are you", "help", "features"):
   - Clearly and warmly explain your core capabilities in 3-4 bullet points:
     • 💧 Real-time chilled drinking water & matka kiosks locator
     • 🌳 High-shade corridors & tree canopies to escape extreme sun
     • 🪑 Public rest benches & cooling waiting areas
     • 🚑 1-Tap Heatstroke Emergency SOS (108 Helpline)
     • ☀️ Live Heat Index & personalized hydration tips
   - Invite them to ask: "Paas mein thanda paani kahan hai?" or "Shade spot batao".
   - DO NOT claim to show a cooling spot when they asked about capabilities.

2. If the user is asking for drinking water, shade, or rest:
   - Nearby verified spots available:
${spotSummaries}
   - Clearly name the closest spot and state its exact distance in meters.
   - Keep it concise (2-3 sentences max) with practical walking guidance.

3. If the user asks for heat safety, ORS, heat exhaustion, or health precautions:
   - Provide medically sound advice: drinking 250ml water every 20-30 min, ORS preparation, taking shade breaks between 12-4 PM, and recognizing heat exhaustion symptoms.

4. If user greets or says hello:
   - Reply warmly, ask how they are holding up in the heat, and ask if they need drinking water, shade, or a place to rest right now.

5. Tone: Respectful, helpful, proactive, and natural. NEVER repeat robotic boilerplate sentences.`;

    const response = await client.models.generateContent({
      model: ENV.GEMINI_MODEL,
      contents: systemPrompt
    });

    const reply = response.text ? response.text.trim() : formatTemplateReply({ intent, spots, lang, query });
    return { reply, source: 'gemini' };
  } catch (err) {
    console.error('generateConciergeReply error:', err?.message || err);
    return {
      reply: formatTemplateReply({ intent, spots, lang, query }),
      source: 'template'
    };
  }
}

/**
 * Generate personalized heat safety advice using Gemini AI or deterministic fallback
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
export function formatTemplateReply({ intent, spots = [], lang = 'hi', query = '' }) {
  if (intent === 'capability') {
    return lang === 'hi'
      ? 'मैं HeatHaven AI हूँ! मैं आपको नज़दीकी ठंडा पानी, पेड़ की छांव, बैठने की जगह, और हीटवेव एडवाइज़री प्रदान कर सकता हूँ। पूछिए: "पास में पानी कहाँ है?"'
      : 'I am HeatHaven AI! I help you find nearby drinking water kiosks, tree shade, resting benches, and heatwave safety advisories. Ask: "Where is cold water near me?"';
  }

  if (intent === 'safety_advice') {
    return lang === 'hi'
      ? 'गर्मी से बचाव के लिए हर 20-30 मिनट में पानी या ORS पिएं। दोपहर 12 से 4 बजे सीधी धूप से बचें और सिर ढककर रखें।'
      : 'Stay protected: Drink water or ORS every 20-30 minutes, avoid direct sun between 12-4 PM, and keep your head covered.';
  }

  if (intent === 'emergency_sos') {
    return lang === 'hi'
      ? '🚨 आपातकालीन स्थिति: यदि किसी को चक्कर या बेहोशी आ रही है, तो तुरंत 108 एम्बुलेंस पर कॉल करें और उन्हें छांव में लिटाएं।'
      : '🚨 Emergency: If someone has severe heat stroke or dizziness, call 108 immediately and move them into deep shade.';
  }

  if (intent === 'general_chat') {
    return lang === 'hi'
      ? 'नमस्ते! मैं आपकी क्या सहायता कर सकता हूँ? क्या आपको ठंडा पानी, छांव या बैठने की जगह चाहिए?'
      : 'Hello! How can I help you today? Are you looking for drinking water, tree shade, or a resting spot?';
  }

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
