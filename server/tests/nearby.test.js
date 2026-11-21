import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../src/app.js';
import { NOIDA_PILOT } from '../src/constants/geo.js';

describe('Nearby Spots API Endpoints', () => {
  it('GET /api/health returns ok: true', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('ok', true);
  });

  it('GET /api/spots/nearby returns spots near Sector 18 Noida', async () => {
    const res = await request(app)
      .get('/api/spots/nearby')
      .query({
        lat: NOIDA_PILOT.CENTER_LAT,
        lng: NOIDA_PILOT.CENTER_LNG,
        radius: 1500
      });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('heat');
    expect(res.body.heat).toHaveProperty('heatIndexC');
    expect(res.body.heat).toHaveProperty('level');
    expect(res.body).toHaveProperty('spots');
    expect(Array.isArray(res.body.spots)).toBe(true);
    expect(res.body.spots.length).toBeGreaterThan(0);

    // Verify distance sorting: distanceM must be non-decreasing
    for (let i = 1; i < res.body.spots.length; i++) {
      expect(res.body.spots[i].distanceM).toBeGreaterThanOrEqual(res.body.spots[i - 1].distanceM);
    }
  });

  it('filters spots by category', async () => {
    const res = await request(app)
      .get('/api/spots/nearby')
      .query({
        lat: NOIDA_PILOT.CENTER_LAT,
        lng: NOIDA_PILOT.CENTER_LNG,
        category: 'water'
      });

    expect(res.status).toBe(200);
    expect(res.body.spots.every((s) => s.category === 'water')).toBe(true);
  });

  it('rejects invalid latitude and longitude with 400 validation error', async () => {
    const res = await request(app)
      .get('/api/spots/nearby')
      .query({
        lat: 999,
        lng: 77.326
      });

    expect(res.status).toBe(400);
    expect(res.body.error).toHaveProperty('code', 'VALIDATION_ERROR');
  });
});

