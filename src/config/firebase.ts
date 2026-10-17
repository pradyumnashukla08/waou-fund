import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getAuth, 
  browserLocalPersistence, 
  setPersistence,
  GoogleAuthProvider,
} from 'firebase/auth';
import { getStorage } from 'firebase/storage';
import { CLOUD_CONFIG } from './cloud';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || CLOUD_CONFIG.FIREBASE.API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || CLOUD_CONFIG.FIREBASE.AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || CLOUD_CONFIG.FIREBASE.PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || CLOUD_CONFIG.FIREBASE.STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '204151638622',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || CLOUD_CONFIG.FIREBASE.APP_ID,
};

export const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const storage = getStorage(app);
export const googleProvider = new GoogleAuthProvider();

// Enforce local session persistence
setPersistence(auth, browserLocalPersistence).catch((err) => {
  console.warn('[Firebase Auth] Persistence set error:', err);
});
