import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { apiRequest } from '../lib/apiClient.js';
import Toast from '../components/ui/Toast.jsx';

/**
 * AdminPage Component
 * Municipal Relief Command Center: Heat Broadcasts, Spot Management & Chhaon Resource Dispatch
 * Uses the dark "control room" theme (--night: #151A18, --night-2: #1E2522, --ember: #FF9A4D)
 */
export const AdminPage = ({ lang = 'en', onNavigate = () => {} }) => {
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'broadcast' | 'dispatch' | 'spots'
  const [stats, setStats] = useState(null);
  const [broadcast, setBroadcast] = useState({
    active: true,
    level: 'extreme',
    titleEn: 'IMD Extreme Heat Red Alert · Delhi NCR',
    titleHi: 'मौसम विभाग रेड अलर्ट · भीषण लू चेतावनी',
    messageEn: 'Severe hot westerly winds (Loo) active. Keep mouth & head covered. Seek shaded shelter between 12-4 PM.',
    messageHi: 'तेज गर्म पछुआ हवाएं (लू) जारी। मुंह व सिर ढककर रखें। दोपहर 12 से 4 बजे के बीच छायादार स्थानों पर रहें।'
  });
  const [dispatchZones, setDispatchZones] = useState([]);
  const [toastMessage, setToastMessage] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [adminKey, setAdminKey] = useState(() => sessionStorage.getItem('hh_admin_key') || '');
  const [isAuthenticated, setIsAuthenticated] = useState(() => !!sessionStorage.getItem('hh_admin_key'));

  // New Spot Form State
  const [newSpot, setNewSpot] = useState({
    name: '',
    category: 'water',
    lat: 28.570,
    lng: 77.326,
    description: ''
  });

  // Load Admin Data
  useEffect(() => {
    async function loadData() {
      try {
        const statsData = await apiRequest('/admin/stats').catch(() => null);
        if (statsData) {
          setStats(statsData.stats);
          if (statsData.broadcast) setBroadcast(statsData.broadcast);
        }

        const dispatchData = await apiRequest('/admin/dispatch-recommendations').catch(() => null);
        if (dispatchData && dispatchData.recommendations) {
          setDispatchZones(dispatchData.recommendations);
        }
      } catch {
        // Fallback default
      }
    }
    loadData();
  }, []);

  const handleUpdateBroadcast = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await apiRequest('/admin/broadcast', {
        method: 'POST',
        headers: { 'x-admin-key': adminKey },
        body: JSON.stringify(broadcast)
      });
      setToastMessage(lang === 'hi' ? 'आपदा बुलेटिन अपडेट हो गया!' : 'Heat Emergency Broadcast updated!');
      setTimeout(() => setToastMessage(null), 3000);
    } catch {
      setToastMessage(lang === 'hi' ? 'अपडेट में त्रुटि हुई' : 'Failed to update broadcast');
      setTimeout(() => setToastMessage(null), 3000);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCreateSpot = async (e) => {
    e.preventDefault();
    if (!newSpot.name) return;
    setIsSaving(true);
    try {
      await apiRequest('/admin/spots', {
        method: 'POST',
        headers: { 'x-admin-key': adminKey },
        body: JSON.stringify({
          ...newSpot,
          lat: parseFloat(newSpot.lat),
          lng: parseFloat(newSpot.lng)
        })
      });
      setToastMessage(lang === 'hi' ? 'नया आधिकारिक स्पॉट जोड़ा गया!' : 'Official relief spot registered!');
      setTimeout(() => setToastMessage(null), 3000);
      setNewSpot({ name: '', category: 'water', lat: 28.570, lng: 77.326, description: '' });
    } catch {
      setToastMessage(lang === 'hi' ? 'स्पॉट जोड़ने में त्रुटि' : 'Failed to register spot');
      setTimeout(() => setToastMessage(null), 3000);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSimulateDispatch = (zoneId) => {
    setToastMessage(
      lang === 'hi'
        ? `दिल्ली जल बोर्ड टैंकर डिस्पैच आदेश जारी: ${zoneId}`
        : `Delhi Jal Board 5000L Tanker dispatched to ${zoneId}`
    );
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleAdminLogin = (e) => {
    e.preventDefault();
    sessionStorage.setItem('hh_admin_key', adminKey);
    setIsAuthenticated(true);
    setToastMessage(lang === 'hi' ? 'एडमिन एक्सेस सफल!' : 'Admin access granted!');
    setTimeout(() => setToastMessage(null), 2500);
  };

  return (
    <div className="flex-1 overflow-y-auto bg-[#151A18] text-[#EDE7DA] p-4 md:p-8 space-y-6 min-h-screen">
      <Toast message={toastMessage} type="success" />

      {/* Admin Passkey Gate (Zero Passkey Leakage) */}
      {!isAuthenticated && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md mx-auto mt-16 p-8 bg-[#1E2522] rounded-2xl border border-[#2C3531] shadow-2 space-y-6 text-center"
        >
          <div className="w-16 h-16 mx-auto rounded-2xl bg-pani/15 border border-pani/30 flex items-center justify-center">
            <i className="fa-solid fa-shield-halved text-2xl text-pani-soft" />
          </div>
          <div className="space-y-1">
            <h2 className="text-xl font-heading font-extrabold text-[#EDE7DA]">
              {lang === 'hi' ? 'नगर निगम एडमिन कमांड सेंटर' : 'Municipal Admin Command Center'}
            </h2>
            <p className="text-xs text-[#EDE7DA]/70 font-sans">
              {lang === 'hi' ? 'प्रमाणीकृत पासकी दर्ज करें (DDMA / NDMA अधिकारी)' : 'Enter authorized civic agency passkey'}
            </p>
          </div>
          <form onSubmit={handleAdminLogin} className="space-y-4">
            <input
              type="password"
              value={adminKey}
              onChange={(e) => setAdminKey(e.target.value)}
              placeholder="••••••••••••"
              className="w-full h-11 px-4 text-sm rounded-xl bg-[#151A18] border border-[#2C3531] focus:border-pani focus:ring-2 focus:ring-pani/20 text-center font-mono tracking-widest text-[#EDE7DA]"
              required
              autoFocus
            />
            <button
              type="submit"
              className="w-full h-11 rounded-xl bg-pani text-white font-bold text-sm hover:brightness-110 active:scale-98 transition-all shadow-sm"
            >
              <i className="fa-solid fa-right-to-bracket mr-2" />
              {lang === 'hi' ? 'कमांड सेंटर खोलें' : 'Access Command Center'}
            </button>
          </form>
        </motion.div>
      )}

      {isAuthenticated && (
        <>
          {/* Header Banner */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#2C3531] pb-5">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono font-bold uppercase px-2.5 py-0.5 rounded-full bg-loo/20 text-loo border border-loo/30">
                  MUNICIPAL RELIEF CONTROL PANEL
                </span>
                <span className="text-xs font-mono text-[#EDE7DA]/60">
                  DDMA / NDMA Heat Action Protocol
                </span>
              </div>
              <h1 className="text-2xl md:text-3xl font-heading font-black text-[#EDE7DA] mt-1.5">
                {lang === 'hi' ? 'नगर निगम एवं आपदा राहत नियंत्रण केंद्र' : 'Municipal Heat Emergency & Relief Command'}
              </h1>
            </div>

            <div className="flex items-center gap-2.5">
              <button
                onClick={() => onNavigate('home')}
                className="px-3.5 py-2 rounded-xl border border-[#2C3531] bg-[#1E2522] text-xs font-semibold text-[#EDE7DA] hover:bg-[#2C3531] transition-colors"
              >
                <i className="fa-solid fa-arrow-left mr-1.5" />
                {lang === 'hi' ? 'होम पर लौटें' : 'Back to Home'}
              </button>
              <button
                onClick={() => onNavigate('map')}
                className="px-4 py-2 rounded-xl bg-pani text-white text-xs font-bold hover:brightness-110 transition-all shadow-xs"
              >
                <i className="fa-solid fa-map mr-1.5" />
                {lang === 'hi' ? 'लाइव मैप खोलें' : 'Open Live Map'}
              </button>
            </div>
          </div>

          {/* Tab Switcher */}
          <div className="flex items-center gap-2 border-b border-[#2C3531] pb-3 overflow-x-auto no-scrollbar">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                activeTab === 'overview'
                  ? 'bg-pani text-white shadow-sm'
                  : 'bg-[#1E2522] text-[#EDE7DA]/70 hover:text-[#EDE7DA] border border-[#2C3531]'
              }`}
            >
              <i className="fa-solid fa-chart-line" />
              {lang === 'hi' ? 'राहत अवलोकन' : 'Overview & Telemetry'}
            </button>

            <button
              onClick={() => setActiveTab('broadcast')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                activeTab === 'broadcast'
                  ? 'bg-pani text-white shadow-sm'
                  : 'bg-[#1E2522] text-[#EDE7DA]/70 hover:text-[#EDE7DA] border border-[#2C3531]'
              }`}
            >
              <i className="fa-solid fa-bullhorn" />
              {lang === 'hi' ? 'आपातकालीन बुलेटिन' : 'Emergency Heat Broadcast'}
            </button>

            <button
              onClick={() => setActiveTab('dispatch')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                activeTab === 'dispatch'
                  ? 'bg-pani text-white shadow-sm'
                  : 'bg-[#1E2522] text-[#EDE7DA]/70 hover:text-[#EDE7DA] border border-[#2C3531]'
              }`}
            >
              <i className="fa-solid fa-truck-droplet" />
              {lang === 'hi' ? 'छांव (Chhaon) टैंकर डिस्पैच' : 'Chhaon Tanker Dispatch'}
            </button>

            <button
              onClick={() => setActiveTab('spots')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                activeTab === 'spots'
                  ? 'bg-pani text-white shadow-sm'
                  : 'bg-[#1E2522] text-[#EDE7DA]/70 hover:text-[#EDE7DA] border border-[#2C3531]'
              }`}
            >
              <i className="fa-solid fa-plus" />
              {lang === 'hi' ? 'नया स्पॉट जोड़ें' : 'Register Relief Spot'}
            </button>
          </div>

          {/* Tab 1: Overview */}
          {activeTab === 'overview' && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-5 bg-[#1E2522] rounded-2xl border border-[#2C3531]">
                  <span className="text-xs text-[#EDE7DA]/70 font-semibold">Total Verified Spots</span>
                  <p className="text-3xl font-extrabold text-[#EDE7DA] mt-1.5 font-mono">
                    {stats?.totalSpots || 32}
                  </p>
                  <span className="text-[11px] text-emerald-400 font-bold">● Ground-Inspected</span>
                </div>

                <div className="p-5 bg-[#1E2522] rounded-2xl border border-[#2C3531]">
                  <span className="text-xs text-[#EDE7DA]/70 font-semibold">Drinking Water Kiosks</span>
                  <p className="text-3xl font-extrabold text-pani-soft mt-1.5 font-mono">
                    {stats?.waterCount || 18}
                  </p>
                  <span className="text-[11px] text-[#EDE7DA]/50">DJB + Metro + Pyau</span>
                </div>

                <div className="p-5 bg-[#1E2522] rounded-2xl border border-[#2C3531]">
                  <span className="text-xs text-[#EDE7DA]/70 font-semibold">Verified Urban Shade</span>
                  <p className="text-3xl font-extrabold text-emerald-400 mt-1.5 font-mono">
                    {stats?.shadeCount || 9}
                  </p>
                  <span className="text-[11px] text-[#EDE7DA]/50">DUSIB & Banyan Belts</span>
                </div>

                <div className="p-5 bg-[#1E2522] rounded-2xl border border-[#2C3531]">
                  <span className="text-xs text-[#EDE7DA]/70 font-semibold">Active Tanker Units</span>
                  <p className="text-3xl font-extrabold text-amber-400 mt-1.5 font-mono">
                    {stats?.activeTankersDispatched || 6}
                  </p>
                  <span className="text-[11px] text-loo font-bold">● Active Staging</span>
                </div>
              </div>

              {/* Live Heat Protocol Card */}
              <div className="p-6 bg-[#1E2522] rounded-2xl border border-[#2C3531] space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <h2 className="text-sm font-bold text-[#EDE7DA] uppercase tracking-wider flex items-center gap-2">
                    <i className="fa-solid fa-triangle-exclamation text-loo" />
                    Active Heat Action Plan Status (GRAP / NDMA)
                  </h2>
                  <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-loo/20 text-loo border border-loo/30 self-start sm:self-auto">
                    STAGE 3: SEVERE HEATWAVE
                  </span>
                </div>
                <p className="text-xs text-[#EDE7DA]/80 leading-relaxed font-sans">
                  Automatic alert triggers when apparent temperature exceeds 42°C with westerly loo winds over 15 km/h.
                  All public fountains, metro cool posts, and DUSIB shelters are mandated to remain unlocked 24/7.
                </p>
              </div>
            </motion.div>
          )}

          {/* Tab 2: Emergency Broadcast Controller */}
          {activeTab === 'broadcast' && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-[#1E2522] p-6 rounded-2xl border border-[#2C3531] space-y-5 max-w-3xl"
            >
              <div className="border-b border-[#2C3531] pb-3">
                <h2 className="text-base font-heading font-extrabold text-[#EDE7DA]">
                  City-Wide Public Alert Broadcast
                </h2>
                <p className="text-xs text-[#EDE7DA]/70 mt-1 font-sans">
                  Updates the urgent heat warning ticker visible at the top of all citizen screens.
                </p>
              </div>

              <form onSubmit={handleUpdateBroadcast} className="space-y-4">
                <div className="flex flex-wrap items-center gap-4">
                  <label className="flex items-center gap-2 text-xs font-bold text-[#EDE7DA] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={broadcast.active}
                      onChange={(e) => setBroadcast({ ...broadcast, active: e.target.checked })}
                      className="rounded accent-pani focus:ring-pani"
                    />
                    Broadcast Banner Active
                  </label>

                  <select
                    value={broadcast.level}
                    onChange={(e) => setBroadcast({ ...broadcast, level: e.target.value })}
                    className="text-xs font-bold h-10 px-3 rounded-xl border border-[#2C3531] bg-[#151A18] text-[#EDE7DA] focus:ring-2 focus:ring-pani"
                  >
                    <option value="extreme">Extreme Heat (Red Alert)</option>
                    <option value="danger">High Heat (Orange Alert)</option>
                    <option value="warning">Moderate Heat (Yellow Advisory)</option>
                  </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#EDE7DA]/70 mb-1">
                      Title (English)
                    </label>
                    <input
                      type="text"
                      value={broadcast.titleEn}
                      onChange={(e) => setBroadcast({ ...broadcast, titleEn: e.target.value })}
                      className="w-full h-10 px-3 text-xs rounded-xl bg-[#151A18] border border-[#2C3531] text-[#EDE7DA] focus:ring-2 focus:ring-pani"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#EDE7DA]/70 mb-1">
                      शीर्षक (Hindi)
                    </label>
                    <input
                      type="text"
                      value={broadcast.titleHi}
                      onChange={(e) => setBroadcast({ ...broadcast, titleHi: e.target.value })}
                      className="w-full h-10 px-3 text-xs rounded-xl bg-[#151A18] border border-[#2C3531] text-[#EDE7DA] focus:ring-2 focus:ring-pani font-sans"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#EDE7DA]/70 mb-1">
                    Advisory Message (English)
                  </label>
                  <textarea
                    rows={2}
                    value={broadcast.messageEn}
                    onChange={(e) => setBroadcast({ ...broadcast, messageEn: e.target.value })}
                    className="w-full p-3 text-xs rounded-xl bg-[#151A18] border border-[#2C3531] text-[#EDE7DA] focus:ring-2 focus:ring-pani"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#EDE7DA]/70 mb-1">
                    सलाह सन्देश (Hindi)
                  </label>
                  <textarea
                    rows={2}
                    value={broadcast.messageHi}
                    onChange={(e) => setBroadcast({ ...broadcast, messageHi: e.target.value })}
                    className="w-full p-3 text-xs rounded-xl bg-[#151A18] border border-[#2C3531] text-[#EDE7DA] focus:ring-2 focus:ring-pani font-sans"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSaving}
                  className="h-10 px-6 rounded-xl bg-pani text-white text-xs font-bold hover:brightness-110 transition-all shadow-sm active:scale-98"
                >
                  <i className="fa-solid fa-paper-plane mr-2" />
                  {isSaving ? 'Broadcasting...' : 'Publish Public Broadcast'}
                </button>
              </form>
            </motion.div>
          )}

          {/* Tab 3: Chhaon Resource Dispatcher */}
          {activeTab === 'dispatch' && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <div className="p-6 bg-[#1E2522] rounded-2xl border border-[#2C3531]">
                <h2 className="text-base font-heading font-extrabold text-[#EDE7DA] flex items-center gap-2">
                  <i className="fa-solid fa-satellite text-pani-soft" />
                  Chhaon (IIIT-Delhi) High-Thermal Microclimate Analysis
                </h2>
                <p className="text-xs text-[#EDE7DA]/70 mt-1 font-sans">
                  Automated resource deployment recommendations targeting Delhi-NCR blocks with extreme heat stress (&gt;46°C apparent) and zero potable water within a 500m pedestrian radius.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {dispatchZones.map((zone) => (
                  <div
                    key={zone.id}
                    className="p-5 bg-[#1E2522] rounded-2xl border border-[#2C3531] space-y-3 flex flex-col justify-between"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono font-bold uppercase px-2.5 py-0.5 rounded-full bg-loo/20 text-loo">
                          {zone.priority} Priority
                        </span>
                        <span className="text-xs font-mono font-bold text-loo">
                          🔥 {zone.apparentTemp}°C
                        </span>
                      </div>

                      <h3 className="text-sm font-heading font-bold text-[#EDE7DA]">
                        {zone.areaName}
                      </h3>

                      <p className="text-xs text-[#EDE7DA]/70">
                        <strong className="text-[#EDE7DA]">Deficiency:</strong> {zone.deficiency}
                      </p>

                      <p className="text-xs text-pani-soft font-semibold">
                        <i className="fa-solid fa-lightbulb mr-1" />
                        {zone.recommendedAction}
                      </p>
                    </div>

                    <button
                      onClick={() => handleSimulateDispatch(zone.areaName)}
                      className="w-full h-10 rounded-xl bg-pani hover:brightness-110 text-white text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-xs"
                    >
                      <i className="fa-solid fa-truck-droplet text-xs" />
                      Dispatch DJB Tanker Now
                    </button>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Tab 4: Register Official Relief Spot */}
          {activeTab === 'spots' && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-[#1E2522] p-6 rounded-2xl border border-[#2C3531] space-y-5 max-w-2xl"
            >
              <div className="border-b border-[#2C3531] pb-3">
                <h2 className="text-base font-heading font-extrabold text-[#EDE7DA]">
                  Register New Official Relief Spot
                </h2>
                <p className="text-xs text-[#EDE7DA]/70 mt-1 font-sans">
                  Adds an inspected municipal water post, shaded canopy, or resting station to the live public relief map.
                </p>
              </div>

              <form onSubmit={handleCreateSpot} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-[#EDE7DA]/70 mb-1">
                    Spot Name / Landmark
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Sector 18 Metro Gate 3 Chilled Water ATM"
                    value={newSpot.name}
                    onChange={(e) => setNewSpot({ ...newSpot, name: e.target.value })}
                    className="w-full h-10 px-3 text-xs rounded-xl bg-[#151A18] border border-[#2C3531] text-[#EDE7DA] focus:ring-2 focus:ring-pani"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-[#EDE7DA]/70 mb-1">
                      Category
                    </label>
                    <select
                      value={newSpot.category}
                      onChange={(e) => setNewSpot({ ...newSpot, category: e.target.value })}
                      className="w-full h-10 px-2 text-xs font-bold rounded-xl bg-[#151A18] border border-[#2C3531] text-[#EDE7DA] focus:ring-2 focus:ring-pani"
                    >
                      <option value="water">💧 Drinking Water (जल)</option>
                      <option value="shade">🌳 Urban Shade (छांव)</option>
                      <option value="rest">🪑 Covered Rest (विश्राम)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#EDE7DA]/70 mb-1">
                      Latitude
                    </label>
                    <input
                      type="number"
                      step="0.0001"
                      value={newSpot.lat}
                      onChange={(e) => setNewSpot({ ...newSpot, lat: e.target.value })}
                      className="w-full h-10 px-3 text-xs rounded-xl bg-[#151A18] border border-[#2C3531] font-mono text-[#EDE7DA] focus:ring-2 focus:ring-pani"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#EDE7DA]/70 mb-1">
                      Longitude
                    </label>
                    <input
                      type="number"
                      step="0.0001"
                      value={newSpot.lng}
                      onChange={(e) => setNewSpot({ ...newSpot, lng: e.target.value })}
                      className="w-full h-10 px-3 text-xs rounded-xl bg-[#151A18] border border-[#2C3531] font-mono text-[#EDE7DA] focus:ring-2 focus:ring-pani"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#EDE7DA]/70 mb-1">
                    Official Notes / Water Quality
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. DJB RO Potable Water · Filter replacement verified this morning"
                    value={newSpot.description}
                    onChange={(e) => setNewSpot({ ...newSpot, description: e.target.value })}
                    className="w-full h-10 px-3 text-xs rounded-xl bg-[#151A18] border border-[#2C3531] text-[#EDE7DA] focus:ring-2 focus:ring-pani"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSaving}
                  className="h-10 px-6 rounded-xl bg-chhaon text-white text-xs font-bold hover:brightness-110 transition-all shadow-sm active:scale-98"
                >
                  <i className="fa-solid fa-plus mr-2" />
                  {isSaving ? 'Registering...' : 'Add Spot to Live Relief Map'}
                </button>
              </form>
            </motion.div>
          )}
        </>
      )}
    </div>
  );
};

export default AdminPage;
