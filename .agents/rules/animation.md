# Animation Spec Rules (HeatHaven AI — Loo & Chhaon v2)

Animations must explain state changes, not decorate. Use Framer Motion for springs, layout, and gestures; CSS for loops. Animate `transform` and `opacity` only. Respect `prefers-reduced-motion` and low-data toggle.

## 1. Tokens
```css
:root {
  --ease-out: cubic-bezier(0.22, 1, 0.36, 1);
  --ease-in-out: cubic-bezier(0.65, 0, 0.35, 1);
  --dur-fast: 150ms;
  --dur-base: 250ms;
  --dur-slow: 400ms;
  --dur-hero: 600ms;
}
```

## 2. Interaction & Transition Matrix (REDESIGN_SPEC Section 5)
| Moment | Animation |
|---|---|
| **App load** | Thermometer bar sweeps in (600 ms) and marker settles at current heat. Header and chips rise with 60 ms stagger. |
| **Heat pill** | Number counts up; colour band cross-fades when level changes. |
| **Pins** | Drop-in with small bounce (350 ms), 40 ms stagger, max 10. Selected pin springs larger. |
| **Pin to sheet** | Shared-element transition between pin, card, and detail (`layoutId`). |
| **Sheet** | Spring physics (stiffness ~300, damping ~30), rubber-band at limits. |
| **Trust ring** | Stroke 0 to value (600 ms), mono number counts up. |
| **One-tap report** | Ripple on button, pin colour cross-fade (400 ms), score ticks, toast slides in, ring pulse on map. |
| **Mode switch (Spots/Heat/Gaps)** | Overlay cross-fades (300 ms); legend slides in. |
| **Time slider** | Overlay tint and numbers tween smoothly while dragging (throttled). |
| **Cooling transition** | Opening a verified relief spot shifts sheet tint from warm to cool over 400 ms. |
| **Concierge** | Bubbles slide up; typing dots; mic "breathes" while listening with small waveform. |
| **Scroll pages** | Sections reveal on scroll (fade and 16 px rise, once). Big numerals count up once. |
| **Dashboard** | KPI count-up, grid cells fade by distance from centre, red cells pulse once, chart bars grow. |
| **Route changes** | 200 ms cross-fade only. |

## 3. Performance & Accessibility
- Exactly one focal animation per screen.
- Respect `prefers-reduced-motion: reduce`: static or instantaneous changes only.
- If a mid-range Android profile drops below 50 fps, simplify the animation.
