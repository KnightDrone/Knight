import { firestore } from "./Firebase";
import { Order, orderConverter, OrderLocation } from "../types/Order";
import { collection, Firestore } from "@firebase/firestore";
import {
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  where,
} from "firebase/firestore";

class FirestoreManager {
  private database: Firestore;

  constructor() {
    this.database = firestore;
  }

  // Method to read data by id from the database
  async readData(id: string): Promise<Order | null> {
    const docRef = doc(this.database, "orders", id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      console.log("Order with id " + id + " found in the database");
      return docSnap.data().withConverter(orderConverter);
    } else {
      console.log("No such document!");
      return null;
    }
  }

  // Method to query data from the database based on user, status, or item name
  async queryData(
    user?: string,
    status?: string,
    itemName?: string
  ): Promise<Order[] | null> {
    if (user !== undefined) {
      var orders: Order[] = [];
      const q = query(
        collection(this.database, "orders"),
        where("user", "==", user)
      );
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        orders.push(doc.data().withConverter(orderConverter));
      });
      if (orders.length == 0) {
        console.log("No orders found for user: " + user);
        return null;
      } else {
        console.log(orders.length + "orders found for user: " + user);
        return orders;
      }
    } else if (status !== undefined) {
      var orders: Order[] = [];
      const q = query(
        collection(this.database, "orders"),
        where("status", "==", status)
      );
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        orders.push(doc.data().withConverter(orderConverter));
      });
      if (orders.length == 0) {
        console.log("No orders found with status: " + status);
        return null;
      } else {
        console.log(orders.length + "orders found with status: " + status);
        return orders;
      }
    } else if (itemName !== undefined) {
      var orders: Order[] = [];
      const q = query(
        collection(this.database, "orders"),
        where("item.name", "==", itemName)
      );
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        orders.push(doc.data().withConverter(orderConverter));
      });
      if (orders.length == 0) {
        console.log("No orders found with item name: " + itemName);
        return null;
      } else {
        console.log(orders.length + "orders found with item name: " + itemName);
        return orders;
      }
    } else {
      console.log("No query parameters provided");
      return null;
    }
  }

  // Method to write specific order to the database
  async writeOrder(order: Order): Promise<void> {
    try {
      await setDoc(
        doc(this.database, "orders").withConverter(orderConverter),
        order
      );
      console.log(
        "Order with id " + order.getId() + " successfully added to the database"
      );
    } catch (e) {
      console.error("Error adding order to the database: ", e);
    }
  }

  // Method to delete order with a specific id in the database
  async deleteData(orderId: string): Promise<void> {
    try {
      await deleteDoc(doc(this.database, "orders", orderId));
      console.log(
        "Order with id " + orderId + " successfully deleted from the database"
      );
    } catch (e) {
      console.error("Error deleting order from the database: ", e);
    }
  }

  // Method to update data at a specific path in the database
  async updateData(
    orderId: string,
    operator?: string,
    status?: string,
    deliveryDate?: Date,
    location?: OrderLocation
  ): Promise<void> {
    const orderRef = doc(this.database, "orders", orderId);
    try {
      if (operator !== undefined) {
        await setDoc(orderRef, { operator: operator }, { merge: true });
        console.log(
          "Order with id " +
            orderId +
            " successfully updated operator field in the database"
        );
      } else if (status !== undefined) {
        await setDoc(orderRef, { status: status }, { merge: true });
        console.log(
          "Order with id " +
            orderId +
            " successfully updated status field in the database"
        );
      } else if (deliveryDate !== undefined) {
        await setDoc(orderRef, { deliveryDate: deliveryDate }, { merge: true });
        console.log(
          "Order with id " +
            orderId +
            " successfully updated delivery date field in the database"
        );
      } else if (location !== undefined) {
        await setDoc(orderRef, { location: location }, { merge: true });
        console.log(
          "Order with id " +
            orderId +
            " successfully updated location field in the database"
        );
      }
    } catch (e) {
      console.error("Error updating order in the database: ", e);
    }
  }
}

export default FirestoreManager;
