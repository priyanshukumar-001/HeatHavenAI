import React, { useState, useEffect } from 'react';

/**
 * LiveFeed Component (Modern Clean Terminal Telemetry)
 * Terminal-style panel displaying real-time telemetry, reports, and AI decisions
 */
export const LiveFeed = () => {
  const [logs, setLogs] = useState([
    { id: 1, time: '15:24:02', color: 'text-blue-400', text: 'INIT_STREAM: Delhi-NCR & Kanpur Sector 18 live telemetry active' },
    { id: 2, time: '15:25:18', color: 'text-amber-400', text: 'SYNC_WEATHER: Open-Meteo apparent temp 42°C (EXTREME CAUTION)' },
    { id: 3, time: '15:28:44', color: 'text-emerald-400', text: 'REPORT_INGEST: Bangla Sahib Chilled Water Seva verified 100% OK' },
    { id: 4, time: '15:30:11', color: 'text-emerald-400', text: 'TRUST_RECALC: Anand Vihar ISBT DJB Tanker trust score 91/100' },
    { id: 5, time: '15:32:05', color: 'text-rose-400', text: 'GAP_ALERT: Sector 18 NW & Rama Devi flagged as Priority Heat Deserts' }
  ]);

  // Periodic live telemetry simulation
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
      const events = [
        { color: 'text-emerald-400', text: 'REPORT_VERIFY: Rama Devi Flyover Pyau verified "OK" (+6 trust)' },
        { color: 'text-blue-400', text: 'SHELTER_SYNC: Kanshi Ram Hospital Shelter verified active & shaded' },
        { color: 'text-amber-400', text: 'CACHE_HIT: Open-Meteo apparent temp 42°C refreshed across 8 zones' },
        { color: 'text-emerald-400', text: 'REPORT_INGEST: Sis Ganj Gurudwara 24/7 Jal Seva verified by rider' },
        { color: 'text-blue-400', text: 'CONCIERGE_HIT: Gemini AI response served in 220ms with nearby spots' }
      ];
      const randomEvent = events[Math.floor(Math.random() * events.length)];
      setLogs((prev) => [...prev.slice(-7), { id: Date.now(), time: timeStr, ...randomEvent }]);
    }, 6000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 text-slate-100 shadow-md flex flex-col justify-between">
      {/* Terminal Title Bar */}
      <div className="bg-slate-900 px-5 py-3 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block" />
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" />
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
          <span className="text-xs font-mono font-bold text-slate-300 ml-2">telemetry_feed.log</span>
        </div>
        <span className="text-xs font-mono text-emerald-400 font-bold flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          LIVE STREAM
        </span>
      </div>

      {/* Terminal Content Body */}
      <div className="p-5 font-mono text-xs space-y-2.5 h-52 overflow-y-auto bg-slate-950">
        {logs.map((log) => (
          <p key={log.id} className="leading-relaxed">
            <span className="text-slate-500 mr-2">[{log.time}]</span>
            <span className={`${log.color} font-medium`}>{log.text}</span>
          </p>
        ))}
      </div>
    </div>
  );
};

export default LiveFeed;
