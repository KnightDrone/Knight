// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { getDatabase } from "firebase/database";

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
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const analytics = getAnalytics(app);
const database = getDatabase(app);

export default app;
export { auth, GoogleAuthProvider, signInWithPopup, database };
