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
