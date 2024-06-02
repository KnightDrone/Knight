import { Alert } from "react-native";
import {
  auth,
  createUserWithEmailAndPassword,
  signInWithCredential,
  signInWithEmailAndPassword,
} from "../services/Firebase";
import FirestoreManager, { DBUser } from "../services/FirestoreManager";
import { FirebaseError } from "firebase/app";
import { useTranslation } from "react-i18next";
import { TFunction } from "i18next";
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
export const logInWithGoogle = async (
  credential: any,
  navigation: any,
  firestoreManager: FirestoreManager,
  setError: SetErrorFunction,
  t: TFunction
) => {
  try {
    const result = await signInWithCredential(auth, credential);
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

      firestoreManager.createUser(result.user.uid, userData).then(async () => {
        navigation.navigate("UserDrawer");
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
            navigation.navigate("OperatorDrawer");
            registerIndieID(
              "operator" + result.user.uid,
              process.env.NN_APP_ID || "",
              process.env.NN_APP_TOKEN || ""
            );
          } else {
            navigation.navigate("UserDrawer");
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
              navigation.navigate("UserDrawer");
              registerIndieID(
                "user" + result.user.uid,
                process.env.NN_APP_ID || "",
                process.env.NN_APP_TOKEN || ""
              );
            });
        });
    }
  } catch (error) {
    handleFirebaseError(error, setError, t);
  }
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
  setError: SetErrorFunction,
  t: TFunction
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
      }
    } catch (error) {
      handleFirebaseError(error, setError, t);
    }
  } else {
    handleFirebaseError(
      new AppError("auth/missing-credentials", "Missing credentials"),
      setError,
      t
    );
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
  setError: SetErrorFunction,
  t: TFunction
) => {
  if (userName && email && password) {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const userData: DBUser = {
        name: userName,
        email: email,
        photoURL: "",
        role: "user",
        createdAt: new Date(),
      };

      firestoreManager
        .createUser(userCredential.user.uid, userData)
        .then(async () => {
          navigation.navigate("UserDrawer");
          registerIndieID(
            "user" + userCredential.user.uid,
            process.env.NN_APP_ID || "",
            process.env.NN_APP_TOKEN || ""
          );
        })
        .catch((error) => {
          handleFirebaseError(error, setError, t);
        });
    } catch (error) {
      handleFirebaseError(error, setError, t);
    }
  } else {
    handleFirebaseError(
      new AppError("auth/missing-credentials", "Missing credentials"),
      setError,
      t
    );
  }
};

/**
 * Logs out the current user.
 * @param navigation - The navigation object.
 */
export const logoutUser = async (
  navigation: any,
  setError: SetErrorFunction,
  t: TFunction
) => {
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
    handleFirebaseError(error, setError, t);
  }
};

type SetErrorFunction = (message: string) => void;

class AppError extends Error {
  code: string;
  constructor(code: string, message: string) {
    super(message);
    this.code = code;
  }
}

export const handleFirebaseError = (
  error: unknown,
  setError: SetErrorFunction,
  t: TFunction
) => {
  //console.log("Error code:", error instanceof FirebaseError ? error.code : "unknown error");

  if (error instanceof FirebaseError || error instanceof AppError) {
    switch (error.code) {
      case "auth/invalid-email":
        setError(t("error.invalid-email"));
        break;
      case "auth/user-disabled":
        setError(t("error.user-disabled"));
        break;
      case "auth/user-not-found":
        setError(t("error.user-not-found"));
        break;
      case "auth/wrong-password":
        setError(t("error.wrong-password"));
        break;
      case "auth/email-already-in-use":
        setError(t("error.email-already-in-use"));
        break;
      case "auth/operation-not-allowed":
        setError(t("error.operation-not-allowed"));
        break;
      case "auth/weak-password":
        setError(t("error.weak-password"));
        break;
      case "auth/requires-recent-login":
        setError(t("error.requires-recent-login"));
        break;
      case "auth/network-request-failed":
        setError(t("error.network-request-failed"));
        break;
      case "auth/too-many-requests":
        setError(t("error.too-many-requests"));
        break;
      case "auth/missing-credentials":
        setError(t("error.missing-credentials"));
        break;
      case "auth/invalid-credential":
        setError(t("error.invalid-credential"));
        break;
      default:
        setError(t("error.default"));
    }
  } else {
    setError(t("error.unknown"));
  }
};
