import FirestoreManager from "../src/services/FirestoreManager";
import { mock, MockProxy } from "jest-mock-extended";
import { Item } from "../src/types/Item";
import { Firestore } from "../src/services/Firebase";
import { Order } from "../src/types/Order";

let firestoreManager: FirestoreManager;
let mockFirestore: MockProxy<Firestore> & Firestore;
let mockOrder: MockProxy<Order> & Order;
let consoleOutput: string[];
const originalLog = console.log;

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

beforeEach(() => {
  mockFirestore = mock<Firestore>();
  mockOrder = mock<Order>();
  firestoreManager = new FirestoreManager();
  consoleOutput = [];
  console.log = (output: string) => consoleOutput.push(output);
});

describe("FirestoreManager", () => {
  it("should read data", async () => {
    // mockFirestore.getDoc.mockResolvedValue(mockOrder);
    const result = await firestoreManager.readData(id);

    expect(result?.getUser).toBe(user);
    expect(result?.getItem).toBe(item);
    expect(result?.getOrderDate).toBe(orderDate);
    expect(result?.getDeliveryDate).toBe(deliveryDate);
    expect(result?.getOperator).toBe(operator);
    expect(result?.getOrderLocation).toBe(location);
    expect(consoleOutput).toContain(
      "Order with id " + id + " found in the database"
    );
    // expect(mockFirestore.getDoc).toHaveBeenCalledWith("testId");
  });

  //   it("should query data", async () => {
  //     mockFirestore.getDocs.mockResolvedValue([mockOrder]);
  //     const result = await firestoreManager.queryData("testUser");
  //     expect(result[0]?.getUser).toBe(user);
  // expect(result[0]?.getItem).toBe(item);
  // expect(result[0]?.getOrderDate).toBe(orderDate);
  // expect(result[0]?.getDeliveryDate).toBe(deliveryDate);
  // expect(result[0]?.getOperator).toBe(operator);
  // expect(result[0]?.getOrderLocation).toBe(location);
  //     expect(mockFirestore.getDocs).toHaveBeenCalledWith("testUser");
  //   });

  //   it("should write order", async () => {
  //     await firestoreManager.writeOrder(mockOrder);
  //     expect(mockFirestore.setDoc).toHaveBeenCalledWith(mockOrder);
  //   });

  //   it("should delete data", async () => {
  //     await firestoreManager.deleteData("testId");
  //     expect(mockFirestore.deleteDoc).toHaveBeenCalledWith("testId");
  //   });

  //   it("should update data", async () => {
  //     await firestoreManager.updateData("testId", "testOperator");
  //     expect(mockFirestore.setDoc).toHaveBeenCalledWith(
  //       "testId",
  //       { operator: "testOperator" },
  //       { merge: true }
  //     );
  //   });
});
