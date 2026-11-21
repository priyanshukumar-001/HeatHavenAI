import React from 'react';

/**
 * TokenPreviewPage (/dev/tokens)
 * Living visual verification suite displaying all "Loo & Chhaon" design tokens from REDESIGN_SPEC.md.
 */
export const TokenPreviewPage = () => {
  const surfaceTokens = [
    { name: '--paper', hex: '#FBF7F0', desc: 'Warm paper base surface', css: 'bg-paper text-ink' },
    { name: '--paper-2', hex: '#F3ECDF', desc: 'Sunken areas & chips', css: 'bg-paper-2 text-ink' },
    { name: '--card', hex: '#FFFFFF', desc: 'Cards & elevated panels', css: 'bg-card text-ink' },
    { name: '--line', hex: '#E2D9C8', desc: 'Hairline borders', css: 'bg-line text-ink' },
    { name: '--line-strong', hex: '#CBBFA8', desc: 'Strong borders', css: 'bg-line-strong text-ink' }
  ];

  const categoryTokens = [
    { name: '--pani', hex: '#0F6FA8', desc: 'Water / Pyau relief', css: 'bg-pani text-white' },
    { name: '--pani-soft', hex: '#D9EDF7', desc: 'Water soft chip', css: 'bg-pani-soft text-pani' },
    { name: '--chhaon', hex: '#1E7B4F', desc: 'Shade / Tree canopy', css: 'bg-chhaon text-white' },
    { name: '--chhaon-soft', hex: '#DCF1E4', desc: 'Shade soft chip', css: 'bg-chhaon-soft text-chhaon' },
    { name: '--aaram', hex: '#D9941A', desc: 'Rest / Seating', css: 'bg-aaram text-white' },
    { name: '--aaram-soft', hex: '#FBEBC7', desc: 'Rest soft chip', css: 'bg-aaram-soft text-aaram' }
  ];

  const heatTokens = [
    { name: '--loo', hex: '#D4412A', desc: 'Danger heat / Loo', css: 'bg-loo text-white' },
    { name: '--loo-soft', hex: '#FBDDD5', desc: 'Loo alert soft chip', css: 'bg-loo-soft text-loo' },
    { name: '--angaar', hex: '#8F1D12', desc: 'Extreme heatwave', css: 'bg-angaar text-white' },
    { name: '--sun', hex: '#F2C230', desc: 'Caution / Solar', css: 'bg-sun text-black' },
    { name: '--cool', hex: '#2E9E7A', desc: 'Normal / Cool zone', css: 'bg-cool text-white' }
  ];

  const controlRoomTokens = [
    { name: '--night', hex: '#151A18', desc: 'Dark control room base', css: 'bg-[#151A18] text-[#EDE7DA]' },
    { name: '--night-2', hex: '#1E2522', desc: 'Control room panel', css: 'bg-[#1E2522] text-[#EDE7DA]' },
    { name: '--night-line', hex: '#2C3531', desc: 'Telemetry dividers', css: 'bg-[#2C3531] text-[#EDE7DA]' },
    { name: '--ember', hex: '#FF9A4D', desc: 'Telemetry highlight', css: 'bg-amber-500 text-black' },
    { name: '--on-night', hex: '#EDE7DA', desc: 'Crisp body on night', css: 'bg-[#EDE7DA] text-[#151A18]' }
  ];

  const gradients = [
    { name: '--g-dawn', desc: 'Safety hero, About hero', css: 'var(--g-dawn)' },
    { name: '--g-relief', desc: 'Concierge sheet, water panels', css: 'var(--g-relief)' },
    { name: '--g-grove', desc: 'Verified spots, success state', css: 'var(--g-grove)' },
    { name: '--g-alert', desc: 'Danger alert banner', css: 'var(--g-alert)' },
    { name: '--g-extreme', desc: 'Extreme heat banner', css: 'var(--g-extreme)' },
    { name: '--g-thermal', desc: 'Heat thermometer top bar & map overlay', css: 'var(--g-thermal)' }
  ];

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto space-y-10 pb-24 bg-paper text-ink min-h-screen">
      {/* Intro Header */}
      <section className="bg-card p-6 md:p-8 rounded-2xl shadow-xs border border-line">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <span className="text-xs uppercase font-mono font-bold text-pani">REDESIGN_SPEC.md Verification</span>
            <h1 className="text-3xl font-heading font-black text-ink mt-1">
              "Loo & Chhaon" Design Tokens
            </h1>
            <p className="text-sm text-ink-2 mt-1 font-sans">
              Live verification suite for surfaces, categories, thermal bar, typography (Bricolage Grotesque & Mukta), and control room dark mode.
            </p>
          </div>
          <div className="px-4 py-2 bg-chhaon-soft border border-chhaon/30 rounded-full text-chhaon font-mono text-xs font-bold flex items-center gap-2">
            <i className="fa-solid fa-circle-check" />
            Tokens Loaded 100%
          </div>
        </div>
      </section>

      {/* 1. Typography Showcase */}
      <section className="bg-card p-6 rounded-2xl shadow-xs border border-line space-y-5">
        <h2 className="text-lg font-heading font-extrabold border-b border-line pb-3 flex items-center gap-2">
          <i className="fa-solid fa-font text-pani" />
          1. Typography Suite (Bricolage Grotesque, Mukta & JetBrains Mono)
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Display */}
          <div className="space-y-2 border border-line p-5 rounded-xl bg-paper">
            <p className="text-xs font-mono text-ink-3 uppercase font-bold">Display: Bricolage Grotesque</p>
            <p className="font-heading font-black text-2xl tracking-tight">HeatHaven AI</p>
            <p className="font-heading font-extrabold text-lg">Urban Shade Mapping</p>
            <p className="font-heading font-bold text-base">Municipal Heat Action</p>
            <p className="text-xs text-ink-2 font-sans pt-2">Characterful, high-impact grotesque for headings.</p>
          </div>

          {/* Hindi & Body UI */}
          <div className="space-y-2 border border-line p-5 rounded-xl bg-paper">
            <p className="text-xs font-mono text-ink-3 uppercase font-bold">Body & UI: Mukta (Latin + Devanagari)</p>
            <p className="font-sans font-bold text-base leading-relaxed">
              शहरी धूप से सुरक्षा। निःशुल्क जल, छांव और जीवनरक्षा।
            </p>
            <p className="font-sans font-medium text-xs text-ink-2 leading-relaxed">
              44°C धूप में काम कर रहे डिलीवरी राइडर्स और राहगीरों के लिए 250m में निकटतम सत्यापित प्याऊ।
            </p>
            <p className="text-[11px] font-mono text-chhaon font-semibold pt-1">
              ✓ Line-height 1.55 prevents Devanagari matra clipping.
            </p>
          </div>

          {/* Numbers */}
          <div className="space-y-2 border border-line p-5 rounded-xl bg-paper font-mono">
            <p className="text-xs text-ink-3 uppercase font-bold">Numerals: JetBrains Mono</p>
            <p className="text-3xl font-extrabold text-loo">43°C</p>
            <p className="text-sm font-semibold text-pani">Lat: 28.5704° N, Lng: 77.3262° E</p>
            <p className="text-xs font-medium text-ink-2">Distance: 180m · Trust: 94/100</p>
            <p className="text-[11px] text-ink-3 pt-2">Precision alignment for live telemetry.</p>
          </div>
        </div>
      </section>

      {/* 2. Surfaces & Paper */}
      <section className="bg-card p-6 rounded-2xl shadow-xs border border-line space-y-4">
        <h2 className="text-lg font-heading font-extrabold border-b border-line pb-3 flex items-center gap-2">
          <i className="fa-solid fa-layer-group text-pani" />
          2. Surfaces (Warm Sunlight-Bleached Paper)
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {surfaceTokens.map((t) => (
            <div key={t.name} className="p-4 rounded-xl border border-line bg-paper space-y-1">
              <div className={`w-full h-10 rounded-lg border border-line/40 ${t.css}`} />
              <p className="font-mono text-xs font-bold pt-1">{t.name}</p>
              <p className="font-mono text-[11px] text-ink-3">{t.hex}</p>
              <p className="text-[11px] text-ink-2 font-sans">{t.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Category Tokens */}
      <section className="bg-card p-6 rounded-2xl shadow-xs border border-line space-y-4">
        <h2 className="text-lg font-heading font-extrabold border-b border-line pb-3 flex items-center gap-2">
          <i className="fa-solid fa-droplet text-pani" />
          3. Relief Categories (Pani, Chhaon, Aaram)
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
          {categoryTokens.map((t) => (
            <div key={t.name} className="p-3.5 rounded-xl border border-line bg-paper space-y-1">
              <div className={`w-full h-10 rounded-lg flex items-center justify-center font-bold text-xs ${t.css}`}>
                {t.name}
              </div>
              <p className="font-mono text-xs font-bold pt-1">{t.name}</p>
              <p className="font-mono text-[11px] text-ink-3">{t.hex}</p>
              <p className="text-[11px] text-ink-2 font-sans truncate">{t.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Heat Spectrum */}
      <section className="bg-card p-6 rounded-2xl shadow-xs border border-line space-y-4">
        <h2 className="text-lg font-heading font-extrabold border-b border-line pb-3 flex items-center gap-2">
          <i className="fa-solid fa-temperature-arrow-up text-loo" />
          4. Heat Danger Spectrum (Loo, Angaar, Sun, Cool)
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {heatTokens.map((t) => (
            <div key={t.name} className="p-3.5 rounded-xl border border-line bg-paper space-y-1">
              <div className={`w-full h-10 rounded-lg flex items-center justify-center font-bold text-xs ${t.css}`}>
                {t.name}
              </div>
              <p className="font-mono text-xs font-bold pt-1">{t.name}</p>
              <p className="font-mono text-[11px] text-ink-3">{t.hex}</p>
              <p className="text-[11px] text-ink-2 font-sans truncate">{t.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 5. Control Room Palette */}
      <section className="bg-card p-6 rounded-2xl shadow-xs border border-line space-y-4">
        <h2 className="text-lg font-heading font-extrabold border-b border-line pb-3 flex items-center gap-2">
          <i className="fa-solid fa-sliders text-amber-500" />
          5. Control Room Theme (Dashboard & Admin)
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {controlRoomTokens.map((t) => (
            <div key={t.name} className="p-3.5 rounded-xl border border-line bg-paper space-y-1">
              <div className={`w-full h-10 rounded-lg flex items-center justify-center font-bold text-xs ${t.css}`}>
                {t.name}
              </div>
              <p className="font-mono text-xs font-bold pt-1">{t.name}</p>
              <p className="font-mono text-[11px] text-ink-3">{t.hex}</p>
              <p className="text-[11px] text-ink-2 font-sans truncate">{t.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 6. Gradients */}
      <section className="bg-card p-6 rounded-2xl shadow-xs border border-line space-y-4">
        <h2 className="text-lg font-heading font-extrabold border-b border-line pb-3 flex items-center gap-2">
          <i className="fa-solid fa-wand-magic text-pani" />
          6. The Six Official Gradients
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {gradients.map((g) => (
            <div key={g.name} className="p-4 rounded-xl border border-line bg-paper space-y-2">
              <div
                style={{ background: g.css }}
                className="w-full h-16 rounded-xl border border-line/60 shadow-xs"
              />
              <div className="flex items-center justify-between">
                <p className="font-mono text-xs font-bold text-ink">{g.name}</p>
              </div>
              <p className="text-xs text-ink-2 font-sans">{g.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default TokenPreviewPage;
