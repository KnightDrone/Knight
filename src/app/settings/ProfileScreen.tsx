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
  Alert,
} from "react-native";
import { auth, storage } from "../../services/Firebase";
import { updateProfile, updateEmail, updatePassword } from "firebase/auth";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import FirestoreManager, { DBUser } from "../../services/FirestoreManager";
import * as ImagePicker from "expo-image-picker";
import { isValidEmail } from "../../utils/Auth";
interface ProfileScreenProps {
  onSaveChanges?: () => void;
}

const ProfileScreen: React.FC<ProfileScreenProps> = ({ onSaveChanges }) => {
  const { displayName, email, photoURL } = auth.currentUser || {};
  const firestoreManager = new FirestoreManager();
  const [name, setName] = useState(displayName || "");
  const [userEmail, setUserEmail] = useState(email || "");
  const [password, setPassword] = useState("");
  const [picURL, setPicURL] = useState(photoURL || "");
  const [photoBase64, setPhotoBase64] = useState("");

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

          uploadBytes(photoRef, blob)
            .then(async () => {
              const url = await getDownloadURL(photoRef);
              setPicURL(url);
            })
            .catch(() => {
              Alert.alert("Error", "Failed to upload image");
            });
        } catch (error) {
          console.error("Error during image upload: ", error);
          Alert.alert("Error", "Failed to upload image");
        }
      }
    }
  };

  const handleSaveChanges = async () => {
    try {
      if (auth.currentUser) {
        await updateProfile(auth.currentUser, {
          displayName: name,
          photoURL: photoURL,
        });

        if (isValidEmail(userEmail)) {
          auth.currentUser.email !== email &&
            updateEmail(auth.currentUser, userEmail);
        } else {
          return alert("Invalid email address");
        }

        if (password) {
          updatePassword(auth.currentUser, password);
        }

        if (picURL) {
          const user = auth.currentUser;
          if (user) {
            const updatedUser: Partial<DBUser> = {
              photoURL: picURL,
            };
            await firestoreManager.updateUser(user.uid, updatedUser);
            await updateProfile(user, {
              photoURL: picURL,
            });

            onSaveChanges?.();
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
        className="justify-center items-center mb-7.5 h-50"
        onPress={pickImage}
        testID="profile-image-button"
      >
        <Image
          source={
            photoBase64
              ? { uri: `data:image/jpeg;base64,${photoBase64}` }
              : picURL
                ? { uri: picURL }
                : require("../../../assets/images/profile.png")
          }
          testID="profile-image"
          style={styles.profileImage}
        />
      </TouchableOpacity>

      <View className="flex space-y-5 my-5">
        <View className="h-auto mb-5 bg-gray-100 rounded-lg px-2.5 py-1.25">
          <Text className="text-base font-bold mb-1.25">Name</Text>
          <TextInput
            className="p-2.5 bg-white rounded"
            placeholder="Name"
            value={name}
            onChangeText={setName}
          />
        </View>
        <View className="mb-5 bg-gray-100 rounded-lg px-2.5 py-1.25">
          <Text className="text-base font-bold mb-1.25">Email</Text>
          <TextInput
            className="h-10 p-2.5 bg-white rounded"
            placeholder="Email"
            value={userEmail}
            onChangeText={setUserEmail}
          />
        </View>
        <View className="mb-5 bg-gray-100 rounded-lg px-2.5 py-1.25">
          <Text className="text-base font-bold mb-1.25">Password</Text>
          <TextInput
            className="p-2.5 bg-white rounded"
            placeholder="Password"
            secureTextEntry={true}
            value={password}
            onChangeText={setPassword}
          />
        </View>
      </View>

      <TouchableOpacity
        className="bg-blue-500 rounded-lg py-3 px-5 items-center mt-2.5"
        onPress={handleSaveChanges}
        testID="save-button"
      >
        <Text className="text-white text-lg font-bold">Save changes</Text>
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
