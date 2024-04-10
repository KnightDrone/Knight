import React, { SetStateAction, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Image,
  TouchableOpacity,
} from "react-native";
import Button from "../components/Button";
import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithCredential,
} from "firebase/auth";
import { auth } from "../firebase";
import * as Google from "expo-auth-session/providers/google";
import * as WebBrowser from "expo-web-browser";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { signInWithEmailAndPassword } from "firebase/auth";
import { Icon } from "react-icons-kit";
import { eyeOff } from "react-icons-kit/feather/eyeOff";
import { eye } from "react-icons-kit/feather/eye";

export default function SignUp({ promptAsync, navigation }: any) {
  const [user, setUser] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const [password, setPassword] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [strength, setStrength] = useState("");

  const [type, setType] = useState("password");
  const [icon, setIcon] = useState(eyeOff);

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

  const handleToggle = () => {
    if (type === "password") {
      setIcon(eye);
      setType("text");
    } else {
      setIcon(eyeOff);
      setType("password");
    }
  };
  // TODO: Implement handleSignUp using firebase
  const handleSignUp = () => {};

  return (
    <View style={styles.container}>
      <Image
        style={styles.logo}
        source={require("../../assets/images/usedLogo.png")}
      />

      <Text style={styles.title}>Wild Knight</Text>

      <TextInput
        style={styles.input}
        placeholder="Enter your username"
        value={user}
        onChangeText={setUser}
      />

      <TextInput
        style={styles.input}
        placeholder="Enter your email"
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        style={styles.input}
        placeholder="Enter your password"
        onChangeText={(text) => {
          setPassword(text);
        }}
      />
      {/** 
      <View
        style={styles.input}
      >
        <Icon
          icon={icon}
          style={styles.icon}>
        </Icon>
      </View>
      **/}

      <View>
        {suggestions.map((suggestion, index) => (
          <View key={index}>
            <Text style={styles.strengthText}>
              Password Strength: {strength}
            </Text>
            <Text style={styles.suggestionsText}>
              <Text key={index}>
                {suggestion}
                {"\n"}
              </Text>
            </Text>
            <View style={styles.strengthMeter}>
              <View
                style={{
                  width: `${
                    strength === "Very Strong"
                      ? 100
                      : strength === "Strong"
                        ? 75
                        : strength === "Moderate"
                          ? 50
                          : strength === "Weak"
                            ? 25
                            : 0
                  }%`,
                  height: 20,
                  backgroundColor:
                    strength === "Too Weak"
                      ? "red"
                      : strength === "Weak"
                        ? "orange"
                        : strength === "Moderate"
                          ? "yellow"
                          : strength === "Strong"
                            ? "green"
                            : "limegreen",
                }}
              ></View>
            </View>
          </View>
        ))}
      </View>

      <Button title="Sign Up" onPress={handleSignUp} />

      <View style={styles.lineContainer}>
        <View style={styles.line} />
        <Text style={styles.orText}>OR</Text>
        <View style={styles.line} />
      </View>

      <TouchableOpacity style={styles.button} onPress={() => promptAsync()}>
        <Text style={styles.googleButtonText}>Continue with Google</Text>
      </TouchableOpacity>

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
});
