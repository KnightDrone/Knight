import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Image,
  TouchableOpacity,
} from "react-native";
import { auth } from "../services/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";

// Navigation imports
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

export default function Login({ navigation }: any) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const [request, response, promptAsync] = Google.useAuthRequest({
    iosClientId:
      "983400403511-gi5mo0akb89fcecaivk4q509c63hrvtl.apps.googleusercontent.com",
    androidClientId:
      "983400403511-i43set67i4o1e3kb7fl91vrh9r6aemcb.apps.googleusercontent.com",
    webClientId:
      "983400403511-ff4ntmj4f9qvmmcc6nqh68tn524bp740.apps.googleusercontent.com",
    redirectUri:
      "com.googleusercontent.apps.983400403511-gi5mo0akb89fcecaivk4q509c63hrvtl:/oauth2redirect/google"
  });

  

  useEffect(() => {
    if (response?.type === "success") {
      const { id_token } = response.params;
      const credential = GoogleAuthProvider.credential(id_token);
      signInWithCredential(auth, credential)
        .then(() => {
          navigation.navigate("OrderMenu"); // Navigate after successful login
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
          console.log("Login success");
          // Navigate to the order menu screen
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
    <View style={styles.container}>
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
        testID="showPasswordButton"
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

      <TouchableOpacity style={styles.login} onPress={logInWithEmail}>
        <Text style={styles.googleButtonText}>Log in</Text>
      </TouchableOpacity>

      <TouchableOpacity>
        <Text
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
