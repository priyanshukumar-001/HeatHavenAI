# HeatHaven AI ☀️💧🌴

> **Find Shade. Find Water. Find Relief.**  
> A mobile-first Progressive Web App guiding outdoor gig workers (delivery riders, street vendors, construction workers, commuters) to verified free drinking water, shade, and seating in Noida Sector 18.

---

## Highlights

- **Real-Time Heat Index**: Dynamic heat index calculation from Open-Meteo apparent temperature.
- **2-Second Discovery**: Instant nearby relief spots within 500m–2000m using MongoDB geospatial `2dsphere` queries.
- **Live Crowd Trust Score (0–100)**: Freshness decay + report agreement + AI photo validation. Spots are never deleted.
- **One-Tap Community Reports**: Report "Water works" / "Dry" / "Closed" with 200m geolocation validation and 1-per-hour rate limiting.
- **Bilingual AI Concierge**: Voice & text query in Hindi (`hi-IN`) and English with Gemini AI + deterministic fallback.
- **Heat-Gap Dashboard**: Municipal analytics highlighting underserved "heat deserts" and automated "Next Kiosk" recommendations.
- **Strict Anti-Slop Design System**: Google-inspired tokenized UI with high contrast for direct sunlight.

---

## Quick Start (Setup in 4 Steps)

### 1. Install Dependencies
```bash
# Server
cd server
npm install

# Client
cd ../client
npm install
```

### 2. Configure Environment
Create `server/.env` (see `.env.example`):
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/heathaven
CLIENT_ORIGIN=http://localhost:5173
GEMINI_API_KEY=your_key_here
GEMINI_MODEL=gemini-2.5-flash
OPEN_METEO_CACHE_MIN=30
DEMO_LAT=28.570
DEMO_LNG=77.326
```

### 3. Seed Pilot Data (Sector 18 Noida)
```bash
cd server
npm run seed:osm
npm run seed:manual
npm run seed:reports
```

### 4. Run Development Servers
```bash
# Terminal 1: Backend
cd server
npm run dev

# Terminal 2: Frontend
cd client
npm run dev
```

Open `http://localhost:5173` on mobile or desktop browser.  
Use `http://localhost:5173?demo=1` to simulate fixed Sector 18 location with seeded demo data.

For full architecture details, see [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) and [HOW_TO_RUN.md](HOW_TO_RUN.md).

