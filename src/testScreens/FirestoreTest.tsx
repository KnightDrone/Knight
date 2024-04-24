import React from "react";
import FirestoreManager from "../services/FirestoreManager"; // Import your FirestoreManager module
import { Item } from "../types/Item"; // Import your Item module
import { Text, Button, View, StyleSheet } from "react-native";
import { Order } from "../types/Order"; // Import your Order module

const firestoreManager = new FirestoreManager(); // Create an instance of your FirestoreManager
const id = "mqpsyXSq3iJSOErqgPzt";
const user = "admin";
const orderDate = new Date(2024, 4, 19, 12, 0, 0);
const deliveryDate = new Date(2024, 4, 19, 13, 0, 0);
const location = { latitude: -999, longitude: -999 };
const op_name = "me";
const op_location = { latitude: -998, longitude: -998 };
const itemName = "flashlight";
const itemId = 1;
const itemDescription = "batteries not included";
const imageDir = "../../assets/images/splash.png";
const image = require(imageDir);
const itemPrice = 20;
const item = new Item(
  itemId,
  itemName,
  itemDescription,
  itemPrice,
  image,
  image
);
const order = new Order(
  user,
  item,
  location,
  orderDate,
  deliveryDate,
  op_name,
  op_location,
  id
);

const FirestoreTest: React.FC = () => {
  const handleButtonClick = async () => {
    // Call your FirestoreManager functions here
    // For example:
    const result = await firestoreManager.readData(id);
    console.log("result: ", result);
    console.log("result dictionary: ", result.toDict());
    console.log("order dictionary: ", order.toDict());

    if (result.toDict() === order.toDict()) {
      console.log("Test: read data passed");
    } else {
      console.log(
        "Test: read data failed - expected: " + order + " but got: " + result
      );
    }
  };

  return (
    <View style={styles.container}>
      <Button onPress={handleButtonClick} title="read data" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    paddingTop: 160,
  },
});

export default FirestoreTest;
