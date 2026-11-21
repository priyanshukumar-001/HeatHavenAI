import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../src/app.js';
import { extractFallbackIntent, formatTemplateReply } from '../src/services/geminiService.js';
import { NOIDA_PILOT } from '../src/constants/geo.js';

describe('AI Concierge Service & API', () => {
  it('extracts correct intents using keyword fallback', () => {
    expect(extractFallbackIntent('paas mein thanda pani kahan milega?')).toBe('water');
    expect(extractFallbackIntent('kisi ped ya shelter ki chhaon chahiye')).toBe('shade');
    expect(extractFallbackIntent('baithne ke liye koi bench hai?')).toBe('rest');
    expect(extractFallbackIntent('need rest area')).toBe('rest');
  });

  it('generates deterministic bilingual template replies', () => {
    const mockSpots = [
      { name: 'Atta Market Pyau', distanceM: 180, trustScore: 92 },
      { name: 'Sector 18 Metro Kiosk', distanceM: 250, trustScore: 88 }
    ];

    const replyHi = formatTemplateReply({ intent: 'water', spots: mockSpots, lang: 'hi' });
    expect(replyHi).toContain('Atta Market Pyau');
    expect(replyHi).toContain('180m');

    const replyEn = formatTemplateReply({ intent: 'water', spots: mockSpots, lang: 'en' });
    expect(replyEn).toContain('Atta Market Pyau');
    expect(replyEn).toContain('180m');
  });

  it('POST /api/ai/concierge returns structured response with fallback', async () => {
    const res = await request(app)
      .post('/api/ai/concierge')
      .send({
        query: 'paas mein pani kahan hai?',
        lat: NOIDA_PILOT.CENTER_LAT,
        lng: NOIDA_PILOT.CENTER_LNG,
        lang: 'hi'
      });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('intent', 'water');
    expect(res.body).toHaveProperty('reply');
    expect(typeof res.body.reply).toBe('string');
    expect(res.body).toHaveProperty('spots');
    expect(Array.isArray(res.body.spots)).toBe(true);
    expect(res.body).toHaveProperty('source');
  }, 15000);
});

