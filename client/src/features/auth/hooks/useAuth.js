import { useState, useEffect, useCallback } from 'react';
import { apiRequest } from '../../../lib/apiClient.js';

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
   * Fast, passwordless login / registration
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
        return res.user;
      }
    } catch {
      // Offline fallback login so workers never get blocked
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
      return offlineUser;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    setCurrentUser(null);
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
    logout,
    incrementContributions,
    toggleSaveSpot
  };
}

