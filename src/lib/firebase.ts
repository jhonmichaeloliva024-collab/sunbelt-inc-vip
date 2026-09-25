import { initializeApp, getApps, getApp } from 'firebase/app';
import { initializeFirestore } from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

// Initialize Firebase App
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// Initialize Cloud Firestore using the database specified in firebase-applet-config.json
export const db = initializeFirestore(app, {}, firebaseConfig.firestoreDatabaseId || '(default)');

export default app;
