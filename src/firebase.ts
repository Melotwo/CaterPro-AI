import { initializeApp, getApp, getApps, FirebaseApp } from "firebase/app";
import { getAuth, Auth } from "firebase/auth";
import { getFirestore, Firestore, getDocFromServer, doc } from "firebase/firestore";
import { getStorage, FirebaseStorage } from "firebase/storage";

// Load configuration
const jsonConfigs = import.meta.glob('../*.json', { eager: true });
const jsonConfig = (jsonConfigs['../firebase-applet-config.json'] as any)?.default || {};

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || jsonConfig.apiKey,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || jsonConfig.authDomain,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || jsonConfig.projectId,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || jsonConfig.storageBucket,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || jsonConfig.messagingSenderId,
  appId: import.meta.env.VITE_FIREBASE_APP_ID || jsonConfig.appId,
  firestoreDatabaseId: import.meta.env.VITE_FIREBASE_DATABASE_ID || jsonConfig.firestoreDatabaseId,
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
    // Prevent double initialization
    app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
    auth = getAuth(app);
    // Respect the named database if provided in config
    db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
    storage = getStorage(app);

    // Validate connection to Firestore
    const testConnection = async () => {
      if (!db) return;
      try {
        await getDocFromServer(doc(db, 'test', 'connection'));
      } catch (error) {
        if(error instanceof Error && error.message.includes('the client is offline')) {
          console.error("Firebase Connection Error: The client is offline. This usually indicates an invalid Project ID or Database ID in your configuration.");
          console.error("Current Config:", {
            projectId: firebaseConfig.projectId,
            databaseId: firebaseConfig.firestoreDatabaseId,
            hasApiKey: !!firebaseConfig.apiKey
          });
        }
      }
    };
    testConnection();
  } catch (error: any) {
    console.error("Firebase initialization failed:", error);
  }
} else {
  console.warn("Firebase is not configured. Authentication and database features will be disabled.");
}

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId: string | undefined;
    email: string | null | undefined;
    emailVerified: boolean | undefined;
    isAnonymous: boolean | undefined;
    tenantId: string | null | undefined;
    providerInfo: {
      providerId: string;
      displayName: string | null;
      email: string | null;
      photoUrl: string | null;
    }[];
  }
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth?.currentUser?.uid,
      email: auth?.currentUser?.email,
      emailVerified: auth?.currentUser?.emailVerified,
      isAnonymous: auth?.currentUser?.isAnonymous,
      tenantId: auth?.currentUser?.tenantId,
      providerInfo: auth?.currentUser?.providerData.map(provider => ({
        providerId: provider.providerId,
        displayName: provider.displayName,
        email: provider.email,
        photoUrl: provider.photoURL
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

export { auth, db, storage, isConfigured };
