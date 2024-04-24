import uuid from "react-native-uuid";
import { Item } from "./Item";

enum OrderStatus {
  Pending = "Pending",
  Shipped = "Shipped",
  Delivered = "Delivered",
  Cancelled = "Cancelled",
}

interface OrderLocation {
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
    op_location?: OrderLocation,
    id?: string
  ) {
    this.id = id || uuid.v4().toString();
    this.user = user;
    this.item = item;
    this.orderDate = new Date();
    this.status = OrderStatus.Pending;
    this.orderDate = orderDate || new Date();
    this.deliveryDate = deliveryDate || new Date();
    this.location = location;
    this.op_name = op_name || "";
    this.op_location = op_location || { latitude: -999, longitude: -999 };
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

  getOrderLocation(): OrderLocation {
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

  setStatus(newStatus: OrderStatus): void {
    this.status = newStatus;
  }

  toDict(): { [key: string]: string } {
    return {
      id: this.id,
      user: this.user,
      operator: this.op_name,
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
      location: {
        latitude: order.getOrderLocation().latitude,
        longitude: order.getOrderLocation().longitude,
      },
      op_location: {
        latitude: order.getOpOrderLocation().latitude,
        longitude: order.getOpOrderLocation().longitude,
      },
    };
  },
  fromFirestore: (snapshot: any) => {
    const data = snapshot.data();
    const item = new Item(
      data.item.id,
      data.item.name,
      data.item.description,
      data.item.price
    );
    const order = new Order(
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

    console.log("id: ", data.id); // id is undefined !!

    return order;
  },
};

export { OrderStatus, OrderLocation, Order, orderConverter };
