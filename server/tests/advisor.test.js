import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { app } from '../src/app.js';

describe('AI Advisor API', () => {
  it('POST /api/ai/advisor returns heat safety advice', async () => {
    const res = await request(app)
      .post('/api/ai/advisor')
      .send({ temp: 45, humidity: 25, lang: 'en' });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('advice');
    expect(res.body).toHaveProperty('riskLevel');
    expect(typeof res.body.advice).toBe('string');
    expect(res.body.advice.length).toBeGreaterThan(10);
  });

  it('POST /api/ai/advisor returns correct risk level for extreme heat', async () => {
    const res = await request(app)
      .post('/api/ai/advisor')
      .send({ temp: 48, humidity: 20, lang: 'hi' });

    expect(res.status).toBe(200);
    expect(res.body.riskLevel).toBe('extreme');
  });

  it('POST /api/ai/advisor returns moderate for low temp', async () => {
    const res = await request(app)
      .post('/api/ai/advisor')
      .send({ temp: 35, humidity: 40, lang: 'en' });

    expect(res.status).toBe(200);
    expect(res.body.riskLevel).toBe('moderate');
  });
});

