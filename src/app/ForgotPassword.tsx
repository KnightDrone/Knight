import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Image,
  TouchableOpacity,
} from "react-native";
import Button from "../components/Button";
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../firebase';

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const handleForgotPassword = () => {
    sendPasswordResetEmail(auth, email)
      .then(() => {
        // Password reset email sent!
        alert("Password reset email sent!");
      })
      .catch((error) => {
        setError(error.message);
        alert("Please enter a valid email address");
      });

  };

  return (
    <View style={styles.container}>
      <Image
        style={styles.logo}
        source={require("../../assets/images/usedLogo.png")}
      />

      <Text style={styles.title}>Wild Knight</Text>

      <Text style={styles.label}>Give us your email</Text>
      <TextInput
        style={styles.input}
        onChangeText={setEmail}
        value={email}
        placeholder="Please enter your email"
      />

      <Button title="Reset Password" onPress={handleForgotPassword} />

      <Text style={styles.error}>{error}</Text>
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
