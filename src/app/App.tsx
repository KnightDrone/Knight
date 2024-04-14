import React from "react";
import { Text } from "react-native";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../services/firebase";
import * as WebBrowser from "expo-web-browser";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { User } from "firebase/auth";
import "./global.css";

// Imports for Navigation
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { HeaderBackButton } from "@react-navigation/elements";

import Login from "./Login";
import SignUp from "./SignUp";
import ForgotPassword from "./ForgotPassword";
import OrderMenu from "./OrderMenu";
import MapView from "./Map";

import { useFonts } from "expo-font";
import KaiseiRegular from "../../assets/fonts/KaiseiDecol-Regular.ttf";

import { registerRootComponent } from "expo";
import Icon from "react-native-vector-icons/MaterialIcons";
import OrderPlaced from "./OrderPlaced";

WebBrowser.maybeCompleteAuthSession();

// Types for navigation handling
// Should navigation be handled in a separate file??
type RootStackParamList = {
  Login: undefined;
  SignUp: undefined;
  ForgotPassword: undefined;
  OrderMenu: undefined;
  Map: undefined;
  OrderPlaced: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

function App() {
  const [fontsLoaded] = useFonts({
    "Kaisei-Regular": KaiseiRegular,
  });

  const [userInfo, setUserInfo] = React.useState<User | null>(null);
  const [loading, setLoading] = React.useState(false);

  const checkLocalUser = async () => {
    try {
      // NOTE: Doesn't work with testing library
      // setLoading(true);
      // const userJSON = await AsyncStorage.getItem("@user");
      // const userData = userJSON != null ? JSON.parse(userJSON) : null;
      // if (userData){
      //   setUserInfo(userData);
      // }
    } catch (e) {
      alert(e);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    checkLocalUser();
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUserInfo(user);
        try {
          await AsyncStorage.setItem("@user", JSON.stringify(user));
        } catch (e) {
          alert(e);
        }
      } else {
        setUserInfo(null);
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
              />
            ),
          })}
        />
        <Stack.Screen name="Map">
          {(props) => <MapView {...props} />}
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
              />
            ),
          })}
        >
          {(props) => <OrderMenu {...props} />}
        </Stack.Screen>
        <Stack.Screen name="OrderPlaced">
          {(props) => <OrderPlaced {...props} />}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

registerRootComponent(App);

export default App;
