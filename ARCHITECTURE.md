# HeatHaven AI Architecture

> Living document of the system architecture and current implementation state.

---

## 1. System Overview

```
                      +---------------------------------------+
                      |          Client (React 19 PWA)        |
                      |  - Leaflet Map (Noida Pilot)          |
                      |  - One-Tap Reports (ok/dry/closed)    |
                      |  - Voice/Text AI Concierge (Hindi/En) |
                      |  - Heat-Gap Dashboard (Recharts)      |
                      +-------------------+-------------------+
                                          |
                                HTTP / REST API
                                          |
                      +-------------------+-------------------+
                      |      Server (Node.js / Express)       |
                      |  - Geospatial Queries ($nearSphere)   |
                      |  - Trust Score Engine (freshness/agr) |
                      |  - Anti-Spam (200m GPS fence + rate)  |
                      |  - Heat Index Cache (Open-Meteo)      |
                      |  - Heat-Gap Analytics Engine          |
                      +---------+-------------------+---------+
                                |                   |
                 +--------------+--+             +--+--------------+
                 | MongoDB 2dsphere|             | Google Gemini AI|
                 | - Spots         |             | - Intent parse  |
                 | - Reports       |             | - Bilingual text|
                 +-----------------+             | - Vision check  |
                                                 +-----------------+
```

---

## 2. Current Implementation State

### Phase 1: Foundation & Design System (Completed)
- Monorepo structure with `client/` and `server/`.
- Full design system in `client/src/styles/tokens.css`, `base.css`, and `animations.css`.
- Google-inspired palette, 7 approved gradients, Plus Jakarta Sans & JetBrains Mono fonts, and Font Awesome 6.5.1 icons.
- `TopColorBar` brand sweep animation (600ms, `scaleX: 0 -> 1`).
- `Header` component with wordmark, apparent temperature heat pill, Hindi/English language toggle, and desktop navigation.
- `AppShell` responsive wrapper.
- `/dev/tokens` visual gallery displaying all design tokens and interaction components.
- Zero lint errors (`npm run lint`), passing automated test suite (`npm test`), and verified production build (`npm run build`).

### Next Phases:
- **Phase 2**: Server models (`Spot`, `Report`), Mongoose `2dsphere` indexes, Noida OSM data import, manual ground-truth spots, and `GET /api/spots/nearby`.
- **Phase 3**: Leaflet map integration, custom category markers with drop-in animations, bottom sheet with ranked spot cards, and Open-Meteo weather integration.
- **Phase 4**: Trust score service with mathematical decay, `POST /api/spots/:id/report` with 200m fence, and live UI pin cross-fades.
- **Phase 5**: Gemini AI concierge with intent extraction, bilingual prompts, and deterministic fallback.
- **Phase 6**: Heat-gap analytics and municipal dashboard with live activity feed.
- **Phase 7**: Vision photo validation, SOS emergency card (`tel:108`), and shade estimates.
- **Phase 8**: Demo mode (`?demo=1`), simulated report fixtures, and complete demo script.

