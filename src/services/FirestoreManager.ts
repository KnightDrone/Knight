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
import { FirestoreDataConverter } from "@firebase/firestore";

// A local type for representing the user in db
export type DBUser = {
  name: string;
  email: string;
  phone?: string;
  address?: string;
  role: string;
  createdAt: Date;
  photoURL?: string;
};

export default class FirestoreManager {
  private converterDictionary: { [key: string]: FirestoreDataConverter<any> };

  constructor() {
    // Dictionary to map collection names to their respective converters
    this.converterDictionary = {
      orders: orderConverter,
    };
  }

  /**
   * Creates or updates a user document in Firestore.
   * @param userId The UID of the user.
   * @param userData The user data to store or update.
   */
  async createUser(userId: string, userData: DBUser): Promise<void> {
    try {
      const userRef = doc(firestore, "users", userId);
      await setDoc(userRef, userData, { merge: true });
    } catch (error) {
      console.error("Error writing user document: ", error);
    }
  }

  /**
   * Updates specific fields of a user's document in Firestore.
   * @param userId The UID of the user.
   * @param updates An object containing the fields to update.
   */
  async updateUser(userId: string, updates: Partial<DBUser>): Promise<void> {
    try {
      const userRef = doc(firestore, "users", userId);
      await setDoc(userRef, updates, { merge: true });
    } catch (error) {
      console.error("Error updating user document: ", error);
    }
  }

  /**
   * Retrieves a user document from Firestore by UID.
   * @param userId The UID of the user to retrieve.
   * @returns A promise that resolves to the user data or null if not found.
   */
  async getUser(userId: string): Promise<DBUser | null> {
    try {
      const userRef = doc(firestore, "users", userId);
      const docSnap = await getDoc(userRef);
      if (docSnap.exists()) {
        return docSnap.data() as DBUser;
      } else {
        throw new Error("User not found.");
      }
    } catch (error) {
      throw error;
    }
  }

  /**
   * Method to read data by id from the database
   *
   * @param collection - The collection to read from, "users" or "orders"
   * @param id - The id of the data to read
   * @returns - The order with the specified id
   */
  async readData(collection: string, id: string): Promise<any | null> {
    this.checkStaleOrders();
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
    this.checkStaleOrders();
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
   * Method to write data to the database
   *
   * @param collection - The collection to write to, "users" or "orders"
   * @param data - The data to write to the database
   * @returns - None
   */
  async writeData(collection: string, data: any): Promise<void> {
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
   * @param id - The id of the data to delete
   * @returns - None
   */
  async deleteData(collection: string, id: string): Promise<void> {
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
   * @param field - The field to update, valid fields include: "operatorId", "status", "deliveryDate", "location", "operatorName" for 'orders' collection and "displayName", "birthday", "email" for "users" collection
   * @param data - The data to update the field with
   * @returns - None
   */
  async updateData(
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
        "opLocation",
        "operatorName",
      ],
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
  /**
   * Method to check for stale orders in the database and delete them if they have been pending for more than 6 hours.
   *
   * @returns {Promise<void>} - A promise that resolves when the operation is complete.
   */
  async checkStaleOrders(): Promise<void> {
    const sixHoursInMilliseconds = 6 * 60 * 60 * 1000;
    const now = Date.now();
    try {
      const q = query(
        collection(firestore, "orders"),
        where("status", "==", OrderStatus.Pending)
      ).withConverter(orderConverter);
      const querySnapshot = await getDocs(q);
      // print the "age" of each order
      querySnapshot.forEach((docSnapshot) => {
        const order = docSnapshot.data();
        const orderDate = order.getOrderDate().getTime();
        console.log(`Order ${order.getId()} is ${now - orderDate} ms old.`);
      });
      const staleOrders: Order[] = [];
      querySnapshot.forEach((docSnapshot) => {
        const order = docSnapshot.data();
        const orderDate = order.getOrderDate().getTime();
        if (now - orderDate > sixHoursInMilliseconds) {
          staleOrders.push(order);
        }
      });

      console.log(`Found ${staleOrders.length} stale orders.`);

      for (const order of staleOrders) {
        await this.deleteData("orders", order.getId());
        console.log(`Deleted stale order with ID: ${order.getId()}`);
      }
    } catch (error) {
      console.error("Error while checking for stale orders: ", error);
    }
  }
}
