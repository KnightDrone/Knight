import { secureRandom } from "../utils/random";
import { Item } from "./Item";

enum OrderStatus {
  Pending = "Pending",
  Shipped = "Shipped",
  Delivered = "Delivered",
  Cancelled = "Cancelled",
}

interface Location {
  latitude: number,
  longitude: number
}

class Order {
  private user: string;
  private item: Item;
  private orderDate: Date;
  private status: OrderStatus;
  private deliveryDate: Date;
  private location: Location;

  constructor(
    user: string,
    item: Item,
    location: Location
  ) {
    this.id = id || uuid.v4().toString();
    this.user = user;
    this.item = item;
    this.status = OrderStatus.Pending;
    this.deliveryDate = new Date();
    this.location = location;
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

  toDict(): { [key: string]: string } {
    return {
      user: this.user,
      item: JSON.stringify(this.item.toDict()),
      orderDate: this.orderDate.toString(),
      status: this.status,
      deliveryDate: this.deliveryDate.toString(),
      location: JSON.stringify(this.location),
    };
  }
}


export {OrderStatus, Location, Order}