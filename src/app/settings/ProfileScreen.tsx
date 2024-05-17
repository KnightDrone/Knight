import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  TextInput,
  Platform,
} from "react-native";
import { auth, storage } from "../../services/Firebase";
import { updateProfile, updateEmail, updatePassword } from "firebase/auth";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import FirestoreManager, { DBUser } from "../../services/FirestoreManager";
import * as ImagePicker from "expo-image-picker";

const ProfileScreen = () => {
  const firestoreManager = new FirestoreManager();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [photoURL, setPhotoURL] = useState("");
  const [photoBase64, setPhotoBase64] = useState("");

  useEffect(() => {
    if (auth.currentUser) {
      const { displayName, email, photoURL } = auth.currentUser;
      setName(displayName || "");
      setEmail(email || "");
      setPhotoURL(photoURL || "");
    }
  }, []);

  useEffect(() => {
    (async () => {
      if (Platform.OS !== "web") {
        const { status } =
          await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== "granted") {
          alert("Sorry, we need camera roll permissions to make this work!");
        }
      }
    })();
  }, []);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
      base64: true,
    });

    if (!result.canceled) {
      const item = result.assets[0] as any;
      setPhotoBase64(item.base64);
      if (auth.currentUser) {
        const uid = auth.currentUser.uid;
        const url = `profile_pictures/${uid}.jpg`;
        const photoRef = ref(storage, url);

        try {
          const response = await fetch(item.uri);
          const blob = await response.blob();

          await uploadBytes(photoRef, blob).then(async () => {
            const url = await getDownloadURL(photoRef);
            setPhotoURL(url);
          });
        } catch (error) {
          console.error("Error during image upload: ", error);
        }
      }
    }
  };

  function isValidEmail(email: string) {
    var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    return regex.test(email);
  }

  const handleSaveChanges = async () => {
    try {
      if (auth.currentUser) {
        await updateProfile(auth.currentUser, {
          displayName: name,
          photoURL: photoURL,
        });

        if (isValidEmail(email)) {
          auth.currentUser.email !== email &&
            updateEmail(auth.currentUser, email);
        } else {
          return alert("Invalid email address");
        }

        if (password) {
          updatePassword(auth.currentUser, password);
        }

        if (photoURL) {
          const user = auth.currentUser;
          if (user) {
            const updatedUser: Partial<DBUser> = {
              photoURL: photoURL,
            };
            await firestoreManager.updateUser(user.uid, updatedUser);
            await updateProfile(user, {
              photoURL: photoURL,
            });
            await user.reload();
          }
        }

        alert("Changes Saved!");
      }
    } catch (error: any) {
      alert(`Failed to save changes: ${error.message}`);
    }
  };

  return (
    <ScrollView style={styles.container} testID="profile-screen">
      <TouchableOpacity
        style={styles.profileImageContainer}
        onPress={async () => await pickImage()}
      >
        <Image
          source={
            photoBase64
              ? { uri: `data:image/jpeg;base64,${photoBase64}` }
              : photoURL
                ? { uri: photoURL }
                : require("../../../assets/images/profile.png")
          }
          testID="profile-image"
          style={styles.profileImage}
        />
      </TouchableOpacity>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Name</Text>
        <TextInput
          style={styles.input}
          placeholder="Name"
          value={name}
          onChangeText={setName}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Password</Text>
        <TextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry={true}
          value={password}
          onChangeText={setPassword}
        />
      </View>

      <TouchableOpacity
        style={styles.saveButton}
        onPress={handleSaveChanges}
        testID="save-button"
      >
        <Text style={styles.saveButtonText}>Save changes</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  profileImageContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 30,
    height: 200,
  },
  profileImage: {
    width: 180,
    height: 180,
    borderRadius: 90,
    borderWidth: 4,
    borderColor: "#ddd",
  },
  inputContainer: {
    marginBottom: 20,
    backgroundColor: "#f7f7f7",
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  input: {
    height: 40,
    padding: 10,
    backgroundColor: "white",
    borderRadius: 5,
  },
  picker: {
    height: 50,
    width: "100%",
    backgroundColor: "white",
    borderRadius: 5,
  },
  saveButton: {
    backgroundColor: "#007AFF", // iOS blue button color
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignItems: "center",
    marginTop: 10,
  },
  saveButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default ProfileScreen;
