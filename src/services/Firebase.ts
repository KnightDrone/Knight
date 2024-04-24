// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {
  GoogleAuthProvider,
  signInWithCredential,
  signInWithEmailAndPassword,
  User,
  onAuthStateChanged,
  sendPasswordResetEmail,
  createUserWithEmailAndPassword,
  getReactNativePersistence,
  initializeAuth,
} from "firebase/auth";

import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";

import { getDatabase } from "firebase/database";
import { Platform } from "react-native";
import {
  getFirestore,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  where,
  Firestore,
  initializeFirestore,
} from "firebase/firestore";

// https://firebase.google.com/docs/web/setup#available-libraries

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCDjeBhSsVZsZnO4gQ2xU9rlRdaJt6K1ZI",
  authDomain: "swent-g25.firebaseapp.com",
  projectId: "swent-g25",
  storageBucket: "swent-g25.appspot.com",
  messagingSenderId: "983400403511",
  appId: "1:983400403511:web:04caa117a0e3e7424ae5b2",
  measurementId: "G-N04Q2KKH95",
};
// Initialize Firebase

const app = initializeApp({
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: APP_ID,
  measurementId: process.env.FIREBASE_MEASUREMENT_ID,
});

const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});

const database = getDatabase(app);

// Initialize Firebase Authentication and get a reference to the service
// export const auth = getAuth(app);
export default app;
export {
  auth,
  GoogleAuthProvider,
  database,
  signInWithCredential,
  signInWithEmailAndPassword,
};
