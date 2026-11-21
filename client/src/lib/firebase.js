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

// Customize Google Provider prompt so user can pick their Chrome Gmail account
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

/**
 * Sign in using Firebase Google Auth with popup
 * No fake fallbacks: uses REAL Chrome Google account.
 *
 * @returns {Promise<{ ok: boolean, user?: object, error?: string, errorCode?: string }>}
 */
export async function signInWithGoogleFirebase() {
  if (!isFirebaseConfigured || !auth) {
    return {
      ok: false,
      error: 'Firebase is not initialized. Please verify your Firebase project keys.'
    };
  }

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
    console.error('Firebase Auth Exception:', err);

    let friendlyMessage = err.message || 'Google Sign-In failed';
    if (err.code === 'auth/popup-closed-by-user') {
      friendlyMessage = 'Google Sign-In window was closed before finishing.';
    } else if (err.code === 'auth/popup-blocked') {
      friendlyMessage = 'Google popup was blocked by your browser. Please allow popups for this site.';
    } else if (err.code === 'auth/operation-not-allowed') {
      friendlyMessage = 'Google Sign-In is disabled in your Firebase Console. Go to Firebase Console > Authentication > Sign-in method, click Google, and click Enable & Save.';
    } else if (err.code === 'auth/unauthorized-domain') {
      const currentHost = typeof window !== 'undefined' ? window.location.hostname : 'your domain';
      friendlyMessage = `Domain "${currentHost}" is not authorized. Please add "${currentHost}" to Firebase Console > Authentication > Settings > Authorized domains.`;
    }

    return {
      ok: false,
      errorCode: err.code,
      error: friendlyMessage
    };
  }
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
