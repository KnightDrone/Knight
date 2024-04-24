import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getDatabase } from "firebase/database";
import { getAuth } from "firebase/auth";
import { Platform } from "react-native";

jest.mock("firebase/app");

const mockConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_WEB_APP_ID,
};

describe("Firebase Initialization", () => {
  it("should initialize app with correct config", () => {
    process.env = Object.assign(process.env, mockConfig);

    require("../src/services/Firebase"); // This will run your Firebase.ts file

    expect(initializeApp).toHaveBeenCalledWith(mockConfig);
  });

  it("should call getAuth, getDatabase, and getFirestore", () => {
    require("../src/services/Firebase"); // This will run your Firebase.ts file

    expect(initializeApp).toHaveBeenCalled();
    expect(getAuth).toHaveBeenCalled();
    expect(getDatabase).toHaveBeenCalled();
    expect(getFirestore).toHaveBeenCalled();
  });

  it("should initialize auth, database, and firestore", () => {
    require("../src/services/Firebase"); // This will run your Firebase.ts file

    expect(initializeApp()).toBeDefined();
    expect(getAuth()).toBeDefined();
    expect(getDatabase()).toBeDefined();
    expect(getFirestore()).toBeDefined();
    expect(getDatabase).toHaveBeenCalled();
    expect(getFirestore).toHaveBeenCalled();
  });
});
