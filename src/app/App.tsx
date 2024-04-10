import * as React from "react";
import { Text } from "react-native";
import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithCredential,
} from "firebase/auth";
import { auth } from "../firebase";
import * as Google from "expo-auth-session/providers/google";
import * as WebBrowser from "expo-web-browser";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { User } from "firebase/auth";

// Imports for Navigation
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import Login from "./Login";
import SignUp from "./SignUp";
import ForgotPassword from "./ForgotPassword";

WebBrowser.maybeCompleteAuthSession();

const Stack = createStackNavigator<RootStackParamList>();

// Types for navigation handling
// Should navigation be handled in a separate file??
type RootStackParamList = {
  Login: undefined;
  SignUp: undefined;
  ForgotPassword: undefined;
};

export default function App() {
  const [request, response, promptAsync] = Google.useAuthRequest({
    iosClientId:
      "983400403511-gi5mo0akb89fcecaivk4q509c63hrvtl.apps.googleusercontent.com",
    androidClientId:
      "983400403511-i43set67i4o1e3kb7fl91vrh9r6aemcb.apps.googleusercontent.com",
  });

  const [userInfo, setUserInfo] = React.useState<User | null>(null);
  const [loading, setLoading] = React.useState(false);

  const checkLocalUser = async () => {
    try {
      setLoading(true);
      const userJSON = await AsyncStorage.getItem("@user");
      const userData = userJSON != null ? JSON.parse(userJSON) : null;
      console.log("local storage:", userData);
      setUserInfo(userData);
    } catch (e) {
      alert(e);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    if (response?.type === "success") {
      const { id_token } = response.params;
      const credential = GoogleAuthProvider.credential(id_token);
      signInWithCredential(auth, credential);
    }
  }, [response]);

  React.useEffect(() => {
    checkLocalUser();
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (user) {
        console.log(JSON.stringify(user, null, 2));
        setUserInfo(user);
        try {
          await AsyncStorage.setItem("@user", JSON.stringify(user));
        } catch (e) {
          alert(e);
        }
      } else {
      }
    });

    return () => unsub(); // for performance
  }, []);
  if (loading) {
    return <Text>Loading...</Text>;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" options={{ title: "Login to Wild Knight" }}>
          {(props) => <Login {...props} promptAsync={promptAsync} />}
        </Stack.Screen>
        <Stack.Screen name="SignUp">
          {(props) => <SignUp {...props} promptAsync={promptAsync} />}
        </Stack.Screen>
        <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
