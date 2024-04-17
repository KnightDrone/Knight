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

  getOpName(): string {
    return this.operator;
  }

  getOperatorLocation(): OrderLocation {
    return this.operatorLoc;
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
  // Temporary method for testing, should NOT be used in production
  private generateId(): string {
    const timestamp = Date.now().toString();
    const randomNumber = Math.floor(secureRandom() * 1000)
      .toString()
      .padStart(3, "0");
    return timestamp + randomNumber;
  }
}


export {OrderStatus, Location, Order}