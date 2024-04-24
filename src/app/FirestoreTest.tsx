import React from "react";
import FirestoreManager from "../services/FirestoreManager"; // Import your FirestoreManager module
import { Item } from "../types/Item"; // Import your Item module

const firestoreManager = new FirestoreManager(); // Create an instance of your FirestoreManager
const id = "mqpsyXSq3iJSOErqgPzt";
const user = "admin";
const operator = "me";
const orderDate = new Date(2024, 4, 19, 12, 0, 0);
const deliveryDate = new Date(2024, 4, 19, 13, 0, 0);
const location = { latitude: -999, longitude: -999 };
const itemName = "flashlight";
const itemId = 1;
const itemDescription = "batteries not included";
const imageDir = "../assets/images/splash.png";
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

const FirestoreTest: React.FC = () => {
  const handleButtonClick = async () => {
    // Call your FirestoreManager functions here
    // For example:
    const result = await firestoreManager.readData(id);
    console.log(result);
  };

  return (
    <div>
      <h1>Firestore Test</h1>
      <button onClick={handleButtonClick}>Test Firestore</button>
      <h1></h1>
    </div>
  );
};

export default FirestoreTest;
