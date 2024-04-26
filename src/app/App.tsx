import React, { useEffect, useState } from "react";
import { Text } from "react-native";
import { User, onAuthStateChanged, auth } from "../services/Firebase";
import * as WebBrowser from "expo-web-browser";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Icon from "react-native-vector-icons/MaterialIcons";

import "./global.css";

import { registerRootComponent } from "expo";
import OrderHistory from "./OrderHistory";

WebBrowser.maybeCompleteAuthSession();

const Stack = createStackNavigator<RootStackParamList>();

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
      <Stack.Navigator
        initialRouteName={userInfo ? "Map" : "Login"}
        screenOptions={{
          headerShown: false,
          headerStyle: {
            backgroundColor: "#f9f9f9",
          },
          headerTintColor: "#000",
          headerTitleStyle: {
            fontWeight: "bold",
          },
        }}
      >
        <Stack.Screen name="Login" options={{ title: "Login to Wild Knight" }}>
          {(props) => <Login {...props} />}
        </Stack.Screen>
        <Stack.Screen
          name="SignUp"
          options={({ navigation }) => ({
            headerShown: true,
            headerTransparent: true,
            headerTitle: "",
            headerLeft: () => (
              <HeaderBackButton
                onPress={() => navigation.goBack()}
                labelVisible={false}
                testID="sign-up-back-button"
              />
            ),
          })}
        >
          {(props) => <SignUp {...props} />}
        </Stack.Screen>
        <Stack.Screen
          name="ForgotPassword"
          component={ForgotPassword}
          options={({ navigation }) => ({
            headerShown: true,
            headerTransparent: true,
            headerTitle: "",
            headerLeft: () => (
              <HeaderBackButton
                onPress={() => navigation.goBack()}
                labelVisible={false}
                testID="forgot-password-back-button"
              />
            ),
          })}
        />
        <Stack.Screen name="Map">
          {(props) => <MapOverview {...props} />}
        </Stack.Screen>
        <Stack.Screen
          name="OrderMenu"
          options={({ navigation }) => ({
            headerShown: true,
            headerTransparent: true,
            headerTitle: "",
            headerLeft: () => (
              <HeaderBackButton
                onPress={() => navigation.goBack()}
                backImage={() => (
                  <Icon name="arrow-back" size={24} color="black" />
                )}
                labelVisible={false}
                testID="back-button"
              />
            ),
          })}
        >
          {(props) => <OrderMenu {...props} />}
        </Stack.Screen>
        <Stack.Screen name="OrderPlaced">
          {(props) => <OrderPlaced {...props} />}
        </Stack.Screen>
        <Stack.Screen name="OrderHistory">
          {(props) => <OrderHistory {...props} />}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

registerRootComponent(App);

export default App;
