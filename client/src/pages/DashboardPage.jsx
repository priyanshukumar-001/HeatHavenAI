import React, { useState, useEffect, useCallback } from 'react';
import KpiCard from '../features/dashboard/components/KpiCard.jsx';
import GapGrid from '../features/dashboard/components/GapGrid.jsx';
import KioskCard from '../features/dashboard/components/KioskCard.jsx';
import GapChart from '../features/dashboard/components/GapChart.jsx';
import AqiCard from '../features/dashboard/components/AqiCard.jsx';
import LiveFeed from '../features/dashboard/components/LiveFeed.jsx';
import Skeleton from '../components/ui/Skeleton.jsx';
import { fetchHeatGapAnalytics, fetchRealTimeAqi } from '../features/dashboard/api.js';
import { useT } from '../i18n/useT.js';

/**
 * DashboardPage Component
 * Officials' Heat-Gap Decision Dashboard
 * Clean, high-contrast, modern executive intelligence design (inspired by Reference Images 1, 2 & 4)
 *
 * @param {Object} props
 * @param {'en' | 'hi'} [props.lang='en']
 */
export const DashboardPage = ({ lang = 'en' }) => {
  const t = useT(lang);
  const [data, setData] = useState(null);
  const [liveAqi, setLiveAqi] = useState(null);
  const [selectedCityId, setSelectedCityId] = useState('noida');
  const [selectedCoords, setSelectedCoords] = useState({ lat: 28.570, lng: 77.326 });
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshingAqi, setIsRefreshingAqi] = useState(false);

  const loadAnalytics = useCallback((coords = selectedCoords) => {
    setIsRefreshingAqi(true);
    return fetchHeatGapAnalytics(coords.lat, coords.lng)
      .then((res) => {
        setData(res);
        if (res?.aqi) setLiveAqi(res.aqi);
      })
      .catch(() => {})
      .finally(() => setIsRefreshingAqi(false));
  }, [selectedCoords]);

  useEffect(() => {
    loadAnalytics({ lat: 28.570, lng: 77.326 }).finally(() => setIsLoading(false));
  }, [loadAnalytics]);

  const handleSelectCity = (city) => {
    setSelectedCityId(city.id);
    setSelectedCoords({ lat: city.lat, lng: city.lng });
    loadAnalytics({ lat: city.lat, lng: city.lng });
  };

  const handleRefreshAqi = async () => {
    setIsRefreshingAqi(true);
    try {
      const aqiRes = await fetchRealTimeAqi(selectedCoords.lat, selectedCoords.lng);
      setLiveAqi(aqiRes);
    } catch {
      // ignore
    } finally {
      setIsRefreshingAqi(false);
    }
  };

  const cells = data?.cells || [];
  const recommendation = data?.recommendations?.[0];
  const aqiData = liveAqi || data?.aqi;
  const peakHeat = Math.max(...cells.map((c) => c.heatIndexC), 42);
  const totalSpots = cells.reduce((acc, c) => acc + (c.spotCount || 0), 0);
  const totalVerified = cells.reduce((acc, c) => acc + (c.verifiedSpots || 0), 0);
  const desertCount = cells.filter((c) => c.isHeatDesert).length;

  const verifiedPercent = totalSpots > 0
    ? `${Math.round((totalVerified / totalSpots) * 100)}%`
    : '—';

  return (
    <div className="flex-1 overflow-y-auto pb-24 space-y-8 bg-paper text-ink min-h-screen">
      {/* Executive Command Header (Inspired by Reference 2 & 4) */}
      <section className="max-w-6xl mx-auto px-4 md:px-8 pt-6">
        <div className="p-6 md:p-8 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 text-white shadow-md flex flex-col md:flex-row md:items-center justify-between gap-6 border border-slate-700/50">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[11px] font-mono font-bold uppercase px-3 py-1 rounded-full bg-white/10 text-emerald-400 border border-emerald-400/30 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Municipal Heat Control Room
              </span>
              <span className="text-[11px] font-mono text-slate-300">
                Delhi-NCR & Kanpur Urban Zone · 250m Spatial Grid
              </span>
            </div>
            <h1 className="text-2xl md:text-4xl font-heading font-black tracking-tight text-white">
              {t('dashboard.title')}
            </h1>
            <p className="text-xs md:text-sm text-slate-300 font-sans max-w-2xl leading-relaxed">
              {t('dashboard.subtitle')}
            </p>
          </div>

          <div className="px-5 py-3.5 bg-white/10 backdrop-blur-md rounded-2xl border border-white/15 flex items-center gap-3 shrink-0 self-start md:self-auto">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-400/30 text-emerald-400 flex items-center justify-center">
              <i className="fa-solid fa-satellite-dish text-base" />
            </div>
            <div>
              <p className="text-[10px] uppercase font-mono text-slate-400 font-bold">Telemetry Sync</p>
              <p className="text-xs font-bold text-emerald-400 flex items-center gap-1.5 font-mono">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                Live Feed Active
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Dashboard Grid */}
      <div className="max-w-6xl mx-auto px-4 md:px-8 space-y-8">
        {/* KPI Cards Row (Inspired by Reference 1 Delivery Stats) */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <KpiCard
            title={t('dashboard.kpi.peakHeat')}
            value={`${peakHeat}°C`}
            subtitle="Open-Meteo apparent heat index"
            color="loo"
            icon="fa-temperature-arrow-up"
          />
          <KpiCard
            title={t('dashboard.kpi.reliefSpots')}
            value={totalSpots}
            subtitle="Water, shade & seating mapped"
            color="pani"
            icon="fa-location-dot"
          />
          <KpiCard
            title={t('dashboard.kpi.verifiedShare')}
            value={verifiedPercent}
            subtitle="Crowd trust score ≥ 70"
            color="chhaon"
            icon="fa-circle-check"
          />
          <KpiCard
            title={t('dashboard.kpi.heatDeserts')}
            value={desertCount}
            subtitle="Priority coverage deficit zones"
            color="ember"
            icon="fa-triangle-exclamation"
          />
        </section>

        {/* Real-Time Air Quality (AQI) Telemetry Card with City Selection */}
        <section>
          <AqiCard
            aqi={aqiData}
            selectedCityId={selectedCityId}
            onSelectCity={handleSelectCity}
            onRefresh={handleRefreshAqi}
            isRefreshing={isRefreshingAqi}
          />
        </section>

        {/* Optimal Recommendation & Live Telemetry Feed */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <KioskCard recommendation={recommendation} />
          <LiveFeed />
        </section>

        {/* Heat-Gap Matrix Grid */}
        <section>
          {isLoading ? (
            <div className="p-10 bg-card rounded-2xl border border-line text-center space-y-3">
              <Skeleton className="w-1/3 h-6 mx-auto bg-slate-200" />
              <Skeleton className="w-2/3 h-4 mx-auto bg-slate-200" />
            </div>
          ) : (
            <GapGrid cells={cells} />
          )}
        </section>

        {/* Multi-Metric Stress Analysis Bar Chart (Heat, AQI & Composite Deficit) */}
        <section>
          <GapChart cells={cells} aqi={aqiData} />
        </section>
      </div>
    </div>
  );
};

export default DashboardPage;
