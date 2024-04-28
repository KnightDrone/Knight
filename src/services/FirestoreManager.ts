import { firestore } from "./Firebase";
import { Order } from "../types/Order";
import { collection, Firestore } from "@firebase/firestore";
import { addDoc } from "firebase/firestore";

class FirebaseManager {
  private database: Firestore;
  private path: any;

  constructor() {
    this.database = firestore;
    this.path = collection(this.database, "Orders");
  }

  readData(path: string): Promise<Order> {
    return snapshot.val();
  }

  // Method to write data to a specific path in the database
  async writeOrder(order: Order): Promise<void> {
    try {
      const docRef = await addDoc(this.path, {
        title: order.getId(),
        done: false,
      });
      setTodo("");
      console.log("Document written with ID: ", docRef.id);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  }

  // Method to delete data from a specific path in the database
  deleteData(path: string): Promise<void> {}

  // Method to update data at a specific path in the database
  updateData(path: string, data: any): Promise<void> {}
}

export default FirebaseManager;
