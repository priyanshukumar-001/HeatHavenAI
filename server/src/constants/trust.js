/**
 * Trust score algorithm weights, time windows, and classification thresholds
 * Defined in SPEC.md Section 5.4:
 * trust = 50 * freshness + 35 * agreement + 15 * photoCheck
 */
export const TRUST_WEIGHTS = {
  FRESHNESS: 50,
  AGREEMENT: 35,
  PHOTO: 15
};

export const TRUST_THRESHOLDS = {
  VERIFIED_MIN: 70,
  CHECK_MIN: 40,
  FRESHNESS_WINDOW_HOURS: 48,
  RATE_LIMIT_HOURS: 1
};

export const SPOT_STATUS = {
  VERIFIED: 'verified',
  CHECK: 'check',
  LIKELY_CLOSED: 'likely_closed',
  UNVERIFIED: 'unverified'
};

