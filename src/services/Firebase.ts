// Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
// import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
// import { getDatabase } from "firebase/database";
// import firebase from '@react-native-firebase/app';
import firebase from "@react-native-firebase/app";
import auth from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

const APP_ID =
  Platform.OS === "ios"
    ? process.env.EXPO_PUBLIC_FIREBASE_IOS_APP_ID
    : process.env.EXPO_PUBLIC_FIREBASE_ANDROID_APP_ID;

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

// Initialize Firebase Authentication and get a reference to the service
// export const auth = getAuth(app);
export default app;
export { authInstance, firestoreInstance };
