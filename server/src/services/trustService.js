import { TRUST_WEIGHTS, TRUST_THRESHOLDS, SPOT_STATUS } from '../constants/trust.js';

/**
 * Calculate freshness score [0, 1] decaying over 48 hours
 * @param {Date|string|number} lastVerifiedAt 
 * @param {Date} [now=new Date()]
 * @returns {number}
 */
export function calculateFreshness(lastVerifiedAt, now = new Date()) {
  if (!lastVerifiedAt) return 0;
  const verifiedTime = new Date(lastVerifiedAt).getTime();
  const currentTime = new Date(now).getTime();
  const hoursSince = Math.max(0, (currentTime - verifiedTime) / (1000 * 60 * 60));

  if (hoursSince >= TRUST_THRESHOLDS.FRESHNESS_WINDOW_HOURS) {
    return 0;
  }
  return Math.max(0, 1 - hoursSince / TRUST_THRESHOLDS.FRESHNESS_WINDOW_HOURS);
}

/**
 * Calculate agreement score [0, 1] based on ok vs (dry + closed) reports
 * @param {Array<{ type: string, createdAt: Date }>} reports 
 * @returns {number}
 */
export function calculateAgreement(reports = []) {
  if (!reports || reports.length === 0) return 0;

  const now = Date.now();
  let weightedOk = 0;
  let totalWeight = 0;

  for (const report of reports) {
    const ageHours = (now - new Date(report.createdAt).getTime()) / (1000 * 60 * 60);
    // Exponential decay: weight halves every 24 hours
    const weight = Math.exp(-ageHours / 24);

    if (report.type === 'ok') {
      weightedOk += weight;
    }
    totalWeight += weight;
  }

  if (totalWeight === 0) return 0;
  return weightedOk / totalWeight;
}

/**
 * Determine classification status based on trust score and freshness
 * @param {number} trustScore (0 to 100)
 * @param {number} freshness (0 to 1)
 * @returns {'verified' | 'check' | 'likely_closed' | 'unverified'}
 */
export function determineStatus(trustScore, freshness) {
  if (freshness === 0) {
    return SPOT_STATUS.UNVERIFIED;
  }
  if (trustScore >= TRUST_THRESHOLDS.VERIFIED_MIN) {
    return SPOT_STATUS.VERIFIED;
  }
  if (trustScore >= TRUST_THRESHOLDS.CHECK_MIN) {
    return SPOT_STATUS.CHECK;
  }
  return SPOT_STATUS.LIKELY_CLOSED;
}

/**
 * Calculate full trust score (0 to 100) and status
 * @param {Object} params
 * @param {Date} params.lastVerifiedAt
 * @param {Array} [params.reports=[]]
 * @param {boolean} [params.aiVerified=false]
 * @param {Date} [params.now=new Date()]
 * @returns {{ trustScore: number, status: string, freshness: number, agreement: number }}
 */
export function calculateTrustScore({
  lastVerifiedAt,
  reports = [],
  aiVerified = false,
  now = new Date()
}) {
  const freshness = calculateFreshness(lastVerifiedAt, now);
  const agreement = calculateAgreement(reports);
  const photoCheck = aiVerified ? 1 : 0;

  const rawScore =
    TRUST_WEIGHTS.FRESHNESS * freshness +
    TRUST_WEIGHTS.AGREEMENT * agreement +
    TRUST_WEIGHTS.PHOTO * photoCheck;

  const trustScore = Math.min(100, Math.max(0, Math.round(rawScore)));
  const status = determineStatus(trustScore, freshness);

  return {
    trustScore,
    status,
    freshness: Math.round(freshness * 100) / 100,
    agreement: Math.round(agreement * 100) / 100
  };
}

