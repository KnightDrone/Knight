import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Button,
  ScrollView,
} from "react-native";
import { Picker } from "@react-native-picker/picker";

const ProfileScreen = () => {
  const [name, setName] = useState("Melissa Peters");
  const [email, setEmail] = useState("melpeters@gmail.com");
  const [password, setPassword] = useState("**********");
  const [dateOfBirth, setDateOfBirth] = useState("23/05/1995");
  const [country, setCountry] = useState("Nigeria");

  return (
    <ScrollView style={styles.container}>
      <View style={styles.headerContainer}></View>
      <View style={styles.profileImageContainer}>
        {/* Placeholder for profile image */}
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Name</Text>
        <TextInput style={styles.input} value={name} onChangeText={setName} />
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Email</Text>
        <TextInput style={styles.input} value={email} onChangeText={setEmail} />
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Password</Text>
        <TextInput
          style={styles.input}
          value={password}
          onChangeText={setPassword}
          secureTextEntry={true}
        />
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Date of Birth</Text>
        <TextInput
          style={styles.input}
          value={dateOfBirth}
          onChangeText={setDateOfBirth}
        />
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Country/Region</Text>
        <Picker
          selectedValue={country}
          onValueChange={(itemValue, itemIndex) => setCountry(itemValue)}
          style={styles.picker}
        >
          <Picker.Item label="Nigeria" value="Nigeria" />
          {/* Add other countries as needed */}
        </Picker>
      </View>
      <Button title="Save changes" onPress={() => alert("Changes Saved!")} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  headerContainer: {
    marginBottom: 20,
  },
  headerText: {
    fontSize: 20,
    fontWeight: "bold",
  },
  profileImageContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    padding: 10,
  },
  picker: {
    height: 50,
    width: "100%",
  },
});

export default ProfileScreen;
