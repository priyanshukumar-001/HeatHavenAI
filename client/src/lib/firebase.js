import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';

/**
 * Firebase Client Configuration
 * Real Project: WanderAI (wanderai-1eb54)
 */
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'AIzaSyDiNMnvFX0gS_9ZdwP3jZ1FqGMJiIUzb0Q',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'wanderai-1eb54.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'wanderai-1eb54',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'wanderai-1eb54.firebasestorage.app',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '839625482209',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:839625482209:web:727143706983992c6a7ca0',
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || 'G-WH0H97BFB3'
};

export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey &&
  firebaseConfig.projectId &&
  firebaseConfig.projectId !== 'your-project-id'
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
 *
 * @returns {Promise<{ ok: boolean, user?: object, error?: string, errorCode?: string }>}
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
      if (err.code === 'auth/popup-closed-by-user') {
        return { ok: false, error: 'Sign-in window was closed by user.' };
      }
      return {
        ok: false,
        errorCode: err.code,
        error: err.message
      };
    }
  }

  return {
    ok: false,
    error: 'Firebase is not initialized.'
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
