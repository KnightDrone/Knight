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
  private operator: string;
  private operatorLoc: OrderLocation;

  constructor(
    user: string,
    item: Item,
    location: OrderLocation,
    orderDate?: Date,
    deliveryDate?: Date,
    operator?: string,
    op_location?: OrderLocation,
    id?: string
  ) {
    this.id = id || uuid.v4().toString();
    this.user = user;
    this.item = item;
    this.status = OrderStatus.Pending;
    this.orderDate = orderDate || new Date();
    this.deliveryDate = deliveryDate || new Date();
    this.location = location;
    this.operator = operator || "";
    this.operatorLoc = op_location || { latitude: -999, longitude: -999 };
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
    return this.operator;
  }

  getOperatorLocation(): OrderLocation {
    return this.operatorLoc;
  }

  getOperator(): string {
    return this.operator;
  }

  setStatus(newStatus: OrderStatus): void {
    this.status = newStatus;
  }

  toDict(): { [key: string]: string } {
    return {
      id: this.id,
      user: this.user,
      operator: this.operator,
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
        latitude: order.getOperatorLocation().latitude,
        longitude: order.getOperatorLocation().longitude,
      },
    };
  },
  fromFirestore: (snapshot: any) => {
    const data = snapshot.data();
    const id = snapshot.id;

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
      new Date(data.orderDate.seconds * 1000),
      new Date(data.deliveryDate.seconds * 1000),
      data.operator,
      {
        latitude: data.op_location.latitude,
        longitude: data.op_location.longitude,
      },
      id
    );

    return order;
  },
};

export { OrderStatus, OrderLocation, Order, orderConverter };
