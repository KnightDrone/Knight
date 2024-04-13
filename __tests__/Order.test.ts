import { Item } from "../src/types/Item";
import { Order, OrderStatus } from "../src/types/Order";

describe("Order", () => {
  let order: Order;
  const user = "John Doe";
  const image = require("../assets/images/splash.png");
  const item = new Item(1, "Test Item", "Test Description", image, image, 10);
  const orderDate = new Date();
  const status = OrderStatus.Pending;
  const deliveryDate = new Date();
  const location = [0, 0];

  beforeEach(() => {
    order = new Order(user, item, orderDate, status, deliveryDate, location);
  });

  it("should create an instance of Order", () => {
    expect(order).toBeInstanceOf(Order);
  });

  it("should have the correct properties", () => {
    expect(order.getUser()).toBe(user);
    expect(order.getItem()).toBe(item);
    expect(order.getOrderDate().getTime()).toBeCloseTo(orderDate.getTime(), -2);
    expect(order.getStatus()).toBe(status);
    expect(order.getDeliveryDate().getTime()).toBeCloseTo(
      deliveryDate.getTime(),
      -2
    );
    expect(order.getLocation()).toEqual(location);
  });

  it("should have all order statuses", () => {
    expect(OrderStatus).toEqual({
      Pending: "Pending",
      Shipped: "Shipped",
      Delivered: "Delivered",
      Cancelled: "Cancelled",
    });
  });

  it("getStatus should return the correct status", () => {
    expect(order.getStatus()).toBe(OrderStatus.Pending);
  });
    
  it("getDeliveryDate should return the correct delivery date", () => {
    expect(order.getDeliveryDate().getTime()).toBeCloseTo(
      deliveryDate.getTime(),
      -2
    );
  });

  it("getLocation should return the correct location", () => {
    expect(order.getLocation()).toEqual(location);
  });
});
