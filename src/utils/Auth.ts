import { Alert } from "react-native";
import {
  auth,
  createUserWithEmailAndPassword,
  signInWithCredential,
  signInWithEmailAndPassword,
} from "../services/Firebase";
import FirestoreManager, { DBUser } from "../services/FirestoreManager";
import { registerIndieID, unregisterIndieDevice } from "native-notify";

/**
 * Checks if the given email is valid.
 * @param email - The email to validate.
 * @returns True if the email is valid, false otherwise.
 */
export function isValidEmail(email: string): boolean {
  var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
  return regex.test(email);
}

/**
 * Logs in the user with Google credentials.
 * @param credential - The Google credential.
 * @param navigation - The navigation object.
 * @param firestoreManager - The FirestoreManager instance.
 */
export const logInWithGoogle = (
  credential: any,
  navigation: any,
  firestoreManager: FirestoreManager
) => {
  signInWithCredential(auth, credential).then((result) => {
    const newUser =
      result.user.metadata.creationTime === result.user.metadata.lastSignInTime;
    if (newUser) {
      const userData: DBUser = {
        name: result.user.displayName || "",
        email: result.user.email || "",
        photoURL: result.user.photoURL || "",
        role: "user",
        createdAt: new Date(),
      };

      firestoreManager.createUser(result.user.uid, userData).then(() => {
        navigation.reset({
          index: 0,
          routes: [{ name: "UserDrawer" }],
        });
        registerIndieID(
          userData.role + result.user.uid,
          process.env.NN_APP_ID || "",
          process.env.NN_APP_TOKEN || ""
        );
      });
    } else {
      firestoreManager
        .getUser(result.user.uid)
        .then(async (user) => {
          if (user && user.role === "operator") {
            navigation.reset({
              index: 0,
              routes: [{ name: "OperatorDrawer" }],
            });
            registerIndieID(
              "operator" + result.user.uid,
              process.env.NN_APP_ID || "",
              process.env.NN_APP_TOKEN || ""
            );
          } else {
            navigation.reset({
              index: 0,
              routes: [{ name: "UserDrawer" }],
            });
            registerIndieID(
              "user" + result.user.uid,
              process.env.NN_APP_ID || "",
              process.env.NN_APP_TOKEN || ""
            );
          }
        })
        .catch(() => {
          // User might not exist in the database
          firestoreManager
            .createUser(result.user.uid, {
              name: result.user.displayName || "",
              email: result.user.email || "",
              photoURL: result.user.photoURL || "",
              role: "user",
              createdAt: new Date(),
            })
            .then(async () => {
              navigation.reset({
                index: 0,
                routes: [{ name: "UserDrawer" }],
              });
              registerIndieID(
                "user" + result.user.uid,
                process.env.NN_APP_ID || "",
                process.env.NN_APP_TOKEN || ""
              );
            });
        });
    }
  });
};

/**
 * Logs in the user with email and password.
 * @param email - The user's email.
 * @param password - The user's password.
 * @param firestoreManager - The FirestoreManager instance.
 * @param navigation - The navigation object.
 * @param setError - The function to set an error message.
 */
export const logInWithEmail = async (
  email: string,
  password: string,
  firestoreManager: FirestoreManager,
  navigation: any,
  setError: any
) => {
  if (email && password) {
    try {
      const response = await signInWithEmailAndPassword(auth, email, password);
      if (response.user) {
        const user = await firestoreManager
          .getUser(response.user.uid)
          .catch(() => {
            // User might not exist in the database
            firestoreManager
              .createUser(response.user.uid, {
                name: response.user.displayName || "",
                email: response.user.email || "",
                photoURL: response.user.photoURL || "",
                role: "user",
                createdAt: new Date(),
              })
              .then(async () => {
                navigation.navigate("UserDrawer");
                registerIndieID(
                  "user" + response.user.uid,
                  process.env.NN_APP_ID || "",
                  process.env.NN_APP_TOKEN || ""
                );
              });
          });
        if (user && user.role === "operator") {
          navigation.navigate("OperatorDrawer");
          registerIndieID(
            "operator" + response.user.uid,
            process.env.NN_APP_ID || "",
            process.env.NN_APP_TOKEN || ""
          );
        } else {
          navigation.navigate("UserDrawer");
          registerIndieID(
            "user" + response.user.uid,
            process.env.NN_APP_ID || "",
            process.env.NN_APP_TOKEN || ""
          );
        }
      } else {
        setError("Invalid credentials");
      }
    } catch (e) {
      setError("Login failed. Please check your credentials.");
    }
  }
};

/**
 * Signs up a new user with email and password.
 * @param userName - The user's name.
 * @param email - The user's email.
 * @param password - The user's password.
 * @param firestoreManager - The FirestoreManager instance.
 * @param navigation - The navigation object.
 * @param setError - The function to set an error message.
 */
export const signUpWithEmail = async (
  userName: string,
  email: string,
  password: string,
  firestoreManager: FirestoreManager,
  navigation: any,
  setError: any
) => {
  if (userName && email && password) {
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const userData: DBUser = {
          name: userName,
          email: email,
          photoURL: "",
          role: "user",
          createdAt: new Date(),
        };

        firestoreManager
          .createUser(userCredential.user.uid, userData)
          .then(() => {
            navigation.reset({
              index: 0,
              routes: [{ name: "UserDrawer" }],
            });
            registerIndieID(
              "user" + userCredential.user.uid,
              process.env.NN_APP_ID || "",
              process.env.NN_APP_TOKEN || ""
            );
          });
      })
      .catch((error) => {
        setError("Sign Up failed. Please check your credentials.");
      });
  } else {
    setError("Please input email and password.");
  }
};

/**
 * Logs out the current user.
 * @param navigation - The navigation object.
 */
export const logoutUser = async (navigation: any) => {
  try {
    const userId = auth.currentUser?.uid || "";
    await unregisterIndieDevice(
      "user" + userId,
      process.env.NN_APP_ID || "",
      process.env.NN_APP_TOKEN || ""
    );
    await unregisterIndieDevice(
      "operator" + userId,
      process.env.NN_APP_ID || "",
      process.env.NN_APP_TOKEN || ""
    );
    await auth.signOut();
    navigation.reset({
      index: 0,
      routes: [{ name: "Login" }],
    });
  } catch (error) {
    Alert.alert("Logout Failed", "Unable to logout at this time.");
  }
};
