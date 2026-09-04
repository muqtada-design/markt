import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyDvtO7T9Pdipx22rjCp1XSeHB8cD0mwz0c",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "markali-ec8d5.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "markali-ec8d5",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "markali-ec8d5.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "41277156729",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:41277156729:web:277a42d5d0ac0029e9d3a8",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-6YE4K1CG3B",
};

// التحقق من اكتمال الإعدادات
export const isFirebaseConfigured = (): boolean => {
  return Boolean(
    firebaseConfig.apiKey &&
    firebaseConfig.apiKey !== 'YOUR_FIREBASE_API_KEY' &&
    firebaseConfig.projectId &&
    firebaseConfig.projectId !== 'YOUR_PROJECT_ID'
  );
};

// تهيئة تطبيق Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
