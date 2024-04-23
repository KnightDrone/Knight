// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithCredential,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { getDatabase } from "firebase/database";

// https://firebase.google.com/docs/web/setup#available-libraries

interface FirebaseConfig {
  apiKey: any;
  authDomain: any;
  projectId: any;
  storageBucket: any;
  messagingSenderId: any;
  appId: any;
  measurementId: any;
}

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig: FirebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_ANDROID_APP_ID,
  measurementId: process.env.EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID,
};
// Initialize Firebase

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const analytics = getAnalytics(app);
const database = getDatabase(app);

// Initialize Firebase Authentication and get a reference to the service
// export const auth = getAuth(app);
export default app;
export {
  auth,
  GoogleAuthProvider,
  signInWithPopup,
  database,
  analytics,
  signInWithCredential,
  signInWithEmailAndPassword,
};
