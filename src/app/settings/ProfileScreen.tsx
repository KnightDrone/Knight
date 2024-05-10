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
import { auth } from "../../services/Firebase";
import { updateProfile, updateEmail, updatePassword } from "firebase/auth";
import FirestoreManager from "../../services/FirestoreManager";
import { User } from "../../types/User";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";

const firestoreManager = new FirestoreManager();

const ProfileScreen = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isOperator, setIsOperator] = useState(false); // TODO: Implement operator functionality
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [isPickerShow, setIsPickerShow] = useState(false);

  const showPicker = () => {
    setIsPickerShow(true);
  };

  useEffect(() => {
    const fetchData = async () => {
      const user = auth.currentUser;
      if (user) {
        const userData = await firestoreManager.readData("users", user.uid);

        if (!userData) {
          console.error("User data not found");
          return;
        }
        setIsOperator(userData.getIsOperator());
        setName(userData.getDisplayName());
        setEmail(userData.getEmail());
        setDateOfBirth(userData.getBirthday().toLocaleDateString("en-GB"));
      } else {
        console.error("No user logged in");
      }
    };
    fetchData();
  }, []);

  function parseDate(dateString: string): Date {
    const [day, month, year] = dateString.split("/");
    return new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
  }

  const saveChanges = async () => {
    try {
      const user = auth.currentUser;
      if (user) {
        const newUser = new User(
          user.uid,
          email,
          isOperator,
          name,
          parseDate(dateOfBirth)
        );
        await firestoreManager.writeData("users", newUser);
        updatePassword(user, password);
        alert("Changes Saved!");
      }
    } catch (error) {
      console.error("Error updating user data:", error);
    }
  };

  const handleConfirm = (date: Date) => {
    setIsPickerShow(false);
    setDateOfBirth(date.toLocaleDateString("en-GB")); // formats date as DD/MM/YYYY
  };

  const changeImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 4],
      quality: 1,
    });

    console.log(result);
  };

  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity
        style={styles.profileImageContainer}
        onPress={() => changeImage()}
      >
        <Image
          source={require("../../../assets/images/profile.png")}
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
        onPress={saveChanges}
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
