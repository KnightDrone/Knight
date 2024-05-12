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
  const [isLoggedIn, setIsLoggedIn] = useState<"Login" | "Map">("Login");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const userJSON = await AsyncStorage.getItem("@user");
        const userData = userJSON != null ? JSON.parse(userJSON) : null;
        if (userData) {
          setUserInfo(userData);
          setIsLoggedIn("Map");
        } else {
          const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
              setUserInfo(user);
              setIsLoggedIn("Map");
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
          return unsubscribe;
        }
      } catch (error) {
        console.error("Error fetching local user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
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
