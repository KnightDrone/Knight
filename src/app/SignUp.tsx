import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Image,
  TouchableOpacity,
} from "react-native";
import Button from "../components/Button";
// ------------- FIREBASE IMPORTS ----------------
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithCredential,
} from "firebase/auth";

import { auth } from "../services/Firebase";
import { database } from "../services/Firebase";
import { UserCredential } from "firebase/auth";
import { ref, set } from "firebase/database";
// -----------------------------------------------
import * as Google from "expo-auth-session/providers/google";
import Icon from "react-native-vector-icons/FontAwesome";

export default function SignUp({ navigation }: any) {
  const [user, setUser] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const [password, setPassword] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [strength, setStrength] = useState("");

  const [showPassword, setShowPassword] = useState(false);

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
          console.log("Sign up successful")
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
          console.log(userCredential, "sign up with email successful.")
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
        return "green";
      case "Very Strong":
        return "limegreen";
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
    <View style={styles.container}>
      <Image
        style={styles.logo}
        source={require("../../assets/images/usedLogo.png")}
      />

      <Text style={styles.title}>Wild Knight</Text>

      <TextInput
        style={styles.input}
        testID="username-input"
        placeholder="Enter your username"
        value={user}
        onChangeText={setUser}
        autoCapitalize="none"
        autoCorrect={false}
      />

      <TextInput
        style={styles.input}
        testID="email-input"
        placeholder="Enter your email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        autoCorrect={false}
      />

      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.input}
          testID="password-input"
          placeholder="Enter your password"
          value={password}
          onChangeText={(text) => {
            setPassword(text);
          }}
          autoCapitalize="none"
          autoCorrect={false}
          passwordRules={
            "required: lower; required: upper; required: digit; required: special; minlength: 8;"
          }
          secureTextEntry={!showPassword}
        />
        <TouchableOpacity
          testID="password-toggle"
          style={styles.eyeIcon}
          onPress={() => {
            setShowPassword(!showPassword);
          }}
        >
          <Icon
            name={showPassword ? "eye" : "eye-slash"}
            size={20}
            color="#000"
            testID="eye-icon"
          />
        </TouchableOpacity>
      </View>

      <View>
        <Text testID="pw-strength" style={styles.strengthText}>
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

      <Button title="Sign Up" onPress={signUpWithEmail} />

      <View style={styles.lineContainer}>
        <View style={styles.line} />
        <Text style={styles.orText}>OR</Text>
        <View style={styles.line} />
      </View>

      <TouchableOpacity style={styles.button} onPress={() => promptAsync()}>
        <Text style={styles.googleButtonText}>Continue with Google</Text>
      </TouchableOpacity>

      <Text style={styles.error} testID="signup-error-message">
        {error}
      </Text>
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
