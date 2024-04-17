import React, { useState } from "react";
import { StyleSheet, Text, View, TextInput, Image } from "react-native";
import Button from "../components/Button";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../services/Firebase";

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
    <View style={styles.container}>
      <Image
        style={styles.logo}
        source={require("../../assets/images/usedLogo.png")}
      />

      <Text style={styles.title} testID="title-text">
        Wild Knight
      </Text>

      <Text style={styles.label} testID="email-text">
        Give us your email
      </Text>
      <TextInput
        testID="email-input"
        style={styles.input}
        onChangeText={setEmail}
        value={email}
        placeholder="Please enter your email"
      />

      <Button title="Reset Password" onPress={handleForgotPassword} />

      <Text testID="error-message" style={styles.error}>
        {error}
      </Text>
      {success && (
        <Text testID="success-message" style={styles.error}>
          {successMessage}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    width: "80%",
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 10,
    padding: 10,
  },
  error: {
    color: "red",
    marginTop: 10,
  },
  label: {
    color: "black",
    fontSize: 16,
    textAlign: "center", // Center the text
    marginBottom: 10,
  },
});
