import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, Platform } from "react-native";
// ------------- FIREBASE IMPORTS ----------------
import {
  auth,
  GoogleAuthProvider,
  signInWithCredential,
  createUserWithEmailAndPassword,
} from "../services/Firebase";
// -----------------------------------------------
import * as Google from "expo-auth-session/providers/google";
import GoogleAuthConfig from "../types/GoogleAuthConfig";
import { TextField } from "../ui/TextField";
import { Button } from "../ui/Button";
import { OrSeparator } from "../components/OrSeparator";
import { MessageBox } from "../ui/MessageBox";

export default function SignUp({ navigation }: any) {
  const [user, setUser] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const [password, setPassword] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [strength, setStrength] = useState("");

  const [showPassword, setShowPassword] = useState(false);

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
          navigation.navigate("Map");
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, [response]);

  React.useEffect(() => {
    validatePassword(password);
  }, [password]);

  const validatePassword = (input: string) => {
    let newSuggestions = [];
    if (input.length < 8) {
      newSuggestions.push("Password should be at least 8 characters long");
    }
    if (!/\d/.test(input)) {
      newSuggestions.push("Add at least one number");
    }

    if (!/[A-Z]/.test(input) || !/[a-z]/.test(input)) {
      newSuggestions.push("Include both upper and lower case letters");
    }

    if (!/[^A-Za-z0-9]/.test(input)) {
      newSuggestions.push("Include at least one special character");
    }

    setSuggestions(newSuggestions);

    // Determine password strength based on suggestions
    if (newSuggestions.length === 0) {
      setStrength("Very Strong");
    } else if (newSuggestions.length <= 1) {
      setStrength("Strong");
    } else if (newSuggestions.length <= 2) {
      setStrength("Moderate");
    } else if (newSuggestions.length <= 3) {
      setStrength("Weak");
    } else {
      setStrength("Too Weak");
    }
  };

  // const writeUserData = async (response: UserCredential) => {
  //   set(ref(database, "users/" + response.user.uid), {
  //     username: user,
  //     email: email,
  //     orders: [], // This will create an empty list for orders
  //   });
  // };

  const signUpWithEmail = async () => {
    if (email && password) {
      createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          navigation.navigate("Map");
        })
        .catch((error) => {
          setError("Sign Up failed. Please check your credentials.");
        });
    } else {
      setError("Please input email and password.");
    }
  };

  const getStrengthColor = () => {
    switch (strength) {
      case "Too Weak":
        return "red";
      case "Weak":
        return "orange";
      case "Moderate":
        return "yellow";
      case "Strong":
        return "yellowgreen";
      case "Very Strong":
        return "green";
      default:
        return "#ccc";
    }
  };

  const getStrengthWidth = () => {
    switch (strength) {
      case "Very Strong":
        return "100%";
      case "Strong":
        return "75%";
      case "Moderate":
        return "50%";
      case "Weak":
        return "25%";
      default:
        return "0%";
    }
  };

  return (
    <View
      className="flex-1 bg-white items-center justify-center px-8"
      testID="sign-up-screen"
    >
      <Text
        className="text-4xl font-bold mb-16 text-center"
        testID="signup-title"
      >
        Sign Up
      </Text>

      <View className="flex flex-col gap-3">
        <TextField
          placeholder="Enter your username"
          value={user}
          onChangeText={setUser}
          type="text"
          testID="username-input"
        />

        <TextField
          placeholder="Enter your email"
          value={email}
          onChangeText={setEmail}
          type="email"
          testID="email-input"
        />

        <TextField
          placeholder="Enter your password"
          value={password}
          onChangeText={setPassword}
          type="password"
          testID="password-input"
        />
      </View>

      <View className="w-full my-8 flex flex-col items-center bg-gray-100 p-4 rounded-lg">
        <Text testID="pw-strength" className="text-lg text-center">
          Password Strength: {strength}
        </Text>
        <View style={styles.strengthMeter}>
          <View
            style={{
              width: getStrengthWidth(),
              height: 20,
              backgroundColor: getStrengthColor(),
            }}
          />
        </View>
        <View>
          {suggestions.map((suggestion, index) => (
            <Text key={index} style={styles.suggestionsText}>
              {suggestion}
            </Text>
          ))}
        </View>
      </View>

      <Button
        text="Sign Up"
        onPress={signUpWithEmail}
        style="primary"
        testID="sign-up-button"
      />

      <OrSeparator />

      <Button
        text="Continue with Google"
        imgSrc={require("../../assets/images/google-icon.png")}
        onPress={() => promptAsync()}
        style="secondary"
      />

      {/* <Text style={styles.error} testID="signup-error-message">
        {error}
      </Text> */}
      {error && (
        <MessageBox
          message={error}
          style="error"
          onClose={() => setError("")}
          testID="signup-error-message"
          className="mt-8"
        />
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
  button: {
    marginTop: 10,
    width: "80%",
    borderColor: "black",
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
  },
  input: {
    width: "80%",
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 10,
    padding: 10,
  },
  passwordText: {
    color: "black",
    fontSize: 16,
    textAlign: "left",
    marginTop: 10,
  },
  error: {
    color: "red",
    marginTop: 10,
  },
  text: {
    color: "black",
    fontSize: 16,
    textAlign: "center",
    marginTop: 10,
  },
  lineContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "80%",
    marginVertical: 20,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: "gray",
  },
  orText: {
    width: 30,
    textAlign: "center",
  },
  googleButtonText: {
    color: "black",
    fontSize: 16,
    textAlign: "center",
  },
  linkText: {
    color: "blue",
    fontSize: 16,
    textAlign: "center",
    marginTop: 10,
    textDecorationLine: "underline",
  },
  strengthText: {
    fontWeight: "bold",
    color: "black",
    fontSize: 18,
    marginBottom: 10,
    marginTop: 10,
  },
  suggestionsText: {
    color: "red",
  },
  strengthMeter: {
    width: "80%",
    height: 20,
    backgroundColor: "#ccc",
    marginTop: 10,
    marginBottom: 10,
    borderRadius: 10,
    overflow: "hidden",
  },
  icon: {
    position: "absolute",
    marginRight: 10,
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "80%",
  },
  eyeIcon: {
    position: "absolute",
    right: 10,
  },
});
