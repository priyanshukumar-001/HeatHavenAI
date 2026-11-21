import React from 'react';
import { motion } from 'framer-motion';
import HeatPill from '../../features/heat/components/HeatPill.jsx';
import { useT } from '../../i18n/useT.js';

/**
 * Modern Gen-Z Header Component (Inspired by Reference Images 1, 2 & 4)
 * Sleek glassmorphism bar with bold typography, live thermal indicator,
 * instant navigation tabs, and emergency SOS trigger.
 */
export const Header = ({
  lang = 'en',
  onToggleLang = () => {},
  heatIndex = 42,
  heatLevel,
  activeTab = 'map',
  onNavigate = () => {},
  onOpenSos = () => {},
  onOpenAuth = () => {},
  currentUser = null,
  isDemoMode = false
}) => {
  const t = useT(lang);

  return (
    <motion.header
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      className="fixed top-1 left-0 right-0 h-14 bg-card/95 backdrop-blur-md border-b border-line z-40 px-3 md:px-6 flex items-center justify-between shadow-xs"
    >
      {/* Left: Modern Brand Wordmark */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => onNavigate('home')}
          className="text-left group flex items-center gap-2 focus:outline-none"
          aria-label="HeatHaven Home"
        >
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-xs group-hover:scale-105 transition-transform">
            <i className="fa-solid fa-sun-plant-wilt text-sm" />
          </div>
          <div className="flex items-center">
            <span className="font-heading font-black text-lg md:text-xl tracking-tight text-ink group-hover:text-blue-600 transition-colors">
              Heat<span className="text-blue-600">Haven</span>
            </span>
            <span className="ml-1.5 text-[10px] px-2 py-0.5 rounded-full font-mono font-bold bg-blue-50 text-blue-700 border border-blue-200">
              AI
            </span>
          </div>
          {isDemoMode && (
            <span className="hidden sm:inline-block text-[10px] px-2 py-0.5 rounded-full font-mono font-bold bg-amber-50 text-amber-700 border border-amber-200">
              LIVE PILOT
            </span>
          )}
        </button>

        {/* Desktop Navigation Links (Reference 1 Dark Pill Style) */}
        <nav className="hidden md:flex items-center gap-1.5 ml-5 border-l border-line pl-5">
          <button
            onClick={() => onNavigate('home')}
            className={`px-3.5 py-1.5 text-xs font-bold rounded-full transition-all ${
              activeTab === 'home'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            {lang === 'hi' ? 'होम' : 'Home'}
          </button>
          <button
            onClick={() => onNavigate('map')}
            className={`px-3.5 py-1.5 text-xs font-bold rounded-full transition-all flex items-center gap-1.5 ${
              activeTab === 'map'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <i className="fa-solid fa-map-location-dot text-[11px] text-blue-500" />
            <span>{t('header.map')}</span>
          </button>
          <button
            onClick={() => onNavigate('dashboard')}
            className={`px-3.5 py-1.5 text-xs font-bold rounded-full transition-all flex items-center gap-1.5 ${
              activeTab === 'dashboard'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <i className="fa-solid fa-chart-pie text-[11px] text-emerald-500" />
            <span>{t('header.dashboard')}</span>
          </button>
          <button
            onClick={() => onNavigate('admin')}
            className={`px-3 py-1.5 text-xs font-bold rounded-full transition-all flex items-center gap-1.5 ${
              activeTab === 'admin'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <i className="fa-solid fa-shield-halved text-[10px] text-rose-500" />
            <span>Admin</span>
          </button>
          <button
            onClick={() => onNavigate('tokens')}
            className={`px-2.5 py-1.5 text-[11px] font-mono font-semibold rounded-full transition-all ${
              activeTab === 'tokens'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-400 hover:text-slate-700 hover:bg-slate-100'
            }`}
          >
            /tokens
          </button>
        </nav>
      </div>

      {/* Right Controls: SOS + Heat Badge + Language + Profile */}
      <div className="flex items-center gap-2 sm:gap-2.5">
        {/* Glowing 1-Tap SOS Button */}
        <button
          onClick={onOpenSos}
          className="h-9 px-3 sm:px-3.5 rounded-full bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-600 font-bold text-xs flex items-center gap-1.5 active:scale-95 transition-all shadow-xs"
          title="Heatstroke Emergency (108)"
          aria-label="Heatstroke SOS"
        >
          <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
          <i className="fa-solid fa-kit-medical text-[11px]" />
          <span className="font-heading font-black">SOS</span>
        </button>

        {/* Live Thermal Metric */}
        <HeatPill heatIndexC={heatIndex} level={heatLevel} lang={lang} />

        {/* Bilingual Hindi/English Switcher */}
        <button
          onClick={onToggleLang}
          className="h-9 px-2.5 sm:px-3 rounded-full bg-paper hover:bg-paper-2 border border-line text-ink font-heading font-bold text-xs flex items-center gap-1 transition-all focus:outline-none"
          title={lang === 'en' ? 'Switch to Hindi (हिंदी)' : 'Switch to English'}
          aria-label="Toggle language"
        >
          <i className="fa-solid fa-language text-slate-500 text-xs" />
          <span>{lang === 'en' ? 'HI' : 'EN'}</span>
        </button>

        {/* User Account / Profile Button */}
        <button
          onClick={onOpenAuth}
          className="h-9 px-2.5 sm:px-3 rounded-full bg-paper hover:bg-paper-2 border border-line text-ink font-bold text-xs flex items-center gap-1.5 transition-all focus:outline-none"
          title={currentUser ? currentUser.name : 'Sign in / Profile'}
          aria-label="User Account"
        >
          <div className="w-5 h-5 rounded-full bg-blue-600 text-white text-[10px] flex items-center justify-center font-bold">
            {currentUser ? currentUser.name.charAt(0).toUpperCase() : <i className="fa-solid fa-user text-[9px]" />}
          </div>
          <span className="hidden sm:inline font-sans truncate max-w-[90px]">
            {currentUser ? currentUser.name.split(' ')[0] : 'Sign In'}
          </span>
        </button>
      </div>
    </motion.header>
  );
};

export default Header;
