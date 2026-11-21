import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';

/**
 * Firebase Client Configuration
 * Keys are loaded from Vite environment variables (prefixed with VITE_).
 * When keys are not set, a graceful offline fallback handles auth.
 */
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || '',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || '',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || '',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || ''
};

export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey &&
  firebaseConfig.apiKey !== 'your_firebase_api_key' &&
  firebaseConfig.projectId
);

// Initialize Firebase App singleton
export const app = isFirebaseConfigured
  ? (getApps().length === 0 ? initializeApp(firebaseConfig) : getApp())
  : null;

export const auth = app ? getAuth(app) : null;
export const googleProvider = new GoogleAuthProvider();

// Customize Google Provider prompt
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

/**
 * Sign in using Firebase Google Auth with popup
 * Falls back cleanly if Firebase keys are not yet configured or on network error.
 *
 * @returns {Promise<{ ok: boolean, user?: object, error?: string, source: 'firebase' | 'simulated' }>}
 */
export async function signInWithGoogleFirebase() {
  if (isFirebaseConfigured && auth) {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const fbUser = result.user;
      return {
        ok: true,
        source: 'firebase',
        user: {
          id: fbUser.uid,
          name: fbUser.displayName || 'Google User',
          phoneOrEmail: fbUser.email || '',
          email: fbUser.email || '',
          photoURL: fbUser.photoURL || '',
          provider: 'google',
          badge: 'Verified Google Contributor',
          contributionsCount: 5,
          savedSpots: []
        }
      };
    } catch (err) {
      // If unauthorized domain (e.g. Render domain not yet added to Firebase authorized domains)
      // or popup was closed by user
      if (err.code === 'auth/popup-closed-by-user') {
        return { ok: false, error: 'Sign-in window was closed.' };
      }
      if (err.code === 'auth/unauthorized-domain') {
        console.warn('Firebase auth: domain not yet in Authorized Domains list in Firebase Console. Using demo sign-in.');
      } else {
        console.error('Firebase Auth error:', err);
      }
      // Return error code so caller can provide simulated fallback or message
      return {
        ok: false,
        errorCode: err.code,
        error: err.message
      };
    }
  }

  // Graceful fallback when Firebase config is missing (for instant preview / offline dev)
  return {
    ok: true,
    source: 'simulated',
    user: {
      id: `google_sim_${Date.now()}`,
      name: 'Google Contributor (Demo)',
      phoneOrEmail: 'contributor.relief@gmail.com',
      email: 'contributor.relief@gmail.com',
      photoURL: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face',
      provider: 'google',
      badge: 'Verified Google Contributor',
      contributionsCount: 5,
      savedSpots: []
    }
  };
}

/**
 * Sign out of Firebase session
 */
export async function signOutFirebase() {
  if (auth) {
    try {
      await signOut(auth);
    } catch {
      // Ignore
    }
  }
}
