import React from 'react';
import TopColorBar from './TopColorBar.jsx';
import Header from './Header.jsx';
import HeatAlertBanner from '../../features/heat/components/HeatAlertBanner.jsx';

/**
 * AppShell Component
 * Outer layout boundary hosting the signature top bar, sticky header, alert banner, and main view.
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children
 * @param {'en' | 'hi'} [props.lang='en']
 * @param {Function} [props.onToggleLang]
 * @param {number} [props.heatIndex]
 * @param {string} [props.heatLevel]
 * @param {string} [props.activeTab='home']
 * @param {Function} [props.onNavigate]
 * @param {Function} [props.onOpenSos]
 * @param {Function} [props.onOpenAuth]
 * @param {Object} [props.currentUser]
 * @param {boolean} [props.isDemoMode]
 */
export const AppShell = ({
  children,
  lang = 'en',
  onToggleLang,
  heatIndex,
  heatLevel,
  activeTab,
  onNavigate,
  onOpenSos,
  onOpenAuth,
  currentUser = null,
  isDemoMode = false
}) => {
  return (
    <div className="h-screen w-screen flex flex-col relative bg-paper text-ink overflow-hidden">
      {/* 4px Brand Thermal Gradient Bar */}
      <TopColorBar heatIndex={heatIndex} />

      {/* Sticky Top Header (56px) */}
      <Header
        lang={lang}
        onToggleLang={onToggleLang}
        heatIndex={heatIndex}
        heatLevel={heatLevel}
        activeTab={activeTab}
        onNavigate={onNavigate}
        onOpenSos={onOpenSos}
        onOpenAuth={onOpenAuth}
        currentUser={currentUser}
        isDemoMode={isDemoMode}
      />

      {/* Container below header */}
      <div className="flex-1 pt-14 flex flex-col min-h-0 overflow-hidden">
        {/* Heat Alert Banner (danger / extreme) in document flow, never overlapping controls */}
        <HeatAlertBanner heatIndexC={heatIndex} level={heatLevel} lang={lang} />

        {/* Main Content Area */}
        <main className="flex-1 flex flex-col min-h-0 relative overflow-hidden">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AppShell;
