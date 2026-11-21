# HeatHaven AI: UI Redesign Spec (v2 theme, pages, Relief Map v2)

> Put this file at the repo root next to `SPEC.md`. **Where this file conflicts with SPEC.md Sections 4 and 6 (palette, gradients, "never invent colours"), this file wins.** Everything else in SPEC.md still applies (no spot is deleted, AI fallbacks, simulated labels, Zod, tests).
> Main focus of this task: **UI, theme, motion, pages, Relief Map.** Keep all existing working features working.

---

## 0. Order of work (do not skip)

1. Read `SPEC.md`, `PROJECT_SUMMARY.md`, this file. Write no app code yet.
2. Update `AGENTS.md` and `.agents/rules/design-system.md` + `animation.md` to match this file (the old rule "never invent new colours" would block this redesign).
3. Create `HOW_TO_RUN.md` if it does not exist (see Section 11).
4. Produce an **Audit artifact** (current UI problems with screenshots at 390 px and 1280 px).
5. Produce an **Implementation Plan artifact** for Phases A to F (Section 12). Wait for my approval.
6. Implement phase by phase. After each phase: lint, test, build, screenshots (390 and 1280), Walkthrough artifact.

---

## 1. Why a redesign (diagnosis)

The current UI uses the Google 4-colour palette, pastel gradients, Plus Jakarta Sans, and cards with a coloured top border. Together these read as a generic template: if you swapped the logo, nobody would notice. Also, Plus Jakarta Sans has **no Devanagari glyphs**, so Hindi currently falls back to a system font and looks unfinished. Fix both. The product needs its own identity, built from its own world: **loo (hot wind), pani (water), chhaon (shade)**.

---

## 2. Theme: "Loo & Chhaon"

**Concept:** the interface itself shows the journey from heat to relief. Warm sun-bleached paper and amber for the hot state, deep water-teal and shade-green for relief. The more dangerous the heat, the warmer the ambient tint; once the user opens a relief spot, the screen "cools" (a short colour transition).

### 2.1 Colour tokens (replace `tokens.css` colours; keep radius/shadow/spacing names)

```css
:root {
  /* Surfaces: warm paper, easier on the eyes than pure white in sunlight */
  --paper:   #FBF7F0;
  --paper-2: #F3ECDF;   /* sunken areas, chips */
  --card:    #FFFFFF;
  --line:    #E2D9C8;
  --line-strong: #CBBFA8;

  /* Text */
  --ink:   #1B2421;     /* body, high contrast */
  --ink-2: #4A5651;     /* secondary, still AA on paper */
  --ink-3: #6B766F;     /* tertiary, only for large/non-essential text */

  /* Categories */
  --pani:   #0F6FA8;  --pani-soft:   #D9EDF7;   /* water */
  --chhaon: #1E7B4F;  --chhaon-soft: #DCF1E4;   /* shade */
  --aaram:  #D9941A;  --aaram-soft:  #FBEBC7;   /* rest, marigold */

  /* Heat */
  --loo:     #D4412A;  --loo-soft: #FBDDD5;      /* danger */
  --angaar:  #8F1D12;                            /* extreme */
  --sun:     #F2C230;                            /* caution */
  --cool:    #2E9E7A;                            /* normal */

  /* Interaction */
  --focus: #0B4F7C;    /* 2px ring, 2px offset */
  --link:  #0B5E91;

  /* Dark "control room" theme, used only on /dashboard and /admin */
  --night:   #151A18;  --night-2: #1E2522;  --night-line: #2C3531;
  --ember:   #FF9A4D;  --on-night: #EDE7DA;
}
```

Rules: every text/background pair must pass WCAG AA (4.5:1 body, 3:1 large). Run a contrast check script as part of verification. The hex values above are starting points; adjust only to fix contrast and record the change in the design rule file.

### 2.2 Gradients (exactly these six, each with one job)

```css
:root {
  --g-dawn:    linear-gradient(165deg, #FFE7B0 0%, #FFC48A 40%, #F4A082 72%, #FBF7F0 100%); /* Safety hero, About hero */
  --g-relief:  linear-gradient(165deg, #D9EDF7 0%, #E4F3EF 55%, #FBF7F0 100%);              /* concierge, water panels */
  --g-grove:   linear-gradient(165deg, #DCF1E4 0%, #EEF6E2 60%, #FBF7F0 100%);              /* verified/success */
  --g-alert:   linear-gradient(90deg, #D4412A 0%, #B8301E 100%);                            /* danger banner */
  --g-extreme: linear-gradient(90deg, #8F1D12 0%, #5E0F08 100%);                            /* extreme banner */
  --g-thermal: linear-gradient(90deg, #2E9E7A 0%, #F2C230 35%, #F08A24 62%, #D4412A 82%, #8F1D12 100%); /* heat bar, charts, map overlay */
}
```

- Add a very subtle **film grain** (SVG `feTurbulence`, opacity 0.05) over `--g-dawn` and the dashboard header only, so gradients feel printed, not digital. Provide a plain fallback for low-data mode.
- Banned: purple or blue-violet gradients, gradient text, glassmorphism blobs, floating orbs, mesh gradients on every card.

### 2.3 Typography (must support Hindi properly)

| Use | Font | Notes |
|---|---|---|
| Display / headings (Latin) | **Bricolage Grotesque** (600 to 800) | Characterful, not the usual Inter/Space Grotesk. Verify the package exists on npm as `@fontsource-variable/bricolage-grotesque` or fall back to the closest distinctive grotesque and tell me. |
| Body and UI, Latin + Devanagari | **Mukta** (400, 500, 600, 700, 800) | Latin and Devanagari designed together, so Hinglish and Hindi sit on one baseline. |
| Numbers, distance, coordinates, timestamps, feed | **JetBrains Mono** (500, 600, 700) | Keep. Big mono numerals are part of the identity. |

- Self-host with `@fontsource`, subset to `latin` and `devanagari`, `font-display: swap`.
- Type scale (px): 12, 14, 16, 18, 22, 28, 36, 48. Hindi gets +1 px line-height (`1.55` body) so matras never clip.
- Take screenshots of Hindi mode on every screen. Clipped or fallback-font Devanagari is a failed check.

### 2.4 Shape, depth, imagery, icons

- Radius: 10 (controls), 16 (cards), 28 (sheets), 999 (pills). Do not round everything the same.
- Depth: prefer **hairline borders + one soft shadow level** over shadows everywhere. Raised only when interactive.
- **Do not use a thick coloured border on one side of a card** (top or left). It is the most recognisable template tell. Show category with an icon chip and a small colour dot instead.
- Imagery: use **real ground photos** from `manual-spots.json` (compressed, lazy, with blur-up). No stock photos, no AI illustrations, no emoji as icons.
- Icons: Font Awesome 6.5.1 for UI. For map pins and category marks, draw **a custom inline-SVG set** (teardrop pin with category glyph, status ring). One consistent stroke width (2 px).

### 2.5 Signature elements (what makes it recognisable)

1. **Heat Thermometer Bar** replaces the 4-colour top bar. A 4 px `--g-thermal` bar fixed at the top of every page. On load it sweeps in, then a small marker settles at the **current heat index position** (so the brand mark is also live data). Tooltip/aria-label: "Heat index 43°C, Danger".
2. **Ambient heat mode:** a CSS variable `--ambient` (from the heat level) adds a very light tint to `--paper` (cooler when normal, warmer when extreme). Max change 4 percent lightness. Respect reduced motion (no transition).
3. **Mono numerals as heroes:** distance, trust, heat, counts.
4. **Hindi-first microcopy:** keep the table in SPEC 4.7; add new strings to both `hi.json` and `en.json`.

### 2.6 Slop checklist (every screenshot is judged against this)

- [ ] Palette is only from Section 2.1/2.2. No purple, no default blue-on-white look.
- [ ] No one-side coloured card borders, no identical 3-card feature grids, no gradient text.
- [ ] Layouts vary: asymmetry, a full-bleed photo band, large numerals, overlap where it helps. Not every section is "centred heading + card row".
- [ ] Specific, real copy (names of real places, real numbers, labelled simulated). No lorem ipsum, no "Empower your journey".
- [ ] One focal animation per screen. Nothing floats or bounces without a reason.
- [ ] Hindi renders in Mukta everywhere, nothing falls back to a system font.

---

## 3. Information architecture (make it a real website around the app)

The **app opens directly on the map** at `/` (PWA, mobile first). The rest is a proper website shell (header, footer, search-friendly pages) reachable from the footer, the Safety sheet and the desktop header.

| Route | Purpose | Notes |
|---|---|---|
| `/` | **Relief Map** (app) | Public, no login. |
| `/spot/:id` | Public spot page | Photo, trust ring, last verified, directions, report buttons, share (WhatsApp), QR. Has Open Graph meta for sharing. |
| `/safety` | Heat Safety guide | ORS calculator, mask/gamcha/wet-cloth guide, exhaustion vs heatstroke, helplines. Moved from old Home. Hindi/English. |
| `/for-workers` | Guide for riders, vendors, construction crews | Short, icon-first, printable A4 poster (print CSS). Peak-hours advisory (configurable by admin, labelled advisory). |
| `/for-officials` | What the dashboard offers | How heat-gap is computed, sample screenshot, CSV download, contact. Link to `/dashboard`. |
| `/dashboard` | Heat-gap dashboard | Dark "control room" theme. |
| `/admin` | Admin console | Passkey from server env only. |
| `/how-it-works` | Trust score, verification, spam guards | Plain-language, with a live mini demo of the trust ring. |
| `/data` | Open data and methodology | Download spots as GeoJSON/CSV, API docs, simulated-data policy, licence/attribution (OSM, Open-Meteo, OpenFreeMap). |
| `/about` | Mission, problem, team, pilot zones | Real numbers only; mark simulated. Use the Heat Action Plan context honestly. |
| `/faq` | Common questions | Accordion, searchable. |
| `/contact` | Feedback and partner enquiry | Simple form stored server-side (Zod, rate-limited); also "Report a wrong spot". |
| `/privacy`, `/terms` | Plain-language, short | State: no login for workers, hashed device id, no personal data. |
| `/offline`, `*` | Offline and 404 pages | Designed, with a way back to the nearest cached spots. |

Shell rules:
- **Mobile:** bottom tab bar (Map, Safety, Add/Report, Concierge mic, More). Max 5 items. Secondary pages live under "More".
- **Desktop:** compact header with wordmark, nav (Map, Safety, For workers, For officials, Data, About), language toggle, SOS. Footer with sitemap, data credits, simulated-data note.
- SOS button is visible on every screen.
- Page transitions: 200 ms cross-fade only.
- Add `<title>`, meta description, canonical and Open Graph tags per route (use `react-helmet-async` or equivalent). Generate `sitemap.xml` and `robots.txt`.

---

## 4. Relief Map v2 (the hero of the app)

### 4.1 Basemap and tech decision (put the comparison in the plan)

Facts to respect: the public OpenStreetMap tile server is policy-limited and not meant for production, and CARTO's keyless raster tiles may now show an "API key required" watermark. A keyless, production-friendly route is **OpenFreeMap vector tiles rendered with MapLibre GL** (attribution to OpenFreeMap, OpenMapTiles and OSM must stay visible; verify the current style URLs and terms on the OpenFreeMap site).

Compare two options and recommend one:
- **A.** Keep Leaflet and add `@maplibre/maplibre-gl-leaflet`.
- **B.** Move to MapLibre GL JS (via `react-map-gl/maplibre` or plain `maplibre-gl`). Recommended if the overlays and smooth camera moves below need it. Keep the Leaflet-based routes working until B is verified.

Either way: restyle the basemap to the new palette (paper-toned land, soft teal water, muted greens for parks, desaturated roads) by overriding layer paints, so the map looks designed, not default. Provide a no-WebGL fallback: list mode with "Open in Google Maps" links.

### 4.2 Map modes (segmented control, floating, thumb-reachable)

1. **Spots** (default): category pins, clusters when zoomed out.
2. **Heat**: soft thermal overlay (`--g-thermal`) from the heat-gap grid, so the user sees hot blocks vs cooler blocks.
3. **Gaps**: highlights heat deserts (high heat, no verified spot within 500 m) with a "Pehla spot jodein" call to action.

### 4.3 New map features (all must work with real data and degrade gracefully)

1. **Walk-time rings:** 3, 7 and 15 minute rings around the user (use a constant walking speed from `constants`, label "approx").
2. **Nearest-relief chip** above the sheet: "Sabse paas: Thanda pani, 180 m" with a direction arrow (device heading via `DeviceOrientationEvent` where permitted; otherwise a static bearing arrow).
3. **Cool Route:** walking route (OSRM; check usage limits and add a Google Maps deep-link fallback) plus a count of verified spots within 50 m of the route ("Raste mein 2 pani, 1 chhaon"). Choose between "Fastest" and "Most relief" when two routes exist.
4. **Heat time slider** (6 AM to 8 PM): drag to see the hourly apparent-temperature forecast from Open-Meteo; the heat overlay and the heat pill update; the safest window is highlighted.
5. **Live report pulses:** when any device reports a spot, a ring ripples on that pin and the feed updates (Server-Sent Events from `/api/events`, polling fallback).
6. **Smart pins:** teardrop SVG pins with category glyph and a **status ring** (verified, check, likely closed, unverified). Selected pin scales up and syncs with the sheet (shared layout animation with the spot card). Cap animated markers at about 10, total rendered about 50 with clustering above that.
7. **Search and presets:** place search (Nominatim, debounced, cached) plus horizontally scrolling region chips (Noida Sector 18, Connaught Place, Anand Vihar, Chandni Chowk, AIIMS, Kanpur Rama Devi, Kanpur Jajmau).
8. **Layers panel:** toggle categories and the new types (`mobile_unit`, `misting`, `cool_shelter`, `ors_point`), plus "Unverified" visibility.
9. **Shade estimate (label as estimate):** using sun position (`suncalc`) show "Dhoop ki disha" and a rough shaded-side hint near tall buildings if building heights are available in the vector tiles; otherwise skip silently.

### 4.4 Bottom sheet and spot detail

- Three snap points (peek 140 px, half, 90%), drag handle, velocity-based snapping, focus-trapped when at 90%.
- Spot card: photo thumbnail (if any), name, big mono distance, trust badge, freshness line, one primary action "Route dikhao".
- Spot detail: photo header, trust ring (animated), report buttons with cooldown countdown, share (WhatsApp), "Print QR poster" (generate with the `qrcode` package; opens `/spot/:id`).
- Loading = skeleton shimmer. Empty = SPEC copy plus "Add a spot". Error = retry button, never a blank panel.

---

## 5. Motion spec (extends SPEC Section 6)

Use Framer Motion for springs, layout and gestures; CSS for loops. Animate `transform` and `opacity` only. Respect `prefers-reduced-motion` and the low-data toggle (static equivalents). One focal animation per screen.

| Moment | Animation |
|---|---|
| App load | Thermometer bar sweeps in (600 ms) and the marker settles at the current heat. Header and chips rise with a 60 ms stagger. |
| Heat pill | Number counts up; colour band cross-fades when the level changes. |
| Pins | Drop-in with a small bounce (350 ms), 40 ms stagger, max 10. Selected pin springs larger. |
| Pin to sheet | Shared-element transition between pin, card and detail (`layoutId`). |
| Sheet | Spring (stiffness about 300, damping about 30), rubber-band at limits. |
| Trust ring | Stroke 0 to value (600 ms), mono number counts up. |
| One-tap report | Ripple on the button, pin colour cross-fade (400 ms), score ticks, toast slides in, and a ring pulse on the map. The demo's wow moment. |
| Mode switch (Spots/Heat/Gaps) | Overlay cross-fades (300 ms); legend slides in. |
| Time slider | Overlay tint and numbers tween smoothly while dragging; throttle updates. |
| Cooling transition | Opening a verified relief spot shifts the sheet tint from warm to cool over 400 ms. |
| Concierge | Bubbles slide up; typing dots; mic "breathes" while listening with a small waveform. |
| Scroll pages (`/about`, `/safety`) | Sections reveal on scroll (fade and 16 px rise, once). Big numerals count up once. |
| Dashboard | KPI count-up, grid cells fade by distance from centre, red cells pulse once, chart bars grow. |
| Hero (about/safety, desktop only) | Optional subtle "heat shimmer" on the hero background (SVG displacement, very low strength). Disable on mobile, reduced motion and low-data. |
| Route changes | 200 ms cross-fade. |

Performance gate: if a mid-range Android profile drops below about 50 fps, simplify the animation. Document what was simplified.

---

## 6. Dashboard and Admin (dark control-room theme)

- Use `--night` surfaces, `--ember` accents, `--g-thermal` for heat, JetBrains Mono for data. Same fonts, different mood. It should feel like an operations room, not the public app in dark mode.
- KPI row: large mono numbers with small trend sparklines. **No coloured top borders**; use an icon chip and a small status dot.
- Add: heat-desert **map view** (reuse the MapLibre overlay), ranked zone table, "Next kiosk" card with coverage circle, CSV export, print-friendly report, tanker dispatch log (persisted).
- Admin passkey: from env, verified on the server, rate-limited. Never print it in docs or client code.

---

## 7. New features to add (each needs a working fallback)

P0 (do in this task):
1. **Offline PWA** (`vite-plugin-pwa`): cache shell and last nearby results; "Offline, showing saved spots" banner; `/offline` page.
2. **Wet-bulb and feels-like** in the heat pill (humidity from Open-Meteo, formula in `constants`/`utils`, with unit tests).
3. **Crowd "Add a spot"** (location + photo + category) with an admin approval queue; Zod + upload validation; rate limit.
4. **Public spot pages** with share and QR poster.
5. **Open data page** with GeoJSON/CSV download and methodology.
6. **Cooling Break Timer:** shift timer with drink reminders (Notification API, in-page fallback). Peak-hours advisory is **configurable by admin** and labelled "advisory"; do not hardcode legal hours.

P1 (if time): Hindi voice replies (`speechSynthesis`, hi-IN), low-data mode, high-contrast toggle, contribution badges (anonymous, device-based), SSE live feed.

P2 (roadmap only): WhatsApp bot, platform integrations, authority verification.

---

## 8. Accessibility and low-end performance

- Sunlight: body text `--ink` on `--paper`, no light-grey on gradients, ring and pin status never colour-only (icon + label too).
- Tap targets at least 48 x 48 px, bottom-weighted actions (thumb zone, bottom 40% of the screen).
- Focus ring: 2 px `--focus`, 2 px offset. All icon buttons have `aria-label`. Bottom sheet is keyboard operable.
- Lazy-load dashboard, charts, map overlays and the QR library. Compress photos (WebP/AVIF, width-capped). First load target: under 250 KB of JS for the map route on a throttled 3G profile (report the real number).
- Lighthouse mobile targets for `/`: Performance 85+, Accessibility 95+. Report before and after.

---

## 9. Microcopy additions (Hindi/Hinglish and English; add to i18n files)

| Where | Hindi / Hinglish | English |
|---|---|---|
| Mode: Spots / Heat / Gaps | Spots / Garmi / Khaali jagah | Spots / Heat / Gaps |
| Nearest chip | Sabse paas: {category}, {distance} | Nearest: {category}, {distance} |
| Route summary | Raste mein {n} pani, {m} chhaon | {n} water, {m} shade on the way |
| Heat window | Sabse safe samay: {time} | Safest time: {time} |
| Add spot | Yahan spot jodein | Add a spot here |
| Offline | Net nahi hai. Saved spots dikha rahe hain. | You are offline. Showing saved spots. |
| Timer | Har 45 minute mein pani piyo | Drink water every 45 minutes |
| Simulated | Demo data (simulated) | Simulated demo data |

---

## 10. Things that must NOT break

Reports (200 m rule and cooldown), trust score, Gemini fallback, 2dsphere search, auth for admin, GPS pipeline, all 25 server tests, 2 client tests. Add tests for the new code (wet-bulb, add-spot validation, admin auth middleware, new categories, route-relief counting).

---

## 11. HOW_TO_RUN.md (create or refresh)

Numbered steps (under 10): prerequisites, install in `/client` and `/server`, copy `.env.example` to `.env` and list each variable, running without MongoDB (in-memory fallback), seeding, `npm run dev` for both, URLs (app, API, `/api/health`), tests/lint/build, `?demo=1`, troubleshooting (port busy, CORS, Gemini quota, geolocation needs HTTPS or localhost, WebGL unavailable). Read the real `package.json` scripts first. Never include the admin passkey.

---

## 12. Phases (plan artifact, approval, implement, verify, Walkthrough artifact)

- **Phase A: Foundations.** Update AGENTS.md and rules, new tokens, fonts (Hindi check), gradients, grain, Thermometer Bar, shell (mobile tab bar, desktop header, footer), `/dev/tokens` page updated. Remove login gate from the map; move admin passkey to env.
- **Phase B: Relief Map v2.** Basemap decision and restyle, smart pins, clusters, sheet, spot detail, modes (Spots/Heat/Gaps), nearest chip, walk-time rings.
- **Phase C: Map intelligence.** Cool Route, heat time slider, live pulses (SSE), search and presets, layers panel, new spot types.
- **Phase D: Website pages.** `/safety`, `/for-workers`, `/for-officials`, `/how-it-works`, `/data`, `/about`, `/faq`, `/contact`, `/privacy`, `/terms`, `/spot/:id`, `/offline`, 404, SEO tags, sitemap.
- **Phase E: Dashboard and admin redesign.** Dark control-room theme, map view of gaps, exports, add-a-spot approval queue.
- **Phase F: Offline, performance, polish.** PWA, wet-bulb, timer, low-data and high-contrast toggles, Lighthouse pass, reduced-motion pass, final slop checklist, HOW_TO_RUN.md final check, README links.

**Done when** (all phases): lint, tests and build pass; screenshots at 390 px and 1280 px (English and Hindi) pass Section 2.6; Lighthouse numbers reported; no regressions in Section 10; browser recording of the report flow and the Cool Route flow.

