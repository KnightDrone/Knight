import { Alert } from "react-native";
import {
  auth,
  createUserWithEmailAndPassword,
  signInWithCredential,
  signInWithEmailAndPassword,
} from "../services/Firebase";
import FirestoreManager, { DBUser } from "../services/FirestoreManager";
import { registerIndieID, unregisterIndieDevice } from "native-notify";

export function isValidEmail(email: string) {
  var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
  return regex.test(email);
}

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
  });
};

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
          .then(async () => {
            navigation.navigate("UserDrawer");
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
