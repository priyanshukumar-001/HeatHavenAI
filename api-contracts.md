# API Contracts, Models, & Algorithms (HeatHaven AI)

All responses must be JSON. Standard error format:
`{ "error": { "code": "...", "message": "..." } }`.
All request inputs must be strictly validated with Zod.

## 1. Environment & Services
- Backend port: `5000`
- MongoDB: `mongodb://localhost:27017/heathaven` (with `2dsphere` index)
- Gemini: Model name configured from `.env` (`GEMINI_MODEL`), never hardcoded. Non-AI fallback required.
- Weather: Open-Meteo apparent temperature, cached for 30 minutes.

## 2. Data Models
### Spot
```js
{
  name: String,
  category: 'water' | 'shade' | 'rest',
  location: { type: 'Point', coordinates: [lng, lat] }, // 2dsphere index
  source: 'osm' | 'manual' | 'crowd',
  lastVerifiedAt: Date,
  trustScore: Number, // 0 to 100, cached
  status: 'verified' | 'check' | 'likely_closed' | 'unverified',
  reportCounts: { ok: Number, dry: Number, closed: Number },
  aiVerified: Boolean,
  photoUrl: String,
  isSimulated: Boolean, // true for seeded demo data
  createdAt: Date
}
```
*Note: Do NOT use MongoDB TTL indexes. Spots are never deleted; after 48h without verification they are marked `unverified`.*

### Report
```js
{
  spotId: ObjectId,
  type: 'ok' | 'dry' | 'closed',
  deviceHash: String,
  createdAt: Date
}
```

## 3. API Endpoints
| Method & Path | Input Params / Body | Output Schema |
|---|---|---|
| `GET /api/health` | none | `{ ok: true }` |
| `GET /api/spots/nearby` | `lat, lng, radius (m, default 1000, max 2000), category?` | `{ heat: { heatIndexC, level }, spots: [ { id, name, category, distanceM, trustScore, status, lastVerifiedAt, location: { lat, lng }, reportCounts, isSimulated } ] }` |
| `POST /api/ai/concierge` | `{ query, lat, lng, lang: 'hi' \| 'en' }` | `{ intent, reply, spots: [top 3], source: 'gemini' \| 'template' }` |
| `POST /api/spots/:id/report` | `{ type, lat, lng, deviceId }` | Updated `{ spot }` with new trust score and status |
| `POST /api/spots/verify-photo` | multipart: `photo`, `spotId` | `{ verified, reason, status }` |
| `GET /api/analytics/heat-gap` | `lat, lng` | `{ cells: [ { id, center, heatIndexC, spotCount, gapScore, rank } ], recommendations: [ { center, reason } ] }` |

## 4. Trust Score Algorithm
```text
trust = 50 * freshness + 35 * agreement + 15 * photoCheck

freshness  = max(0, 1 - hoursSinceLastVerified / 48)
agreement  = weighted share of recent "ok" reports (exponential decay on older reports); 0 if no reports
photoCheck = 1 if Gemini Vision passed, else 0

Thresholds:
- 70 to 100: 'verified'
- 40 to 69:  'check'
- below 40:  'likely_closed'
- no report for 48h: 'unverified' (do not delete)
```
Constants live in `server/src/constants/trust.js`.

## 5. Report Anti-Spam Guards
- **Proximity check**: User must be within **200 m** of the spot.
- **Rate limit**: Maximum **1 report per spot per device per hour**.
- **Device ID**: Anonymized client hash generated and stored in client localStorage. No login.

## 6. Concierge Pipeline
1. Incoming query received.
2. Gemini extracts intent (`water | shade | rest`) as structured JSON.
3. Node.js backend performs geo-query ranking by distance, trust, and heat index.
4. Gemini drafts concise Hindi/English response referencing top 2–3 spots.
5. On rate limit or Gemini failure, fallback cleanly to `template` response (`source: 'template'`).
6. Cache responses by intent + grid cell for 10 minutes.

## 7. Heat-Gap Algorithm
- Divide pilot area into 500 m grid cells.
- Calculate Open-Meteo apparent temperature per cell (cached 30 min).
- Formula: `gapScore = normalizedHeat * (1 / (verifiedSpots + 1))`.
- Top 3 cells flagged as "heat deserts".
- "Next kiosk": Centroid of highest-gap cell with 500 m coverage buffer.

