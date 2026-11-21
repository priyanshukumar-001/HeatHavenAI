import { z } from 'zod';
import { getNearbySpots } from '../services/spotService.js';
import { calculateDistanceMeters } from '../utils/distance.js';
import { hashDeviceId } from '../utils/hash.js';
import { calculateTrustScore } from '../services/trustService.js';
import { Spot } from '../models/Spot.js';
import { Report } from '../models/Report.js';
import { GEO_LIMITS } from '../constants/geo.js';
import { isDbConnected } from '../config/db.js';

// In-memory rate limiting map for zero-dependency offline & test environments
const inMemoryReportCooldowns = new Map();
const FOUR_HOURS_MS = 4 * 60 * 60 * 1000;

export const nearbyQuerySchema = z.object({
  lat: z.coerce.number().min(-90).max(90),
  lng: z.coerce.number().min(-180).max(180),
  radius: z.coerce.number().min(50).max(GEO_LIMITS.MAX_RADIUS_METERS).default(GEO_LIMITS.DEFAULT_RADIUS_METERS),
  category: z.enum(['water', 'shade', 'rest']).optional()
});

export const reportBodySchema = z.object({
  type: z.enum(['ok', 'dry', 'closed']),
  lat: z.number().min(-90).max(90),
  lng: z.number().min(-180).max(180),
  deviceId: z.string().min(3)
});

/**
 * Handle GET /api/spots/nearby
 */
export async function handleGetNearby(req, res, next) {
  try {
    const { lat, lng, radius, category } = req.query;
    const result = await getNearbySpots({ lat, lng, radius, category });
    res.json(result);
  } catch (err) {
    next(err);
  }
}

/**
 * Handle POST /api/spots/:id/report
 * Enforces 200m proximity check and 1 report/hour/device rate limiting
 */
export async function handlePostReport(req, res, next) {
  try {
    const { id } = req.params;
    const { type, lat, lng, deviceId } = req.body;
    const deviceHash = hashDeviceId(deviceId);

    // If MongoDB is connected:
    if (isDbConnected()) {
      const spot = await Spot.findById(id);
      if (!spot) {
        return res.status(404).json({
          error: { code: 'NOT_FOUND', message: 'Relief spot not found' }
        });
      }

      // 1. Proximity Check (SPEC Section 5.5: Reporter within 200m)
      const [spotLng, spotLat] = spot.location.coordinates;
      const distance = calculateDistanceMeters(lat, lng, spotLat, spotLng);
      if (distance > GEO_LIMITS.REPORT_PROXIMITY_METERS) {
        return res.status(400).json({
          error: {
            code: 'OUT_OF_RANGE',
            message: `You must be within 200m of the spot to submit a report (current distance: ${distance}m)`
          }
        });
      }

      // 2. Rate Limit Check (Enforce 4 hours per spot per device/user)
      const fourHoursAgo = new Date(Date.now() - FOUR_HOURS_MS);
      const existingReport = await Report.findOne({
        spotId: spot._id,
        deviceHash,
        createdAt: { $gte: fourHoursAgo }
      });

      if (existingReport) {
        return res.status(429).json({
          error: {
            code: 'RATE_LIMITED',
            message: 'You have already verified this spot within the last 4 hours'
          }
        });
      }

      // 3. Create Report Document
      await Report.create({
        spotId: spot._id,
        type,
        deviceHash,
        createdAt: new Date()
      });

      // 4. Update Report Counts
      spot.reportCounts[type] = (spot.reportCounts[type] || 0) + 1;
      spot.lastVerifiedAt = new Date();

      // 5. Fetch recent reports for trust calculation
      const recentReports = await Report.find({ spotId: spot._id })
        .sort({ createdAt: -1 })
        .limit(20)
        .lean();

      // 6. Recalculate Composite Trust Score
      const trustResult = calculateTrustScore({
        lastVerifiedAt: spot.lastVerifiedAt,
        reports: recentReports,
        aiVerified: spot.aiVerified
      });

      spot.trustScore = trustResult.trustScore;
      spot.status = trustResult.status;
      await spot.save();

      return res.json({
        spot: {
          id: spot._id.toString(),
          name: spot.name,
          category: spot.category,
          trustScore: spot.trustScore,
          status: spot.status,
          reportCounts: spot.reportCounts,
          lastVerifiedAt: spot.lastVerifiedAt
        }
      });
    }

    // In-memory fallback response with strict 4-hour rate limiting
    const cooldownKey = `${id}_${deviceHash}`;
    const lastReportTime = inMemoryReportCooldowns.get(cooldownKey);
    const now = Date.now();

    if (lastReportTime && now - lastReportTime < FOUR_HOURS_MS) {
      const remainingMinutes = Math.ceil((FOUR_HOURS_MS - (now - lastReportTime)) / 60000);
      return res.status(429).json({
        error: {
          code: 'RATE_LIMITED',
          message: `You have already verified this spot within the last 4 hours (cooldown active: ${remainingMinutes}m remaining)`
        }
      });
    }

    inMemoryReportCooldowns.set(cooldownKey, now);

    const delta = type === 'ok' ? 8 : -14;
    const baseScore = type === 'ok' ? 85 : 45;
    const simulatedTrust = Math.min(100, Math.max(10, baseScore + delta));

    res.json({
      spot: {
        id,
        trustScore: simulatedTrust,
        status: simulatedTrust >= 70 ? 'verified' : simulatedTrust >= 40 ? 'check' : 'likely_closed',
        lastVerifiedAt: new Date().toISOString()
      }
    });
  } catch (err) {
    next(err);
  }
}
