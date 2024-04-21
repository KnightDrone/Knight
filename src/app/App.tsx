import React from "react";
import { Text } from "react-native";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "../services/Firebase";
import * as WebBrowser from "expo-web-browser";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Imports for Navigation
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { HeaderBackButton } from "@react-navigation/elements";

import Login from "./Login";
import SignUp from "./SignUp";
import ForgotPassword from "./ForgotPassword";
import OrderMenu from "./OrderMenu";
import MapOverview from "./Map";
import OrderPlaced from "./OrderPlaced";
import DrawerNavigator from "./DrawerNavigation";
import "./global.css";

import { useFonts } from "expo-font";
import KaiseiRegular from "../../assets/fonts/KaiseiDecol-Regular.ttf";

import { registerRootComponent } from "expo";

import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
  DrawerContentComponentProps,
} from "@react-navigation/drawer";

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
      {userInfo ? (
        <DrawerNavigator />
      ) : (
        <Stack.Navigator
          initialRouteName="Login"
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
          <Stack.Screen
            name="Login"
            options={{ title: "Login to Wild Knight" }}
          >
            {(props) => <Login {...props} />}
          </Stack.Screen>
          <Stack.Screen name="Map">
            {(props) => <MapOverview {...props} />}
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
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
}

registerRootComponent(App);

export default App;
