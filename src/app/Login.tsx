import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Image,
  TouchableOpacity,
  Platform,
  TouchableHighlight,
  TouchableWithoutFeedback,
} from "react-native";
import {
  GoogleAuthProvider,
  signInWithCredential,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "../services/Firebase";
import * as Google from "expo-auth-session/providers/google";

// Navigation imports
import GoogleAuthConfig from "../types/GoogleAuthConfig";

export default function Login({ navigation }: any) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const config = Platform.select({
    ios: GoogleAuthConfig.ios,
    android: GoogleAuthConfig.android,
    default: GoogleAuthConfig.web,
  });

  const [request, response, promptAsync] = Google.useAuthRequest(config);

  useEffect(() => {
    if (response?.type === "success") {
      const { id_token } = response.params;
      const credential = GoogleAuthProvider.credential(id_token);
      signInWithCredential(auth, credential)
        .then(() => {
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
        <Text className="text-red-700 font-bold bg-red-100 w-full text-center p-4 rounded mb-8">
          {error}
        </Text>
      )}

      <TextInput
        className="w-full h-12 border border-gray-400 mb-2.5 px-4 rounded-full bg-gray-50"
        placeholder="Enter your username or email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        autoCorrect={false}
      />

      <View className="flex-row items-center w-full h-12 px-4 border border-gray-400 rounded-full mb-2.5 bg-gray-50">
        <TextInput
          className="h-12 w-full"
          placeholder="Enter your password"
          value={password}
          secureTextEntry={!showPassword}
          onChangeText={setPassword}
          autoCapitalize="none"
          autoCorrect={false}
        />
        <TouchableOpacity
          testID="password-toggle"
          className="absolute right-2.5"
          onPress={() => setShowPassword(!showPassword)}
        >
          <Image
            source={
              showPassword
                ? require("../../assets/images/eye-hide.png")
                : require("../../assets/images/eye-show.png")
            }
            className="w-5 h-5"
          />
        </TouchableOpacity>
      </View>

      <TouchableHighlight
        className="rounded-full overflow-hidden bg-primary-400 w-full h-12  flex items-center justify-center"
        onPress={logInWithEmail}
        testID="login-button"
      >
        <Text className="text-white font-bold">Log in</Text>
      </TouchableHighlight>

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

      <View className="flex-row items-center w-full my-8">
        <View className="flex-1 h-[2px] rounded bg-gray-200" />
        <Text className="mx-4 text-gray-400 font-bold">OR</Text>
        <View className="flex-1 h-[2px] rounded bg-gray-200" />
      </View>

      <TouchableOpacity
        className="w-full bg-gray-200 rounded-full"
        onPress={() => promptAsync()}
      >
        <View className="flex-row items-center justify-center h-12">
          <Image
            source={require("../../assets/images/google-icon.png")} // Replace with the path to your Google icon
            className="w-7 h-7 mr-2.5"
          />
          <Text className="text-black text-lg text-center">
            Continue with Google
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}
