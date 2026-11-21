import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { app } from '../src/app.js';

describe('Admin API', () => {
  it('GET /api/admin/stats returns overview stats', async () => {
    const res = await request(app).get('/api/admin/stats');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('stats');
    expect(res.body.stats).toHaveProperty('totalSpots');
    expect(res.body.stats).toHaveProperty('waterCount');
    expect(res.body.stats).toHaveProperty('shadeCount');
    expect(res.body.stats).toHaveProperty('restCount');
    expect(res.body).toHaveProperty('broadcast');
  });

  it('GET /api/admin/broadcast returns active broadcast', async () => {
    const res = await request(app).get('/api/admin/broadcast');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('broadcast');
    expect(res.body.broadcast).toHaveProperty('active');
    expect(res.body.broadcast).toHaveProperty('level');
  });

  it('POST /api/admin/broadcast without passkey returns 403', async () => {
    const res = await request(app)
      .post('/api/admin/broadcast')
      .send({
        active: true,
        level: 'danger',
        titleEn: 'Test alert EN',
        titleHi: 'Test alert HI',
        messageEn: 'Stay safe from heat',
        messageHi: 'गर्मी से बचें'
      });
    expect(res.status).toBe(403);
    expect(res.body.error.code).toBe('FORBIDDEN');
  });

  it('POST /api/admin/broadcast with valid passkey succeeds', async () => {
    const res = await request(app)
      .post('/api/admin/broadcast')
      .set('x-admin-key', 'heathaven2026')
      .send({
        active: true,
        level: 'danger',
        titleEn: 'Test alert EN',
        titleHi: 'Test alert HI',
        messageEn: 'Stay safe from heat',
        messageHi: 'गर्मी से बचें'
      });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('success', true);
    expect(res.body.broadcast.level).toBe('danger');
  });

  it('GET /api/admin/dispatch-recommendations returns zones', async () => {
    const res = await request(app).get('/api/admin/dispatch-recommendations');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('recommendations');
    expect(Array.isArray(res.body.recommendations)).toBe(true);
    expect(res.body.recommendations.length).toBeGreaterThan(0);
  });

  it('POST /api/admin/spots without passkey returns 403', async () => {
    const res = await request(app)
      .post('/api/admin/spots')
      .send({
        name: 'Test Water Post',
        category: 'water',
        lat: 28.57,
        lng: 77.33
      });
    expect(res.status).toBe(403);
  });

  it('POST /api/admin/spots with valid passkey creates spot', async () => {
    const res = await request(app)
      .post('/api/admin/spots')
      .set('x-admin-key', 'heathaven2026')
      .send({
        name: 'Official Test Water Post',
        category: 'water',
        lat: 28.57,
        lng: 77.33
      });
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('spot');
    expect(res.body.spot.name).toBe('Official Test Water Post');
    expect(res.body.spot.trustScore).toBe(98);
  });
});

