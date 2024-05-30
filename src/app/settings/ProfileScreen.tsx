import React, { useEffect, useState } from "react";
import {
  View,
  Text,
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
import { useTranslation } from "react-i18next";
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

  const { t } = useTranslation();

  useEffect(() => {
    (async () => {
      if (Platform.OS !== "web") {
        const { status } =
          await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== "granted") {
          alert(t("settings.profile.error.camera-permission"));
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

          await uploadBytes(photoRef, blob);

          const url = await getDownloadURL(photoRef);
          setPicURL(url);
        } catch (error) {
          Alert.alert(
            t("settings.profile.error.title"),
            t("settings.profile.error.image-upload")
          );
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
          return alert(t("settings.profile.error.email-invalid"));
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

        alert(t("settings.profile.save-changes.success"));
      }
    } catch (error: any) {
      alert(`${t("settings.profile.save-changes.error")}: ${error.message}`);
    }
  };

  return (
    <ScrollView className="flex-1 px-5 bg-white" testID="profile-screen">
      <TouchableOpacity
        className="justify-center items-center mb-7.5 h-45"
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
          className="w-2/3 h-4/5 rounded-full border-4 border-gray-300"
        />
      </TouchableOpacity>
      <View className="my-5 bg-gray-100 rounded-lg h-20 px-2.5 py-1.25">
        <Text className="text-base font-bold mb-1.25">
          {t("settings.profile.name")}
        </Text>
        <TextInput
          className="h-10 p-2.5 bg-white rounded"
          placeholder={t("settings.profile.name")}
          value={name}
          onChangeText={setName}
        />
      </View>
      <View className="mb-5 bg-gray-100 rounded-lg h-20  px-2.5 py-1.25">
        <Text className="text-base font-bold mb-1.25">
          {t("settings.profile.email")}
        </Text>
        <TextInput
          className="h-10 p-2.5 bg-white rounded"
          placeholder={t("settings.profile.email")}
          value={userEmail}
          onChangeText={setUserEmail}
        />
      </View>
      <View className="mb-5 bg-gray-100 rounded-lg h-20 px-2.5 py-1.25">
        <Text className="text-base font-bold mb-1.25">
          {t("settings.profile.password")}
        </Text>
        <TextInput
          className="h-10 p-2.5 bg-white rounded"
          placeholder={t("settings.profile.password")}
          secureTextEntry={true}
          value={password}
          onChangeText={setPassword}
        />
      </View>

      <TouchableOpacity
        className="bg-blue-500 rounded-lg py-3 px-5 items-center mt-2.5"
        onPress={handleSaveChanges}
        testID="save-button"
      >
        <Text className="text-white text-lg font-bold">
          {t("settings.profile.save-changes.button")}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default ProfileScreen;
