import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../src/app.js';
import { NOIDA_PILOT } from '../src/constants/geo.js';

describe('Report Submission API Endpoints', () => {
  it('POST /api/spots/:id/report submits community report and updates score', async () => {
    const res = await request(app)
      .post('/api/spots/test_spot_101/report')
      .send({
        type: 'ok',
        lat: NOIDA_PILOT.CENTER_LAT,
        lng: NOIDA_PILOT.CENTER_LNG,
        deviceId: 'device_test_mock_123'
      });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('spot');
    expect(res.body.spot).toHaveProperty('trustScore');
    expect(res.body.spot).toHaveProperty('status');
  });

  it('rejects invalid report type with 400 validation error', async () => {
    const res = await request(app)
      .post('/api/spots/test_spot_101/report')
      .send({
        type: 'invalid_type',
        lat: NOIDA_PILOT.CENTER_LAT,
        lng: NOIDA_PILOT.CENTER_LNG,
        deviceId: 'device_test_mock_123'
      });

    expect(res.status).toBe(400);
    expect(res.body.error).toHaveProperty('code', 'VALIDATION_ERROR');
  });

  it('rejects duplicate report within 4 hours with 429 rate limit error', async () => {
    // First report with unique test device
    const uniqueDevice = 'device_rate_limit_test_' + Date.now();
    const res1 = await request(app)
      .post('/api/spots/test_spot_cooldown/report')
      .send({
        type: 'ok',
        lat: NOIDA_PILOT.CENTER_LAT,
        lng: NOIDA_PILOT.CENTER_LNG,
        deviceId: uniqueDevice
      });
    expect(res1.status).toBe(200);

    // Second immediate report should be rejected with 429
    const res2 = await request(app)
      .post('/api/spots/test_spot_cooldown/report')
      .send({
        type: 'ok',
        lat: NOIDA_PILOT.CENTER_LAT,
        lng: NOIDA_PILOT.CENTER_LNG,
        deviceId: uniqueDevice
      });
    expect(res2.status).toBe(429);
    expect(res2.body.error).toHaveProperty('code', 'RATE_LIMITED');
  });
});

