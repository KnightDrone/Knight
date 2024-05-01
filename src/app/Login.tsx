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
  auth,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithCredential,
  signInWithEmailAndPassword,
} from "../services/Firebase";
import * as Google from "expo-auth-session/providers/google";
import * as WebBrowser from "expo-web-browser";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Navigation imports
import GoogleAuthConfig from "../types/GoogleAuthConfig";
import { TextField } from "../ui/TextField";
import { Button } from "../ui/Button";
import { MessageBox } from "../ui/MessageBox";
import { OrSeparator } from "../components/OrSeparator";
import { useTranslation } from "react-i18next";
import { langIcons, locales, useLocale } from "../lang/i18n";
import { twMerge } from "tailwind-merge";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";

export default function Login({ navigation }: any) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const [request, response, promptAsync] = Google.useAuthRequest({
    iosClientId: process.env.IOS_CLIENT_ID_OAUTH,
    androidClientId: process.env.ANDROID_CLIENT_ID_OAUTH,
    webClientId: process.env.WEB_CLIENT_ID_OAUTH,
    redirectUri: process.env.REDIRECT_URI,
  });

  useEffect(() => {
    if (response?.type === "success") {
      const { id_token } = response.params;
      const credential = GoogleAuthProvider.credential(id_token);
      signInWithCredential(auth, credential)
        .then(() => {
          navigation.navigate("Map"); // Navigate after successful login
        })
        .catch((error: any) => {
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

  const { t } = useTranslation();

  const [locale, setLocale] = useLocale();

  return (
    <View
      className="flex-1 bg-white items-center justify-center px-8"
      testID="login-screen"
    >
      <Image
        className="w-64 h-64"
        source={require("../../assets/images/usedLogo.png")}
      />
      <Text className="text-4xl font-bold mb-16 text-center">
        {t("login.app-name")}
      </Text>

      {error && (
        <MessageBox
          message={error}
          style="error"
          onClose={() => setError("")}
        />
      )}

      <View className="flex flex-col gap-3 w-full">
        <TextField
          placeholder={t("login.username")}
          value={email}
          onChangeText={setEmail}
          type="email"
        />

        <TextField
          placeholder={t("login.password")}
          value={password}
          onChangeText={setPassword}
          type="password"
          testID="password-input"
        />

        <Button
          text={t("login.login-button")}
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
            {t("login.reset-password")}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity>
          <Text
            className="text-primary-500 text-center mt-2.5"
            onPress={() => navigation.navigate("SignUp")}
            testID="sign-up-link"
          >
            {t("login.create-account")}
          </Text>
        </TouchableOpacity>
      </View>

      <OrSeparator />

      <Button
        text={t("login.google-login")}
        imgSrc={require("../../assets/images/google-icon.png")}
        onPress={() => promptAsync()}
        style="secondary"
      />

      <View className="flex flex-row items-center justify-center gap-4 mt-12">
        {/* <Text>Choose your language</Text> */}

        {locales.map((lang) => (
          <TouchableWithoutFeedback key={lang} onPress={() => setLocale(lang)}>
            <Image
              key={lang}
              className={twMerge(
                "w-8 h-8 transition-opacity",
                locale != lang && "opacity-40"
              )}
              source={langIcons[lang]}
            />
          </TouchableWithoutFeedback>
        ))}
      </View>
    </View>
  );
}
