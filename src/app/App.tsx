import React, { useEffect, useState } from "react";
import { Text } from "react-native";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../services/Firebase";
import * as WebBrowser from "expo-web-browser";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Imports for Navigation
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { AuthStack, UserStack } from "../navigation/StackNavigation";
import "./global.css";

import { registerRootComponent } from "expo";
import OrderHistory from "./OrderHistory";

WebBrowser.maybeCompleteAuthSession();

// Types for navigation handling
// Should navigation be handled in a separate file??
// type RootStackParamList = {
//   Login: undefined;
//   SignUp: undefined;
//   ForgotPassword: undefined;
//   OrderMenu: undefined;
//   Map: undefined;
//   OrderPlaced: undefined;
// };

// const Stack = createStackNavigator<RootStackParamList>();
function App() {
  const [fontsLoaded] = useFonts({
    "Kaisei-Regular": KaiseiRegular,
  });

  const [userInfo, setUserInfo] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);

  const checkLocalUser = async () => {
    try {
      // NOTE: Doesn't work with testing library
      // setLoading(true);
      // const userJSON = await AsyncStorage.getItem("@user");
      // const userData = userJSON != null ? JSON.parse(userJSON) : null;
      // if (userData) {
      //   setUserInfo(userData);
      // }
    } catch (e) {
      alert(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkLocalUser();
    const unsub = onAuthStateChanged(auth, async (user) => {
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

    return unsub;
  }, []);

  if (loading) {
    return <Text>Loading...</Text>;
  }
  return <OrderHistory userId={0} opOrders={false} />;
  return (
    <NavigationContainer>
      {userInfo ? <UserStack /> : <AuthStack />}
    </NavigationContainer>
  );
}

registerRootComponent(FirestoreTest);

export default App;
