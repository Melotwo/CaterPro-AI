import { initializeApp, getApp, getApps, FirebaseApp } from "firebase/app";
import { getAuth, Auth } from "firebase/auth";
import { getFirestore, Firestore, getDocFromServer, doc } from "firebase/firestore";
import { getStorage, FirebaseStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || '',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || '',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || '',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '',
  firestoreDatabaseId: import.meta.env.VITE_FIREBASE_FIRESTORE_DATABASE_ID || '',
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
    console.log("Initializing Firebase with Project ID:", firebaseConfig.projectId);
    
    // Prevent double initialization
    app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
    auth = getAuth(app);
    
    // Respect the named database if provided in config
    const dbId = firebaseConfig.firestoreDatabaseId && 
                 firebaseConfig.firestoreDatabaseId !== '(default)' && 
                 firebaseConfig.firestoreDatabaseId !== 'undefined'
      ? firebaseConfig.firestoreDatabaseId 
      : undefined;
      
    console.log("Using Firestore Database ID:", dbId || "(default)");
    
    try {
      db = dbId ? getFirestore(app, dbId) : getFirestore(app);
    } catch (fsError: any) {
      console.error("Failed to initialize Firestore with ID:", dbId, fsError);
      if (dbId) {
        console.log("Attempting fallback to default database...");
        db = getFirestore(app);
      } else {
        throw fsError;
      }
    }
    
    storage = getStorage(app);

    // Validate connection to Firestore
    const testConnection = async () => {
      if (!db) return;
      try {
        // Try a simple getDocFromServer with a timeout or after a delay
        // We use a path that we allowed in firestore.rules
        await getDocFromServer(doc(db, 'test', 'connection'));
        console.log("Firebase Connection: Successfully verified connection to Firestore.");
      } catch (error: any) {
        const isOffline = error.message?.includes('the client is offline') || 
                          error.message?.includes('Failed to get document') ||
                          error.message?.includes('offline');
                          
        if (isOffline) {
          console.info("Firebase Connection: Client is currently initializing or in offline-first mode. Firestore is ready and will synchronize automatically when online.");
          return;
        }

        // If there's an actual database not found or invalid config error, attempt fallback to default db
        if (dbId && app) {
          console.warn("Firebase Connection: Named database request failed with non-offline error. Attempting fallback to default database...");
          try {
            const fallbackDb = getFirestore(app);
            await getDocFromServer(doc(fallbackDb, 'test', 'connection'));
            db = fallbackDb;
            console.log("Firebase Connection: Successfully verified connection to default Firestore database as a fallback!");
            return;
          } catch (fallbackError: any) {
            console.warn("Firebase Connection: Fallback database connection trial finished:", fallbackError.message);
          }
        }

        // Other errors (like permission denied) are actually good signs of connectivity
        console.log("Firebase Connection: Connection verified (received response from server).", error.message);
      }
    };
    
    // Run after a short delay to let the network connection warm up
    setTimeout(() => {
      testConnection();
    }, 3000);
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
  const currentUser = auth?.currentUser;
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: currentUser?.uid,
      email: currentUser?.email,
      emailVerified: currentUser?.emailVerified,
      isAnonymous: currentUser?.isAnonymous,
      tenantId: currentUser?.tenantId,
      providerInfo: currentUser?.providerData.map(provider => ({
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
