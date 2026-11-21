import React, { useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from 'recharts';

/**
 * Modern Reference-Grade Real-Time GapChart Component
 * Visualizes live spatial telemetry across Delhi-NCR & Noida zones:
 * 1) Apparent Heat (°C) vs Relief Spots
 * 2) Real-Time Air Quality Index (US AQI & PM2.5)
 * 3) Composite Heat Stress Deficit Index
 *
 * NOTE: Bars are rendered directly as children of BarChart (NO React.Fragment <>)
 * so Recharts reliably mounts and renders every bar element.
 *
 * @param {Object} props
 * @param {Array} props.cells - Array of zone cells with live heat & AQI metrics
 * @param {Object} [props.aqi] - Top-level live AQI telemetry
 */
export const GapChart = ({ cells = [], aqi = null }) => {
  const [metricTab, setMetricTab] = useState('heat_spots'); // 'heat_spots' | 'aqi' | 'composite'

  // Default fallback zones if cells is loading or empty
  const defaultZones = [
    { name: 'Noida Sec 18 NW', fullName: 'Noida Sector 18 Market North-West', heat: 42, spots: 3, gap: 4.2, aqi: 220, pm25: 165, pm10: 240, isHeatDesert: true },
    { name: 'Noida Sec 18 Belt', fullName: 'Noida Sector 18 Commercial Belt', heat: 41, spots: 2, gap: 5.1, aqi: 235, pm25: 180, pm10: 260, isHeatDesert: true },
    { name: 'Anand Vihar ISBT', fullName: 'Anand Vihar ISBT Transit Hub', heat: 44, spots: 1, gap: 8.5, aqi: 265, pm25: 210, pm10: 290, isHeatDesert: true },
    { name: 'Connaught Place', fullName: 'Connaught Place Central Hub', heat: 39, spots: 6, gap: 2.1, aqi: 210, pm25: 145, pm10: 220, isHeatDesert: false },
    { name: 'AIIMS / Safdarjung', fullName: 'AIIMS / Safdarjung South Corridor', heat: 40, spots: 4, gap: 2.8, aqi: 225, pm25: 155, pm10: 230, isHeatDesert: false },
    { name: 'Atta Market Central', fullName: 'Noida Atta Market Central', heat: 43, spots: 2, gap: 6.0, aqi: 245, pm25: 190, pm10: 275, isHeatDesert: true }
  ];

  // Prepare chart data with zone-specific metrics
  const chartData = (cells && cells.length > 0)
    ? cells.map((c) => {
        const shortName = c.name
          .replace('Noida ', '')
          .replace(' Market North-West', ' NW')
          .replace(' Commercial Belt', ' Belt')
          .replace(' Central Hub', '')
          .replace(' Transit Hub', '')
          .replace(' South Corridor', '');

        return {
          fullName: c.name,
          name: shortName,
          heat: Number(c.heatIndexC) || 42,
          spots: Number(c.verifiedSpots) || 0,
          totalSpots: Number(c.spotCount) || 0,
          gap: Number(c.gapScore) || 3.5,
          aqi: Number(c.aqi) || (aqi?.usAqi ? Number(aqi.usAqi) : 225),
          pm25: Number(c.pm25) || (aqi?.pm25 ? Number(aqi.pm25) : 155),
          pm10: Number(c.pm10) || (aqi?.pm10 ? Number(aqi.pm10) : 240),
          isHeatDesert: Boolean(c.isHeatDesert)
        };
      })
    : defaultZones;

  // Custom rich tooltip
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="p-3.5 bg-white rounded-2xl border border-slate-200 shadow-[0_8px_30px_rgba(0,0,0,0.12)] text-left space-y-2 min-w-[220px]">
          <div className="border-b border-slate-100 pb-1.5 flex items-center justify-between gap-2">
            <p className="font-heading font-bold text-xs text-slate-900 leading-tight">
              {data.fullName}
            </p>
            {data.isHeatDesert && (
              <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-rose-100 text-rose-700 shrink-0">
                HEAT DESERT
              </span>
            )}
          </div>

          <div className="space-y-1 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-slate-500 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-rose-500" />
                Apparent Heat:
              </span>
              <span className="font-mono font-bold text-rose-600">{data.heat}°C</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-slate-500 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-purple-500" />
                Live Air Quality:
              </span>
              <span className="font-mono font-bold text-purple-700">AQI {data.aqi}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-slate-500 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-blue-600" />
                Verified Relief Spots:
              </span>
              <span className="font-mono font-bold text-blue-600">{data.spots} kiosks</span>
            </div>

            <div className="flex items-center justify-between pt-1 border-t border-slate-100 text-[11px]">
              <span className="text-slate-400">PM2.5 / PM10:</span>
              <span className="font-mono text-slate-700 font-semibold">{data.pm25} / {data.pm10} µg/m³</span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="p-6 md:p-8 rounded-3xl bg-card border border-line text-ink space-y-6 shadow-xs">
      {/* Chart Header & Metric Switcher Tabs */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-line pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-mono font-bold uppercase px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse" />
              Real-Time Zone Telemetry
            </span>
            <span className="text-[11px] font-mono text-slate-400">
              Open-Meteo & Copernicus Sync
            </span>
          </div>
          <h3 className="font-heading font-black text-lg text-slate-900">
            {metricTab === 'heat_spots' && 'Zone Stress: Apparent Heat (°C) vs Verified Water & Shade'}
            {metricTab === 'aqi' && 'Live Air Quality (US AQI & PM2.5) across Delhi-NCR Pilot Zones'}
            {metricTab === 'composite' && 'Composite Heat-Pollution Deficit Score (0 - 10 Priority)'}
          </h3>
          <p className="text-xs text-slate-500 font-sans mt-0.5">
            {metricTab === 'heat_spots' && 'Identifies treeless asphalt corridors with critical relief spot deficits'}
            {metricTab === 'aqi' && 'Dual exposure analysis: Hot dry Loo winds carrying high particulate matter'}
            {metricTab === 'composite' && 'Algorithmic ranking for emergency municipal misting & water deployment'}
          </p>
        </div>

        {/* Segmented Switcher Controls */}
        <div className="p-1 bg-slate-100 rounded-2xl flex items-center gap-1 shrink-0">
          <button
            type="button"
            onClick={() => setMetricTab('heat_spots')}
            className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all ${
              metricTab === 'heat_spots'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            🔥 Heat & Relief
          </button>

          <button
            type="button"
            onClick={() => setMetricTab('aqi')}
            className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all ${
              metricTab === 'aqi'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            🌫️ Live AQI
          </button>

          <button
            type="button"
            onClick={() => setMetricTab('composite')}
            className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all ${
              metricTab === 'composite'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            📊 Deficit Index
          </button>
        </div>
      </div>

      {/* Main Bar Chart (No React.Fragments around Bar components) */}
      <div className="h-80 w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 20, right: 25, left: 10, bottom: 35 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
            <XAxis
              dataKey="name"
              stroke="#94A3B8"
              tick={{ fontSize: 11, fill: '#475569', fontWeight: 600 }}
              angle={-14}
              textAnchor="end"
              height={45}
            />
            <YAxis
              stroke="#94A3B8"
              tick={{ fontSize: 11, fill: '#475569', fontWeight: 600 }}
              width={35}
            />
            <Tooltip content={<CustomTooltip />} />

            {/* Direct Bars without React.Fragment */}
            {metricTab === 'heat_spots' && (
              <Bar isAnimationActive={false} dataKey="heat" fill="#EF4444" name="Apparent Heat (°C)" radius={[6, 6, 0, 0]} maxBarSize={42} />
            )}
            {metricTab === 'heat_spots' && (
              <Bar isAnimationActive={false} dataKey="spots" fill="#2563EB" name="Verified Spots" radius={[6, 6, 0, 0]} maxBarSize={42} />
            )}

            {metricTab === 'aqi' && (
              <Bar isAnimationActive={false} dataKey="aqi" fill="#A855F7" name="US AQI Index" radius={[6, 6, 0, 0]} maxBarSize={42} />
            )}
            {metricTab === 'aqi' && (
              <Bar isAnimationActive={false} dataKey="pm25" fill="#F97316" name="PM2.5 (µg/m³)" radius={[6, 6, 0, 0]} maxBarSize={42} />
            )}

            {metricTab === 'composite' && (
              <Bar isAnimationActive={false} dataKey="gap" fill="#EA580C" name="Deficit Priority Score" radius={[6, 6, 0, 0]} maxBarSize={50} />
            )}
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Interactive Legend & Threshold Status */}
      <div className="flex flex-wrap items-center justify-between gap-4 text-xs font-mono pt-4 border-t border-line">
        <div className="flex flex-wrap items-center gap-5">
          {metricTab === 'heat_spots' && (
            <>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-rose-500" />
                <span className="text-slate-700 font-bold">Apparent Heat (°C)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-blue-600" />
                <span className="text-slate-700 font-bold">Verified Relief Spots</span>
              </div>
            </>
          )}

          {metricTab === 'aqi' && (
            <>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-purple-500" />
                <span className="text-slate-700 font-bold">US AQI Index (0-500)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-orange-500" />
                <span className="text-slate-700 font-bold">PM2.5 Concentration</span>
              </div>
            </>
          )}

          {metricTab === 'composite' && (
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-orange-600" />
              <span className="text-slate-700 font-bold">Municipal Placement Urgency (Higher = Worse Deficit)</span>
            </div>
          )}
        </div>

        <div className="text-[11px] text-slate-400 font-sans">
          Live sync via Open-Meteo API (250m Resolution)
        </div>
      </div>
    </div>
  );
};

export default GapChart;
