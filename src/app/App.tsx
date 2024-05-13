import React, { useEffect, useState } from "react";
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
  const [loading, setLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState<"Login" | "UserDrawer">("Login");
  const checkLocalUser = async () => {
    try {
      const user = await AsyncStorage.getItem("@user");
      if (user) {
        setUserInfo(JSON.parse(user));
        setIsLoggedIn("UserDrawer");
      } else {
        setIsLoggedIn("Login");
      }
    } catch (e) {
      alert(e);
    } finally {
      //setLoading(false);
    }
  };

  useEffect(() => {
    checkLocalUser();
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUserInfo(user);
        setIsLoggedIn("UserDrawer");
        try {
          await AsyncStorage.setItem("@user", JSON.stringify(user));
        } catch (e) {
          alert(e);
        }
      } else {
        setUserInfo(null);
        setIsLoggedIn("Login");
        try {
          await AsyncStorage.removeItem("@user");
        } catch (e) {
          alert(e);
        }
      }
    });

    return unsub;
  }, []);

  const stripePublishableKey = process.env.STRIPE_PUBLISHABLE_KEY || "";

  return (
    <StripeProvider publishableKey={stripePublishableKey}>
      <AppStack isLoggedIn={isLoggedIn} user={userInfo} />
    </StripeProvider>
  );
}

registerRootComponent(App);

export default App;
