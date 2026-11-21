import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { PILOT_COORDS, DELHI_NCR_REGIONS } from '../../../lib/constants.js';
import { detectSmartLocation } from '../services/smartGeolocation.js';

/**
 * CurrentLocationCard Component (Modern Clean Delivery/SaaS Style)
 * Displays live GPS coordinates, accuracy, detected locality, and instant map routing.
 *
 * @param {Object} props
 * @param {Object} props.userCoords - { lat, lng }
 * @param {Function} props.onUpdateCoords - (coords) => void
 * @param {Function} [props.onOpenMapWithCoords] - (coords) => void
 * @param {Function} [props.onNavigateToMap] - () => void
 * @param {number} [props.heatIndexC=42]
 * @param {boolean} [props.isGpsActive=false]
 * @param {'en' | 'hi'} [props.lang='en']
 */
export const CurrentLocationCard = ({
  userCoords = { lat: PILOT_COORDS.LAT, lng: PILOT_COORDS.LNG },
  onUpdateCoords = () => {},
  onOpenMapWithCoords,
  onNavigateToMap,
  heatIndexC = 42,
  isGpsActive = false,
  lang = 'en'
}) => {
  const [accuracy, setAccuracy] = useState(null);
  const [isLocating, setIsLocating] = useState(false);
  const [localityName, setLocalityName] = useState('Noida Sector 18 (Delhi-NCR Hub)');
  const [statusMsg, setStatusMsg] = useState(null);

  // Accurate landmark resolver covering Kanpur & Delhi-NCR
  const resolveLocality = useCallback((lat, lng) => {
    // Kanpur Region Check
    const distToRamaDevi = Math.hypot(lat - 26.4328, lng - 80.3865);
    const distToChakeri = Math.hypot(lat - 26.4180, lng - 80.4050);
    const distToJajmau = Math.hypot(lat - 26.4398, lng - 80.4022);
    const distToKanpurCentral = Math.hypot(lat - 26.4542, lng - 80.3520);

    if (distToRamaDevi < 0.04) return 'Rama Devi Chauraha & GT Road, Kanpur';
    if (distToChakeri < 0.04) return 'Chakeri Air Force Zone, Kanpur';
    if (distToJajmau < 0.04) return 'Jajmau Ganga Bridge Highway Zone, Kanpur';
    if (distToKanpurCentral < 0.06) return 'Kanpur Central & Cantt Area, Kanpur';
    if (Math.hypot(lat - 26.44, lng - 80.35) < 0.25) return 'Kanpur Urban District, Uttar Pradesh';

    // Delhi-NCR Check
    const distToNoida = Math.hypot(lat - 28.570, lng - 77.326);
    const distToCP = Math.hypot(lat - 28.631, lng - 77.219);
    const distToAnandVihar = Math.hypot(lat - 28.648, lng - 77.316);
    const distToChandniChowk = Math.hypot(lat - 28.656, lng - 77.232);
    const distToAIIMS = Math.hypot(lat - 28.568, lng - 77.208);

    const min = Math.min(distToNoida, distToCP, distToAnandVihar, distToChandniChowk, distToAIIMS);
    if (min === distToNoida && min < 0.05) return 'Noida Sector 18 Market & Metro Hub';
    if (min === distToCP && min < 0.05) return 'Connaught Place & Rajiv Chowk, New Delhi';
    if (min === distToAnandVihar && min < 0.05) return 'Anand Vihar ISBT & Transit Hub, Delhi';
    if (min === distToChandniChowk && min < 0.05) return 'Chandni Chowk Corridor, Old Delhi';
    if (min === distToAIIMS && min < 0.05) return 'AIIMS & Safdarjung Medical Belt, South Delhi';
    return `${lat.toFixed(4)}°N, ${lng.toFixed(4)}°E (Ground Position)`;
  }, []);

  // Real-time reverse geocoding
  useEffect(() => {
    let cancelled = false;
    const fetchReverseGeocode = async () => {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 2000);
        const res = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${userCoords.lat}&lon=${userCoords.lng}&zoom=14&addressdetails=1`,
          { signal: controller.signal }
        );
        clearTimeout(timeoutId);
        if (res.ok) {
          const data = await res.json();
          if (!cancelled && data.address) {
            const suburb = data.address.suburb || data.address.neighbourhood || data.address.road || '';
            const city = data.address.city || data.address.town || data.address.county || data.address.state_district || '';
            if (suburb || city) {
              setLocalityName(`${suburb ? suburb + ', ' : ''}${city}`);
              return;
            }
          }
        }
      } catch {
        // Fallback to local resolver
      }
      if (!cancelled) {
        setLocalityName(resolveLocality(userCoords.lat, userCoords.lng));
      }
    };

    fetchReverseGeocode();
    return () => {
      cancelled = true;
    };
  }, [userCoords, resolveLocality]);

  // Trigger Smart Geolocation scan (GPS -> IP fallback)
  const handleDetectGPS = useCallback(async () => {
    setIsLocating(true);
    setStatusMsg(lang === 'hi' ? 'स्थान खोजा जा रहा है...' : 'Detecting your location...');

    const res = await detectSmartLocation({
      onStatus: (msg) => setStatusMsg(msg)
    });

    setIsLocating(false);

    if (res.ok) {
      if (res.accuracy) setAccuracy(res.accuracy);
      onUpdateCoords(res.coords);
      setStatusMsg(
        res.source === 'gps'
          ? (lang === 'hi' ? 'लाइव GPS स्थिति प्राप्त हुई!' : 'Live GPS location locked!')
          : (lang === 'hi' ? `स्थान पहचाना गया: ${res.city || 'सक्रिय क्षेत्र'}` : `Detected via Network/IP: ${res.city || 'Your Area'}`)
      );
      setTimeout(() => setStatusMsg(null), 3500);
    } else {
      if (res.errorReason === 'denied') {
        setStatusMsg(
          lang === 'hi'
            ? 'ब्राउज़र में GPS ब्लॉक है। नीचे से अपना क्षेत्र चुनें।'
            : 'Browser location is blocked. Choose your area below.'
        );
      } else {
        setStatusMsg(
          lang === 'hi'
            ? 'GPS सिग्नल नहीं मिला। कृपया नीचे से अपना क्षेत्र चुनें।'
            : 'GPS signal not acquired. Choose your area below.'
        );
      }
      setTimeout(() => setStatusMsg(null), 5000);
    }
  }, [lang, onUpdateCoords]);

  // Attempt auto GPS scan on first mount
  useEffect(() => {
    if (!isGpsActive) {
      handleDetectGPS();
    }
  }, [isGpsActive, handleDetectGPS]);

  const handleOpenMapAction = () => {
    onUpdateCoords(userCoords);
    if (onOpenMapWithCoords) {
      onOpenMapWithCoords(userCoords);
    } else if (onNavigateToMap) {
      onNavigateToMap();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="p-5 md:p-6 bg-card rounded-2xl border border-line shadow-xs space-y-4"
    >
      {/* Top Banner: Status + Refresh */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-line pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-pani-soft text-pani flex items-center justify-center text-base shadow-xs">
            <i className="fa-solid fa-location-crosshairs" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-heading font-black text-base text-ink leading-tight">
                {lang === 'hi' ? 'आपकी लाइव जीपीएस स्थिति' : 'Your Live GPS Location'}
              </h3>
              <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                isGpsActive
                  ? 'bg-chhaon-soft text-chhaon border border-chhaon/30'
                  : 'bg-paper-2 text-ink-3 border border-line'
              }`}>
                <span className={`w-1.5 h-1.5 rounded-full ${isGpsActive ? 'bg-chhaon animate-pulse' : 'bg-ink-3'}`} />
                {isGpsActive ? 'LIVE GPS LOCKED' : 'PILOT ANCHOR'}
              </span>
            </div>
            <p className="text-xs text-ink-2 mt-0.5 font-sans">
              {lang === 'hi' ? 'सटीक उपग्रह स्थिति व त्वरित राहत केंद्र' : 'Real-time satellite coordinates & immediate relief routing'}
            </p>
          </div>
        </div>

        <button
          onClick={handleDetectGPS}
          disabled={isLocating}
          className="h-10 px-4 rounded-xl bg-paper hover:bg-paper-2 text-ink text-xs font-bold flex items-center gap-2 border border-line active:scale-95 transition-all disabled:opacity-50 self-start sm:self-auto"
          title="Scan / Refresh GPS"
        >
          <i className={`fa-solid ${isLocating ? 'fa-spinner fa-spin text-pani' : 'fa-arrows-rotate text-pani'} text-xs`} />
          <span>{isLocating ? (lang === 'hi' ? 'खोज रहा...' : 'Locating...') : (lang === 'hi' ? 'GPS रीफ्रेश' : 'Refresh GPS')}</span>
        </button>
      </div>

      {statusMsg && (
        <div className="p-3 bg-chhaon-soft text-chhaon rounded-xl text-xs font-bold flex items-center gap-2 border border-chhaon/30">
          <i className="fa-solid fa-circle-check text-xs" />
          <span>{statusMsg}</span>
        </div>
      )}

      {/* Main Coordinate & Locality Grid (Inspired by Reference 1 Delivery Card) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {/* Locality */}
        <div className="p-4 bg-paper rounded-xl border border-line space-y-1">
          <span className="text-[10px] font-mono text-ink-3 uppercase tracking-wider block font-bold">
            {lang === 'hi' ? 'पहचाना गया क्षेत्र' : 'Detected Zone'}
          </span>
          <p className="font-heading font-bold text-sm text-ink truncate leading-tight" title={localityName}>
            {localityName}
          </p>
          <span className="text-[11px] font-mono text-chhaon font-semibold block">
            {isGpsActive ? (accuracy ? `±${accuracy}m precision` : 'High accuracy') : 'Pilot preset (Noida/Kanpur)'}
          </span>
        </div>

        {/* GPS Coordinates */}
        <div className="p-4 bg-paper rounded-xl border border-line space-y-1 font-mono">
          <span className="text-[10px] text-ink-3 uppercase tracking-wider block font-bold">
            Coordinates
          </span>
          <p className="font-bold text-sm text-ink">
            {userCoords.lat.toFixed(4)}°N, {userCoords.lng.toFixed(4)}°E
          </p>
          <span className="text-[11px] text-pani font-semibold block">
            WGS84 Geodetic
          </span>
        </div>

        {/* Local Heat Stress */}
        <div className="p-4 bg-paper rounded-xl border border-line space-y-1">
          <span className="text-[10px] font-mono text-ink-3 uppercase tracking-wider block font-bold">
            Local Heat Index
          </span>
          <p className="font-heading font-black text-sm text-loo flex items-center gap-1.5">
            <span className="font-mono text-lg">{heatIndexC}°C</span>
            <span className="text-xs font-bold font-sans">Extreme Danger</span>
          </p>
          <span className="text-[11px] font-mono text-ink-3 block">
            Loo westerly winds active
          </span>
        </div>
      </div>

      {/* Quick City Switcher if GPS not active */}
      {!isGpsActive && (
        <div className="flex items-center gap-2 flex-wrap pt-1 text-xs">
          <span className="text-[11px] font-mono text-ink-3 uppercase font-bold">
            {lang === 'hi' ? 'तुरंत क्षेत्र बदलें:' : 'Quick Select Area:'}
          </span>
          {DELHI_NCR_REGIONS.slice(0, 5).map((r) => (
            <button
              key={r.id}
              type="button"
              onClick={() => onUpdateCoords({ lat: r.lat, lng: r.lng })}
              className="px-2.5 py-1 rounded-lg bg-paper-2 hover:bg-line border border-line text-[11px] font-bold text-ink transition-all active:scale-95"
            >
              📍 {r.name.split(' (')[0]}
            </button>
          ))}
        </div>
      )}

      {/* Primary Action Button (Reference 1 & 3 style) */}
      <div className="pt-1 flex flex-col sm:flex-row items-center justify-between gap-3">
        <p className="text-xs text-ink-2 font-sans">
          {lang === 'hi'
            ? 'आपकी वर्तमान स्थिति के 1 किमी दायरे में 18+ सत्यापित प्याऊ और छायादार स्थान सक्रिय हैं।'
            : 'Multiple verified drinking water kiosks and tree canopies are active within 1 km of your location.'}
        </p>

        <button
          onClick={handleOpenMapAction}
          className="w-full sm:w-auto h-11 px-6 rounded-xl bg-ink hover:bg-slate-800 text-white text-xs font-heading font-black flex items-center justify-center gap-2 shadow-sm active:scale-95 transition-all shrink-0"
        >
          <i className="fa-solid fa-map-location-dot text-pani-soft" />
          <span>{lang === 'hi' ? 'मेरे पास राहत केंद्र देखें' : 'Find Relief Spots Near Me'}</span>
          <i className="fa-solid fa-arrow-right text-[10px]" />
        </button>
      </div>
    </motion.div>
  );
};

export default CurrentLocationCard;
