import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SpotCard from './SpotCard.jsx';
import TrustRing from './TrustRing.jsx';
import ReportButtons from '../../reports/components/ReportButtons.jsx';
import Skeleton from '../../../components/ui/Skeleton.jsx';
import { useSpotCooldown } from '../hooks/useSpotCooldown.js';
import { formatDistance, formatRelativeTime } from '../../../lib/format.js';
import { CATEGORY_CONFIG, DELHI_NCR_REGIONS } from '../../../lib/constants.js';
import { useT } from '../../../i18n/useT.js';

// Accurate Haversine distance in meters
function computeMeters(lat1, lon1, lat2, lon2) {
  if (!lat1 || !lon1 || !lat2 || !lon2) return 999999;
  const R = 6371e3;
  const p1 = (lat1 * Math.PI) / 180;
  const p2 = (lat2 * Math.PI) / 180;
  const dp = ((lat2 - lat1) * Math.PI) / 180;
  const dl = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dp / 2) * Math.sin(dp / 2) +
    Math.cos(p1) * Math.cos(p2) * Math.sin(dl / 2) * Math.sin(dl / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
}

/**
 * SpotSheet Component (Upgraded Stockholm Reference UI Style)
 * Crisp white side panel with Search, Category Pills, Location Access Banner,
 * Segmented Tabs, and Live GPS distance calculations.
 *
 * @param {Object} props
 * @param {Array} props.spots
 * @param {boolean} props.isLoading
 * @param {Object} [props.selectedSpot]
 * @param {Function} props.onSelectSpot
 * @param {Function} props.onReport
 * @param {Object} [props.userCoords]
 * @param {boolean} [props.isGpsActive]
 * @param {Function} [props.onLocateUser]
 * @param {boolean} [props.isLocating]
 * @param {string} [props.activeFilter]
 * @param {Function} [props.onFilterChange]
 * @param {string} [props.activeRegionId]
 * @param {Function} [props.onRegionChange]
 * @param {boolean} [props.permissionHelp]
 * @param {Function} [props.onDismissPermissionHelp]
 * @param {'en' | 'hi'} [props.lang='en']
 */
export const SpotSheet = ({
  spots = [],
  isLoading = false,
  selectedSpot = null,
  onSelectSpot = () => {},
  onReport = () => {},
  userCoords = { lat: 28.57, lng: 77.326 },
  isGpsActive = false,
  onLocateUser = () => {},
  isLocating = false,
  activeFilter = 'all',
  onFilterChange = () => {},
  activeRegionId = 'noida_sec18',
  onRegionChange = () => {},
  permissionHelp = false,
  onDismissPermissionHelp = () => {},
  lang = 'en'
}) => {
  const t = useT(lang);
  // Mobile snap points: 'peek' (140px), 'half' (50%), 'full' (85%)
  const [snapPoint, setSnapPoint] = useState('half');
  const [viewTab, setViewTab] = useState('all'); // 'all' | 'verified'
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('distance'); // 'distance' | 'trust'
  const [maxRadiusM, setMaxRadiusM] = useState(null); // null (All), 500, 1000, 2000

  const { isCoolingDown, remainingTimeFormatted, recordVerification } = useSpotCooldown(selectedSpot?.id);

  const handleReportWithCooldown = (type) => {
    onReport(selectedSpot.id, type);
    recordVerification(selectedSpot.id);
  };

  const toggleSnap = () => {
    setSnapPoint((prev) => (prev === 'peek' ? 'half' : prev === 'half' ? 'full' : 'peek'));
  };

  const getHeightClass = () => {
    if (snapPoint === 'peek') return 'h-[140px]';
    if (snapPoint === 'full') return 'h-[85vh]';
    return 'h-[52vh]';
  };

  // Recalculate dynamic distance from userCoords for every spot
  const spotsWithLiveDistance = useMemo(() => {
    return spots.map((s) => {
      const spotLat = s.location?.lat ?? (s.location?.coordinates ? s.location.coordinates[1] : 0);
      const spotLng = s.location?.lng ?? (s.location?.coordinates ? s.location.coordinates[0] : 0);
      const liveDistM = computeMeters(userCoords.lat, userCoords.lng, spotLat, spotLng);
      return {
        ...s,
        distanceM: liveDistM,
        location: { lat: spotLat, lng: spotLng }
      };
    });
  }, [spots, userCoords.lat, userCoords.lng]);

  // Filter and sort spots
  const filteredSpots = useMemo(() => {
    let list = [...spotsWithLiveDistance];

    // Filter by Verified tab
    if (viewTab === 'verified') {
      list = list.filter((s) => s.trustScore >= 70);
    }

    // Filter by Hyperlocal Radius (500m - 2km)
    if (maxRadiusM) {
      list = list.filter((s) => s.distanceM <= maxRadiusM);
    }

    // Filter by Category
    if (activeFilter && activeFilter !== 'all') {
      list = list.filter((s) => s.category === activeFilter);
    }

    // Filter by Search Query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (s) =>
          s.name?.toLowerCase().includes(q) ||
          s.category?.toLowerCase().includes(q)
      );
    }

    // Sort spots
    if (sortBy === 'trust') {
      list.sort((a, b) => b.trustScore - a.trustScore);
    } else {
      list.sort((a, b) => a.distanceM - b.distanceM);
    }

    return list;
  }, [spotsWithLiveDistance, viewTab, activeFilter, searchQuery, sortBy, maxRadiusM]);

  return (
    <aside
      className={`fixed md:relative bottom-0 left-0 right-0 md:w-[440px] md:h-full md:border-r border-slate-200/90 bg-white rounded-t-[32px] md:rounded-none shadow-[0_-12px_36px_rgba(0,0,0,0.08)] md:shadow-none z-30 flex flex-col transition-all duration-300 ease-out ${getHeightClass()}`}
    >
      {/* Mobile Drag Handle */}
      <div
        onClick={toggleSnap}
        className="md:hidden w-full py-2.5 flex items-center justify-center cursor-pointer touch-none bg-white rounded-t-[32px] shrink-0"
        role="button"
        aria-label="Drag sheet"
      >
        <span className="w-12 h-1.5 rounded-full bg-slate-300 hover:bg-slate-400 transition-colors" />
      </div>

      {/* Top Left-Side Control Panel (when no spot is selected) */}
      {!selectedSpot && (
        <div className="px-4 pt-3 pb-3 border-b border-slate-100 shrink-0 space-y-3">
          {/* Header Bar with Region / GPS Indicator */}
          <div className="flex items-center justify-between gap-2">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-heading font-black text-slate-900 tracking-tight">
                  {lang === 'hi' ? 'राहत स्थल' : 'Relief Spots'}
                </h2>
                <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                  {filteredSpots.length} {lang === 'hi' ? 'स्थल' : 'spots'}
                </span>
              </div>
              <div className="text-[11px] text-slate-400 font-sans mt-0.5 flex items-center gap-1.5 flex-wrap">
                <i className="fa-solid fa-location-dot text-rose-500 text-[10px]" />
                {isGpsActive ? (
                  <span className="font-bold text-emerald-600 bg-emerald-50 px-2 py-0.2 rounded-full border border-emerald-200">● Live GPS Locked</span>
                ) : (
                  <select
                    value={activeRegionId}
                    onChange={(e) => onRegionChange(e.target.value)}
                    className="text-[11px] font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-lg px-1.5 py-0.5 focus:outline-none cursor-pointer"
                    aria-label="Change Region"
                  >
                    {DELHI_NCR_REGIONS.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.name}
                      </option>
                    ))}
                  </select>
                )}
              </div>
            </div>

            {/* Quick GPS Permission Request Button */}
            <button
              type="button"
              onClick={onLocateUser}
              disabled={isLocating}
              className={`h-9 px-3 rounded-full text-xs font-bold flex items-center gap-1.5 transition-all active:scale-95 shadow-xs ${
                isGpsActive
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-300'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
              title="Request browser location access to sort by exact distance"
            >
              <i className={`fa-solid ${isLocating ? 'fa-spinner fa-spin' : isGpsActive ? 'fa-circle-check text-emerald-500' : 'fa-location-crosshairs'} text-xs`} />
              <span>{isLocating ? 'Locating...' : isGpsActive ? 'GPS Active' : 'Allow GPS'}</span>
            </button>
          </div>

          {/* Location Access Prompt Banner (if GPS not yet active) */}
          {!isGpsActive && (
            <div className="p-3 bg-gradient-to-r from-blue-50 via-indigo-50 to-blue-50 rounded-2xl border border-blue-200/80 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center text-xs shrink-0 shadow-xs">
                  <i className="fa-solid fa-crosshairs" />
                </div>
                <p className="text-[11px] font-sans text-blue-950 leading-tight">
                  {lang === 'hi' ? 'सटीक दूरी देखने के लिए GPS अनुमति दें' : 'Enable live GPS for closest walking distance'}
                </p>
              </div>
              <button
                type="button"
                onClick={onLocateUser}
                disabled={isLocating}
                className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-bold rounded-xl shadow-xs shrink-0 active:scale-95 transition-all"
              >
                {lang === 'hi' ? 'लोकेशन दें' : 'Detect Me'}
              </button>
            </div>
          )}

          {/* Permission Troubleshooting Card (if user clicked Detect Me and browser blocked it) */}
          {permissionHelp && !isGpsActive && (
            <div className="p-3 bg-amber-50 rounded-2xl border border-amber-300 space-y-2">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-1.5">
                  <i className="fa-solid fa-triangle-exclamation text-amber-600 text-xs" />
                  <span className="text-xs font-bold text-amber-900">
                    {lang === 'hi' ? 'ब्राउज़र में लोकेशन ब्लॉक है' : 'Browser Location Blocked'}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={onDismissPermissionHelp}
                  className="text-amber-500 hover:text-amber-800 text-xs px-1"
                >
                  ✕
                </button>
              </div>

              <p className="text-[11px] text-amber-800 leading-snug">
                {lang === 'hi'
                  ? 'Chrome के URL बार में 🔒 या सेटिंग आइकन पर क्लिक करें और Location को "Allow" करें। या नीचे से अपना क्षेत्र चुनें:'
                  : 'Click the 🔒 icon in your browser URL bar, set Location to "Allow", or pick your area directly below:'}
              </p>

              <div className="flex items-center gap-1.5 flex-wrap pt-0.5">
                {DELHI_NCR_REGIONS.slice(0, 5).map((r) => (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => onRegionChange(r.id)}
                    className={`px-2 py-0.5 rounded-lg text-[10px] font-bold transition-all ${
                      activeRegionId === r.id
                        ? 'bg-amber-800 text-white shadow-xs'
                        : 'bg-white hover:bg-amber-100 text-amber-900 border border-amber-200'
                    }`}
                  >
                    📍 {r.name.split(' (')[0]}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Instant Search Bar */}
          <div className="relative">
            <i className="fa-solid fa-magnifying-glass absolute left-3.5 top-1/2 -translate-y-1/2 text-xs text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={lang === 'hi' ? 'नाम, प्याऊ या लैंडमार्क खोजें...' : 'Search spot by name or landmark...'}
              className="w-full h-10 pl-9 pr-8 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-700"
              >
                <i className="fa-solid fa-circle-xmark" />
              </button>
            )}
          </div>

          {/* Category Filter Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-0.5">
            {[
              { id: 'all', icon: 'fa-layer-group', label: lang === 'hi' ? 'सभी' : 'All' },
              { id: 'water', icon: 'fa-droplet', label: lang === 'hi' ? 'जल प्याऊ' : 'Water' },
              { id: 'shade', icon: 'fa-tree', label: lang === 'hi' ? 'छांव' : 'Shade' },
              { id: 'rest', icon: 'fa-chair', label: lang === 'hi' ? 'विश्राम' : 'Rest' }
            ].map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => onFilterChange(cat.id)}
                className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 shrink-0 ${
                  activeFilter === cat.id
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                <i className={`fa-solid ${cat.icon} text-[10px]`} />
                <span>{cat.label}</span>
              </button>
            ))}
          </div>

          {/* Hyperlocal Radius Range Selector (500m - 2km) */}
          <div className="flex items-center gap-1.5 pt-0.5">
            <span className="text-[10px] font-mono text-slate-400 uppercase font-bold shrink-0">
              {lang === 'hi' ? 'दायरा:' : 'Radius:'}
            </span>
            {[
              { id: null, label: 'All' },
              { id: 500, label: '500m' },
              { id: 1000, label: '1 km' },
              { id: 2000, label: '2 km' }
            ].map((rad) => (
              <button
                key={rad.label}
                type="button"
                onClick={() => setMaxRadiusM(rad.id)}
                className={`px-2.5 py-0.5 rounded-lg text-[10px] font-mono font-bold transition-all ${
                  maxRadiusM === rad.id
                    ? 'bg-blue-600 text-white shadow-2xs'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                }`}
              >
                {rad.label}
              </button>
            ))}
          </div>

          {/* Segmented View Tabs & Sort Selector */}
          <div className="flex items-center justify-between gap-2 pt-1">
            <div className="p-1 bg-slate-100 rounded-xl flex items-center gap-1 flex-1">
              <button
                type="button"
                onClick={() => setViewTab('all')}
                className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
                  viewTab === 'all'
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {lang === 'hi' ? 'सभी स्थल' : 'All Spots'}
              </button>
              <button
                type="button"
                onClick={() => setViewTab('verified')}
                className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1 ${
                  viewTab === 'verified'
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <i className="fa-solid fa-circle-check text-[10px] text-emerald-400" />
                <span>{lang === 'hi' ? 'सत्यापित' : 'Verified (≥70%)'}</span>
              </button>
            </div>

            {/* Sort Toggle */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="h-9 px-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-600 cursor-pointer shrink-0"
              aria-label="Sort Spots"
            >
              <option value="distance">📍 {lang === 'hi' ? 'निकटतम' : 'Closest'}</option>
              <option value="trust">🛡️ {lang === 'hi' ? 'उच्चतम ट्रस्ट' : 'Top Trust'}</option>
            </select>
          </div>
        </div>
      )}

      {/* Main Sheet Content */}
      <div className="flex-1 overflow-y-auto px-4 pb-6 pt-3 space-y-3">
        {selectedSpot ? (
          /* Spot Detail Sub-view */
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedSpot.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="space-y-4 pt-1"
            >
              {/* Back button */}
              <button
                onClick={() => onSelectSpot(null)}
                className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1.5 focus:outline-none"
              >
                <i className="fa-solid fa-arrow-left text-[11px]" />
                {t('spots.back')}
              </button>

              {/* Spot Header with Category Icon */}
              <div className="p-5 bg-slate-50/80 rounded-3xl border border-slate-200/80 space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span
                        className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider"
                        style={{
                          backgroundColor: CATEGORY_CONFIG[selectedSpot.category]?.bgColor,
                          color: CATEGORY_CONFIG[selectedSpot.category]?.color
                        }}
                      >
                        {t(`chip.${selectedSpot.category}`)}
                      </span>
                      {selectedSpot.isSimulated && (
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-200 text-slate-600">
                          simulated
                        </span>
                      )}
                    </div>
                    <h2 className="text-lg font-heading font-black text-slate-900 leading-tight">
                      {selectedSpot.name}
                    </h2>
                    <p className="text-xs font-mono font-bold text-blue-600 mt-1">
                      📍 {formatDistance(selectedSpot.distanceM)} away • {formatRelativeTime(selectedSpot.lastVerifiedAt, lang)}
                    </p>
                  </div>

                  {/* Animated Trust Ring */}
                  <TrustRing score={selectedSpot.trustScore} size={62} />
                </div>

                {/* Walking Time estimate */}
                <div className="p-3 bg-white rounded-2xl border border-slate-200/80 flex items-center justify-between text-xs">
                  <span className="text-slate-500 font-semibold flex items-center gap-1.5">
                    <i className="fa-solid fa-person-walking text-blue-600 text-sm" />
                    Estimated Walking Time:
                  </span>
                  <span className="font-mono font-black text-blue-600">
                    ~{Math.max(1, Math.round((selectedSpot.distanceM || 100) / 80))} mins
                  </span>
                </div>
              </div>

              {/* Action: Open Route in Google Maps */}
              <a
                href={`https://www.google.com/maps/dir/?api=1&destination=${selectedSpot.location?.lat},${selectedSpot.location?.lng}&travelmode=walking`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl flex items-center justify-center gap-2 text-sm shadow-md active:scale-98 transition-all"
              >
                <i className="fa-solid fa-diamond-turn-right text-base" />
                <span>{lang === 'hi' ? 'गूगल मैप्स में पैदल रास्ता देखें' : 'Open Walking Route in Maps'}</span>
              </a>

              {/* One-Tap Report Block with 4h Cooldown & AI Vision Photo Verification */}
              <ReportButtons
                spotId={selectedSpot.id}
                spotName={selectedSpot.name}
                spotDistanceM={selectedSpot.distanceM}
                spotCoords={selectedSpot.location}
                onReport={handleReportWithCooldown}
                onPhotoVerified={(res) => {
                  if (res?.verified) {
                    onSelectSpot((prev) =>
                      prev
                        ? {
                            ...prev,
                            aiVerified: true,
                            trustScore: Math.min(100, (prev.trustScore || 80) + 15),
                            lastVerifiedAt: new Date().toISOString()
                          }
                        : null
                    );
                  }
                }}
                lang={lang}
                isCoolingDown={isCoolingDown}
                remainingTime={remainingTimeFormatted}
              />
            </motion.div>
          </AnimatePresence>
        ) : (
          /* List of Nearby Spots */
          <div className="space-y-3">
            {isLoading ? (
              <div className="space-y-3 pt-1">
                {[1, 2, 3].map((n) => (
                  <div key={n} className="p-4 bg-white rounded-3xl border border-slate-200 space-y-2.5">
                    <Skeleton className="w-1/2 h-4" />
                    <Skeleton className="w-3/4 h-3" />
                  </div>
                ))}
              </div>
            ) : filteredSpots.length === 0 ? (
              <div className="p-8 text-center bg-slate-50 rounded-3xl border border-slate-200 space-y-3">
                <i className="fa-solid fa-magnifying-glass-location text-3xl text-slate-400" />
                <p className="text-xs font-semibold text-slate-600">
                  {searchQuery ? `No relief spots found matching "${searchQuery}"` : t('spots.empty')}
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    onFilterChange('all');
                    setViewTab('all');
                  }}
                  className="px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded-xl active:scale-95"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              filteredSpots.map((spot, index) => (
                <SpotCard
                  key={spot.id}
                  spot={spot}
                  isSelected={selectedSpot?.id === spot.id}
                  isClosest={index === 0 && sortBy === 'distance'}
                  onSelect={onSelectSpot}
                  lang={lang}
                />
              ))
            )}
          </div>
        )}
      </div>
    </aside>
  );
};

export default SpotSheet;
