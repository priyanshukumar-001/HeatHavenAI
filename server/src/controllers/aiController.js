import { z } from 'zod';
import { processConciergeQuery } from '../services/conciergeService.js';
import { getAIHeatAdvisor } from '../services/geminiService.js';

export const conciergeQuerySchema = z.object({
  query: z.string().min(1).max(500),
  lat: z.number().min(-90).max(90),
  lng: z.number().min(-180).max(180),
  lang: z.enum(['hi', 'en']).default('hi')
});

export const advisorQuerySchema = z.object({
  temp: z.coerce.number().min(-50).max(70).default(42),
  humidity: z.coerce.number().min(0).max(100).default(30),
  role: z.string().default('outdoor_worker'),
  location: z.string().default('Delhi NCR'),
  lang: z.enum(['hi', 'en']).default('en')
});

/**
 * Handle POST /api/ai/concierge
 */
export async function handleConcierge(req, res, next) {
  try {
    const { query, lat, lng, lang } = req.body;
    const result = await processConciergeQuery({ query, lat, lng, lang });
    res.json(result);
  } catch (err) {
    next(err);
  }
}

/**
 * Handle POST /api/ai/advisor — AI-powered heat safety advisor
 */
export async function handleAdvisor(req, res, next) {
  try {
    const { temp, humidity, role, location, lang } = req.body;
    const result = await getAIHeatAdvisor({ temp, humidity, role, location, lang });
    res.json(result);
  } catch (err) {
    next(err);
  }
}

