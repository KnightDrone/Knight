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

WebBrowser.maybeCompleteAuthSession();

initI18n();

function App() {
  const [userInfo, setUserInfo] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState<"Login" | "UserDrawer">("Login");

  const stripePublishableKey = process.env.STRIPE_PUBLISHABLE_KEY || "";

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUserInfo(user);
        setIsLoggedIn("UserDrawer"); // Set to "Map" if user is logged in
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
