import firebase from "firebase/app";
import { Database } from "firebase/database";
import { database } from "./Firebase";
import { Order } from "../types/Order";

class FirebaseManager {
  private database: Database;

  constructor() {
    this.database = database;
  }

  // Method to read data from a specific path in the database
    async generateOrderId(): number {
        return Math.floor(Math.random() * 1000); // Generate a random number between 0 and 999
    }

  async readData(path: string): Promise<Order> {
    const snapshot = await this.database.ref(path).once("value");
    return snapshot.val();
  }

  // Method to write data to a specific path in the database
  async writeData(path: string, data: Order): Promise<void> {
    await this.database.ref(path).set(data);
  }

  // Method to delete data from a specific path in the database
  async deleteData(path: string): Promise<void> {
    await this.database.ref(path).remove();
  }

  // Method to update data at a specific path in the database
  async updateData(path: string, data: any): Promise<void> {
    await this.database.ref(path).update(data);
  }
}

export default FirebaseManager;
