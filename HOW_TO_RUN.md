# How to Run HeatHaven AI

Quick-start guide to run, test, and verify HeatHaven AI locally.

---

### Step 1: Prerequisites
- **Node.js**: v18.0.0+ (v20+ recommended)
- **npm**: v9.0.0+
- **MongoDB** *(Optional)*: Local instance on `mongodb://localhost:27017` or Atlas URI. If MongoDB is offline, the backend activates zero-dependency in-memory fallback automatically.

---

### Step 2: Environment Configuration
Copy `.env.example` to `server/.env`:
```bash
cp .env.example server/.env
```
Environment variables:
- `PORT`: Backend server port (default `5000`)
- `MONGODB_URI`: MongoDB connection string (default `mongodb://localhost:27017/heathaven`)
- `CLIENT_ORIGIN`: Allowed frontend origin for CORS (default `http://localhost:5173`)
- `GEMINI_API_KEY`: Google Gemini API key from AI Studio
- `GEMINI_MODEL`: Gemini model tag (default `gemini-2.5-flash`)
- `OPEN_METEO_CACHE_MIN`: Weather cache duration in minutes (default `30`)
- `DEMO_LAT`: Pilot latitude (default `28.570` for Noida)
- `DEMO_LNG`: Pilot longitude (default `77.326` for Noida)
- `ADMIN_PASSKEY`: Emergency command passkey configured on the server

---

### Step 3: Install Dependencies
Run installation in both directories:
```bash
# In server directory:
cd server && npm install

# In client directory:
cd ../client && npm install
```

---

### Step 4: Optional Database Seeding
If using MongoDB, seed initial ground spots and demo reports:
```bash
cd server
npm run seed:manual   # Imports verified ground spots (Delhi-NCR & Kanpur)
npm run seed:reports  # Imports simulated demo community reports
```
*(Skip if running in-memory mode — data seeds into memory automatically on boot).*

---

### Step 5: Start Development Servers
Run each in a separate terminal:

**Terminal 1 (Backend API):**
```bash
cd server
npm run dev
```

**Terminal 2 (Frontend Client):**
```bash
cd client
npm run dev
```

---

### Step 6: Application & API URLs
- **Main App**: [http://localhost:5173](http://localhost:5173)
- **API Health Diagnostics**: [http://localhost:5000/api/health](http://localhost:5000/api/health)
- **Municipal Admin Portal**: [http://localhost:5173/admin](http://localhost:5173/admin)
- **Heat-Gap Dashboard**: [http://localhost:5173/dashboard](http://localhost:5173/dashboard)
- **Design Tokens Preview**: [http://localhost:5173/dev/tokens](http://localhost:5173/dev/tokens)

---

### Step 7: Demo Mode & Test Suites
- **Fixed Demo Mode**: Open [http://localhost:5173?demo=1](http://localhost:5173?demo=1) to lock GPS to Noida Sector 18 and simulate 42°C heatwave conditions.
- **Run Full Verification Suite**:
  ```bash
  # Test & lint server
  cd server && npm run lint && npm test

  # Test, lint & build client
  cd ../client && npm run lint && npm test && npm run build
  ```

---

### Step 8: Troubleshooting
- **Port 5000 or 5173 Busy**: Kill the lingering Node process or change `PORT` in `server/.env` and update `vite.config.js` proxy.
- **CORS Errors**: Confirm `CLIENT_ORIGIN=http://localhost:5173` in `server/.env`.
- **Gemini Quota / API Key Missing**: The app falls back gracefully to deterministic keyword extraction and bilingual template replies.
- **Geolocation Permission Denied**: Geolocation requires `localhost` or HTTPS. If blocked in your browser, the app falls back gracefully to default pilot coordinates (Noida / Kanpur).
- **WebGL Unavailable on Old Devices**: The vector basemap falls back to a clean list mode with direct Google Maps navigation links.
