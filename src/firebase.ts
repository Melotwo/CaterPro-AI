import { initializeApp, FirebaseApp } from "firebase/app";
import { getAuth, Auth } from "firebase/auth";
import { getFirestore, Firestore } from "firebase/firestore";
import { getStorage, FirebaseStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Robust check for valid configuration
const isConfigured = !!firebaseConfig.apiKey && 
                     firebaseConfig.apiKey !== 'undefined' && 
                     firebaseConfig.apiKey !== '' &&
                     !firebaseConfig.apiKey.includes('REPLACE_ME');

let app: FirebaseApp | undefined;
let auth: Auth | undefined;
let db: Firestore | undefined;
let storage: FirebaseStorage | undefined;

if (isConfigured) {
  try {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
    storage = getStorage(app);
  } catch (error: any) {
    console.error("Firebase initialization failed:", error);
    // Fallback to unconfigured state
    auth = undefined;
    db = undefined;
    storage = undefined;
  }
} else {
  console.warn("Firebase is not configured. Authentication and database features will be disabled.");
}

export { auth, db, storage, isConfigured };
