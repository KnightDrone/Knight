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
import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithCredential,
} from "firebase/auth";
import { auth } from "../services/Firebase";
import * as Google from "expo-auth-session/providers/google";
import * as WebBrowser from "expo-web-browser";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { signInWithEmailAndPassword } from "firebase/auth";

// Navigation imports
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

export default function Login({ navigation }: any) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

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
          console.log("Signed in successfully");
          navigation.navigate("Map"); // Navigate after successful login
        })
        .catch((error) => {
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
          console.log(response.user, " signed in successfully");
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

  return (
    <View style={styles.container} testID="login-screen">
      <Image
        style={styles.logo}
        source={require("../../assets/images/usedLogo.png")}
      />

      <Text style={styles.title}>Wild Knight</Text>

      <TextInput
        style={styles.input}
        placeholder="Enter your username or email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        autoCorrect={false}
      />

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.enterPswrd}
          placeholder="Enter your password"
          value={password}
          secureTextEntry={!showPassword}
          onChangeText={setPassword}
          autoCapitalize="none"
          autoCorrect={false}
        />
        <TouchableOpacity
          testID="password-toggle"
          style={styles.iconContainer}
          onPress={() => setShowPassword(!showPassword)}
        >
          <Image
            source={
              showPassword
                ? require("../../assets/images/eye-hide.png")
                : require("../../assets/images/eye-show.png")
            }
            style={styles.eye}
          />
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={styles.login}
        onPress={logInWithEmail}
        testID="login-button"
      >
        <Text style={styles.googleButtonText}>Log in</Text>
      </TouchableOpacity>

      <TouchableOpacity>
        <Text
          testID="forgot-password-link"
          style={styles.linkText}
          onPress={() => navigation.navigate("ForgotPassword")}
        >
          Forgot your password?
        </Text>
      </TouchableOpacity>

      <View style={styles.lineContainer}>
        <View style={styles.line} />
        <Text style={styles.orText}>OR</Text>
        <View style={styles.line} />
      </View>

      <TouchableOpacity style={styles.button} onPress={() => promptAsync()}>
        <View style={styles.GbuttonContent}>
          <Image
            source={require("../../assets/images/google-icon.png")} // Replace with the path to your Google icon
            style={styles.icon}
          />
          <Text style={styles.googleButtonText}>Continue with Google</Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity>
        <Text style={styles.text}> Don't have an account? </Text>
        <Text
          style={styles.linkText}
          onPress={() => navigation.navigate("SignUp")}
          testID="sign-up-link"
        >
          Sign Up!
        </Text>
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
  icon: {
    width: 30, // Adjust as needed
    height: 30, // Adjust as needed
    marginRight: 10, // Adds some space between the icon and the text
  },
  eye: {
    width: 20, // Adjust as needed
    height: 20, // Adjust as needed
  },
  GbuttonContent: {
    flexDirection: "row", // Aligns the children horizontally
    alignItems: "center", // Centers the children vertically
    paddingLeft: 30,
  },
  input: {
    width: "80%",
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 10,
    padding: 10,
    borderRadius: 5,
    backgroundColor: "#FFFBF1",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "80%",
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    backgroundColor: "#FFFBF1",
  },
  enterPswrd: {
    height: 40,
    padding: 10,
  },
  iconContainer: {
    position: "absolute",
    right: 10,
  },
  error: {
    color: "red",
    marginTop: 10,
  },
  text: {
    color: "black",
    fontSize: 16,
    textAlign: "center", // Center the text
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
  button: {
    marginTop: 10,
    width: "80%",
    borderColor: "black",
    borderWidth: 1,
    borderRadius: 50, // Adjust for desired roundness
    padding: 10,
  },
  login: {
    marginTop: 10,
    width: "50%",
    borderColor: "black",
    borderWidth: 1,
    borderRadius: 50, // Adjust for desired roundness
    padding: 10,
  },
  googleButtonText: {
    color: "black",
    fontSize: 16,
    textAlign: "center",
  },
  linkText: {
    color: "#00BAD3", // Change as needed
    fontSize: 16,
    textAlign: "center",
    marginTop: 10,
    textDecorationLine: "underline", // Adds underline to indicate it's a link
  },
  showPassword: {
    color: "blue", // Change as needed
    fontSize: 16,
    textAlign: "center",
    marginBottom: 10,
    textDecorationLine: "underline", // Adds underline to indicate it's a link
  },
  // Add or modify other styles as needed
});
