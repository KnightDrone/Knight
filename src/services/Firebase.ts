// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithCredential,
  signInWithEmailAndPassword,
  User,
  onAuthStateChanged,
  sendPasswordResetEmail,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { getDatabase } from "firebase/database";
import { Platform } from "react-native";

console.log("Firebase.ts: ", process.env.FIREBASE_API_KEY);
import firebase from "@react-native-firebase/app";
import auth from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";

// https://firebase.google.com/docs/web/setup#available-libraries

const APP_ID =
  Platform.OS === "ios"
    ? process.env.FIREBASE_IOS_APP_ID
    : process.env.FIREBASE_ANDROID_APP_ID;

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
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_WEB_APP_ID,
  measurementId: process.env.FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase
var app;

(async () => {
  if (firebase.apps.length === 0) {
    app = await firebase.initializeApp(firebaseConfig);
  } else {
    app = firebase.app();
  }
})();

const authInstance = auth(app);
const firestoreInstance = firestore(app);

export default app;
export {
  auth,
  GoogleAuthProvider,
  signInWithPopup,
  database,
  analytics,
  signInWithCredential,
  signInWithEmailAndPassword,
  User,
  onAuthStateChanged,
  sendPasswordResetEmail,
  createUserWithEmailAndPassword,
};
export { authInstance, firestoreInstance };
