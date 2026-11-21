import React, { useState, useEffect } from 'react';
import AppShell from './components/layout/AppShell.jsx';
import HomePage from './pages/HomePage.jsx';
import MapPage from './pages/MapPage.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import AdminPage from './pages/AdminPage.jsx';
import TokenPreviewPage from './pages/TokenPreviewPage.jsx';
import ConciergeSheet from './features/concierge/components/ConciergeSheet.jsx';
import SosModal from './components/ui/SosModal.jsx';
import AuthModal from './features/auth/components/AuthModal.jsx';
import { useAuth } from './features/auth/hooks/useAuth.js';
import { useHeat } from './features/heat/hooks/useHeat.js';
import { PILOT_COORDS } from './lib/constants.js';
import { detectSmartLocation } from './features/location/services/smartGeolocation.js';

export const App = () => {
  const [lang, setLang] = useState('en');
  const [activeTab, setActiveTab] = useState('home');
  const [pendingTab, setPendingTab] = useState(null);
  const [isConciergeOpen, setIsConciergeOpen] = useState(false);
  const [isSosOpen, setIsSosOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [userCoords, setUserCoords] = useState({ lat: PILOT_COORDS.LAT, lng: PILOT_COORDS.LNG });
  const [isGpsActive, setIsGpsActive] = useState(false);

  const auth = useAuth();

  // Automatic real-time Smart Geolocation on startup (GPS with IP fallback)
  useEffect(() => {
    let cancelled = false;
    detectSmartLocation().then((res) => {
      if (!cancelled && res.ok && res.coords) {
        setUserCoords(res.coords);
        setIsGpsActive(true);
      }
    });
    return () => {
      cancelled = true;
    };
  }, []);

  // Live heat index from the backend based on active user position
  const { heatIndexC, level: heatLevel } = useHeat({ lat: userCoords.lat, lng: userCoords.lng });

  // Sync initial tab and demo flag with auth protection
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('demo') === '1') {
      setIsDemoMode(true);
    }

    const path = window.location.pathname;
    const page = params.get('page');

    if (path === '/dev/tokens' || page === 'tokens') {
      setActiveTab('tokens');
    } else if (path === '/admin' || page === 'admin') {
      setActiveTab('admin');
    } else if (path === '/dashboard' || page === 'dashboard') {
      setActiveTab('dashboard');
    } else if (path === '/map' || page === 'map' || params.get('demo') === '1') {
      setActiveTab('map');
    }
  }, [auth.isLoggedIn]);

  // Once user logs in, automatically redirect to pending gated tab if requested
  useEffect(() => {
    if (auth.isLoggedIn && pendingTab) {
      setActiveTab(pendingTab);
      window.history.pushState({}, '', `/${pendingTab}`);
      setPendingTab(null);
    }
  }, [auth.isLoggedIn, pendingTab]);

  const handleToggleLang = () => {
    setLang((prev) => (prev === 'en' ? 'hi' : 'en'));
  };

  const handleNavigate = (tab) => {
    setActiveTab(tab);
    if (tab === 'tokens') {
      window.history.pushState({}, '', '/dev/tokens');
    } else if (tab === 'admin') {
      window.history.pushState({}, '', '/admin');
    } else if (tab === 'dashboard') {
      window.history.pushState({}, '', '/dashboard');
    } else if (tab === 'map') {
      window.history.pushState({}, '', '/map');
    } else {
      window.history.pushState({}, '', '/');
    }
  };

  return (
    <AppShell
      lang={lang}
      onToggleLang={handleToggleLang}
      heatIndex={heatIndexC}
      heatLevel={heatLevel}
      activeTab={activeTab}
      onNavigate={handleNavigate}
      onOpenSos={() => setIsSosOpen(true)}
      onOpenAuth={() => setIsAuthOpen(true)}
      currentUser={auth.currentUser}
      isDemoMode={isDemoMode}
    >
      {activeTab === 'home' ? (
        <HomePage
          userCoords={userCoords}
          isGpsActive={isGpsActive}
          onUpdateCoords={(coords) => {
            setUserCoords(coords);
            setIsGpsActive(true);
          }}
          onNavigate={handleNavigate}
          onOpenConcierge={() => setIsConciergeOpen(true)}
          onOpenSos={() => setIsSosOpen(true)}
          onOpenAuth={() => setIsAuthOpen(true)}
          auth={auth}
          heatIndexC={heatIndexC}
          heatLevel={heatLevel}
          lang={lang}
        />
      ) : activeTab === 'tokens' ? (
        <TokenPreviewPage />
      ) : activeTab === 'admin' ? (
        <AdminPage lang={lang} onNavigate={handleNavigate} />
      ) : activeTab === 'dashboard' ? (
        <DashboardPage lang={lang} />
      ) : (
        <MapPage
          lang={lang}
          heatIndexC={heatIndexC}
          heatLevel={heatLevel}
          userCoords={userCoords}
          onUpdateUserCoords={setUserCoords}
          onOpenConcierge={() => setIsConciergeOpen(true)}
        />
      )}

      {/* AI Concierge Modal Sheet */}
      <ConciergeSheet
        isOpen={isConciergeOpen}
        onClose={() => setIsConciergeOpen(false)}
        lang={lang}
        userCoords={userCoords}
      />

      {/* Heatstroke Emergency SOS Modal */}
      <SosModal
        isOpen={isSosOpen}
        onClose={() => setIsSosOpen(false)}
        lang={lang}
      />

      {/* User Login & Account Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        auth={auth}
        lang={lang}
      />
    </AppShell>
  );
};

export default App;
