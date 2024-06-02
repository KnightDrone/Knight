import React, { useState, useEffect } from "react";
import {
  Text,
  ScrollView,
  View,
  Image,
  TouchableOpacity,
  Platform,
  TouchableWithoutFeedback,
} from "react-native";
import { GoogleAuthProvider } from "../../services/Firebase";
import * as Google from "expo-auth-session/providers/google";
import { TextField } from "../../ui/TextField";
import { Button } from "../../ui/Button";
import { MessageBox } from "../../ui/MessageBox";
import { OrSeparator } from "../../components/OrSeparator";
import { useTranslation } from "react-i18next";
import { langIcons, locales, useLocale } from "../../lang/i18n";
import GoogleAuthConfig from "../../types/GoogleAuthConfig";
import { logInWithEmail, logInWithGoogle } from "../../utils/Auth";
import FirestoreManager from "../../services/FirestoreManager";

export default function Login({ navigation }: any) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const config = Platform.select({
    web: GoogleAuthConfig.web,
    ios: GoogleAuthConfig.ios,
    android: GoogleAuthConfig.android,
  });

  // Google login
  const [request, response, promptAsync] = Google.useAuthRequest(config);

  const firestoreManager = new FirestoreManager();

  useEffect(() => {
    if (response?.type === "success") {
      const { id_token } = response.params;
      const credential = GoogleAuthProvider.credential(id_token);
      logInWithGoogle(credential, navigation, firestoreManager, setError, t);
    }
  }, [response]);

  const [showPassword, setShowPassword] = useState(false);

  // Translation
  const { t } = useTranslation();
  // Locale
  const [locale, setLocale] = useLocale();

  return (
    <ScrollView
      className="flex-1 bg-white px-8 mt-10"
      contentContainerStyle={{
        // this is necessary for ScrollView, cannot be done through Nativewind
        alignItems: "center",
        justifyContent: "center",
      }}
      testID="login-screen"
    >
      <Image
        className="w-64 h-64"
        source={require("../../../assets/images/usedLogo.png")}
      />
      <Text className="text-4xl font-bold mb-8 text-center">
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
          testID="email-input"
          maxLength={50}
        />

        <TextField
          placeholder={t("login.password")}
          value={password}
          onChangeText={setPassword}
          type="password"
          testID="password-input"
          maxLength={50}
        />

        <Button
          text={t("login.login-button")}
          onPress={() =>
            logInWithEmail(
              email,
              password,
              firestoreManager,
              navigation,
              setError,
              t
            )
          }
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
        imgSrc={require("../../../assets/images/google-icon.png")}
        onPress={() => promptAsync()}
        style="secondary"
      />

      <Button
        text={t("content.see-offline-content")}
        imgSrc={require("../../../assets/icons/manual-book.png")}
        onPress={() => navigation.navigate("ContentIndex")}
        style="secondary"
        className="mt-3"
      />

      <View className="flex flex-row items-center justify-center gap-4 mt-12">
        {/* <Text>Choose your language</Text> */}

        {locales.map((lang) => (
          <TouchableWithoutFeedback key={lang} onPress={() => setLocale(lang)}>
            <Image
              key={lang}
              className={`w-6 h-6 transition-opacity ${locale != lang && "opacity-40"}`}
              source={langIcons[lang]}
            />
          </TouchableWithoutFeedback>
        ))}
      </View>
    </ScrollView>
  );
}
