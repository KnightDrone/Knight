import { Item } from "../src/types/Item";
import {
  Order,
  OrderStatus,
  OrderLocation,
  orderConverter,
} from "../src/types/Order";

describe("Order", () => {
  let order: Order;
  const user = "John Doe";
  const imageDir = "../assets/images/splash.png";
  const image = require(imageDir);
  const item = new Item(1, "Test Item", "Test Description", 10, image, image);
  const orderDate = new Date();
  const deliveryDate = new Date();
  const location: OrderLocation = {
    latitude: 0,
    longitude: 0,
  };

  beforeEach(() => {
    order = new Order(user, item, location);
  });

  it("should create an instance of Order", () => {
    expect(order).toBeInstanceOf(Order);
  });

  it("should have the correct properties", () => {
    expect(order.getUser()).toBe(user);
    expect(order.getItem()).toBe(item);
    expect(order.getOrderDate().getTime()).toBeCloseTo(orderDate.getTime(), -2);
    expect(order.getStatus()).toBe(OrderStatus.Pending);
    expect(order.getDeliveryDate().getTime()).toBeCloseTo(
      deliveryDate.getTime(),
      -2
    );
    expect(order.getOrderLocation()).toEqual(location);
  });

  it("should have all order statuses", () => {
    expect(OrderStatus).toEqual({
      Pending: "Pending",
      Shipped: "Shipped",
      Delivered: "Delivered",
      Cancelled: "Cancelled",
    });
  });

  it("getId should return the correct id", () => {
    expect(order.getId()).toBeTruthy();
  });

  it("getStatus should return the correct status", () => {
    expect(order.getStatus()).toBe(OrderStatus.Pending);
  });

  // it("getDeliveryDate should return the correct delivery date", () => {
  //   expect(order.getDeliveryDate().getTime()).toBeCloseTo(
  //     deliveryDate.getTime(),
  //     -2
  //   );
  // });

  it("getOrderLocation should return the correct location", () => {
    expect(order.getOrderLocation()).toEqual(location);
  });

  it("returns the correct dictionary", () => {
    const expectedDict = {
      id: order.getId(),
      user: user,
      operator: "",
      item: JSON.stringify(item.toDict()),
      orderDate: orderDate.toString(),
      status: OrderStatus.Pending,
      deliveryDate: deliveryDate.toString(),
      location: JSON.stringify(location),
    };

    expect(order.toDict()).toEqual(expectedDict);
  });

  describe("orderConverter", () => {
    it("should correctly convert from and to Firestore data", () => {
      // Mock Firestore document data
      const data = {
        user: "testUser",
        operator: "testOperator",
        item: {
          id: "testItemId",
          name: "testItemName",
          description: "testItemDescription",
          price: 100,
        },
        orderDate: new Date(),
        status: "testStatus",
        deliveryDate: new Date(),
        op_location: JSON.stringify({ latitude: 0, longitude: 0 }),
        location: JSON.stringify({ latitude: 0, longitude: 0 }),
      };

      // Convert the data to an Order object
      const order = orderConverter.fromFirestore(data);

      // Check that the Order object has the correct properties
      expect(order.getUser()).toEqual(data.user);
      expect(order.getOpName()).toEqual(data.operator);
      expect(order.getItem().toDict()).toEqual(data.item);
      expect(order.getOrderDate()).toEqual(data.orderDate);
      expect(order.getStatus()).toEqual(data.status);
      expect(order.getDeliveryDate()).toEqual(data.deliveryDate);
      expect(JSON.stringify(order.getOrderLocation())).toEqual(
        JSON.parse(data.location)
      );

      // Convert the Order object back to Firestore data
      const convertedData = orderConverter.toFirestore(order);

      // Check that the converted data matches the original data
      expect(convertedData).toEqual(data);
    });
  });
});
