import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../src/app.js';
import { NOIDA_PILOT } from '../src/constants/geo.js';

describe('Analytics Heat-Gap API Endpoints', () => {
  it('GET /api/analytics/heat-gap returns scored grid cells and top recommendations', async () => {
    const res = await request(app)
      .get('/api/analytics/heat-gap')
      .query({
        lat: NOIDA_PILOT.CENTER_LAT,
        lng: NOIDA_PILOT.CENTER_LNG
      });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('cells');
    expect(Array.isArray(res.body.cells)).toBe(true);
    expect(res.body.cells.length).toBeGreaterThan(0);

    // Verify cell properties
    const firstCell = res.body.cells[0];
    expect(firstCell).toHaveProperty('id');
    expect(firstCell).toHaveProperty('name');
    expect(firstCell).toHaveProperty('gapScore');
    expect(firstCell).toHaveProperty('rank', 1);

    // Verify top-3 heat desert flag
    const heatDeserts = res.body.cells.filter((c) => c.isHeatDesert);
    expect(heatDeserts.length).toBe(3);

    // Verify recommendation structure
    expect(res.body).toHaveProperty('recommendations');
    expect(res.body.recommendations.length).toBeGreaterThan(0);
    expect(res.body.recommendations[0]).toHaveProperty('reason');
    expect(res.body.recommendations[0]).toHaveProperty('center');
  });
});

