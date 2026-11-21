# HeatHaven AI: Build Spec for Google Antigravity

> **Put this file at the repo root as `SPEC.md`.** It is the single source of truth for the build.
> Antigravity should read it fully before writing any code.

**Paste this as your very first prompt:**

```text
Read @SPEC.md completely. Do NOT write app code yet.
1. Create AGENTS.md and the files under .agents/rules/ exactly as described in Section 2.
2. Summarise your understanding of the product in at most 12 bullets.
3. Ask me at most 5 clarifying questions, only if something is truly ambiguous.
4. Produce an Implementation Plan artifact for Phase 1 and wait for my approval.
Work phase by phase (Section 10). After every phase: run the verification steps,
take screenshots at 390px and 1280px, and write a Walkthrough artifact.
```

---

## 0. Product in one paragraph

**HeatHaven AI** is a mobile-first PWA that guides outdoor workers (delivery riders, street vendors, construction workers, commuters) to **verified free water, shade and seating** within 500 m to 2 km. It has a **live crowd-verified trust score** per spot, a **Hindi/English AI concierge** (voice and text), and an **officials' heat-gap dashboard** that shows where the next water kiosk should go. No login. Runs on free tiers. Pilot zone: **Noida, Sector 18 market area**.

Tagline: **Find Shade. Find Water. Find Relief.**

**Core principle for every decision:** a worker standing in 43 degrees C must understand the screen in 2 seconds, with one thumb, on a cheap Android phone and slow data.

### Scope

| Priority | Feature | Must work live? |
|---|---|---|
| **P0** | Real Noida data (OSM import + ground-verified spots) | Yes |
| **P0** | Nearby search (MongoDB 2dsphere) with Water / Shade / Rest filters | Yes |
| **P0** | One-tap reports (ok / dry / closed) and live trust score | Yes |
| **P0** | Hindi/English concierge with template fallback | Yes |
| **P0** | Heat index (Open-Meteo) | Yes |
| **P0** | Heat-gap dashboard with "next kiosk here" | Yes |
| **P1** | Hindi voice input (Web Speech API, `hi-IN`) | If time |
| **P1** | Photo verification (Gemini Vision) | If time |
| **P1** | SOS card (static first aid + `tel:108`) | If time |
| **P1** | Shade shown as an *estimate* only | If time |
| **P2** | Offline PWA, WhatsApp bot, platform feeds, authority verification | Roadmap only |

---

## 1. How to work with Antigravity (working agreement)

These practices come from Antigravity's own docs and guides. Follow them for the whole build.

1. **Explore, plan, then execute.** For every phase: (a) explore the repo, (b) write an **Implementation Plan artifact** listing files, dependencies and logic, (c) wait for my approval, (d) implement.
2. **Verification loop on every change.** Never say "done" without running the check: `npm run lint`, `npm test`, `npm run build`, and for UI a browser run with screenshots at **390 px** and **1280 px**. If a check fails, fix and re-run automatically.
3. **Review artifacts, not just code.** Produce a **Walkthrough** artifact at the end of each phase with screenshots (and a browser recording for animated flows).
4. **Keep rules in files, not in chat.** `AGENTS.md` at the root and rule files in `.agents/rules/`. Antigravity defaults to `.agents/rules` (the older `.agent/rules` still works). If a rule is missing, add it there instead of repeating it in prompts.
5. **Use skills for repeatable work.** A skill is a folder with a `SKILL.md` in `.agents/skills/<name>/` (for example `new-component`, `new-api-route`). Keep each skill focused and write a clear one-line description. Workflow files are capped at 12,000 characters, and Antigravity is moving workflows toward skills, so prefer skills.
6. **Parallelise safely.** Client work and server work touch different folders, so they can run as parallel agents/subagents. Never let two agents edit the same file.
7. **Course-correct early.** Interrupt (Esc) as soon as the agent drifts. Use `/rewind` to roll back, and `/fork` to try a risky idea in a parallel session. Attach screenshots (paste with Ctrl+V) when reporting a visual bug.
8. **Permissions.** Start with the default review-before-write mode. Switch to sandboxed auto-run only once the repo and tests are stable. Never allow destructive commands (`rm -rf`, force push) without asking.
9. **Mention files explicitly** with `@path` so the agent reads the exact file (for example `@server/src/services/trustService.js`).
10. **Commit small.** One commit per task, conventional commits (`feat:`, `fix:`, `chore:`, `docs:`).

Handy commands to know (see Antigravity docs for exact behavior): `/plan`, `/grill-me` (requirements interview), `/goal`, `/swarm` or `/teamwork` (parallel agents), `/browser`, `/rewind`, `/fork`.

---

## 2. Files Antigravity must create first

### 2.1 `AGENTS.md` (repo root)

````md
# HeatHaven AI: Agent Instructions

Read SPEC.md before any task. This file is the short version.

## Stack
- Client: React 19 + Vite, Tailwind CSS, Leaflet, Framer Motion, Recharts. JavaScript (ES modules), JSDoc for types.
- Server: Node.js + Express, MongoDB (Mongoose, 2dsphere), Zod validation. JavaScript (ES modules).
- AI: Google Gemini (model name from env, never hardcoded). Always have a non-AI fallback.
- Weather: Open-Meteo. Maps: Leaflet + OpenStreetMap. Icons: Font Awesome 6.5.1. Fonts: Plus Jakarta Sans, JetBrains Mono.

## Commands
- Install: `npm install` in /client and /server
- Dev: `npm run dev` in each
- Verify: `npm run lint && npm test && npm run build`

## Non-negotiables
- Follow the design tokens in SPEC.md Section 4. Never invent new colours or fonts.
- Small files (aim under 200 lines), one responsibility each, descriptive names, named exports.
- No magic numbers: put them in `constants` files. No `console.log` in committed code.
- Comments explain WHY, not what. Add JSDoc to every service function.
- Every API input is validated with Zod. Every async call has error handling.
- Never delete a spot because it is old. Flag it as unverified (`lastVerifiedAt`).
- Label any mock or seeded data as "simulated" in the UI and docs.
- Respect `prefers-reduced-motion`.

## Workflow
Explore, then plan (Implementation Plan artifact), wait for approval, implement, verify
(lint, test, build, screenshots at 390px and 1280px), then write a Walkthrough artifact.
````

### 2.2 `.agents/rules/` (create these files)

| File | Content (summarise from the section) |
|---|---|
| `design-system.md` | Section 4 in full: tokens, fonts, gradients, components, anti-slop list |
| `animation.md` | Section 6 in full: durations, easing, allowed animations, reduced motion |
| `code-style.md` | Section 8 in full |
| `api-contracts.md` | Section 5 (API contracts, trust score, heat-gap) |
| `testing.md` | Section 9 (what to test, how to verify) |

Rules that must apply to specific files can use a glob activation (for example the design rule for `client/src/**/*.{jsx,css}`).

### 2.3 Optional skills (`.agents/skills/<name>/SKILL.md`)

- `new-component`: create a UI component using tokens, with a hover/focus state and a reduced-motion-safe animation.
- `new-api-route`: route + controller + service + Zod schema + test, following Section 7 folder rules.
- `verify-ui`: run the app, take screenshots at 390 px and 1280 px, and compare against Section 4.

---

## 3. Tech stack and decisions

| Layer | Choice | Why |
|---|---|---|
| Client | React 19, Vite | Fast dev loop |
| Styling | Tailwind CSS with design tokens as CSS variables | Consistency, no stray colours |
| Maps | Leaflet + OpenStreetMap tiles | Free, no key |
| Routing (turn-by-turn) | Leaflet Routing Machine / OSRM | Free |
| Animation | Framer Motion + CSS keyframes | Spring physics + cheap micro-animations |
| Charts | Recharts | Dashboard |
| Server | Node.js, Express | Familiar, quick |
| DB | MongoDB with `2dsphere` | `$nearSphere` search |
| Validation | Zod | One schema per route |
| AI | Gemini (text + vision) via server only | Key never reaches the browser |
| Weather | Open-Meteo (apparent temperature) | Free, no key |
| Tests | Vitest (client), Vitest or Jest + Supertest (server) | Verification loop |
| Lint/format | ESLint + Prettier | Readable, consistent code |

Font and icon loading: prefer self-hosted packages so the PWA works offline: `@fontsource/plus-jakarta-sans` (400, 500, 600, 700, 800), `@fontsource/jetbrains-mono` (400, 500, 600, 700), `@fortawesome/fontawesome-free@6.5.1`. CDN fallback for Font Awesome: `https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css`.

---

## 4. Design system (must match the reference exactly)

### 4.1 Fonts

| Use | Font | Weights |
|---|---|---|
| Body and UI | **Plus Jakarta Sans** | 400, 500, 600, 700, 800 |
| Code, numbers, coordinates, API tags | **JetBrains Mono** | 400, 500, 600, 700 |
| Icons | **Font Awesome 6.5.1** | solid + regular |

Type scale (px): 12, 14, 16, 20, 24, 32, 44. Headings 700 to 800 with `letter-spacing: -0.02em`. Body 400 to 500. Labels 600. Use **JetBrains Mono** for trust score numbers, distance (`180 m`), lat/lng, timestamps and the live activity feed.

### 4.2 Colours (copy these into `tokens.css`)

```css
:root {
  /* Google-style primary palette */
  --blue: #4285F4;
  --red: #EA4335;
  --yellow: #FBBC04;
  --green: #34A853;

  /* Text, borders, surfaces */
  --text: #202124;
  --text-secondary: #5F6368;
  --border: #DADCE0;
  --border-strong: #BDC1C6;
  --bg-light: #F8F9FA;
  --bg-outer: #E8EAED;
  --white: #FFFFFF;
  --chip-bg: #F1F3F4;
  --muted: #9AA0A6;

  /* Dark surfaces (code and terminal panels) */
  --code-bg: #1E1F24;
  --terminal-bg: #131417;
  --dark-line: #32343D;

  /* Light accents */
  --blue-light: #E8F0FE;   --blue-light-2: #EBF3FE;
  --green-light: #E6F4EA;  --green-light-2: #EAF7EE;
  --yellow-light: #FEF7E0; --yellow-light-2: #FEF9E7;
  --red-light: #FCE8E6;    --red-light-2: #FDECEB;

  /* Strong text and interaction colours */
  --blue-strong: #1A73E8;   /* links, hover, focus ring */
  --green-text: #188038;
  --red-text: #D93025;
  --amber-text: #B45309;

  /* Colours for text on dark panels (syntax-style) */
  --on-dark-blue: #8AB4F8;
  --on-dark-yellow: #FDD663;
  --on-dark-green: #81C995;
  --on-dark-red: #F28B82;

  /* Extra surface tints */
  --tint-green: #F2FBF5;
  --tint-blue: #F4F7FE;
  --tint-gray: #F2FBF5; /* see gradients */

  /* Shape and shadow */
  --radius-sm: 8px; --radius-md: 12px; --radius-lg: 16px; --radius-xl: 24px; --radius-pill: 999px;
  --shadow-1: 0 1px 2px rgba(60,64,67,.12), 0 1px 3px 1px rgba(60,64,67,.08);
  --shadow-2: 0 4px 12px rgba(60,64,67,.16);

  /* Fonts */
  --font-body: 'Plus Jakarta Sans', system-ui, sans-serif;
  --font-mono: 'JetBrains Mono', ui-monospace, monospace;
}
```

> Note: `#F2F` style tints in the reference list are `#F2FBF5`, `#F4F7FE`, `#F1F3F4`. Keep them as the only extra tints. Do not add other colours.

### 4.3 Gradients (exact, from the reference)

```css
:root {
  --grad-default:      linear-gradient(135deg, #F4F7FE 0%, #F8F9FA 45%, #F2FBF5 100%);
  --grad-hero:         linear-gradient(135deg, #E8F0FE 0%, #FEF7E0 35%, #FCE8E6 70%, #E6F4EA 100%);
  --grad-blue-green:   linear-gradient(135deg, #EBF3FE 0%, #F8F9FA 52%, #EAF7EE 100%);
  --grad-yellow-blue:  linear-gradient(135deg, #FEF9E7 0%, #F8F9FA 50%, #EBF3FE 100%);
  --grad-red-yellow:   linear-gradient(135deg, #FDECEB 0%, #F8F9FA 52%, #FEF9E7 100%);
  --grad-green-yellow: linear-gradient(135deg, #EAF7EE 0%, #F8F9FA 50%, #FEF9E7 100%);
  --grad-topbar: linear-gradient(90deg,
    #4285F4 25%, #EA4335 25% 50%, #FBBC04 50% 75%, #34A853 75% 100%);
}
```

**Where each gradient is used (do not use them anywhere else):**

| Gradient | Used for |
|---|---|
| Default | App background (every page) |
| Hero multicolor | Splash/onboarding screen and the dashboard header band |
| Blue-Green | Concierge sheet and water-related panels |
| Yellow-Blue | Weather/heat header card and rest-spot panels |
| Red-Yellow | Heat alert banner (danger and extreme levels) |
| Green-Yellow | Verified/success panels and "next kiosk" recommendation cards |
| Top 4-colour bar | 4 px bar fixed at the top of **every** page (the brand signature) |

### 4.4 Category and status mapping

| Meaning | Colour | Icon (Font Awesome) |
|---|---|---|
| Water | Blue `--blue` | `fa-droplet` |
| Shade | Green `--green` | `fa-tree` |
| Rest / seating | Yellow `--yellow` | `fa-chair` |
| Verified (trust 70+) | Green on `--green-light` | `fa-circle-check` |
| Check karo (40 to 69) | Amber text `--amber-text` on `--yellow-light` | `fa-triangle-exclamation` |
| Shayad band (below 40) | Red text `--red-text` on `--red-light` | `fa-circle-xmark` |
| SOS | Red | `fa-kit-medical` / `fa-phone` |
| Voice | Blue | `fa-microphone` |

Heat bands for the heat-index pill (app-defined, tune later): below 32 Normal (green), 32 to 38 Caution (yellow), 38 to 44 Danger (red text on red-yellow), 44 and above Extreme (solid red).

### 4.5 Components

- **Card:** white, 1 px `--border`, `--radius-lg`, `--shadow-1`. On hover (desktop) lift 2 px and use `--shadow-2`.
- **Chip (filter):** `--chip-bg`, pill radius, 40 px min height. Active chip fills with the category colour and white text.
- **Trust badge:** pill with icon + label + mono number, using the light accent background.
- **Buttons:** primary = `--blue` fill, white text, `--blue-strong` on hover; secondary = white with `--border`; destructive-looking actions use red text. Minimum tap target **48 x 48 px**.
- **Bottom sheet:** white, top radius `--radius-xl`, drag handle, three snap points (peek 140 px, half, 90%).
- **Terminal panel (dashboard live feed):** `--terminal-bg` background, `--code-bg` header strip, JetBrains Mono, token colours `--on-dark-*`.
- **Toast:** white card with a 4 px left border in the status colour.
- **Skeleton:** `--chip-bg` blocks with a soft shimmer.

### 4.6 Layout

**Mobile (390 px, the primary design):**
1. 4 px top colour bar (fixed).
2. Header: wordmark "HeatHaven" (800 weight) on the left, heat-index pill and Hindi/English toggle on the right.
3. Full-bleed Leaflet map. Floating chips row (Water / Shade / Rest) below the header.
4. Bottom sheet with the ranked nearest spots (SpotCard list).
5. Floating mic button (blue, bottom right) opens the concierge sheet.
6. Spot detail sheet: name, distance (mono), trust ring, "verified N min pehle", three report buttons, "Route dikhao".

**Desktop (1024 px and up):** left panel 420 px (list + concierge), right map. Header gains a "Dashboard" link.

**Dashboard page:** hero-gradient header band; KPI row of 4 cards, each with a 3 px top border in one Google colour (peak heat = red, relief spots = blue, verified % = green, heat deserts = yellow); grid heat-map; ranked zone table; "Next kiosk" recommendation cards (green-yellow gradient); bar chart of peak heat vs spots; terminal-style live activity feed.

### 4.7 Microcopy (use real copy, never lorem ipsum)

| Where | Hindi / Hinglish | English |
|---|---|---|
| Water chip | Thanda pani | Water |
| Shade chip | Chhaon | Shade |
| Rest chip | Baithne ki jagah | Rest |
| Report buttons | Pani aa raha hai / Sukha hai / Band hai | Water works / Dry / Closed |
| Trust labels | Verified, Check karo, Shayad band | Verified, Check, Likely closed |
| Freshness | 12 min pehle verify hua | Verified 12 min ago |
| Mic hint | Bolkar poochho | Ask by voice |
| Concierge placeholder | Paas mein thanda pani kahan hai? | Where is cold water nearby? |
| Empty state | Is area mein abhi koi spot nahi. Aap pehla jodein. | No spots here yet. Be the first to add one. |
| Gemini down | Abhi AI band hai. Ye sabse paas ke spots hain. | AI is offline. Here are the nearest spots. |

### 4.8 Anti "AI slop" rules (hard rules)

The UI must look designed by a person with a point of view, not generated from a template. **Do not:**

- Use purple or neon gradients, gradient text, glassmorphism blobs, or floating orbs.
- Build a generic "hero + three feature cards + footer" landing page. The app opens **directly on the map**.
- Use emoji as icons. Use Font Awesome only.
- Use stock illustrations, fake testimonials, fake logos or lorem ipsum.
- Use random gradients. Only the seven in Section 4.3, in the places listed.
- Put shadows on everything, or round everything the same. Follow the radius and shadow tokens.
- Centre-align long text. Left-align by default.
- Add animations everywhere. Only the ones in Section 6.
- Use default browser focus rings or unstyled scrollbars. Focus ring = 2 px `--blue-strong` with 2 px offset.

**Do:**

- Let the 4-colour bar, mono numerals and category colours be the recognisable signature.
- Use an 8 px spacing grid, strong alignment, and generous whitespace around the map controls.
- Make data the hero: big mono numbers for distance and trust, clear status colour, short Hindi copy.
- Keep contrast high for sunlight: body text `--text` on white, never light gray on a gradient.

---

## 5. Data, API and algorithms

### 5.1 Environment (`.env.example`)

```bash
PORT=5000
MONGODB_URI=mongodb://localhost:27017/heathaven
CLIENT_ORIGIN=http://localhost:5173
GEMINI_API_KEY=
GEMINI_MODEL=          # choose a Flash-Lite-class model that is free in YOUR AI Studio console
OPEN_METEO_CACHE_MIN=30
DEMO_LAT=28.570        # approximate Sector 18, Noida. Verify on the map.
DEMO_LNG=77.326
```

### 5.2 Data model

```js
// Spot
{
  name: String,
  category: 'water' | 'shade' | 'rest',
  location: { type: 'Point', coordinates: [lng, lat] },   // 2dsphere index
  source: 'osm' | 'manual' | 'crowd',
  lastVerifiedAt: Date,
  trustScore: Number,          // 0 to 100, cached
  status: 'verified' | 'check' | 'likely_closed' | 'unverified',
  reportCounts: { ok: Number, dry: Number, closed: Number },
  aiVerified: Boolean,
  photoUrl: String,
  isSimulated: Boolean,        // true for seeded demo data
  createdAt: Date
}

// Report
{ spotId, type: 'ok' | 'dry' | 'closed', deviceHash: String, createdAt: Date }
```

**Do not use a MongoDB TTL index on spots.** TTL deletes documents. Old spots are only flagged `unverified` (a scheduled job sets the flag after 48 hours with no report) and keep their history.

### 5.3 API contracts

All responses are JSON. Errors: `{ "error": { "code": "...", "message": "..." } }`. Validate every input with Zod.

| Method and path | Input | Output |
|---|---|---|
| `GET /api/health` | none | `{ ok: true }` |
| `GET /api/spots/nearby` | `lat, lng, radius (m, default 1000, max 2000), category?` | `{ heat: { heatIndexC, level }, spots: [ { id, name, category, distanceM, trustScore, status, lastVerifiedAt, location: { lat, lng }, reportCounts, isSimulated } ] }` |
| `POST /api/ai/concierge` | `{ query, lat, lng, lang: 'hi' or 'en' }` | `{ intent, reply, spots: [top 3], source: 'gemini' or 'template' }` |
| `POST /api/spots/:id/report` | `{ type, lat, lng, deviceId }` | updated `{ spot }` with new trust score and status |
| `POST /api/spots/verify-photo` | multipart: `photo`, `spotId` | `{ verified, reason, status }` |
| `GET /api/analytics/heat-gap` | `lat, lng` | `{ cells: [ { id, center, heatIndexC, spotCount, gapScore, rank } ], recommendations: [ { center, reason } ] }` |

### 5.4 Trust score

```text
trust = 50 * freshness + 35 * agreement + 15 * photoCheck

freshness  = max(0, 1 - hoursSinceLastVerified / 48)
agreement  = weighted share of recent "ok" reports (older reports weigh less); 0 if no reports
photoCheck = 1 if Gemini Vision passed, else 0

status: 70+ verified | 40 to 69 check | below 40 likely_closed
no report for 48 hours -> status 'unverified' (never delete)
```

Keep the weights and thresholds in `server/src/constants/trust.js` so they are easy to tune. Write unit tests for freshness decay, agreement weighting and status thresholds.

### 5.5 Report spam guards

- Accept a report only if the reporter is within **200 m** of the spot (server-side distance check).
- Max **1 report per spot per device per hour**.
- Device identity is a hashed random ID stored in the browser. No login, no personal data.

### 5.6 Concierge flow

1. Query arrives (typed or from voice).
2. Gemini extracts **only the intent** (`water | shade | rest`) as JSON.
3. **Code** runs the geo query and ranks by distance, trust and heat.
4. Gemini writes a short Hindi/English reply from the top 2 to 3 results.
5. If Gemini errors or hits a rate limit: return a **template reply** with `source: 'template'`.
6. Cache replies by intent + grid cell for 10 minutes.

Gemini free-tier limits differ between public sources and may change. Check your real limits in the AI Studio console, keep the model name in `.env`, cache aggressively, and never let a Gemini failure break the screen.

### 5.7 Heat-gap method

- Split the pilot area into 500 m grid cells (or 4 to 6 zones to save API calls).
- Heat index per cell/zone from Open-Meteo apparent temperature, cached 30 minutes.
- `gapScore = normalizedHeat * 1 / (verifiedSpots + 1)`. The top 3 cells are "heat deserts".
- "Next kiosk" = centre of the worst cell, with a 500 m coverage circle.
- Only say "covers N workers" if real population data exists; otherwise label it an assumption.

### 5.8 Data seeding

- `server/scripts/importOverpass.js`: one-time import of `amenity=drinking_water` and shelters for the pilot area into `server/data/noida-osm.geojson`, then into MongoDB. **Never call Overpass while the app is running.**
- Pilot bounding box (approximate, verify on a map): south 28.555, west 77.305, north 28.590, east 77.345.
- `server/data/manual-spots.json`: 10 to 15 spots the team verified on the ground, each with a photo.
- `server/scripts/seedDemoReports.js`: demo reports, all flagged `isSimulated: true` and labelled "simulated" in the UI.

---

## 6. Animation spec

Animations must explain state changes, not decorate. Use Framer Motion for springs and layout, CSS keyframes for cheap loops.

**Tokens:**

```css
:root {
  --ease-out: cubic-bezier(0.22, 1, 0.36, 1);
  --ease-in-out: cubic-bezier(0.65, 0, 0.35, 1);
  --dur-fast: 150ms; --dur-base: 250ms; --dur-slow: 400ms; --dur-hero: 600ms;
}
```

| Moment | Animation |
|---|---|
| App load | 4-colour top bar sweeps in (`scaleX` 0 to 1 from the left, 600 ms, `--ease-out`). Header and chips fade up with a 60 ms stagger. |
| Map markers | Drop-in (scale 0.6 to 1 with a small bounce, 350 ms). Staggered 40 ms per marker, max 10 animated. |
| User location | Soft pulsing ring (CSS, 2 s loop). |
| Bottom sheet | Spring (stiffness about 300, damping about 30), snap points, drag with velocity. |
| Spot cards | Staggered fade-up on list change (40 ms steps). Hover lift 2 px (150 ms). |
| Trust ring | Stroke animates 0 to value (600 ms) and the mono number counts up. |
| One-tap report | Button ripple, pin colour cross-fades (400 ms), score ticks to the new value, toast slides in. This is the demo's wow moment, so make it crisp. |
| Concierge | Message bubbles slide up and fade in. Typing dots while waiting. Mic button breathes (scale 1 to 1.06) while listening, plus a small waveform. |
| Dashboard | KPI numbers count up. Grid cells fade in staggered by distance from the centre. Red cells pulse once. Chart bars grow from zero. |
| Loading | Skeleton shimmer, never a blank screen or a spinner alone. |
| Route changes | Short cross-fade (200 ms). No full-page slides. |

**Rules:**

- Animate only `transform` and `opacity` where possible. No animating `width`, `height` or `top`.
- Anything under 60 fps on a mid-range phone must be simplified.
- Respect `prefers-reduced-motion: reduce`: replace movement with instant or fade-only changes.
- One focal animation per screen at a time.

---

## 7. Folder structure

```text
heathaven/
â”œâ”€ AGENTS.md
â”œâ”€ SPEC.md
â”œâ”€ README.md
â”œâ”€ .env.example
â”œâ”€ .gitignore
â”œâ”€ .agents/
â”‚  â”œâ”€ rules/                 # design-system, animation, code-style, api-contracts, testing
â”‚  â””â”€ skills/                # new-component, new-api-route, verify-ui
â”œâ”€ docs/
â”‚  â”œâ”€ ARCHITECTURE.md        # living document, current state only
â”‚  â””â”€ DEMO_SCRIPT.md
â”œâ”€ client/
â”‚  â”œâ”€ index.html
â”‚  â”œâ”€ vite.config.js
â”‚  â”œâ”€ package.json
â”‚  â””â”€ src/
â”‚     â”œâ”€ main.jsx
â”‚     â”œâ”€ App.jsx
â”‚     â”œâ”€ app/                # router.jsx, providers.jsx
â”‚     â”œâ”€ pages/              # MapPage.jsx, DashboardPage.jsx, NotFoundPage.jsx
â”‚     â”œâ”€ features/
â”‚     â”‚  â”œâ”€ spots/           # components/ (SpotCard, SpotSheet, TrustBadge, TrustRing),
â”‚     â”‚  â”‚                   # hooks/ (useNearbySpots), api.js, index.js
â”‚     â”‚  â”œâ”€ map/             # components/ (MapView, SpotMarker, UserLocation), hooks/
â”‚     â”‚  â”œâ”€ reports/         # components/ (ReportButtons), hooks/, api.js
â”‚     â”‚  â”œâ”€ concierge/       # components/ (ConciergeSheet, MicButton, MessageBubble), hooks/ (useVoice), api.js
â”‚     â”‚  â”œâ”€ heat/            # components/ (HeatPill, HeatAlertBanner), hooks/ (useHeat)
â”‚     â”‚  â””â”€ dashboard/       # components/ (KpiCard, GapGrid, ZoneTable, KioskCard, LiveFeed, GapChart), api.js
â”‚     â”œâ”€ components/
â”‚     â”‚  â”œâ”€ ui/              # Button, Chip, Badge, Sheet, Toast, Skeleton
â”‚     â”‚  â””â”€ layout/          # TopColorBar, Header, AppShell
â”‚     â”œâ”€ lib/                # apiClient.js, geo.js, format.js, deviceId.js, constants.js
â”‚     â”œâ”€ i18n/               # hi.json, en.json, useT.js
â”‚     â”œâ”€ styles/             # tokens.css, base.css, animations.css
â”‚     â””â”€ assets/
â””â”€ server/
   â”œâ”€ package.json
   â”œâ”€ data/                  # noida-osm.geojson, manual-spots.json
   â”œâ”€ scripts/               # importOverpass.js, seedManual.js, seedDemoReports.js
   â”œâ”€ tests/                 # trust.test.js, nearby.test.js, report.test.js, concierge.test.js
   â””â”€ src/
      â”œâ”€ index.js            # bootstrap only
      â”œâ”€ app.js              # express app and middleware wiring
      â”œâ”€ config/             # env.js, db.js
      â”œâ”€ constants/          # trust.js, geo.js, heat.js
      â”œâ”€ models/             # Spot.js, Report.js
      â”œâ”€ routes/             # spots.routes.js, ai.routes.js, analytics.routes.js
      â”œâ”€ controllers/        # one per route file
      â”œâ”€ services/           # spotService, trustService, heatService, gridService,
      â”‚                      # conciergeService, geminiService, photoService
      â”œâ”€ middleware/         # validate.js, rateLimit.js, errorHandler.js
      â”œâ”€ jobs/               # flagStaleSpots.js
      â””â”€ utils/              # distance.js, hash.js, cache.js
```

**Structure rules:**

- **Feature folders on the client**: everything about reports lives in `features/reports`. Shared UI lives in `components/ui`.
- **Thin controllers, fat services** on the server. Controllers parse and respond. Services hold logic and are easy to test.
- A file does one thing. If it grows past about 200 lines, split it.
- Import through each feature's `index.js` so internals can change safely.

---

## 8. Code quality rules (easy to read)

- **JavaScript with ES modules.** Add JSDoc types on service functions and component props.
- **Names say what things are:** `getNearbySpots`, `calculateTrustScore`, `isWithinReportRange`. No `data1`, `temp`, `handleStuff`.
- **No magic numbers.** `200`, `48`, `0.35` and similar live in `constants/`.
- **Comments explain why**, not what: "// Old spots are flagged, never deleted, to keep history."
- **Small functions** (about 30 lines max), early returns, no deep nesting.
- **React:** function components, hooks for logic (`useNearbySpots`), components only render. No business logic in JSX. One component per file.
- **Errors are handled everywhere:** loading, empty and error states exist for every data screen.
- **No dead code, no commented-out code, no `console.log`** in commits.
- **Accessibility:** semantic HTML, labels on all buttons (icon buttons need `aria-label`), focus visible, colour is never the only signal (icon + label too), minimum 48 px tap targets.
- **Performance:** lazy-load the dashboard route and chart library, debounce map moves, cap markers (about 50), compress images, keep the first load light for slow data.
- **Security:** Gemini key only on the server, CORS limited to `CLIENT_ORIGIN`, rate-limit write endpoints, validate uploads (type and size).
- **Formatting:** Prettier + ESLint, run on save and before commit.

---

## 9. Testing and verification

| Area | What to test |
|---|---|
| Trust score | Freshness decay, agreement weighting, thresholds, "unverified after 48 h" |
| Nearby API | Radius filter, category filter, sorted by rank, invalid input rejected |
| Reports | 200 m rule, 1 per hour per device, trust score updates |
| Concierge | Gemini mocked: success path and failure path both return a valid reply (`gemini` and `template`) |
| Heat-gap | Grid scoring and top-3 ranking on fixed fixtures |
| UI | Screenshot at 390 px and 1280 px for map page, spot sheet, concierge and dashboard; check contrast and tap targets |
| Animations | Browser recording of the report flow; check it still works with reduced motion |

Done means: lint, tests and build all pass, **and** screenshots match Section 4.

---

## 10. Build phases (paste one prompt per phase)

For every phase: **Plan artifact first, approval, implement, verify, Walkthrough artifact.**

### Phase 1: Foundation and design system
**Prompt:** "Scaffold the monorepo from Section 7. Set up Vite + React 19 + Tailwind, ESLint/Prettier, fonts and Font Awesome, and `tokens.css`, `base.css`, `animations.css` from Sections 4 and 6. Build `TopColorBar`, `Header` and `AppShell` and an empty `MapPage`. Add a design-token preview route at `/dev/tokens`."
**Done when:** the app runs, the colour bar sweep works, and the tokens page shows every colour, gradient and font correctly at 390 px and 1280 px.

### Phase 2: Server, data and nearby API
**Prompt:** "Build the server skeleton, Mongoose models with the 2dsphere index, `importOverpass.js` and `seedManual.js`, and `GET /api/spots/nearby` with Zod validation and tests. Import real Noida data."
**Done when:** `npm test` passes, and a curl to `/api/spots/nearby` near Sector 18 returns real spots sorted by distance.

### Phase 3: Map and spot list
**Prompt:** "Build `MapView`, markers with category icons and drop-in animation, filter chips, the bottom sheet with `SpotCard` list, and `HeatPill` using Open-Meteo through the server (cached 30 min)."
**Done when:** real spots show on the map, chips filter them, and the sheet snaps smoothly. Screenshots attached.

### Phase 4: Reports and trust score
**Prompt:** "Implement the trust score service with tests, the report endpoint with the 200 m and 1-per-hour guards, the `SpotSheet` with `TrustRing` and `ReportButtons`, and live pin/score updates after a report."
**Done when:** tapping "Sukha hai" turns the pin and drops the score with the animation from Section 6. Browser recording attached.

### Phase 5: Concierge
**Prompt:** "Implement `geminiService` (intent + reply, model from env), `conciergeService` with caching and the template fallback, and the `ConciergeSheet`. Add Hindi voice input with the Web Speech API (`hi-IN`) if supported, otherwise hide the mic."
**Done when:** a Hindi query returns a sensible reply; with Gemini disabled, the template reply appears and nothing breaks.

### Phase 6: Dashboard and heat-gap
**Prompt:** "Implement `gridService` and `GET /api/analytics/heat-gap`, then the dashboard: hero header, KPI cards, `GapGrid`, `ZoneTable`, `KioskCard`, `GapChart` and the terminal-style `LiveFeed`."
**Done when:** red zones and a "next kiosk" suggestion show for the pilot area, with animations from Section 6.

### Phase 7: P1 extras (only if time)
**Prompt:** "Add photo verification with Gemini Vision (fallback: status pending), the SOS card (static first-aid steps and a `tel:108` link) and the shade estimate label."

### Phase 8: Polish, demo mode and handover
**Prompt:** "Add `?demo=1` (fixed Sector 18 location, cached responses, seeded simulated reports labelled as simulated), a QR-friendly live report flow, performance pass, accessibility pass, README with setup steps, and `docs/DEMO_SCRIPT.md`."
**Done when:** the full 3-minute demo runs end to end offline-tolerant, and a backup screen recording exists.

**Code freeze at about 85% of the hackathon time.** After that: only bug fixes, mobile testing and demo practice.

---

## 11. Demo script (3 minutes)

1. **Story:** a rider at 43 degrees C does not know where the nearest water is.
2. **Voice:** tap the mic and ask in Hindi. The answer is spoken and a route appears.
3. **Live report:** a QR on the slide. A judge marks a spot "dry" on their own phone. The pin turns red and the trust score drops on the big screen.
4. **Dashboard:** show the heat-desert cells and the "place next kiosk here" card.
5. **Close:** an open relief layer for every platform's workers, plus decision data for officials.

Label all seeded numbers as **simulated pilot data**.

---

## 12. Definition of done (checklist)

- [ ] Design matches Section 4 (tokens, fonts, gradients, icons) at 390 px and 1280 px
- [ ] No banned slop patterns from Section 4.8
- [ ] All P0 features work with real Noida data
- [ ] Every AI path has a non-AI fallback
- [ ] Reports enforce the 200 m and 1-per-hour rules
- [ ] No spot is ever deleted for being old
- [ ] Animations follow Section 6 and respect reduced motion
- [ ] Lint, tests and build pass
- [ ] Mock data is labelled "simulated" in the UI
- [ ] README explains setup in under 10 steps
- [ ] Backup demo video recorded

---

## 13. References used for the Antigravity workflow

- Antigravity docs: rules and workflows (`.agents/rules`, 12,000-character workflow limit, slash-command invocation)
- Antigravity docs: agent skills (`.agents/skills/<name>/SKILL.md`)
- Antigravity docs: best practices (verification loops, explore-plan-execute, `AGENTS.md`/`GEMINI.md`, `/rewind`, `/fork`, parallel subagents, screenshots as evidence)
- Community guides on phased agent workflows (rules, spec, plan, implementation, verification)
