import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { TextInputMask } from "react-native-masked-text";
import DatePicker from "react-native-date-picker";
import { auth } from "../services/Firebase";
import { updateProfile, updateEmail, updatePassword } from "firebase/auth";

const ProfileScreen = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [isPickerShow, setIsPickerShow] = useState(false);
  const [photoURL, setPhotoURL] = useState("");

  const showPicker = () => {
    setIsPickerShow(true);
  };

  useEffect(() => {
    if (auth.currentUser) {
      const { displayName, email, photoURL } = auth.currentUser;
      setName(displayName || "");
      setEmail(email || "");
      setPhotoURL(photoURL || "");
    }
  }, []);

  function isValidEmail(email: string) {
    var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    return regex.test(email);
  }

  const handleSaveChanges = async () => {
    console.log("Saving changes...");
    try {
      console.log("TRY Saving changes...");
      if (auth.currentUser) {
        console.log("USER Saving changes...");

        await updateProfile(auth.currentUser, {
          displayName: name,
        });

        if (isValidEmail(email)) {
          auth.currentUser.email !== email &&
            updateEmail(auth.currentUser, email);
        } else {
          console.log("Invalid email address", email);
          return alert("Invalid email address");
        }

        if (password) {
          updatePassword(auth.currentUser, password);
        }

        alert("Changes Saved!");
      }
    } catch (error: any) {
      console.log("Failed to save changes:", error.message);
      alert(`Failed to save changes: ${error.message}`);
    }
  };

  const handleConfirm = (date: Date) => {
    setIsPickerShow(false);
    setDateOfBirth(date.toLocaleDateString("en-GB")); // formats date as DD/MM/YYYY
  };

  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity
        style={styles.profileImageContainer}
        onPress={() => console.log("Open Image Picker")}
      >
        <Image
          source={
            (photoURL && { uri: photoURL }) ||
            require("../../assets/images/defaultProfile.png")
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

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Date of Birth</Text>
        <TextInputMask
          type={"datetime"}
          options={{ format: "DD/MM/YYYY" }}
          placeholder="DD/MM/YYYY"
          value={dateOfBirth}
          onChangeText={setDateOfBirth}
          style={styles.input}
        />
        {isPickerShow && (
          <DatePicker
            modal
            open={isPickerShow}
            date={new Date()}
            onConfirm={handleConfirm}
            onCancel={() => setIsPickerShow(false)}
          />
        )}
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
