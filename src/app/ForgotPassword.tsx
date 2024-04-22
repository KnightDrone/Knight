import React, { useState } from "react";
import { Text, View } from "react-native";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../services/Firebase";
import { TextField } from "../ui/TextField";
import { Button } from "../ui/Button";
import { MessageBox } from "../ui/MessageBox";

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const handleForgotPassword = () => {
    sendPasswordResetEmail(auth, email)
      .then(() => {
        // Password reset email sent!
        // showing a toast is better (library: react-native-toast-message, react-native-notifier)
        setSuccess(true);
        setError("");
        setSuccessMessage("Password reset email sent!");
      })
      .catch((error) => {
        setError(error.message);
      });
  };

  return (
    <View
      className="flex flex-col p-8 bg-white items-center justify-center h-full"
      testID="forgot-password-screen"
    >
      <Text
        className="text-3xl font-bold mb-12 text-center"
        testID="title-text"
      >
        Reset Password
      </Text>

      <Text className="mb-12 text-xl text-center" testID="email-text">
        Give us your email and we'll
        {"\n"}
        send you a password reset link.
      </Text>
      <TextField
        placeholder="Enter your email"
        onChangeText={setEmail}
        value={email}
        type="email"
        testID="email-input"
      />

      <Button
        text="Reset Password"
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
    </View>
  );
}
