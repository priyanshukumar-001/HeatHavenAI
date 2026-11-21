# Design System Rules (HeatHaven AI — Loo & Chhaon v2)

This rule defines the design system requirements for HeatHaven AI based on `REDESIGN_SPEC.md`. Where this file conflicts with legacy `SPEC.md` Sections 4 and 6, this file wins.

## 1. Fonts (Self-hosted via @fontsource)
| Use | Font | Weights |
|---|---|---|
| Display / headings (Latin) | **Bricolage Grotesque** | 600, 700, 800 |
| Body & UI (Latin + Devanagari) | **Mukta** | 400, 500, 600, 700, 800 |
| Numbers, distance, coords, code | **JetBrains Mono** | 500, 600, 700 |
| Icons | **Font Awesome 6.5.1** + Custom inline SVG teardrop pins | 2px stroke |

- Type scale (px): 12, 14, 16, 18, 22, 28, 36, 48.
- Hindi line-height: `1.55` body so Devanagari matras never clip.
- Hindi renders in Mukta everywhere; never fall back to system font.

## 2. Colour Tokens ("Loo & Chhaon")
```css
:root {
  /* Surfaces: warm paper, easier on the eyes than pure white in sunlight */
  --paper:   #FBF7F0;
  --paper-2: #F3ECDF;   /* sunken areas, chips */
  --card:    #FFFFFF;
  --line:    #E2D9C8;
  --line-strong: #CBBFA8;

  /* Text */
  --ink:   #1B2421;     /* body, high contrast (WCAG AA) */
  --ink-2: #4A5651;     /* secondary */
  --ink-3: #6B766F;     /* tertiary */

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

  /* Radius */
  --radius-sm: 10px;
  --radius-md: 16px;
  --radius-lg: 28px;
  --radius-pill: 999px;
}
```

## 3. Gradients (Exactly these six, each with one job)
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

- Subtle SVG film grain (`feTurbulence`, opacity 0.05) over `--g-dawn` and dashboard header only.

## 4. Signature Elements
1. **Heat Thermometer Bar**: 4px `--g-thermal` fixed bar at top of every page with live position marker.
2. **Ambient Heat Mode**: `--ambient` CSS tint variable derived from current heat index.
3. **Mono numerals**: Big JetBrains Mono numerals for trust scores, distance, and temperatures.
4. **Hindi-first microcopy**: Natural colloquial terminology (*Loo*, *Chhaon*, *Pani*, *Pyau*).

## 5. Anti-Slop Rules (Strictly Enforced)
- NO thick coloured border on one side of a card (top or left). Use an icon chip and small colour dot instead.
- NO purple/neon gradients, gradient text, glassmorphism blobs, or floating orbs.
- NO generic hero + 3 identical card feature row. Varied layout, asymmetry, real ground photos.
- Real ground photos only (compressed WebP/AVIF). No stock photos or AI illustrations.
- One focal animation per screen.
- High contrast for bright sunlight (WCAG AA compliant).
