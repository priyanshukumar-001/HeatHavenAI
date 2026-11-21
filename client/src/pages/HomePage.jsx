import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CurrentLocationCard from '../features/location/components/CurrentLocationCard.jsx';

// Physics-based easing animations
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.04
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: [0.22, 1, 0.36, 1]
    }
  }
};

const pulseVariants = {
  pulse: {
    scale: [1, 1.03, 1],
    transition: { duration: 2.2, repeat: Infinity, ease: 'easeInOut' }
  }
};

/**
 * HomePage Component (Loo & Chhaon Theme - Modern High-Contrast Gen-Z Style)
 * Includes real-time shade mapping, Loo & mask guidance, ORS recipe calculator,
 * and immediate civic emergency actions.
 */
export const HomePage = ({
  userCoords,
  onUpdateCoords,
  onNavigate,
  onOpenConcierge,
  onOpenSos,
  onOpenAuth: _onOpenAuth,
  auth: _auth,
  heatIndexC = 42,
  heatLevel: _heatLevel = 'danger',
  lang = 'en'
}) => {
  const [activeTabGuide, setActiveTabGuide] = useState('gamcha'); // 'gamcha' | 'ors' | 'triage'
  const [orsUnits, setOrsUnits] = useState(1); // 1 Liter scale

  // Chhaon Microclimate Blocks in Delhi-NCR (250m Granularity)
  const chhaonBlocks = [
    {
      id: 'atta_market',
      zone: 'Atta Market Sector 18 (Noida)',
      ambientTemp: 41.5,
      microclimateTemp: 47.8,
      treeCanopy: '4% (Treeless Asphalt)',
      refugeName: 'Pocket-A Banyan Tree Grove (36.2°C)',
      walkTime: '3 min walk (240m)',
      category: 'shade',
      action: 'Seek shade under dense banyan tree corridor'
    },
    {
      id: 'cp_inner',
      zone: 'Connaught Place Block A Colonnade (Delhi)',
      ambientTemp: 42.0,
      microclimateTemp: 38.4,
      treeCanopy: 'Colonnade Arcade (Built Heritage Shade)',
      refugeName: 'Gurudwara Bangla Sahib 24/7 Jal Seva',
      walkTime: '5 min walk (380m)',
      category: 'water',
      action: '24/7 RO Chilled Water Dispenser & Covered Seating'
    },
    {
      id: 'anand_vihar',
      zone: 'Anand Vihar ISBT Transit Island (Delhi)',
      ambientTemp: 42.8,
      microclimateTemp: 48.6,
      treeCanopy: '2% (Exposed Concrete Transit)',
      refugeName: 'DUSIB Rain Basera Heat Shelter Tent',
      walkTime: '2 min walk (180m)',
      category: 'shade',
      action: 'Misting Fans + 5000L DJB Water Tanker Post'
    }
  ];

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="flex-1 overflow-y-auto pb-24 space-y-8 bg-paper text-ink"
    >
      {/* 1. Civic Hero Banner */}
      <section className="bg-card border-b border-line px-4 py-8 md:px-12 md:py-12 shadow-xs">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-8">
          <motion.div variants={itemVariants} className="space-y-4 max-w-2xl">
            {/* National & State Advisory Pill */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[11px] font-mono font-bold uppercase px-3 py-1 rounded-full bg-paper-2 text-ink-2 border border-line">
                🇮🇳 NDMA & DDMA Heat Protocol
              </span>
              <motion.span
                variants={pulseVariants}
                animate="pulse"
                className="text-[11px] font-mono text-loo font-bold flex items-center gap-1.5 bg-loo-soft px-3 py-1 rounded-full border border-loo/30 shadow-xs"
              >
                <span className="w-2 h-2 rounded-full bg-loo animate-ping" />
                {heatIndexC}°C {lang === 'hi' ? 'भीषण लू चेतावनी (Red Alert)' : 'Extreme Heat Red Alert'}
              </motion.span>
            </div>

            <h1 className="text-3xl md:text-5xl font-heading font-black text-ink tracking-tight leading-tight">
              {lang === 'hi'
                ? 'शहरी धूप से सुरक्षा। निःशुल्क जल, छांव और जीवनरक्षा।'
                : 'Delhi-NCR Real-Time Heat Relief & Shade Mapping.'}
            </h1>

            <p className="text-sm md:text-base text-ink-2 leading-relaxed font-sans">
              {lang === 'hi'
                ? '44°C धूप में काम कर रहे डिलीवरी राइडर्स, ऑटो चालकों, वेंडर्स और राहगीरों के लिए 250m के दायरे में निकटतम सत्यापित प्याऊ, छायादार पेड़ और रैन बसेरे।'
                : 'Built for outdoor gig workers, street vendors, and daily commuters navigating extreme urban heat. Locate free community water kiosks, verified tree canopies, and emergency cooling shelters in under 2 seconds.'}
            </p>

            {/* Main Action Buttons (Modern Tactile Pills) */}
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                onClick={() => onNavigate('map')}
                className="h-11 px-6 rounded-full bg-pani hover:brightness-110 text-white text-sm font-bold flex items-center gap-2 shadow-sm active:scale-95 transition-all"
              >
                <i className="fa-solid fa-map-location-dot" />
                <span>{lang === 'hi' ? 'लाइव रिलीफ मैप खोलें' : 'Open Live Relief Map'}</span>
              </button>

              <button
                onClick={onOpenConcierge}
                className="h-11 px-5 rounded-full bg-card hover:bg-paper-2 border border-line text-ink text-sm font-bold flex items-center gap-2 shadow-xs active:scale-95 transition-all"
              >
                <i className="fa-solid fa-wand-magic-sparkles text-pani" />
                <span>{lang === 'hi' ? 'AI सहायक से पूछें' : 'AI Heat Concierge'}</span>
              </button>

              <button
                onClick={onOpenSos}
                className="h-11 px-5 rounded-full bg-loo-soft hover:bg-loo-soft/80 border border-loo/30 text-loo text-sm font-bold flex items-center gap-2 shadow-xs active:scale-95 transition-all"
              >
                <i className="fa-solid fa-truck-medical text-loo animate-pulse" />
                <span>{lang === 'hi' ? 'आपातकालीन SOS (108)' : 'Heatstroke SOS (108)'}</span>
              </button>
            </div>
          </motion.div>

          {/* Right: Live Meteorological Telemetry Dashboard */}
          <motion.div
            variants={itemVariants}
            whileHover={{ scale: 1.02 }}
            className="w-full md:w-[320px] bg-card p-6 rounded-2xl border border-line shadow-sm space-y-4"
          >
            <div className="flex items-center justify-between border-b border-line pb-3">
              <div className="flex items-center gap-2">
                <i className="fa-solid fa-cloud-sun text-aaram text-base" />
                <span className="text-xs font-bold text-ink uppercase tracking-wider">
                  Live IMD Telemetry
                </span>
              </div>
              <span className="text-[10px] font-mono text-chhaon font-bold bg-chhaon-soft px-2.5 py-0.5 rounded-full">
                ● Live Sync
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-left">
              <div className="p-3 bg-paper-2 rounded-xl border border-line">
                <span className="text-[11px] text-ink-2 font-semibold">Apparent Heat</span>
                <p className="text-xl font-extrabold text-loo font-mono mt-0.5">{heatIndexC}°C</p>
                <span className="text-[10px] text-ink-3">Feels Like 46°C</span>
              </div>

              <div className="p-3 bg-paper-2 rounded-xl border border-line">
                <span className="text-[11px] text-ink-2 font-semibold">Humidity</span>
                <p className="text-xl font-extrabold text-pani font-mono mt-0.5">38%</p>
                <span className="text-[10px] text-ink-3">Dry Loo Winds</span>
              </div>

              <div className="p-3 bg-paper-2 rounded-xl border border-line">
                <span className="text-[11px] text-ink-2 font-semibold">Wind Speed</span>
                <p className="text-xl font-extrabold text-aaram font-mono mt-0.5">22 km/h</p>
                <span className="text-[10px] text-ink-3">Westerly Gusts</span>
              </div>

              <div className="p-3 bg-paper-2 rounded-xl border border-line">
                <span className="text-[11px] text-ink-2 font-semibold">UV Index</span>
                <p className="text-xl font-extrabold text-loo font-mono mt-0.5">10.4</p>
                <span className="text-[10px] text-ink-3">Very High Risk</span>
              </div>
            </div>

            <div className="p-3 bg-aaram-soft/50 rounded-xl border border-aaram/30 flex items-center gap-2.5">
              <i className="fa-solid fa-triangle-exclamation text-aaram text-sm shrink-0" />
              <p className="text-[11px] font-semibold text-ink-2 leading-tight font-sans">
                {lang === 'hi'
                  ? 'दोपहर 12 से 4 बजे के बीच सीधी धूप में लगातार 45 मिनट से अधिक न रहें।'
                  : 'Avoid continuous direct exposure over 45 mins between 12-4 PM.'}
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 2. Embedded Real-Time GPS Location Detector */}
      <section className="max-w-5xl mx-auto px-4">
        <CurrentLocationCard
          userCoords={userCoords}
          onUpdateCoords={onUpdateCoords}
          onOpenMapWithCoords={(coords) => {
            if (coords) onUpdateCoords(coords);
            onNavigate('map');
          }}
          onNavigateToMap={() => onNavigate('map')}
          lang={lang}
        />
      </section>

      {/* 3. Chhaon (IIIT Delhi Inspired) Shade & Microclimate Mapping */}
      <section className="max-w-5xl mx-auto px-4 space-y-4">
        <motion.div variants={itemVariants} className="flex flex-col md:flex-row md:items-end justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-bold uppercase px-2.5 py-0.5 rounded-full bg-chhaon-soft text-chhaon border border-chhaon/30">
                CHHAON (छांव) URBAN SHADE MODEL
              </span>
              <span className="text-xs font-mono text-ink-2">
                250-Meter Microclimate Grid
              </span>
            </div>
            <h2 className="text-xl md:text-2xl font-heading font-extrabold text-ink mt-1">
              {lang === 'hi'
                ? 'शहरी हीट आइलैंड एवं निकटतम छायादार शरणस्थल'
                : 'Urban Heat Island vs. Shaded Refuge Grid'}
            </h2>
          </div>
          <p className="text-xs text-ink-2 max-w-md font-sans">
            {lang === 'hi'
              ? 'बिना पेड़ों वाली सड़कों और कंक्रीट बाजारों में तापमान 48°C+ पहुंच जाता है। नीचे अपने निकटतम ब्लॉक की स्थिति देखें:'
              : 'Dense treeless markets trap heat up to 6°C hotter than green corridors. Find the coolest walking refuge right now:'}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {chhaonBlocks.map((b) => (
            <motion.div
              key={b.id}
              variants={itemVariants}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className="p-5 bg-card rounded-2xl border border-line shadow-xs hover:shadow-sm transition-all space-y-3 flex flex-col justify-between"
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-loo bg-loo-soft px-2.5 py-0.5 rounded-full">
                    🔥 Hotspot: {b.microclimateTemp}°C
                  </span>
                  <span className="text-[11px] font-mono text-ink-3">
                    Canopy: {b.treeCanopy.split(' ')[0]}
                  </span>
                </div>

                <h3 className="text-sm font-heading font-bold text-ink leading-snug">
                  {b.zone}
                </h3>

                <div className="p-3.5 bg-chhaon-soft/60 rounded-xl border border-chhaon/20 space-y-1">
                  <span className="text-[10px] font-mono uppercase font-bold text-chhaon flex items-center gap-1.5">
                    <i className="fa-solid fa-tree" />
                    Nearest Cool Refuge
                  </span>
                  <p className="text-xs font-bold text-ink font-sans">
                    {b.refugeName}
                  </p>
                  <p className="text-[11px] font-semibold text-pani">
                    ⏱️ {b.walkTime}
                  </p>
                </div>
              </div>

              <button
                onClick={() => onNavigate('map')}
                className="w-full h-10 rounded-xl bg-paper hover:bg-paper-2 border border-line text-ink text-xs font-bold flex items-center justify-center gap-2 transition-colors active:scale-98"
              >
                <i className="fa-solid fa-diamond-turn-right text-pani" />
                <span>Walk To Shade</span>
              </button>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 4. Severe Heat & "Loo" Protection Interactive Guide */}
      <section className="max-w-5xl mx-auto px-4 space-y-4">
        <motion.div variants={itemVariants} className="flex flex-col md:flex-row md:items-end justify-between gap-2">
          <div>
            <span className="text-[10px] font-mono font-bold uppercase px-2.5 py-0.5 rounded-full bg-aaram-soft text-aaram border border-aaram/30">
              LIFE-SAVING HEAT SURVIVAL GUIDE
            </span>
            <h2 className="text-xl md:text-2xl font-heading font-extrabold text-ink mt-1">
              {lang === 'hi' ? 'भीषण लू व धूप से बचाव की सम्पूर्ण गाइड' : 'Severe Loo, Mask & Hydration Field Guide'}
            </h2>
          </div>

          {/* Guide Tab Switcher */}
          <div className="flex items-center gap-1.5 bg-paper-2 p-1 rounded-full border border-line">
            <button
              onClick={() => setActiveTabGuide('gamcha')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
                activeTabGuide === 'gamcha'
                  ? 'bg-card text-ink shadow-xs'
                  : 'text-ink-2 hover:text-ink'
              }`}
            >
              🧣 {lang === 'hi' ? 'गमछा व मास्क' : 'Mask & Gamcha'}
            </button>
            <button
              onClick={() => setActiveTabGuide('ors')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
                activeTabGuide === 'ors'
                  ? 'bg-card text-ink shadow-xs'
                  : 'text-ink-2 hover:text-ink'
              }`}
            >
              🧂 {lang === 'hi' ? 'ORS व पेय' : 'ORS & Hydration'}
            </button>
            <button
              onClick={() => setActiveTabGuide('triage')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
                activeTabGuide === 'triage'
                  ? 'bg-card text-ink shadow-xs'
                  : 'text-ink-2 hover:text-ink'
              }`}
            >
              🏥 {lang === 'hi' ? 'लू के लक्षण' : 'Heatstroke Triage'}
            </button>
          </div>
        </motion.div>

        {/* Dynamic Content */}
        <AnimatePresence mode="wait">
          {activeTabGuide === 'gamcha' && (
            <motion.div
              key="gamcha"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
              className="p-6 bg-card rounded-2xl border border-line shadow-xs grid grid-cols-1 md:grid-cols-3 gap-6"
            >
              <div className="space-y-2.5">
                <div className="w-10 h-10 rounded-xl bg-pani-soft text-pani flex items-center justify-center font-bold text-base">
                  1
                </div>
                <h3 className="text-sm font-heading font-bold text-ink">
                  {lang === 'hi' ? 'गीला सूती गमछा / स्कार्फ बांधें' : 'Wet Cotton Gamcha / Scarf'}
                </h3>
                <p className="text-xs text-ink-2 leading-relaxed font-sans">
                  {lang === 'hi'
                    ? 'हल्के रंग का सूती गमछा पानी से गीला करके सिर, गर्दन और कानों को पूरी तरह ढकें। यह हवा से नमी सोखकर मस्तिष्क का तापमान 4-5°C ठंडा रखता है।'
                    : 'Dampen a light-colored cotton gamcha or scarf and wrap around head, neck, and ears. Evaporative cooling lowers cranial heat stress by 4-5°C.'}
                </p>
              </div>

              <div className="space-y-2.5">
                <div className="w-10 h-10 rounded-xl bg-aaram-soft text-aaram flex items-center justify-center font-bold text-base">
                  2
                </div>
                <h3 className="text-sm font-heading font-bold text-ink">
                  {lang === 'hi' ? 'नाक व मुंह पर मास्क अनिवार्य' : 'Breathable Dust & Heat Mask'}
                </h3>
                <p className="text-xs text-ink-2 leading-relaxed font-sans">
                  {lang === 'hi'
                    ? 'गर्म पछुआ हवाएं (लू) श्वासनली को सुखा देती हैं और धूल से फेफड़ों में जलन होती है। बाइक या काम करते समय सूती या N95 मास्क पहनने से फेफड़े सुरक्षित रहते हैं।'
                    : 'Hot dry loo winds rapidly dehydrate respiratory mucous membranes and drive dust particles into lungs. Wearing a breathable mask prevents throat inflammation.'}
                </p>
              </div>

              <div className="space-y-2.5">
                <div className="w-10 h-10 rounded-xl bg-chhaon-soft text-chhaon flex items-center justify-center font-bold text-base">
                  3
                </div>
                <h3 className="text-sm font-heading font-bold text-ink">
                  {lang === 'hi' ? 'यूवी चश्मा व ढीले सूती कपड़े' : 'UV Sunglasses & Loose Cotton'}
                </h3>
                <p className="text-xs text-ink-2 leading-relaxed font-sans">
                  {lang === 'hi'
                    ? 'पॉलिएस्टर या गहरे रंग के कपड़ों से बचें जो गर्मी रोकते हैं। हल्के, ढीले फुल-स्लीव सूती कपड़े और सनग्लास पहनें ताकि धूप से सीधे छाले न पड़ें।'
                    : 'Avoid synthetic or dark tight clothing that traps body heat. Wear light, loose full-sleeve cotton wear and UV-filtering sunglasses to prevent solar cataracts.'}
                </p>
              </div>
            </motion.div>
          )}

          {activeTabGuide === 'ors' && (
            <motion.div
              key="ors"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
              className="p-6 bg-card rounded-2xl border border-line shadow-xs space-y-6"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-line pb-4">
                <div>
                  <h3 className="text-base font-heading font-extrabold text-ink flex items-center gap-2">
                    <i className="fa-solid fa-flask-vial text-pani" />
                    {lang === 'hi' ? 'घर पर जीवनरक्षक घोल (ORS) बनाने की सटीक विधि' : 'Standard WHO / Govt Oral Rehydration Salt (ORS) Recipe'}
                  </h3>
                  <p className="text-xs text-ink-2 mt-0.5 font-sans">
                    {lang === 'hi'
                      ? 'पसीने से शरीर का सोडियम और पोटैशियम निकल जाता है। केवल सादा पानी पीने के बजाय यह घोल पिएं:'
                      : 'Severe sweating depletes essential electrolytes. Drink this solution hourly rather than plain water alone:'}
                  </p>
                </div>

                {/* Liter Stepper */}
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-ink-2">Scale:</span>
                  <button
                    onClick={() => setOrsUnits((p) => Math.max(1, p - 1))}
                    className="w-8 h-8 rounded-lg border border-line bg-paper text-xs font-bold hover:bg-paper-2"
                  >
                    -
                  </button>
                  <span className="text-xs font-mono font-bold px-3 py-1.5 bg-paper-2 rounded-lg border border-line">
                    {orsUnits} {orsUnits === 1 ? 'Liter' : 'Liters'}
                  </span>
                  <button
                    onClick={() => setOrsUnits((p) => Math.min(5, p + 1))}
                    className="w-8 h-8 rounded-lg border border-line bg-paper text-xs font-bold hover:bg-paper-2"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Recipe Proportions */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-5 bg-pani-soft/60 rounded-xl border border-pani/20 text-center space-y-1.5">
                  <i className="fa-solid fa-droplet text-pani text-2xl" />
                  <p className="text-xs text-ink-2 font-semibold">Clean Potable Water</p>
                  <p className="text-2xl font-black text-pani font-mono">{orsUnits} Liter</p>
                  <span className="text-[11px] text-ink-3">Boiled or RO cooled water</span>
                </div>

                <div className="p-5 bg-aaram-soft/60 rounded-xl border border-aaram/30 text-center space-y-1.5">
                  <i className="fa-solid fa-cubes-stacked text-aaram text-2xl" />
                  <p className="text-xs text-ink-2 font-semibold">Sugar (चीनी / शक्कर)</p>
                  <p className="text-2xl font-black text-aaram font-mono">{6 * orsUnits} Teaspoons</p>
                  <span className="text-[11px] text-ink-3">Level spoons (not heaped)</span>
                </div>

                <div className="p-5 bg-paper-2 rounded-xl border border-line text-center space-y-1.5">
                  <i className="fa-solid fa-bowl-rice text-ink-2 text-2xl" />
                  <p className="text-xs text-ink-2 font-semibold">Common Salt (नमक)</p>
                  <p className="text-2xl font-black text-ink font-mono">{(0.5 * orsUnits).toFixed(1)} Teaspoon</p>
                  <span className="text-[11px] text-ink-3">Half spoon per liter</span>
                </div>
              </div>

              {/* Desi Coolers */}
              <div className="p-5 bg-paper-2 rounded-xl border border-line space-y-2.5">
                <span className="text-xs font-bold text-ink uppercase tracking-wider">
                  🍃 Traditional Indian Natural Heat Relievers (पारंपरिक देशी शीतलक)
                </span>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 text-xs font-semibold text-ink-2">
                  <div className="p-2.5 bg-card rounded-xl border border-line">
                    🥭 <strong>Aam Panna</strong> (भुना कच्चा आम)
                  </div>
                  <div className="p-2.5 bg-card rounded-xl border border-line">
                    🌾 <strong>Sattu Sharbat</strong> (चने का सत्तू)
                  </div>
                  <div className="p-2.5 bg-card rounded-xl border border-line">
                    🥛 <strong>Pudina Chaas</strong> (छाछ / मट्ठा)
                  </div>
                  <div className="p-2.5 bg-card rounded-xl border border-line">
                    🥥 <strong>Nariyal Paani</strong> (नारियल पानी)
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTabGuide === 'triage' && (
            <motion.div
              key="triage"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
              className="p-6 bg-card rounded-2xl border border-line shadow-xs space-y-4"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Heat Exhaustion Card */}
                <div className="p-5 rounded-xl border border-aaram/40 bg-aaram-soft/30 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold uppercase text-aaram bg-aaram-soft px-2.5 py-0.5 rounded-full border border-aaram/40">
                      STAGE 1: HEAT EXHAUSTION
                    </span>
                    <span className="text-xs font-bold text-aaram">Early Warning</span>
                  </div>
                  <h4 className="text-sm font-heading font-bold text-ink">
                    {lang === 'hi' ? 'हीट एग्जॉशन (थकान व निर्जलीकरण)' : 'Heat Exhaustion (Early Warning)'}
                  </h4>
                  <ul className="text-xs text-ink-2 space-y-1.5 list-disc list-inside font-sans">
                    <li>Heavy sweating (अत्यधिक पसीना आना)</li>
                    <li>Cold, pale or clammy skin (ठंडी पीली त्वचा)</li>
                    <li>Fast, weak pulse & dizziness (चक्कर व कमजोरी)</li>
                    <li>Muscle cramps (मांसपेशियों में ऐंठन)</li>
                  </ul>
                  <div className="pt-2 text-xs font-bold text-aaram border-t border-aaram/20 font-sans">
                    Action: Move to shade immediately, loosen clothes, sip cold ORS water.
                  </div>
                </div>

                {/* Heat Stroke Card */}
                <div className="p-5 rounded-xl border border-loo/40 bg-loo-soft/30 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold uppercase text-loo bg-loo-soft px-2.5 py-0.5 rounded-full border border-loo/40">
                      STAGE 2: HEAT STROKE (MEDICAL EMERGENCY)
                    </span>
                    <span className="text-xs font-bold text-loo animate-pulse">Critical</span>
                  </div>
                  <h4 className="text-sm font-heading font-bold text-ink">
                    {lang === 'hi' ? 'हीट स्ट्रोक / लू का आघात (जानलेवा स्थिति)' : 'Heat Stroke (Life-Threatening)'}
                  </h4>
                  <ul className="text-xs text-ink-2 space-y-1.5 list-disc list-inside font-sans">
                    <li>High body temperature &gt;103°F (तीव्र बुखार)</li>
                    <li>Hot, red, dry skin with NO sweating (पसीना बंद होना)</li>
                    <li>Confusion, slurred speech or fainting (बेहोशी)</li>
                    <li>Rapid, strong bounding pulse (तेज धड़कन)</li>
                  </ul>
                  <div className="pt-2 text-xs font-bold text-loo border-t border-loo/20 font-sans">
                    Action: Call 108 immediately. Pour water on head & neck. Do NOT force drinks.
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* 5. Emergency Helplines Bar */}
      <section className="max-w-5xl mx-auto px-4">
        <div className="p-6 bg-card rounded-2xl border border-line shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <h3 className="text-sm font-heading font-bold text-ink flex items-center gap-2">
              <i className="fa-solid fa-phone-volume text-loo animate-pulse" />
              {lang === 'hi' ? '24/7 आपातकालीन हेल्पलाइन नंबर' : 'National & State 24/7 Emergency Helplines'}
            </h3>
            <p className="text-xs text-ink-2 font-sans">
              Direct toll-free access to ambulance services, disaster management, and police assistance.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <a
              href="tel:108"
              className="h-10 px-4 rounded-full bg-loo-soft hover:bg-loo-soft/80 border border-loo/30 text-loo text-xs font-bold flex items-center gap-2 shadow-xs active:scale-95 transition-all"
            >
              <i className="fa-solid fa-ambulance" />
              <span>108 (Ambulance)</span>
            </a>

            <a
              href="tel:1077"
              className="h-10 px-4 rounded-full bg-pani-soft hover:bg-pani-soft/80 border border-pani/30 text-pani text-xs font-bold flex items-center gap-2 shadow-xs active:scale-95 transition-all"
            >
              <i className="fa-solid fa-tower-broadcast" />
              <span>1077 (Disaster Control)</span>
            </a>

            <a
              href="tel:112"
              className="h-10 px-4 rounded-full bg-paper-2 hover:bg-paper-2/80 text-ink border border-line text-xs font-bold flex items-center gap-2 shadow-xs active:scale-95 transition-all"
            >
              <i className="fa-solid fa-shield-halved" />
              <span>112 (National Emergency)</span>
            </a>
          </div>
        </div>
      </section>

      {/* 6. Municipal Admin Portal Link & Civic Footer */}
      <section className="max-w-5xl mx-auto px-4 pt-4 border-t border-line">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-ink-2">
          <div className="flex items-center gap-3">
            <span className="font-heading font-extrabold text-ink">HeatHaven AI</span>
            <span>•</span>
            <span>Grounded Relief for Delhi-NCR</span>
            <span>•</span>
            <span className="font-mono text-[11px]">Open-Meteo & Chhaon Protocol</span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => onNavigate('admin')}
              className="text-xs font-bold text-pani hover:underline flex items-center gap-1.5"
            >
              <i className="fa-solid fa-lock text-[10px]" />
              Municipal Admin Portal
            </button>
            <button
              onClick={() => onNavigate('dashboard')}
              className="text-xs font-semibold text-ink-2 hover:text-ink"
            >
              Heat-Gap Dashboard
            </button>
            <button
              onClick={() => onNavigate('tokens')}
              className="font-mono text-[11px] text-ink-3 hover:text-ink"
            >
              /dev/tokens
            </button>
          </div>
        </div>
      </section>
    </motion.div>
  );
};

export default HomePage;
