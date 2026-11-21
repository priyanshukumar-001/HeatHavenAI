# HeatHaven AI — Complete Project Summary & UI Guide (v2 Redesign Edition)

> **Real-Time Heat Relief & Shade Intelligence Platform for Outdoor Gig Workers, Street Vendors & Urban Citizens**  
> *Stack: React 19 + Vite, Node.js + Express, MongoDB (2dsphere) + In-Memory Fallback, Google Gemini AI (gemini-3.1-flash-lite), Leaflet, Tailwind CSS, Framer Motion*

---

## 1. Project Overview & Mission

**HeatHaven AI** is an emergency civic-tech web application designed to protect outdoor workers (delivery riders, rickshaw pullers, street vendors, construction laborers) and citizens from extreme heatwaves (*Loo*) across **Delhi-NCR** and **Kanpur**.

During peak summer, surface temperatures in urban heat islands exceed **48°C–52°C**, leading to fatal heatstrokes. HeatHaven AI maps ground-verified, free public drinking water kiosks (*pyau*), shaded tree groves, metro concourses, and municipal cooling shelters within a walking radius of **200m–2km**. It integrates crowd verification with a 4-hour anti-spam cooldown, AI-driven voice assistance in Hindi and English, and an official disaster control dashboard.

---

## 2. Complete Summary of Work Done (Ab Tak Ka Kaam)

### Phase 1: Core Foundation & "Loo & Chhaon" Theme Redesign (v2)
- Replaced generic template styles with the bespoke **"Loo & Chhaon"** theme (REDESIGN_SPEC.md):
  - **Surfaces**: Warm sun-bleached paper (`--paper: #FBF7F0`, `--paper-2: #F3ECDF`) that reduces glare in direct sunlight, elevated cards (`--card: #FFFFFF`), hairline borders (`--line: #E2D9C8`).
  - **Relief Categories**: Deep ocean azure (`--pani: #0F6FA8`) for water, lush forest emerald (`--chhaon: #1E7B4F`) for shade, solar marigold (`--aaram: #D9941A`) for rest.
  - **Heat Spectrum**: Crimson danger (`--loo: #D4412A`), extreme maroon (`--angaar: #8F1D12`), caution amber (`--sun: #F2C230`).
  - **Control Room Theme**: Dark operations dashboard (`--night: #151A18`, `--night-2: #1E2522`, `--ember: #FF9A4D`, `--on-night: #EDE7DA`) used exclusively on `/dashboard` and `/admin`.
  - **6 Official Gradients**: `--g-dawn`, `--g-relief`, `--g-grove`, `--g-alert`, `--g-extreme`, `--g-thermal`.
  - **Live Heat Thermometer Bar**: 4px dynamic top bar (`--g-thermal`) that settles on load at the current heat index.
  - **Anti-Slop Compliance**: Removed all one-sided thick colored borders on cards; cards use rounded-2xl geometry with subtle category chips and glowing status dots.

### Phase 2: Typography & Devanagari Hindi Excellence
- Integrated native font packages:
  - **Bricolage Grotesque** (`@fontsource-variable/bricolage-grotesque`): Bold, characterful grotesque for headings and wordmarks.
  - **Mukta** (`@fontsource/mukta`): Latin and Devanagari designed together on one baseline with `line-height: 1.55` so Hindi matras never clip.
  - **JetBrains Mono** (`@fontsource/jetbrains-mono`): High-precision mono numerals for heat metrics, coordinates, distances, and live telemetry feeds.
- Full bilingual localization (**Hindi** and **English**) with seamless 1-click toggle.

### Phase 3: Backend Architecture & APIs
- **Node.js + Express REST API** structured with modular routers, controllers, services, and Zod validation.
- **MongoDB Connection with Auto-Bootstrapping**:
  - Automatically seeds ground-inspected relief data from `manual-spots.json` on first boot.
  - Creates 2dsphere indexes for high-speed spatial `$nearSphere` queries.
  - Non-blocking startup with graceful **in-memory fallback** for offline or zero-dependency development.
- **Open-Meteo Integration**: Fetches real-time temperature, relative humidity, and calculates the apparent heat index (*Steadman formulation*).
- **Composite Trust Score Engine**: Spots are ranked 0–100% based on recent community reports, verification recency, and municipal authority badges.
- **4-Hour Anti-Spam Rate Limiting**:
  - Backend enforces a 4-hour cooldown per spot per device/user hash.
  - Repeated verification attempts within 4 hours return HTTP `429 RATE_LIMITED`.

### Phase 4: Google Gemini AI Integration (Verified Live)
- Integrated `@google/genai` using the official API key from `.env` with model `gemini-3.1-flash-lite`.
- **Multilingual Intent Classifier**: Accurately extracts whether the user seeks `water`, `shade`, or `rest` from conversational queries (e.g. *"mujhe thanda paani peena hai"* or *"bahut dhoop hai aaram karna hai"*).
- **Conversational AI Concierge**: Delivers concise, respectful 2-sentence responses in colloquial Hindi or English with the closest spot name and exact distance, tagged with `✨ Gemini AI`.
- **Dedicated AI Heat Safety Advisor (`POST /api/ai/advisor`)**: Analyzes live microclimate inputs (temperature, humidity, outdoor worker role) to generate practical safety recommendations (ORS timing, wet cloth application, hydration frequency).

### Phase 5: Authentication & Security Gate
- Complete mock + session authentication with user roles:
  - 🛵 *Delivery Rider* (Zomato / Swiggy / Blinkit / Zepto)
  - 🛒 *Street Vendor / Daily Wage Worker*
  - 🚶 *Urban Citizen / Commuter*
- **Auth Gate**: Accessing the **Relief Map** or **Heat-Gap Dashboard** prompts guest users with an informative Auth Modal. Once logged in, users are automatically routed to their requested destination.
- **Municipal Admin Passkey**: The Admin Command Center (`/admin`) requires passkey authentication without client-side plaintext disclosures.

### Phase 6: Ground Data Enrichment (Delhi-NCR & Kanpur)
- **Delhi-NCR (32+ Spots)**: Sector 18 & 62 Noida, Bangla Sahib Chilled Jal Seva, Connaught Place Colonnades, Anand Vihar ISBT DUSIB Shelter, Chandni Chowk Sis Ganj, AIIMS OPD Pergola, Safdarjung Hospital RO Cooler, Lajpat Nagar Market, Sarai Kale Khan, Kartavya Path Canopy, etc.
- **Kanpur Hub (10 Spots)**: Rama Devi Chauraha Flyover underpass, Rama Devi Nagar Nigam Pyau, Kanshi Ram Joint Hospital Concourse & RO Dispenser, Chakeri Air Force Bus Shelter, Jajmau Old Ganga Bridge Grove, Jal Sansthan Public Tap, KDA Colony Gazebo, Rama Devi Subzi Mandi Arcade.

### Phase 7: Real-Time GPS Pipeline
- Real-time device geolocation via `navigator.geolocation.getCurrentPosition`.
- Reverse geocoding through OpenStreetMap Nominatim with a 2-second timeout and instant local landmark resolution for Delhi, Noida, and Kanpur.
- "Find Water & Shade Near Me" automatically centers the Leaflet map and queries spots for the user's exact coordinates.

---

## 3. UI Guide — Kaha Kya Hai (Complete Layout Breakdown)

```
+-----------------------------------------------------------------------------------+
| [4px Heat Thermometer Bar: --g-thermal with Live Heat Index Indicator]            |
+-----------------------------------------------------------------------------------+
|  [Logo] HeatHaven AI  |  (Home)  [🔒 Relief Map]  [🔒 Heat-Gap]  |  [SOS] [42°C] [EN] [Login] |
+-----------------------------------------------------------------------------------+
|  [⚠️ Alert Banner: Extreme Heat Red Alert · Keep mouth & head covered]           |
+-----------------------------------------------------------------------------------+
|                                                                                   |
|                                  MAIN CONTENT                                     |
|           (HomePage / MapPage / DashboardPage / AdminPage / Tokens)               |
|                                                                                   |
+-----------------------------------------------------------------------------------+
|  Floating Elements: [🎤 AI Voice Concierge]                                       |
+-----------------------------------------------------------------------------------+
```

### A. Persistent Navigation & Shell (Header & Banner)

Located at the top of every screen:

1. **Heat Thermometer Bar**: 4px `--g-thermal` gradient bar with live indicator needle showing the apparent heat level.
2. **Sticky Header (56px)**:
   - **Logo & Title**: `HeatHaven AI` with `AI` badge in warm paper header.
   - **Navigation Tabs**:
     - 🏠 **Home**: Comprehensive heat advisory, Chhaon microclimate grid, ORS calculator, and GPS lookup.
     - 🗺️ **Relief Map** *(Shows lock icon for guests)*: Full-screen interactive map with verified spots and bottom drawer.
     - 📊 **Heat-Gap Dashboard** *(Shows lock icon for guests)*: Dark control room telemetry dashboard for municipal planners.
     - 🏛️ **Admin**: Municipal Emergency Relief Command Center (`/admin`).
   - **Emergency Actions (Right side)**:
     - 🚨 **SOS Button** (Crimson): 1-tap modal for heatstroke first aid & direct 108 ambulance dialer.
     - 🌡️ **Heat Level Badge**: Live temperature pill (e.g., `42°C Danger` / `46°C Extreme`) computed from Open-Meteo.
     - 🌐 **Language Switcher**: Toggle between `हिंदी` and `English`.
     - 👤 **User Profile / Sign In**: Displays worker avatar or opens the quick passwordless sign-in modal.
3. **Heat Alert Banner**: Automatically docks below the header during danger/extreme conditions with a pulsing beacon.

---

### B. View 1: Home View (`/`) — Civic Heat Advisory & Shade Mapping

1. **National Heat Action Hero**:
   - Official NDMA/DDMA emergency advisory pill.
   - High-contrast Bricolage Grotesque heading in English or Hindi.
   - Quick action pills: *Open Live Relief Map*, *AI Heat Concierge*, *Heatstroke SOS (108)*.
   - **Live Meteorological Telemetry**: Apparent heat, relative humidity, wind speed, UV index with IMD live sync badge.
2. **Current Location & GPS Detector Card**:
   - Live latitude/longitude, detected locality badge (Delhi-NCR or Kanpur), and 1-tap "Find Water & Shade Near Me" button.
3. **Chhaon Urban Shade Model (250m Grid)**:
   - Block-by-block hotspot comparison (e.g. Atta Market 47.8°C vs. Pocket-A Banyan Grove 36.2°C).
   - Walking time and direct routing button.
4. **Life-Saving Heat Survival Guide**:
   - Tab 1: *Mask & Gamcha Guide* (evaporative cooling techniques).
   - Tab 2: *ORS & Hydration Calculator* (interactive liter stepper with exact sugar/salt proportions).
   - Tab 3: *Heatstroke Triage* (Stage 1 Exhaustion vs Stage 2 Life-Threatening Stroke).
5. **Emergency Helplines Bar**: Direct 1-tap dialers for 108 (Ambulance), 1077 (Disaster Control), 112 (National Emergency).
6. **Civic Footer**: Municipal Admin Portal link, Heat-Gap link, and `/dev/tokens` design catalog.

---

### C. View 2: Relief Map (`/map`) — Interactive Map & Spot Drawer

1. **Full-Bleed Map Canvas**:
   - Powered by Leaflet + OpenStreetMap tiles.
   - Custom teardrop markers with category glyphs and status trust rings (`#1E7B4F` verified, `#D9941A` moderate, `#D4412A` unverified).
   - Pulsing live user location beacon.
2. **Top Floating Filter Bar**:
   - Category chips: *All*, *💧 Cold Water*, *🌳 Shade*, *🪑 Rest Spot*.
   - **Delhi-NCR & Kanpur Region Switcher**: Fast-travel dropdown to jump between Noida, Kanpur Rama Devi, Connaught Place, Anand Vihar, Chandni Chowk, AIIMS.
   - **Live GPS Crosshairs**: Forces real-time device location re-center.
3. **Left Panel / Bottom Sheet (SpotDrawer)**:
   - Real-time spot list ranked by walking distance.
   - Spot card details: Category icon, distance in JetBrains Mono, trust score ring, last-verified badge.
   - Detailed view on selection: Photo, directions button, operating hours, water quality description.
   - **One-Tap Verification**: `💧 Water OK` (+6 trust) and `⚠️ Dry / Closed` (-12 trust) with 4-hour rate limit guard.
4. **Floating Action Button**: 🎤 Voice-activated AI Concierge button with breathing animation.

---

### D. View 3: Heat-Gap Decision Dashboard (`/dashboard`)

Styled in the dark **"Control Room"** theme (`#151A18` base):
1. **Telemetry Header Band**: Satellite telemetry status indicator with live sync pulse.
2. **KPI Metrics Grid (4 Hero Cards)**:
   - Peak Apparent Heat (°C)
   - Mapped Relief Spots (Count)
   - Verified Coverage Share (%)
   - Critical Heat Deserts (Deficit Count)
3. **Optimal Placement Engine Card**: Algorithmic recommendation for the next water kiosk placement with estimated daily beneficiaries.
4. **Live Activity Telemetry Feed**: Real-time terminal log displaying report ingestions, Open-Meteo syncs, and AI decisions.
5. **Heat-Gap Matrix Grid**: 3x2 grid of pilot zones ranked by normalized heat vs relief spots.
6. **Stress Analysis Bar Chart**: Recharts bar graph comparing apparent heat index against verified relief capacity.

---

### E. View 4: Municipal Admin Command Center (`/admin`)

Dark control room console for disaster management officials:
1. **Passkey Protection Gate**: Secure entry without plaintext password leakage.
2. **Overview & Telemetry Tab**: Verified spots breakdown, active water tankers count, and NDMA Stage 3 status.
3. **Emergency Broadcast Controller**: Create and update the public heat alert banner across all citizen devices.
4. **Chhaon Tanker Dispatcher**: Dispatches 5,000L Delhi Jal Board water tankers to high-thermal priority blocks.
5. **Register Relief Spot**: Form to register official municipal drinking posts, misting shelters, and banyan tree belts.

---

### F. View 5: Living Design System Catalog (`/dev/tokens`)

Comprehensive visual verification page displaying:
- Typography suites (Bricolage Grotesque, Mukta Latin + Devanagari, JetBrains Mono).
- Surfaces & Paper tokens.
- Category color tokens (Pani, Chhaon, Aaram).
- Heat Danger Spectrum (Loo, Angaar, Sun, Cool).
- Control Room Palette (Night, Ember, On-Night).
- The 6 Official Gradients (`--g-dawn`, `--g-relief`, `--g-grove`, `--g-alert`, `--g-extreme`, `--g-thermal`).

---

## 4. Verification Suite Results

| Test Category | Command | Result | Notes |
|---|---|---|---|
| Client Build | `npm --prefix client run build` | **0 Errors (Code 0)** | 907 modules transformed, production ready |
| Client Tests | `npm --prefix client test` | **2/2 Passed** | Design tokens verified |
| Client Lint | `npm --prefix client run lint` | **0 Errors, 0 Warnings** | Clean ESLint |
| Server Tests | `npm --prefix server test` | **25/25 Passed** | Live Gemini API, spatial queries, trust, admin |
| Server Lint | `npm --prefix server run lint` | **0 Errors, 0 Warnings** | Clean ESLint |
| Server Health | `GET /api/health` | **Healthy** | Database connected, Gemini AI configured |

---

## 5. How to Run the Project

1. **Install Dependencies**:
   ```bash
   npm --prefix server install
   npm --prefix client install
   ```
2. **Start Backend Server**:
   ```bash
   npm --prefix server run dev
   # Runs on http://localhost:5000
   ```
3. **Start Frontend Client**:
   ```bash
   npm --prefix client run dev
   # Runs on http://localhost:5173/
   ```
4. **Access in Browser**:
   - Public App: `http://localhost:5173/`
   - Relief Map: `http://localhost:5173/map`
   - Heat-Gap Dashboard: `http://localhost:5173/dashboard`
   - Municipal Admin: `http://localhost:5173/admin`
   - Design System Tokens: `http://localhost:5173/dev/tokens`
