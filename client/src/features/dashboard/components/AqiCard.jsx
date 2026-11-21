import React from 'react';

export const AQI_CITIES = [
  { id: 'noida', name: 'Noida (Sector 18)', shortName: 'Noida', lat: 28.570, lng: 77.326 },
  { id: 'delhi_cp', name: 'Delhi (Connaught Place)', shortName: 'Delhi (CP)', lat: 28.631, lng: 77.219 },
  { id: 'anand_vihar', name: 'Delhi East (Anand Vihar)', shortName: 'Anand Vihar', lat: 28.648, lng: 77.316 },
  { id: 'kanpur', name: 'Kanpur (Industrial Belt)', shortName: 'Kanpur', lat: 26.4328, lng: 80.3865 },
  { id: 'aiims', name: 'South Delhi (AIIMS)', shortName: 'South Delhi', lat: 28.568, lng: 77.208 }
];

/**
 * AqiCard Component (Real-Time Air Quality & City Selection Telemetry)
 * Displays live US AQI, PM2.5, PM10, city selection pills, health category badge, and worker advisory.
 *
 * @param {Object} props
 * @param {Object} props.aqi - Live AQI object from Open-Meteo
 * @param {string} [props.selectedCityId='noida']
 * @param {Function} [props.onSelectCity]
 * @param {Function} [props.onRefresh]
 * @param {boolean} [props.isRefreshing]
 */
export const AqiCard = ({
  aqi,
  selectedCityId = 'noida',
  onSelectCity = () => {},
  onRefresh,
  isRefreshing = false
}) => {
  const usAqi = aqi?.usAqi ?? 215;
  const pm25 = aqi?.pm25 ?? 145.5;
  const pm10 = aqi?.pm10 ?? 230.2;
  const classification = aqi?.classification || {
    category: 'very_unhealthy',
    label: 'Very Unhealthy (बहुत खराब)',
    color: '#A855F7',
    badgeBg: 'bg-purple-100 text-purple-800 border-purple-300',
    risk: 'Emergency health warning. Combined 42°C+ heat and particulate matter cause severe respiratory stress.'
  };

  const activeCity = AQI_CITIES.find((c) => c.id === selectedCityId) || AQI_CITIES[0];

  return (
    <div className="p-6 md:p-8 rounded-3xl bg-card border border-line shadow-xs space-y-6 text-ink">
      {/* Header & City Selection Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-line pb-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-purple-50 text-purple-700 border border-purple-200 flex items-center justify-center text-lg shadow-xs shrink-0">
            <i className="fa-solid fa-wind" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-heading font-black text-base text-slate-900">
                Real-Time Air Quality Index (AQI)
              </h3>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                Live Satellite Sync
              </span>
            </div>
            <p className="text-xs text-slate-500 font-sans mt-0.5">
              Live Copernicus CAMS & Open-Meteo Telemetry · Currently viewing: <strong className="text-purple-700 font-bold">{activeCity.name}</strong>
            </p>
          </div>
        </div>

        {/* City Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar p-1 bg-slate-100 rounded-2xl shrink-0">
          {AQI_CITIES.map((city) => (
            <button
              key={city.id}
              type="button"
              onClick={() => onSelectCity(city)}
              disabled={isRefreshing}
              className={`px-3 py-1.5 text-xs font-bold rounded-xl whitespace-nowrap transition-all flex items-center gap-1.5 ${
                selectedCityId === city.id
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <span>📍 {city.shortName}</span>
              {selectedCityId === city.id && isRefreshing && (
                <i className="fa-solid fa-spinner fa-spin text-[10px]" />
              )}
            </button>
          ))}

          {onRefresh && (
            <button
              type="button"
              onClick={onRefresh}
              disabled={isRefreshing}
              className="w-8 h-8 rounded-xl bg-white hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-all active:scale-95 text-xs ml-1 shadow-2xs"
              title="Refresh Live Telemetry"
              aria-label="Refresh AQI"
            >
              <i className={`fa-solid fa-rotate-right ${isRefreshing ? 'fa-spin' : ''}`} />
            </button>
          )}
        </div>
      </div>

      {/* Main Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-left">
        {/* US AQI Hero */}
        <div className="p-5 rounded-2xl bg-purple-50/70 border border-purple-200/90 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-black text-purple-700 font-mono tracking-wider">
              {activeCity.shortName} US AQI
            </span>
            <span className="text-[10px] font-mono text-purple-600 font-bold bg-purple-100/80 px-2 py-0.5 rounded-full">
              Real-Time
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-mono font-black text-purple-900">
              {usAqi}
            </span>
            <span className="text-xs font-bold text-purple-700">/ 500 Index</span>
          </div>
          <span className={`inline-block text-[11px] font-black px-3 py-1 rounded-full border ${classification.badgeBg}`}>
            {classification.label}
          </span>
        </div>

        {/* PM2.5 Meter */}
        <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
          <span className="text-[10px] uppercase font-black text-slate-500 font-mono tracking-wider">
            Fine PM2.5 Particles
          </span>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-mono font-black text-slate-900">
              {pm25}
            </span>
            <span className="text-xs font-bold text-slate-500">µg/m³</span>
          </div>
          <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
            <div
              className="bg-purple-600 h-full rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, (pm25 / 250) * 100)}%` }}
            />
          </div>
          <span className="text-[11px] text-slate-500 block font-sans">
            WHO Safe Daily Limit: 15 µg/m³
          </span>
        </div>

        {/* PM10 Meter */}
        <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
          <span className="text-[10px] uppercase font-black text-slate-500 font-mono tracking-wider">
            Coarse PM10 Particles
          </span>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-mono font-black text-slate-900">
              {pm10}
            </span>
            <span className="text-xs font-bold text-slate-500">µg/m³</span>
          </div>
          <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
            <div
              className="bg-orange-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, (pm10 / 300) * 100)}%` }}
            />
          </div>
          <span className="text-[11px] text-slate-500 block font-sans">
            Airborne Dust, Smog & Vehicle Exhaust
          </span>
        </div>
      </div>

      {/* Dual Threat Worker Advisory */}
      <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 flex items-start gap-3">
        <i className="fa-solid fa-mask-ventilator text-rose-600 text-xl mt-0.5 shrink-0" />
        <div className="text-xs text-rose-900 leading-relaxed font-sans">
          <strong>Dual Heat & Pollution Advisory ({activeCity.shortName}):</strong> {classification.risk} Outdoor gig workers, delivery riders, and traffic crews MUST wear a damp cotton gamcha or N95 mask and take mandatory 15-minute shaded hydration breaks every 45 minutes.
        </div>
      </div>
    </div>
  );
};

export default AqiCard;
