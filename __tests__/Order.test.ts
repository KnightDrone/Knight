import { Item } from "../src/types/Item";
import { Order, OrderStatus, Location } from "../src/types/Order";

describe("Order", () => {
  let order: Order;
  const user = "John Doe";
  const imageDir = "../assets/images/splash.png";
  const image = require("../assets/images/splash.png");
  const item = new Item(
    1,
    "Test Item",
    "Test Description",
    image,
    imageDir,
    image,
    imageDir,
    10
  );
  const orderDate = new Date();
  const deliveryDate = new Date();
  const location: Location = {
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
    expect(order.getOpName()).toBe(operator);
    expect(order.getOperatorLocation()).toEqual(operatorLocation);
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

  it("setStatus should set the correct status", () => {
    order.setStatus(OrderStatus.Shipped);
    expect(order.getStatus()).toBe(OrderStatus.Shipped);
  });

  it("getOrderLocation should return the correct location", () => {
    expect(order.getOrderLocation()).toEqual(location);
  });

  it("returns the correct dictionary", () => {
    const expectedDict = {
      id: order.getId(),
      user: user,
      operator: "Hospital",
      item: JSON.stringify(item.toDict()),
      orderDate: orderDate.toString(),
      status: OrderStatus.Pending,
      deliveryDate: deliveryDate.toString(),
      location: JSON.stringify(location),
    };

    expect(order.toDict()).toEqual(expectedDict);
  });

  it("returns the correct dictionary", () => {
    const expectedDict = {
      id: order.getId(),
      user: user,
      item: JSON.stringify(item.toDict()),
      orderDate: orderDate.toString(),
      status: OrderStatus.Pending,
      deliveryDate: deliveryDate.toString(),
      location: JSON.stringify(location),
    };

    expect(order.toDict()).toEqual(expectedDict);
  });
});
