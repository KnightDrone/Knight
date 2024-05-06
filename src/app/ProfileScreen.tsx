import React, { useState, useEffect } from "react";
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
import FirestoreManager from "../services/FirestoreManager";
import { User } from "../types/User";

const firestoreManager = new FirestoreManager();

const ProfileScreen = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [isPickerShow, setIsPickerShow] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const user = auth.currentUser;

      if (user !== null) {
        const userData = await firestoreManager.readData("users", user.uid);
        setName(userData.getDisplayName());
        setEmail(userData.getEmail());
        setDateOfBirth(userData.getBirthday().toLocaleDateString("en-GB"));
      } else {
        console.error("No user logged in");
      }
    };
    fetchData();
  }, []);

  const showPicker = () => {
    setIsPickerShow(true);
  };

  const handleConfirm = (date: Date) => {
    setIsPickerShow(false);
    // setDateOfBirth(date.toLocaleDateString("en-GB")); // formats date as DD/MM/YYYY
  };

  function parseDate(dateString: string): Date {
    const [day, month, year] = dateString.split("/");
    return new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
  }

  const saveChanges = async () => {
    try {
      const user = auth.currentUser;
      if (user) {
        const newUser = new User(user.uid, email, parseDate(dateOfBirth), name);
        await firestoreManager.writeData("users", user);
        alert("Changes Saved!");
      }
    } catch (error) {
      console.error("Error updating user data:", error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.profileImageContainer}>
        <Image
          source={require("../../assets/images/defaultProfile.png")}
          style={styles.profileImage}
        />
      </View>
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
      <TouchableOpacity style={styles.saveButton} onPress={saveChanges}>
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
