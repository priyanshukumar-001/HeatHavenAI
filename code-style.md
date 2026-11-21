# Code Quality & Style Rules (HeatHaven AI)

These rules ensure readability, maintainability, and accessibility across the HeatHaven codebase.

## 1. Language & Typing
- JavaScript with standard ES modules (`import`/`export`).
- Named exports preferred.
- Add JSDoc annotations to every service function and component props.

## 2. Naming Conventions
- Names must clearly state what things are:
  - Examples: `getNearbySpots`, `calculateTrustScore`, `isWithinReportRange`.
  - Disallowed: `data1`, `temp`, `handleStuff`, `item`.

## 3. Structure & Modularity
- **No magic numbers**: All numbers (`200`, `48`, `0.35`, thresholds, timers) must live in `constants/`.
- **Small files**: Keep files under 200 lines. If a file exceeds this, split it.
- **Small functions**: Aim for ~30 lines max, early returns, shallow nesting.
- **Comments explain WHY, not what**: Focus on rationale (e.g. `// Old spots are flagged, never deleted, to keep history`).
- **React patterns**: Function components only. Extract business logic into custom hooks (`useNearbySpots`). No business logic directly in JSX. One component per file.

## 4. Error Handling & State Coverage
- Errors handled gracefully at all levels.
- Every data screen must handle:
  1. Loading state (skeleton shimmer)
  2. Empty state (clear user guidance)
  3. Error state (actionable message)
- No dead code, no commented-out code, and **no `console.log` in committed code**.

## 5. Accessibility (a11y)
- Semantic HTML (`main`, `nav`, `section`, `article`, `header`).
- Meaningful labels on all buttons. Every icon button must have `aria-label`.
- Clear, visible focus ring (`2px --blue-strong` with `2px` offset).
- Colour must never be the only signal (pair colours with Font Awesome icons and text labels).
- Minimum tap target: **48 x 48 px**.

## 6. Performance & Security
- Lazy-load the dashboard route and charting libraries (`Recharts`).
- Debounce map movements; cap rendered markers (~50 max).
- Compress images; ensure fast initial load on slow 3G/4G networks.
- Store `GEMINI_API_KEY` exclusively on the server—never expose to the browser.
- Restrict server CORS strictly to `CLIENT_ORIGIN`.
- Rate-limit report submissions and write endpoints.
- Validate upload MIME types and file sizes.
- Format using Prettier + ESLint before any commit.

