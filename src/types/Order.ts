import { Item } from "./Item";
import { autoId } from "@google-cloud/firestore/build/src/util";

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
  private usr_loc_name: string;
  private op_name: string;
  private op_location: OrderLocation;

  constructor(
    user: string,
    item: Item,
    location: OrderLocation,
    op_name?: string,
    op_location?: OrderLocation
  ) {
    this.id = this.generateId();
    this.user = user;
    this.item = item;
    this.orderDate = new Date();
    this.status = OrderStatus.Pending;
    this.deliveryDate = new Date();
    this.location = location;
    this.usr_loc_name = "";
    this.op_name = op_name || "";
    this.op_location = op_location || { latitude: -999, longitude: -999 };
  }
  // This is done outside constructor as it is bad practice to have async calls in constructor, this method sh
  async locSearch() {
    const location = this.getLocation();
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${location.latitude}&lon=${location.longitude}`
      );
      const data = await response.json();
      this.usr_loc_name = data.name;
    } catch {
      console.error("Failed to fetch location name with Nominatim API");
      this.usr_loc_name = `Lat: ${location.latitude}, Long: ${location.longitude}`; //default boring name
    }
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

  getLocation(): OrderLocation {
    return this.location;
  }
  getUsrLocName(): string {
    return this.usr_loc_name;
  }

  getOpName(): string {
    return this.op_name;
  }

  getOpLocation(): OrderLocation {
    return this.op_location;
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
  // Temporary method for testing, should NOT be used in production
  private generateId(): string {
    const timestamp = Date.now().toString();
    const randomNumber = Math.floor(Math.random() * 1000)
      .toString()
      .padStart(3, "0");
    return timestamp + randomNumber;
  }
}

export { OrderStatus, OrderLocation, Order };
