import React, { useState, useEffect } from "react";
import { Text, ScrollView, View, Platform } from "react-native";
// ------------- FIREBASE IMPORTS ----------------
import {
  auth,
  GoogleAuthProvider,
  signInWithCredential,
  createUserWithEmailAndPassword,
} from "../../services/Firebase";
// -----------------------------------------------
import * as Google from "expo-auth-session/providers/google";
import GoogleAuthConfig from "../../types/GoogleAuthConfig";
import { TextField } from "../../ui/TextField";
import { Button } from "../../ui/Button";
import { OrSeparator } from "../../components/OrSeparator";
import { MessageBox } from "../../ui/MessageBox";
import { useTranslation } from "react-i18next";
import FirestoreManager from "../../services/FirestoreManager";
import { logInWithGoogle, signUpWithEmail } from "../../utils/Auth";

const firestoreManager = new FirestoreManager();

export default function SignUp({ navigation }: any) {
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const [password, setPassword] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [strength, setStrength] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  // Choose the correct Google Auth config based on the platform
  const config = Platform.select({
    web: GoogleAuthConfig.web,
    ios: GoogleAuthConfig.ios,
    android: GoogleAuthConfig.android,
  });

  // Google login
  const [request, response, promptAsync] = Google.useAuthRequest(config);

  useEffect(() => {
    if (response?.type === "success") {
      const { id_token } = response.params;
      const credential = GoogleAuthProvider.credential(id_token);
      logInWithGoogle(credential, navigation, firestoreManager, setError, t);
    }
  }, [response]);

  React.useEffect(() => {
    validatePassword(password);
  }, [password]);

  const validatePassword = (input: string) => {
    let newSuggestions = [];
    if (input.length < 8) {
      newSuggestions.push(t("password-suggestions.length"));
    }
    if (!/\d/.test(input)) {
      newSuggestions.push(t("password-suggestions.number"));
    }

    if (!/[A-Z]/.test(input) || !/[a-z]/.test(input)) {
      newSuggestions.push(t("password-suggestions.upper-lower"));
    }

    if (!/[^A-Za-z0-9]/.test(input)) {
      newSuggestions.push(t("password-suggestions.special"));
    }

    setSuggestions(newSuggestions);

    // Determine password strength based on suggestions
    if (newSuggestions.length === 0) {
      setStrength(t("password-suggestions.very-strong"));
    } else if (newSuggestions.length <= 1) {
      setStrength(t("password-suggestions.strong"));
    } else if (newSuggestions.length <= 2) {
      setStrength(t("password-suggestions.moderate"));
    } else if (newSuggestions.length <= 3) {
      setStrength(t("password-suggestions.weak"));
    } else {
      setStrength(t("password-suggestions.too-weak"));
    }
  };

  const getStrengthColor = () => {
    switch (strength) {
      case t("password-suggestions.too-weak"):
        return "red";
      case t("password-suggestions.weak"):
        return "orange";
      case t("password-suggestions.moderate"):
        return "yellow";
      case t("password-suggestions.strong"):
        return "yellowgreen";
      case t("password-suggestions.very-strong"):
        return "green";
      default:
        return "#ccc";
    }
  };

  const getStrengthWidth = () => {
    switch (strength) {
      case t("password-suggestions.very-strong"):
        return "100%";
      case t("password-suggestions.strong"):
        return "75%";
      case t("password-suggestions.moderate"):
        return "50%";
      case t("password-suggestions.weak"):
        return "25%";
      default:
        return "0%";
    }
  };

  const { t } = useTranslation();

  return (
    <ScrollView
      className="flex-1 bg-white px-8 mt-10"
      contentContainerStyle={{
        // this is necessary for ScrollView, cannot be done through Nativewind
        alignItems: "center",
        justifyContent: "center",
      }}
      testID="sign-up-screen"
    >
      <Text
        className="text-4xl font-bold mb-8 text-center pt-5"
        testID="signup-title"
      >
        {t("signup.title")}
      </Text>

      <View className="flex flex-col gap-3">
        <TextField
          placeholder={t("signup.username")}
          value={userName}
          onChangeText={setUserName}
          type="text"
          testID="username-input"
          maxLength={40}
        />

        <TextField
          placeholder={t("signup.email")}
          value={email}
          onChangeText={setEmail}
          type="email"
          testID="email-input"
          maxLength={30}
        />

        <TextField
          placeholder={t("signup.password")}
          value={password}
          onChangeText={setPassword}
          type="password"
          testID="password-input"
          maxLength={50}
        />
      </View>

      <View className="w-full my-8 flex flex-col items-center bg-gray-100 p-4 rounded-lg">
        <Text testID="pw-strength" className="text-lg text-center">
          {strength}
        </Text>
        <View className="w-full h-4 bg-gray-300 rounded-lg m-2">
          <View
            className="h-full rounded-lg"
            style={{
              width: getStrengthWidth(),
              backgroundColor: getStrengthColor(),
            }}
          />
        </View>
        <View>
          {suggestions.map((suggestion, index) => (
            <Text key={index} className="text-red-500 m-1">
              {suggestion}
            </Text>
          ))}
        </View>
      </View>
      <Button
        text={t("signup.signup-button")}
        onPress={() =>
          signUpWithEmail(
            userName,
            email,
            password,
            firestoreManager,
            navigation,
            setError,
            t
          )
        }
        style="primary"
        testID="sign-up-button"
      />

      <OrSeparator />

      <Button
        text={t("signup.google-login")}
        imgSrc={require("../../../assets/images/google-icon.png")}
        onPress={() => promptAsync()}
        style="secondary"
      />

      <Button
        text={"Operator Sign up"}
        onPress={() => navigation.navigate("OperatorSignup")}
        style="primary"
        className="mt-4"
      />

      {error && (
        <MessageBox
          message={error}
          style="error"
          onClose={() => setError("")}
          testID="signup-error-message"
          className="mt-8"
        />
      )}
    </ScrollView>
  );
}
