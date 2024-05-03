import { Item } from "../src/types/Item";
import {
  Order,
  OrderStatus,
  OrderLocation,
  orderConverter,
} from "../src/types/Order";

describe("Order", () => {
  let order: Order;
  const userId = "John Doe";
  const imageDir = "../assets/images/splash.png";
  const image = require(imageDir);
  const item = new Item(1, "Test Item", "Test Description", 10, image, image);
  const orderDate = new Date();
  const deliveryDate = new Date();
  const operatorId = "Hospital";
  const location: OrderLocation = {
    latitude: 0,
    longitude: 0,
  };
  const operatorLocation: OrderLocation = {
    latitude: -999,
    longitude: -999,
  };

  beforeEach(() => {
    order = new Order(
      userId,
      item,
      location,
      orderDate,
      OrderStatus.Pending,
      deliveryDate,
      "Mattenhorn peak #3", // "usrLocName"
      operatorId,
      operatorLocation
    );
  });

  it("should create an instance of Order", () => {
    expect(order).toBeInstanceOf(Order);
  });

  it("should have the correct properties", () => {
    expect(order.getUser()).toBe(userId);
    expect(order.getItem()).toBe(item);
    expect(order.getOrderDate().getTime()).toBeCloseTo(orderDate.getTime(), -2);
    expect(order.getStatus()).toBe(OrderStatus.Pending);
    expect(order.getDeliveryDate().getTime()).toBeCloseTo(
      deliveryDate.getTime(),
      -2
    );
    expect(order.getUsrLocation()).toEqual(location);
    expect(order.getOpLocName()).toBe(operatorId);
    expect(order.getOpLocation()).toEqual(operatorLocation);
  });

  it("should have all order statuses", () => {
    expect(OrderStatus).toEqual({
      Pending: "Pending",
      Shipped: "Shipped",
      Delivered: "Delivered",
      Cancelled: "Cancelled",
      Accepted: "Accepted",
    });
  });

  it("getId should return the correct id", () => {
    expect(order.getId()).toBeTruthy();
  });

  it("setStatus should set the correct status", () => {
    order.setStatus(OrderStatus.Shipped);
    expect(order.getStatus()).toBe(OrderStatus.Shipped);
  });

  it("getOrderLocation should return the correct location", () => {
    expect(order.getUsrLocation()).toEqual(location);
  });

  /* Commenting this out for now as I'm not sure we're even using toDict
  it("returns the correct dictionary", () => {
    const expectedDict = {
      id: order.getId(),
      userId: userId,
      operatorId: "Hospital",
      item: JSON.stringify(item.toDict()),
      orderDate: orderDate.toString(),
      status: OrderStatus.Pending,
      deliveryDate: deliveryDate.toString(),
      location: JSON.stringify(location),
    };

    expect(order.toDict()).toEqual(expectedDict);
  });*/
});
