import React, { useState } from "react";
import { Text, ScrollView, View } from "react-native";
import { auth, sendPasswordResetEmail } from "../../services/Firebase";
import { TextField } from "../../ui/TextField";
import { Button } from "../../ui/Button";
import { MessageBox } from "../../ui/MessageBox";
import { useTranslation } from "react-i18next";
import { handleFirebaseError } from "../../utils/Auth";

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const { t } = useTranslation();

  const handleForgotPassword = () => {
    sendPasswordResetEmail(auth, email)
      .then(() => {
        // Password reset email sent!
        setSuccess(true);
        setError("");
        setSuccessMessage("Password reset email sent!");
      })
      .catch((error) => {
        handleFirebaseError(error, setError, t);
      });
  };

  return (
    <ScrollView
      className="flex-1 p-8 bg-white"
      contentContainerStyle={{
        // this is necessary for ScrollView, cannot be done through Nativewind
        alignItems: "center",
        justifyContent: "center",
        flexGrow: 1,
      }}
      testID="forgot-password-screen"
    >
      <Text className="text-3xl font-bold mb-6 text-center" testID="title-text">
        {t("reset-password.title")}
      </Text>

      <Text className="mb-6 text-xl text-center" testID="email-text">
        {t("reset-password.description")}
      </Text>
      <TextField
        placeholder={t("reset-password.email")}
        onChangeText={setEmail}
        value={email}
        type="email"
        testID="email-input"
        maxLength={50}
      />

      <Button
        text={t("reset-password.button")}
        onPress={handleForgotPassword}
        style="primary"
        testID="reset-password-button"
        className="mt-3"
      />

      {error && (
        <MessageBox
          message={error}
          style="error"
          className="mt-8"
          onClose={() => setError("")}
          testID="error-message"
        />
      )}
      {success && (
        <MessageBox
          message={successMessage}
          style="success"
          className="mt-8"
          onClose={() => setSuccess(false)}
          testID="success-message"
        />
      )}
    </ScrollView>
  );
}
