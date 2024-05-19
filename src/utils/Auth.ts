import { Alert } from "react-native";
import {
  auth,
  createUserWithEmailAndPassword,
  signInWithCredential,
  signInWithEmailAndPassword,
} from "../services/Firebase";
import FirestoreManager, { DBUser } from "../services/FirestoreManager";

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

      firestoreManager.createUser(result.user.uid, userData).then(() => {
        navigation.navigate("UserDrawer");
      });
    } else {
      firestoreManager
        .getUser(result.user.uid)
        .then((user) => {
          if (user && user.role === "operator") {
            navigation.navigate("OperatorDrawer");
          } else {
            navigation.navigate("UserDrawer");
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
            .then(() => {
              navigation.navigate("UserDrawer");
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
              .then(() => {
                navigation.navigate("UserDrawer");
              });
          });
        if (user && user.role === "operator") {
          navigation.navigate("OperatorDrawer");
        } else {
          navigation.navigate("UserDrawer");
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
          .then(() => {
            navigation.navigate("UserDrawer");
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
    await auth.signOut();
    navigation.reset({
      index: 0,
      routes: [{ name: "Login" }],
    });
  } catch (error) {
    Alert.alert("Logout Failed", "Unable to logout at this time.");
  }
};
