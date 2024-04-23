import { secureRandom } from "../utils/random";
import { Item } from "./Item";
import { autoId } from "@google-cloud/firestore/build/src/util";

enum OrderStatus {
  Pending = "Pending",
  Shipped = "Shipped",
  Delivered = "Delivered",
  Cancelled = "Cancelled",
}

interface Location {
  latitude: number;
  longitude: number;
}

class Order {
  private id: string;
  private user: string;
  private item: Item;
  private orderDate: Date;
  private status: OrderStatus;
  private deliveryDate: Date;
  private location: OrderLocation;
  private op_name: string;
  private op_location: OrderLocation;

  constructor(
    user: string,
    item: Item,
    location: OrderLocation,
    orderDate?: Date,
    deliveryDate?: Date,
    op_name?: string,
    op_location?: OrderLocation
  ) {
    this.id = autoId();
    this.user = user;
    this.item = item;
    this.status = OrderStatus.Pending;
    this.deliveryDate = new Date();
    this.location = location;
  }

  getId(): string {
    return this.id;
  }

  getUser(): string {
    return this.user;
  }

  getItem(): Item {
    return this.item;
  }

  getOrderDate(): Date {
    return this.orderDate;
  }

  getStatus(): OrderStatus {
    return this.status;
  }

  getDeliveryDate(): Date {
    return this.deliveryDate;
  }

  getLocation(): Location {
    return this.location;
  }

  getOpName(): string {
    return this.op_name;
  }

  getOpOrderLocation(): OrderLocation {
    return this.op_location;
  }

  getOperator(): string {
    return this.op_name;
  }

  toDict(): { [key: string]: string } {
    return {
      id: this.id,
      user: this.user,
      item: JSON.stringify(this.item.toDict()),
      orderDate: this.orderDate.toString(),
      status: this.status,
      deliveryDate: this.deliveryDate.toString(),
      location: JSON.stringify(this.location),
    };
  }
}

export { OrderStatus, Location, Order };
