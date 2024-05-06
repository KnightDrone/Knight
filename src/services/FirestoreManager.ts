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
import { User, userConverter } from "../types/User";
import { FirestoreDataConverter } from "@firebase/firestore";

export default class FirestoreManager {
  private converterDictionary: { [key: string]: FirestoreDataConverter<any> };

  constructor() {
    // Dictionary to map collection names to their respective converters
    this.converterDictionary = {
      users: userConverter,
      orders: orderConverter,
    };
  }

  /**
   * Method to read data by id from the database
   *
   * @param collection - The collection to read from, "users" or "orders"
   * @param id - The id of the data to read
   * @returns - The order with the specified id
   */
  async readOrder(collection: string, id: string): Promise<any | null> {
    const docRef = doc(firestore, collection, id).withConverter(
      this.converterDictionary[collection]
    );

    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      console.log(
        "Document with id " + id + " found in the " + collection + " database"
      );
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
    console.log("field " + field);
    console.log("data " + data);
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
   * Method to write data to the database
   *
   * @param collection - The collection to write to, "users" or "orders"
   * @param order - The data to write to the database
   * @returns - None
   */
  async writeOrder(collection: string, data: any): Promise<void> {
    try {
      await setDoc(
        doc(firestore, collection, data.getId()).withConverter(
          this.converterDictionary[collection]
        ),
        data
      );
      console.log(
        "Document with id " +
          data.getId() +
          " successfully added to the " +
          collection +
          " database"
      );
    } catch (e) {
      console.error("Error adding document to the database: ", e);
    }
  }

  /**
   * Method to delete an order from the database
   *
   * @param collection - The collection to delete from, "users" or "orders"
   * @param orderId - The id of the data to delete
   * @returns - None
   */
  async deleteOrder(collection: string, id: string): Promise<void> {
    try {
      await deleteDoc(doc(firestore, collection, id));
      console.log(
        "Document with id " +
          id +
          " successfully deleted from the " +
          collection +
          " database"
      );
    } catch (e) {
      console.error("Error deleting document from the database: ", e);
    }
  }

  /**
   * Method to update an order in the database
   *
   * @param collection - the collection to update, "users" or "orders"
   * @param id - The id of the data to update
   * @param field - The field to update, valid fields include: "operatorId", "status", "deliveryDate", "location", "operatorName" for 'orders' collection and "displayName", "email" for "users" collection
   * @param data - The data to update the field with
   * @returns - None
   */
  async updateOrder(
    collection: string,
    id: string,
    field: string,
    data: string | Date | OrderLocation
  ): Promise<void> {
    const orderRef = doc(firestore, collection, id);
    const validFields: { [key: string]: string[] } = {
      orders: [
        "operatorId",
        "status",
        "deliveryDate",
        "location",
        "operatorName",
      ],
      users: ["email", "displayName"],
    };

    try {
      if (validFields[collection].includes(field)) {
        await setDoc(orderRef, { [field]: data }, { merge: true });
        console.log(
          "Document with id " +
            id +
            " successfully updated " +
            field +
            " field in the " +
            collection +
            " database"
        );
      } else {
        console.log("No valid field provided to update");
      }
    } catch (e) {
      console.error("Error updating document in the database: ", e);
    }
  }
}
