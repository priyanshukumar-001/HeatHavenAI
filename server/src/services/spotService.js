import { Spot } from '../models/Spot.js';
import { calculateDistanceMeters } from '../utils/distance.js';
import { isDbConnected } from '../config/db.js';
import { getHeatIndex } from './heatService.js';
import { GEO_LIMITS } from '../constants/geo.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Fallback in-memory dataset loaded from manual-spots.json for zero-dependency operation
let inMemorySpots = [];
try {
  const manualPath = path.resolve(__dirname, '../../data/manual-spots.json');
  if (fs.existsSync(manualPath)) {
    const raw = fs.readFileSync(manualPath, 'utf8');
    inMemorySpots = JSON.parse(raw);
  }
} catch {
  inMemorySpots = [];
}

/**
 * Find nearby relief spots sorted by distance and rank
 * @param {Object} options
 * @param {number} options.lat Latitude
 * @param {number} options.lng Longitude
 * @param {number} [options.radius=1000] Search radius in meters
 * @param {string} [options.category] Optional category filter ('water' | 'shade' | 'rest')
 * @returns {Promise<{ heat: Object, spots: Array }>}
 */
export async function getNearbySpots({ lat, lng, radius = GEO_LIMITS.DEFAULT_RADIUS_METERS, category }) {
  const heat = await getHeatIndex(lat, lng);
  const effectiveRadius = Math.min(radius, GEO_LIMITS.MAX_RADIUS_METERS);

  // If MongoDB is connected, run 2dsphere $nearSphere query
  if (isDbConnected()) {
    try {
      const query = {
        location: {
          $nearSphere: {
            $geometry: {
              type: 'Point',
              coordinates: [lng, lat]
            },
            $maxDistance: effectiveRadius
          }
        }
      };

      if (category) {
        query.category = category;
      }

      const docs = await Spot.find(query).limit(50).lean();

      if (docs && docs.length > 0) {
        const spots = docs.map((doc) => {
          const [spotLng, spotLat] = doc.location.coordinates;
          const distanceM = calculateDistanceMeters(lat, lng, spotLat, spotLng);

          return {
            id: doc._id.toString(),
            name: doc.name,
            category: doc.category,
            distanceM,
            trustScore: doc.trustScore,
            status: doc.status,
            lastVerifiedAt: doc.lastVerifiedAt,
            location: { lat: spotLat, lng: spotLng },
            reportCounts: doc.reportCounts,
            isSimulated: doc.isSimulated || false
          };
        });

        return { heat, spots };
      }
    } catch {
      // Fallback gracefully to in-memory spots if DB is unavailable
    }
  }

  // Graceful In-Memory fallback for unit tests, offline, or zero-dependency demo operation
  let candidateSpots = [...inMemorySpots];

  if (category) {
    candidateSpots = candidateSpots.filter((s) => s.category === category);
  }

  const spotsWithDistance = candidateSpots
    .map((s, idx) => {
      const spotLat = s.location?.coordinates ? s.location.coordinates[1] : s.location.lat;
      const spotLng = s.location?.coordinates ? s.location.coordinates[0] : s.location.lng;
      const distanceM = calculateDistanceMeters(lat, lng, spotLat, spotLng);

      return {
        id: s._id || `sim_${idx + 1}`,
        name: s.name,
        category: s.category,
        distanceM,
        trustScore: s.trustScore || 85,
        status: s.status || 'verified',
        lastVerifiedAt: s.lastVerifiedAt || new Date().toISOString(),
        location: { lat: spotLat, lng: spotLng },
        reportCounts: s.reportCounts || { ok: 5, dry: 0, closed: 0 },
        isSimulated: s.isSimulated !== undefined ? s.isSimulated : true
      };
    })
    .filter((s) => s.distanceM <= effectiveRadius)
    .sort((a, b) => a.distanceM - b.distanceM);

  return { heat, spots: spotsWithDistance };
}

export default { getNearbySpots };
