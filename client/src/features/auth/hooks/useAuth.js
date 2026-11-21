import { useState, useEffect, useCallback } from 'react';
import { apiRequest } from '../../../lib/apiClient.js';
import {
  signInWithGoogleFirebase,
  signOutFirebase,
  isFirebaseConfigured
} from '../../../lib/firebase.js';

const STORAGE_KEY = 'heathaven_user_session';

/**
 * Hook for managing worker/volunteer account authentication & contributions
 */
export function useAuth() {
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Sync to localStorage
  useEffect(() => {
    try {
      if (currentUser) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(currentUser));
      } else {
        localStorage.removeItem(STORAGE_KEY);
      }
    } catch {
      // Ignore storage errors in private mode
    }
  }, [currentUser]);

  /**
   * Fast, passwordless login / registration for workers & commuters
   */
  const login = useCallback(async ({ name, phoneOrEmail, role = 'delivery_rider' }) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await apiRequest('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ name, phoneOrEmail, role })
      });

      if (res && res.user) {
        setCurrentUser(res.user);
        return { ok: true, user: res.user };
      }
    } catch {
      // Offline fallback login for gig workers
      const offlineUser = {
        id: `local_${Date.now()}`,
        name: name.trim(),
        phoneOrEmail: phoneOrEmail.trim(),
        role,
        contributionsCount: 3,
        savedSpots: [],
        badge: 'Relief Scout'
      };
      setCurrentUser(offlineUser);
      return { ok: true, user: offlineUser };
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Real Google Sign-In via Firebase Authentication
   * STRICT: Connects directly to user's real Chrome Google account without fake fallbacks.
   */
  const loginWithGoogle = useCallback(async (role = 'commuter') => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await signInWithGoogleFirebase();
      if (!result.ok) {
        setError(result.error);
        return { ok: false, error: result.error, errorCode: result.errorCode };
      }

      const googleUser = {
        ...result.user,
        role
      };

      // Also sync profile with backend if available
      try {
        await apiRequest('/auth/login', {
          method: 'POST',
          body: JSON.stringify({
            name: googleUser.name,
            phoneOrEmail: googleUser.email || googleUser.phoneOrEmail,
            role
          })
        });
      } catch {
        // Backend optional
      }

      setCurrentUser(googleUser);
      return { ok: true, user: googleUser };
    } catch (err) {
      const message = err.message || 'Google Sign-In failed';
      setError(message);
      return { ok: false, error: message };
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Completely clean logout (clears Firebase session + localStorage)
   */
  const logout = useCallback(async () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
      sessionStorage.clear();
      await signOutFirebase();
    } catch {
      // Safe ignore
    } finally {
      setCurrentUser(null);
      setError(null);
    }
  }, []);

  const incrementContributions = useCallback(async () => {
    if (!currentUser) return;
    const newCount = (currentUser.contributionsCount || 0) + 1;
    let badge = 'Relief Scout';
    if (newCount >= 10) badge = 'Relief Sentinel';
    else if (newCount >= 5) badge = 'Hydration Guardian';

    const updated = {
      ...currentUser,
      contributionsCount: newCount,
      badge
    };
    setCurrentUser(updated);

    if (currentUser.id && !currentUser.id.startsWith('local_')) {
      try {
        await apiRequest(`/auth/${currentUser.id}/contribute`, { method: 'POST' });
      } catch {
        // Safe ignore
      }
    }
  }, [currentUser]);

  const toggleSaveSpot = useCallback((spotId) => {
    if (!currentUser) return;
    const currentSaved = currentUser.savedSpots || [];
    const exists = currentSaved.includes(spotId);
    const updatedSpots = exists
      ? currentSaved.filter((id) => id !== spotId)
      : [...currentSaved, spotId];

    setCurrentUser({
      ...currentUser,
      savedSpots: updatedSpots
    });
  }, [currentUser]);

  return {
    currentUser,
    isLoggedIn: !!currentUser,
    isLoading,
    error,
    login,
    loginWithGoogle,
    logout,
    incrementContributions,
    toggleSaveSpot,
    isFirebaseConfigured
  };
}
