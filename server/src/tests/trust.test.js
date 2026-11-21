import { describe, it, expect } from 'vitest';
import {
  calculateFreshness,
  calculateAgreement,
  determineStatus,
  calculateTrustScore
} from '../src/services/trustService.js';
import { SPOT_STATUS } from '../src/constants/trust.js';

describe('Trust Score Algorithm Service', () => {
  it('calculates freshness score with 48h decay', () => {
    const now = new Date('2026-06-01T12:00:00Z');
    
    // Exactly at verification time -> freshness = 1.0
    expect(calculateFreshness(now, now)).toBe(1);

    // 24 hours later -> freshness = 0.5
    const t24h = new Date('2026-05-31T12:00:00Z');
    expect(calculateFreshness(t24h, now)).toBe(0.5);

    // 48 hours later -> freshness = 0
    const t48h = new Date('2026-05-30T12:00:00Z');
    expect(calculateFreshness(t48h, now)).toBe(0);

    // 60 hours later -> clamped at 0
    const t60h = new Date('2026-05-29T12:00:00Z');
    expect(calculateFreshness(t60h, now)).toBe(0);
  });

  it('calculates agreement score from reports', () => {
    // Empty reports -> agreement = 0
    expect(calculateAgreement([])).toBe(0);

    // All "ok" reports -> agreement = 1.0
    const allOk = [
      { type: 'ok', createdAt: new Date() },
      { type: 'ok', createdAt: new Date() }
    ];
    expect(calculateAgreement(allOk)).toBe(1);

    // All "dry" reports -> agreement = 0
    const allDry = [
      { type: 'dry', createdAt: new Date() }
    ];
    expect(calculateAgreement(allDry)).toBe(0);
  });

  it('maps scores to correct status thresholds', () => {
    expect(determineStatus(85, 0.8)).toBe(SPOT_STATUS.VERIFIED);
    expect(determineStatus(70, 0.5)).toBe(SPOT_STATUS.VERIFIED);
    expect(determineStatus(55, 0.4)).toBe(SPOT_STATUS.CHECK);
    expect(determineStatus(40, 0.3)).toBe(SPOT_STATUS.CHECK);
    expect(determineStatus(30, 0.2)).toBe(SPOT_STATUS.LIKELY_CLOSED);
    
    // Never deleted: when freshness = 0 (48h without verification), status is unverified
    expect(determineStatus(90, 0)).toBe(SPOT_STATUS.UNVERIFIED);
  });

  it('calculates full composite trust score', () => {
    const now = new Date();
    const result = calculateTrustScore({
      lastVerifiedAt: now,
      reports: [{ type: 'ok', createdAt: now }],
      aiVerified: true,
      now
    });

    // 50*1 + 35*1 + 15*1 = 100
    expect(result.trustScore).toBe(100);
    expect(result.status).toBe(SPOT_STATUS.VERIFIED);
  });
});

