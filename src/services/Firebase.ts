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
  getAuth,
} from "firebase/auth";
import { getStorage } from "firebase/storage";

import AsyncStorage from "@react-native-async-storage/async-storage";
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
} from "firebase/firestore";

// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_WEB_APP_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});
const storage = getStorage(app);

export {
  app,
  auth,
  GoogleAuthProvider,
  signInWithCredential,
  signInWithEmailAndPassword,
  User,
  onAuthStateChanged,
  sendPasswordResetEmail,
  createUserWithEmailAndPassword,
  firestore,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  where,
  Firestore,
  storage,
};
