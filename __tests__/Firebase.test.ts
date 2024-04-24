import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getDatabase } from "firebase/database";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { FirebaseConfig } from "../src/services/Firebase"; // Import the FirebaseConfig interface from your Firebase.ts file
import { Platform } from "react-native";

jest.mock("firebase/app");

describe("Firebase Initialization", () => {
  it("should initialize app with correct config", () => {
    const APP_ID =
      Platform.OS === "ios"
        ? process.env.FIREBASE_IOS_APP_ID
        : process.env.FIREBASE_ANDROID_APP_ID;

    const mockConfig: FirebaseConfig = {
      apiKey: process.env.FIREBASE_API_KEY,
      authDomain: process.env.FIREBASE_AUTH_DOMAIN,
      projectId: process.env.FIREBASE_PROJECT_ID,
      storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
      messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
      appId: APP_ID,
      measurementId: process.env.FIREBASE_MEASUREMENT_ID,
    };

    process.env = Object.assign(process.env, mockConfig);

    require("../src/services/Firebase"); // This will run your Firebase.ts file

    expect(initializeApp).toHaveBeenCalledWith(mockConfig);
  });

  it("should call getAuth, getAnalytics, getDatabase, and getFirestore", () => {
    require("../src/services/Firebase"); // This will run your Firebase.ts file

    expect(initializeApp).toHaveBeenCalled();
    expect(getAuth).toHaveBeenCalled();
    expect(getAnalytics).toHaveBeenCalled();
    expect(getDatabase).toHaveBeenCalled();
    expect(getFirestore).toHaveBeenCalled();
  });

  it("should initialize auth, analytics, database, and firestore", () => {
    require("../src/services/Firebase"); // This will run your Firebase.ts file

    expect(initializeApp()).toBeDefined();
    expect(getAuth()).toBeDefined();
    expect(getAnalytics()).toBeDefined();
    expect(getDatabase()).toBeDefined();
    expect(getFirestore()).toBeDefined();
    expect(getDatabase).toHaveBeenCalled();
    expect(getFirestore).toHaveBeenCalled();
  });
});
