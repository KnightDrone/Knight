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

  /**
   * Method to read data by id from the database
   *
   * @param id - The id of the order to read
   * @returns - The order with the specified id
   */
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

  /**
   * Method to query data from the database based on user, status, or item name
   *
   * @param field - The field to query by. Must be one of these: "userId", "status", "item.name", "operatorId"
   * @param data - The data to query for. Must match the field type
   * @returns - An array of orders that match the query
   */
  async queryOrder(field: string, data: string): Promise<Order[] | null> {
    const validFields = ["userId", "status", "item.name", "operatorId"];

    if (validFields.includes(field)) {
      var orders: Order[] = [];
      const q = query(
        collection(firestore, "orders"),
        where(field, "==", data)
      ).withConverter(orderConverter);

      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        orders.push(doc.data());
      });
      if (orders.length == 0) {
        console.log("No orders found for " + field + ": " + data);
      } else {
        console.log(orders.length + " orders found for " + field + ": " + data);
      }
      return orders; // Case of no orders found we return empty array
    } else {
      console.log("No valid query field provided");
      return null;
    }
  }

  /**
   * Method to write an order to the database
   *
   * @param order - The order to write to the database
   * @returns - None
   */
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

  /**
   * Method to delete an order from the database
   *
   * @param orderId - The id of the order to delete
   * @returns - None
   */
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

  /**
   * Method to update an order in the database
   *
   * @param orderId - The id of the order to update
   * @param field - The field to update, valid fields include: "operatorId", "status", "deliveryDate", "location"
   * @param data - The data to update the field with
   * @returns - None
   */
  async updateOrder(
    orderId: string,
    field: string,
    data: string | Date | OrderLocation
  ): Promise<void> {
    const orderRef = doc(firestore, "orders", orderId);
    const validFields = ["operatorId", "status", "deliveryDate", "location"];
    try {
      if (validFields.includes(field)) {
        await setDoc(orderRef, { [field]: data }, { merge: true });
        console.log(
          "Order with id " +
            orderId +
            " successfully updated " +
            field +
            " field in the database"
        );
      } else {
        console.log("No valid field provided to update");
      }
    } catch (e) {
      console.error("Error updating order in the database: ", e);
    }
  }
}
