import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Image,
  TouchableOpacity,
  Platform,
} from "react-native";
import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithCredential,
} from "firebase/auth";
import { auth } from "../services/Firebase";
import * as Google from "expo-auth-session/providers/google";
import * as WebBrowser from "expo-web-browser";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { signInWithEmailAndPassword } from "firebase/auth";

// Navigation imports
import GoogleAuthConfig from "../types/GoogleAuthConfig";
import { TextField } from "../ui/TextField";
import { Button } from "../ui/Button";
import { MessageBox } from "../ui/MessageBox";
import { OrSeparator } from "../components/OrSeparator";

export default function Login({ navigation }: any) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const [request, response, promptAsync] = Google.useAuthRequest({
    iosClientId: process.env.EXPO_PUBLIC_IOS_CLIENT_ID_OAUTH,
    androidClientId: process.env.EXPO_PUBLIC_ANDROID_CLIENT_ID_OAUTH,
    webClientId: process.env.EXPO_PUBLIC_WEB_CLIENT_ID_OAUTH,
    redirectUri: process.env.EXPO_PUBLIC_REDIRECT_URI,
  });

  useEffect(() => {
    if (response?.type === "success") {
      const { id_token } = response.params;
      const credential = GoogleAuthProvider.credential(id_token);
      signInWithCredential(auth, credential)
        .then(() => {
          console.log("Signed in successfully");
          navigation.navigate("Map"); // Navigate after successful login
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, [response]);

  const logInWithEmail = async () => {
    if (email && password) {
      try {
        const response = await signInWithEmailAndPassword(
          auth,
          email,
          password
        );
        if (response.user) {
          console.log(response.user.email, " signed in successfully");
          navigation.navigate("Map");
        } else {
          setError("Invalid credentials");
        }
      } catch (e) {
        setError("Login failed. Please check your credentials.");
      }
    }
  };

  const [showPassword, setShowPassword] = useState(false);

  return (
    <View
      className="flex-1 bg-white items-center justify-center px-8"
      testID="login-screen"
    >
      <Image
        className="w-64 h-64"
        source={require("../../assets/images/usedLogo.png")}
      />
      <Text className="text-4xl font-bold mb-16 text-center">Wild Knight</Text>

      {error && (
        <MessageBox
          message={error}
          style="error"
          onClose={() => setError("")}
        />
      )}

      <View className="flex flex-col gap-3 w-full">
        <TextField
          placeholder="Enter your username or email"
          value={email}
          onChangeText={setEmail}
          type="email"
        />

        <TextField
          placeholder="Enter your password"
          value={password}
          onChangeText={setPassword}
          type="password"
        />

        <Button
          text="Log in"
          onPress={logInWithEmail}
          style="primary"
          testID="login-button"
        />
      </View>

      <View className="flex-row items-center justify-center gap-8 w-full px-6">
        <TouchableOpacity>
          <Text
            testID="forgot-password-link"
            className="text-primary-500 text-center mt-2.5"
            onPress={() => navigation.navigate("ForgotPassword")}
          >
            Reset password
          </Text>
        </TouchableOpacity>

        <TouchableOpacity>
          <Text
            className="text-primary-500 text-center mt-2.5"
            onPress={() => navigation.navigate("SignUp")}
            testID="sign-up-link"
          >
            Create account
          </Text>
        </TouchableOpacity>
      </View>

      <OrSeparator />

      <Button
        text="Continue with Google"
        imgSrc={require("../../assets/images/google-icon.png")}
        onPress={() => promptAsync()}
        style="secondary"
      />
    </View>
  );
}
