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
  private location: Location;

  constructor(user: string, item: Item, location: Location) {
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

const orderConverter = {
  toFirestore: (order: Order) => {
    return {
      user: order.getUser(),
      operator: order.getOpName(),
      item: order.getItem().toDict(),
      orderDate: order.getOrderDate(),
      status: order.getStatus(),
      deliveryDate: order.getDeliveryDate(),
      location: JSON.stringify(order.getOrderLocation()),
    };
  },
  fromFirestore: (data: any) => {
    // const data = snapshot.data();
    const item = new Item(
      data.item.id,
      data.item.name,
      data.item.description,
      data.item.price
    );
    return new Order(
      data.user,
      item,
      { latitude: data.location.latitude, longitude: data.location.longitude },
      data.orderDate,
      data.deliveryDate,
      data.operator,
      {
        latitude: data.op_location.latitude,
        longitude: data.op_location.longitude,
      },
      data.id
    );
  },
};

export { OrderStatus, OrderLocation, Order, orderConverter };
