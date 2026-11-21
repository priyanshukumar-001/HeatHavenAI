# HeatHaven AI: Agent Instructions

Read `REDESIGN_SPEC.md` and `SPEC.md` before any task. Where `REDESIGN_SPEC.md` conflicts with `SPEC.md` Sections 4 and 6 (palette, gradients, "never invent colours"), `REDESIGN_SPEC.md` wins.

## Stack
- Client: React 19 + Vite, Tailwind CSS, Leaflet / MapLibre GL, Framer Motion, Recharts. JavaScript (ES modules), JSDoc for types.
- Server: Node.js + Express, MongoDB (Mongoose, 2dsphere), Zod validation. JavaScript (ES modules).
- AI: Google Gemini (model name from env, never hardcoded). Always have a non-AI fallback.
- Weather: Open-Meteo. Maps: MapLibre GL / Leaflet + OpenFreeMap / OpenStreetMap. Icons: Font Awesome 6.5.1 + custom inline SVG pins.
- Fonts: Bricolage Grotesque (display), Mukta (body & Devanagari UI), JetBrains Mono (numerals & code).

## Commands
- Install: `npm install` in /client and /server
- Dev: `npm run dev` in each
- Verify: `npm run lint && npm test && npm run build`

## Non-negotiables
- Follow the design tokens in `REDESIGN_SPEC.md` Section 2 ("Loo & Chhaon" theme).
- Small files (aim under 200 lines), one responsibility each, descriptive names, named exports.
- No magic numbers: put them in `constants` files. No `console.log` in committed code.
- Comments explain WHY, not what. Add JSDoc to every service function.
- Every API input is validated with Zod. Every async call has error handling.
- Never delete a spot because it is old. Flag it as unverified (`lastVerifiedAt`).
- Label any mock or seeded data as "simulated" in the UI and docs.
- Respect `prefers-reduced-motion` and low-data modes.
- Passkey for admin must come from server environment only; never expose in client or docs.

## Workflow
Explore, then plan (Implementation Plan artifact), wait for approval, implement, verify
(lint, test, build, screenshots at 390px and 1280px), then write a Walkthrough artifact.

