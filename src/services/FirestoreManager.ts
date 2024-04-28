import {
  firestore,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  where,
} from "./Firebase";
import {
  Order,
  orderConverter,
  OrderLocation,
  OrderStatus,
} from "../types/Order";

export default class FirestoreManager {
  constructor() {}

  // Method to read data by id from the database
  async readOrder(id: string): Promise<any | null> {
    const docRef = doc(firestore, "orders", id).withConverter(orderConverter);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      console.log("Order with id " + id + " found in the database");
      return docSnap.data();
    } else {
      console.log("No such document!");
      return null;
    }
  }

  // Method to query data from the database based on user, status, or item name
  async queryOrder(field: string, data: string): Promise<Order[] | null> {
    if (field == "user") {
      var orders: Order[] = [];
      const q = query(
        collection(firestore, "orders"),
        where("user", "==", data)
      ).withConverter(orderConverter);
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        orders.push(doc.data());
      });
      if (orders.length == 0) {
        console.log("No orders found for user: " + data);
        return null;
      } else {
        console.log(orders.length + " orders found for user: " + data);
        return orders;
      }
    } else if (field == "status") {
      var orders: Order[] = [];
      const q = query(
        collection(firestore, "orders"),
        where("status", "==", data)
      ).withConverter(orderConverter);
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        orders.push(doc.data());
      });
      if (orders.length == 0) {
        console.log("No orders found with status: " + data);
        return null;
      } else {
        console.log(orders.length + " orders found with status: " + data);
        return orders;
      }
    } else if (field == "itemName") {
      var orders: Order[] = [];
      const q = query(
        collection(firestore, "orders"),
        where("item.name", "==", data)
      ).withConverter(orderConverter);
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        orders.push(doc.data());
      });
      if (orders.length == 0) {
        console.log("No orders found with item name: " + data);
        return null;
      } else {
        console.log(orders.length + " orders found with item name: " + data);
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
        doc(firestore, "orders", order.getId()).withConverter(orderConverter),
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
  async deleteOrder(orderId: string): Promise<void> {
    try {
      await deleteDoc(doc(firestore, "orders", orderId));
      console.log(
        "Order with id " + orderId + " successfully deleted from the database"
      );
    } catch (e) {
      console.error("Error deleting order from the database: ", e);
    }
  }

  // Method to update data at a specific path in the database
  async updateOrder(
    orderId: string,
    field: string,
    data: string | Date | OrderLocation
  ): Promise<void> {
    const orderRef = doc(firestore, "orders", orderId);
    try {
      if (field == "operator") {
        await setDoc(orderRef, { operator: data }, { merge: true });
        console.log(
          "Order with id " +
            orderId +
            " successfully updated operator field in the database"
        );
      } else if (field == "status") {
        await setDoc(orderRef, { status: data }, { merge: true });
        console.log(
          "Order with id " +
            orderId +
            " successfully updated status field in the database"
        );
      } else if (field == "deliveryDate") {
        await setDoc(orderRef, { deliveryDate: data }, { merge: true });
        console.log(
          "Order with id " +
            orderId +
            " successfully updated delivery date field in the database"
        );
      } else if (field == "location") {
        await setDoc(orderRef, { location: data }, { merge: true });
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
