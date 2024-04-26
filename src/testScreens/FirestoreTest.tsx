import React from "react";
import FirestoreManager from "../services/FirestoreManager"; // Import your FirestoreManager module
import { Item } from "../types/Item"; // Import your Item module
import { Text, Button, View, StyleSheet } from "react-native";
import { Order, OrderStatus } from "../types/Order"; // Import your Order module

const firestoreManager = new FirestoreManager(); // Create an instance of your FirestoreManager
const id = "mqpsyXSq3iJSOErqgPzt";
const user = "admin";
const orderDate = new Date(2024, 3, 19, 12, 0, 0);
const deliveryDate = new Date(2024, 3, 19, 13, 0, 0);
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
  const readFirestore = async () => {
    // Call your FirestoreManager functions here
    // For example:
    const result = await firestoreManager.readData(id);
    console.log("result: ", result);
    console.log("result dictionary: ", result.toDict());
    console.log("order dictionary: ", order.toDict());

    if (JSON.stringify(result.toDict()) === JSON.stringify(order.toDict())) {
      console.log("Test: read data passed");
    } else {
      console.log(
        "Test: read data failed - expected: " + order + " but got: " + result
      );
    }
  };

  const queryUser = async () => {
    // Call your FirestoreManager functions here
    // For example:
    const userRes = await firestoreManager.queryData("user", user);
    console.log("result: ", userRes);
    console.log("result dictionary: ", userRes[0].toDict());
    console.log("order dictionary: ", order.toDict());

    if (
      JSON.stringify(userRes[0].toDict()) === JSON.stringify(order.toDict())
    ) {
      console.log("Test: query data by user passed");
    } else {
      console.log(
        "Test: query data by user failed - expected: " +
          order +
          " but got: " +
          userRes
      );
    }
  };

  const queryStatus = async () => {
    const statusRes = await firestoreManager.queryData(
      "status",
      OrderStatus.Pending
    );
    console.log("result: ", statusRes);
    console.log("result dictionary: ", statusRes[0].toDict());
    console.log("order dictionary: ", order.toDict());

    if (
      JSON.stringify(statusRes[0].toDict()) === JSON.stringify(order.toDict())
    ) {
      console.log("Test: query data by status passed");
    } else {
      console.log(
        "Test: query data by status failed - expected: " +
          order +
          " but got: " +
          statusRes[0]
      );
    }
  };

  const queryItem = async () => {
    const itemNameRes = await firestoreManager.queryData("item", itemName);
    console.log("result: ", itemNameRes);
    console.log("result dictionary: ", itemNameRes[0].toDict());

    if (
      JSON.stringify(itemNameRes[0].toDict()) === JSON.stringify(order.toDict())
    ) {
      console.log("Test: query data by item name passed");
    } else {
      console.log(
        "Test: query data by item name failed - expected: " +
          order +
          " but got: " +
          itemNameRes[0]
      );
    }
  };

  // const updateFirestore = async () => {
  //   // Call your FirestoreManager functions here
  //   // For example:
  //   const result = await firestoreManager.updateData(id, order.getOpName());
  //   console.log("result: ", result);
  //   console.log("result dictionary: ", result.toDict());
  //   console.log("order dictionary: ", order.toDict());

  //   if (JSON.stringify(result.toDict()) === JSON.stringify(order.toDict())) {
  //     console.log("Test: update data passed");
  //   } else {
  //     console.log(
  //       "Test: update data failed - expected: " + order + " but got: " + result
  //     );
  //   }
  // };

  return (
    <View style={styles.container}>
      <View style={styles.buttonContainer}>
        <Button onPress={readFirestore} title="read data" />
      </View>
      <View style={styles.buttonContainer}>
        <Button onPress={queryUser} title="query user" />
      </View>
      <View style={styles.buttonContainer}>
        <Button onPress={queryStatus} title="query status" />
      </View>
      <View style={styles.buttonContainer}>
        <Button onPress={queryItem} title="query item" />
      </View>
      {/* <Button onPress={updateFirestore} title="update data" /> */}
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
  buttonContainer: {
    marginBottom: 30, // adjust this value to increase or decrease the space between buttons
  },
});

export default FirestoreTest;
