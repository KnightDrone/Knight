import React, { useEffect, useState } from "react";
import { View, ActivityIndicator } from "react-native";
import { User, onAuthStateChanged, auth } from "../services/Firebase";
import * as WebBrowser from "expo-web-browser";
import AsyncStorage from "@react-native-async-storage/async-storage";

import "./global.css";

import { registerRootComponent } from "expo";
import { initI18n } from "../lang/i18n";
import { AppStack } from "./AppStack";
import { StripeProvider } from "@stripe/stripe-react-native";
import FirestoreManager from "../services/FirestoreManager";
import registerNNPushToken from "native-notify";

WebBrowser.maybeCompleteAuthSession();

initI18n();

function App() {
  const [userInfo, setUserInfo] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState<
    "Login" | "UserDrawer" | "OperatorDrawer"
  >("Login");

  const NN_APP_ID = process.env.NN_APP_ID || "";
  const NN_APP_TOKEN = process.env.NN_APP_TOKEN || "";
  registerNNPushToken(NN_APP_ID, NN_APP_TOKEN);

  const saveUserRole = async (role: string) => {
    try {
      await AsyncStorage.setItem("@user_role", role);
    } catch (e) {
      console.error("Failed to save user role to storage", e);
    }
  };

  const getUserRole = async (): Promise<string | undefined> => {
    try {
      const role = await AsyncStorage.getItem("@user_role");
      return role !== null ? role : undefined;
    } catch (e) {
      console.error("Failed to fetch user role from storage", e);
      return undefined;
    }
  };

  const fetchUserWithTimeout = async (userId: string, timeout: number) => {
    return Promise.race([
      firestoreManager.getUser(userId),
      new Promise<null>((_, reject) =>
        setTimeout(() => reject(new Error("Timeout")), timeout)
      ),
    ]);
  };

  const stripePublishableKey = process.env.STRIPE_PUBLISHABLE_KEY || "";
  const firestoreManager = new FirestoreManager();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUserInfo(user);
        let userData;
        try {
          userData = await fetchUserWithTimeout(user.uid, 5000); // 5 seconds timeout
        } catch (error) {
          console.error(
            "Failed to fetch user data or request timed out",
            error
          );
        }
        let role = userData?.role;
        if (!role) {
          // in the case that we timed out or failed to fetch user
          // note that if we're here, there has been a previous login
          role = await getUserRole();
        } else {
          await saveUserRole(role);
        }
        if (role === "operator") {
          setIsLoggedIn("OperatorDrawer");
        } else {
          setIsLoggedIn("UserDrawer");
        }
      } else {
        setUserInfo(null);
        setIsLoggedIn("Login");
      }
      setLoading(false); // Set loading to false after authentication state is determined
    });

    // Clean up subscription on unmount
    return () => unsubscribe();
  }, []);

  if (loading) {
    return <LoadingIndicator />;
  }
  return (
    <StripeProvider publishableKey={stripePublishableKey}>
      <AppStack isLoggedIn={isLoggedIn} user={userInfo} />
    </StripeProvider>
  );
}

function LoadingIndicator() {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <ActivityIndicator size="large" />
    </View>
  );
}

registerRootComponent(App);

export default App;
