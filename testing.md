# Testing & Verification Rules (HeatHaven AI)

Every phase requires automated and manual verification before concluding.

## 1. Automated Test Scope
| Area | Verification Targets |
|---|---|
| **Trust Score Service** | Freshness decay calculations, agreement weighting, status tier thresholds, `unverified` transition after 48h. |
| **Nearby API** | Radius filtering (default 1000m, max 2000m), category filtering, distance sorting, Zod schema validation errors. |
| **Report Submission** | 200m distance threshold enforcement, 1-per-hour rate limit per device, trust score updates. |
| **Concierge Service** | Mocked Gemini responses, template fallback on failure/timeout, top spots matching. |
| **Heat-Gap Analytics** | Grid cell scoring, gap score calculations, top-3 heat desert ranking on fixture data. |

## 2. UI & Responsive Verification
- Capture and review screenshots at **390 px** (mobile priority) and **1280 px** (desktop).
- Verify minimum tap target sizes (48 x 48 px).
- Verify color contrast against bright ambient light.
- Verify micro-animations with Framer Motion and check behavior with `prefers-reduced-motion: reduce`.

## 3. Definition of Done Checklist
- `npm run lint` passes without errors or warnings.
- `npm test` passes 100% on client and server.
- `npm run build` succeeds cleanly.
- Visual inspection at 390px and 1280px matches Section 4 design tokens.
- Walkthrough artifact documented.

