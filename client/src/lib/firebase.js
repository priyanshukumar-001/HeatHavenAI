import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';

/**
 * Hardcoded verified WanderAI Firebase Configuration
 * Guarantees zero missing env variable issues on both Localhost and Render.
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

export const isFirebaseConfigured = true;

let firebaseApp = null;
let firebaseAuth = null;
let googleAuthProvider = null;

/**
 * Get or initialize Firebase Auth instance safely
 */
export function getFirebaseAuth() {
  if (firebaseAuth) {
    return { auth: firebaseAuth, provider: googleAuthProvider };
  }

  try {
    if (getApps().length === 0) {
      firebaseApp = initializeApp(firebaseConfig);
    } else {
      firebaseApp = getApp();
    }

    firebaseAuth = getAuth(firebaseApp);
    googleAuthProvider = new GoogleAuthProvider();
    googleAuthProvider.setCustomParameters({
      prompt: 'select_account'
    });

    return { auth: firebaseAuth, provider: googleAuthProvider };
  } catch (err) {
    console.error('Firebase Initialization Error:', err);
    return { error: err.message };
  }
}

// Initial eager attempt
const initial = getFirebaseAuth();
export const app = firebaseApp;
export const auth = initial.auth || null;
export const googleProvider = initial.provider || null;

/**
 * Sign in using Firebase Google Auth with popup
 * Uses user's real Chrome Google account.
 *
 * @returns {Promise<{ ok: boolean, user?: object, error?: string, errorCode?: string }>}
 */
export async function signInWithGoogleFirebase() {
  const instance = getFirebaseAuth();
  if (instance.error || !instance.auth) {
    return {
      ok: false,
      error: `Firebase Init Error: ${instance.error || 'Auth instance not available'}`
    };
  }

  try {
    const result = await signInWithPopup(instance.auth, instance.provider);
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
    console.error('Firebase Auth Popup Exception:', err);

    let friendlyMessage = err.message || 'Google Sign-In failed';
    if (err.code === 'auth/popup-closed-by-user') {
      friendlyMessage = 'Google Sign-In window was closed before finishing.';
    } else if (err.code === 'auth/popup-blocked') {
      friendlyMessage = 'Google popup was blocked by your browser. Please allow popups in your Chrome address bar.';
    } else if (err.code === 'auth/operation-not-allowed') {
      friendlyMessage = 'Google provider is not enabled in Firebase. Go to Firebase Console > Authentication > Sign-in method > Google > Enable & Save.';
    } else if (err.code === 'auth/unauthorized-domain') {
      const currentHost = typeof window !== 'undefined' ? window.location.hostname : 'domain';
      friendlyMessage = `Domain "${currentHost}" is not authorized. Go to Firebase Console > Authentication > Settings > Authorized domains and add "${currentHost}".`;
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
  const instance = getFirebaseAuth();
  if (instance.auth) {
    try {
      await signOut(instance.auth);
    } catch {
      // Ignore
    }
  }
}
