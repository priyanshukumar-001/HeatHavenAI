import React, { useState, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';
import MapView from '../features/map/components/MapView.jsx';
import SpotSheet from '../features/spots/components/SpotSheet.jsx';
import Chip from '../components/ui/Chip.jsx';
import Toast from '../components/ui/Toast.jsx';
import { useNearbySpots } from '../features/spots/hooks/useNearbySpots.js';
import { PILOT_COORDS, DELHI_NCR_REGIONS } from '../lib/constants.js';
import { getDeviceId } from '../lib/deviceId.js';
import { submitReport } from '../features/spots/api.js';
import { useT } from '../i18n/useT.js';
import { detectSmartLocation, findClosestRegion } from '../features/location/services/smartGeolocation.js';

/**
 * MapPage (Full interactive relief map with Delhi NCR regions, real-time GPS, and bottom sheet)
 *
 * @param {Object} props
 * @param {'en' | 'hi'} [props.lang='en']
 * @param {Function} [props.onOpenConcierge]
 * @param {Object} [props.userCoords]
 * @param {Function} [props.onUpdateUserCoords]
 */
export const MapPage = ({
  lang = 'en',
  onOpenConcierge = () => { },
  userCoords: externalCoords,
  onUpdateUserCoords
}) => {
  const t = useT(lang);
  const [activeFilter, setActiveFilter] = useState('all');
  const [selectedSpot, setSelectedSpot] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);
  const [localCoords, setLocalCoords] = useState({ lat: PILOT_COORDS.LAT, lng: PILOT_COORDS.LNG });
  const [activeRegionId, setActiveRegionId] = useState('noida_sec18');
  const [isLocating, setIsLocating] = useState(false);
  const [isGpsActive, setIsGpsActive] = useState(false);
  const [permissionHelp, setPermissionHelp] = useState(false);

  const userCoords = externalCoords || localCoords;
  const setUserCoords = onUpdateUserCoords || setLocalCoords;

  // Real-time Smart Geolocation (GPS with automatic IP fallback)
  const handleLocateUser = useCallback(async () => {
    setIsLocating(true);
    setPermissionHelp(false);
    setToastMessage(lang === 'hi' ? 'स्थान खोजा जा रहा है (GPS एवं नेटवर्क)...' : 'Acquiring location (GPS & Network)...');

    const res = await detectSmartLocation({
      onStatus: (msg) => setToastMessage(msg)
    });

    setIsLocating(false);

    if (res.ok) {
      setUserCoords(res.coords);
      setIsGpsActive(true);
      const matched = findClosestRegion(res.coords.lat, res.coords.lng);
      if (matched) {
        setActiveRegionId(matched.id);
      }
      setToastMessage(
        res.source === 'gps'
          ? (lang === 'hi' ? 'लाइव GPS स्थिति प्राप्त हुई!' : 'Live GPS location locked!')
          : (lang === 'hi' ? `स्थान पहचाना गया: ${res.city || 'सक्रिय क्षेत्र'}` : `Detected via Network/IP: ${res.city || 'Your Area'}`)
      );
      setTimeout(() => setToastMessage(null), 3500);
    } else {
      setIsGpsActive(false);
      if (res.errorReason === 'denied') {
        setPermissionHelp(true);
        setToastMessage(
          lang === 'hi'
            ? 'ब्राउज़र में GPS ब्लॉक है। नीचे से शहर चुनें।'
            : 'Browser location blocked. Choose your city below or allow in browser.'
        );
      } else {
        setToastMessage(
          lang === 'hi'
            ? 'GPS सिग्नल नहीं मिला। कृपया नीचे से अपना शहर चुनें।'
            : 'GPS signal not found. Please select your city below.'
        );
      }
      setTimeout(() => setToastMessage(null), 5000);
    }
  }, [lang, setUserCoords]);

  // Auto-sync region dropdown if userCoords is closer to another preset (e.g. Kanpur)
  useEffect(() => {
    let closestRegion = null;
    let minDistance = Infinity;
    for (const r of DELHI_NCR_REGIONS) {
      const dist = Math.hypot(userCoords.lat - r.lat, userCoords.lng - r.lng);
      if (dist < minDistance) {
        minDistance = dist;
        closestRegion = r;
      }
    }
    if (closestRegion && minDistance < 0.25) {
      setActiveRegionId(closestRegion.id);
    }
  }, [userCoords.lat, userCoords.lng]);

  const { spots, isLoading, setSpots } = useNearbySpots({
    lat: userCoords.lat,
    lng: userCoords.lng,
    category: activeFilter
  });

  const filters = [
    { id: 'all', icon: 'fa-location-dot', labelKey: 'chip.all', color: 'bg-ink text-paper shadow-sm' },
    { id: 'water', icon: 'fa-droplet', labelKey: 'chip.water', color: 'bg-pani text-white shadow-glow-pani' },
    { id: 'shade', icon: 'fa-tree', labelKey: 'chip.shade', color: 'bg-chhaon text-white shadow-sm' },
    { id: 'rest', icon: 'fa-chair', labelKey: 'chip.rest', color: 'bg-aaram text-ink shadow-sm' },
  ];

  // Switch region across Noida & Delhi
  const handleRegionChange = (regionId) => {
    setActiveRegionId(regionId);
    const region = DELHI_NCR_REGIONS.find((r) => r.id === regionId);
    if (region) {
      setUserCoords({ lat: region.lat, lng: region.lng });
      setToastMessage(lang === 'hi' ? `नक्शा बदला गया: ${region.name}` : `Location moved to ${region.name}`);
      setTimeout(() => setToastMessage(null), 2500);
    }
  };

  // Handle One-Tap Crowd Report submission
  const handleReport = async (spotId, type) => {
    try {
      const deviceId = getDeviceId();
      const targetSpot = spots.find((s) => s.id === spotId);
      const reportLat = targetSpot ? targetSpot.location.lat : userCoords.lat;
      const reportLng = targetSpot ? targetSpot.location.lng : userCoords.lng;

      await submitReport({
        spotId,
        type,
        lat: reportLat,
        lng: reportLng,
        deviceId
      }).catch(() => null);

      const msg = type === 'ok' ? t('report.success.ok') : t('report.success.other');
      setToastMessage(msg);
      setTimeout(() => setToastMessage(null), 3500);

      // Update spot trust in memory real-time
      setSpots((prev) =>
        prev.map((s) => {
          if (s.id !== spotId) return s;
          const scoreDelta = type === 'ok' ? 6 : -12;
          const updatedScore = Math.min(100, Math.max(10, s.trustScore + scoreDelta));
          const updatedSpot = { ...s, trustScore: updatedScore };
          if (selectedSpot && selectedSpot.id === spotId) {
            setSelectedSpot(updatedSpot);
          }
          return updatedSpot;
        })
      );
    } catch {
      setToastMessage(t('report.error'));
      setTimeout(() => setToastMessage(null), 3000);
    }
  };

  return (
    <div className="relative flex-1 flex flex-col md:flex-row w-full h-full min-h-0 overflow-hidden">
      {/* Toast Notification */}
      <Toast message={toastMessage} type="success" />

      {/* Floating Filter Chips & Delhi NCR Region Switcher */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.25 }}
        className="absolute top-3 left-0 right-0 md:left-[430px] z-20 px-3 flex items-center justify-between gap-2 overflow-x-auto no-scrollbar pointer-events-auto"
      >
        <div className="flex items-center gap-2 shrink-0">
          {filters.map((f) => (
            <Chip
              key={f.id}
              active={activeFilter === f.id}
              activeColor={f.color}
              icon={f.icon}
              label={t(f.labelKey)}
              onClick={() => setActiveFilter(f.id)}
            />
          ))}
        </div>

        {/* Region & GPS Live Switcher */}
        <div className="flex items-center gap-2 shrink-0 ml-auto">
          <select
            value={activeRegionId}
            onChange={(e) => handleRegionChange(e.target.value)}
            className="h-10 px-3 rounded-full bg-card/95 text-xs font-bold text-ink border border-line shadow-xs hover:bg-paper-2 focus:outline-none focus:ring-2 focus:ring-pani cursor-pointer"
            aria-label="Select Region"
          >
            {DELHI_NCR_REGIONS.map((r) => (
              <option key={r.id} value={r.id}>
                📍 {r.name}
              </option>
            ))}
          </select>

          <button
            onClick={handleLocateUser}
            disabled={isLocating}
            className="h-10 px-3.5 rounded-full bg-pani hover:brightness-110 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs active:scale-95 transition-all shrink-0"
            title="Use My Live GPS Location"
            aria-label="Locate User GPS"
          >
            <i className={`fa-solid ${isLocating ? 'fa-spinner fa-spin' : 'fa-location-crosshairs'} text-xs`} />
            <span className="hidden sm:inline">GPS</span>
          </button>
        </div>
      </motion.div>

      {/* Left (Desktop) / Bottom Sheet (Mobile) */}
      <SpotSheet
        spots={spots}
        isLoading={isLoading}
        selectedSpot={selectedSpot}
        onSelectSpot={setSelectedSpot}
        onReport={handleReport}
        userCoords={userCoords}
        isGpsActive={isGpsActive}
        onLocateUser={handleLocateUser}
        isLocating={isLocating}
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
        activeRegionId={activeRegionId}
        onRegionChange={handleRegionChange}
        permissionHelp={permissionHelp}
        onDismissPermissionHelp={() => setPermissionHelp(false)}
        lang={lang}
      />

      {/* Right / Main Full-Bleed Map Canvas */}
      <div className="flex-1 w-full h-full relative min-h-0 flex flex-col">
        <MapView
          spots={spots}
          selectedSpot={selectedSpot}
          onSelectSpot={setSelectedSpot}
          userCoords={userCoords}
        />

        {/* Floating Voice Mic Button */}
        <button
          onClick={onOpenConcierge}
          className="fixed md:absolute bottom-6 md:bottom-8 right-6 z-40 w-14 h-14 rounded-full bg-pani text-white shadow-1 flex items-center justify-center hover:brightness-110 active:scale-95 transition-all animate-mic-breathe"
          aria-label={t('mic.hint')}
          title={t('mic.hint')}
        >
          <i className="fa-solid fa-microphone text-xl" />
        </button>
      </div>
    </div>
  );
};

export default MapPage;
