import { Item } from "./Item";

export enum OrderStatus {
  Pending = "Pending",
  Shipped = "Shipped",
  Delivered = "Delivered",
  Cancelled = "Cancelled",
}

export class Order {
  private user: string;
  private item: Item;
  private orderDate: Date;
  private status: OrderStatus;
  private deliveryDate: Date;
  private us_latitude: number;
  private us_longitude: number;
  private op_location: string;
  private op_latitude: number;
  private op_longitude: number;

  constructor(
    user: string,
    item: Item,
    orderDate: Date,
    status: OrderStatus,
    deliveryDate: Date,
    us_latitude: number,
    us_longitude: number,
    op_location: string, // Name of where the drone came from such as "Drone Station 1", "St. Gallen Hospital", "Jeffrey's Clinic"
    op_latitude?: number,
    op_longitude?: number
  ) {
    this.user = user;
    this.item = item;
    this.orderDate = new Date();
    this.status = OrderStatus.Pending;
    this.deliveryDate = new Date();
    this.us_latitude = us_latitude;
    this.us_longitude = us_longitude;
    this.op_location = op_location;
    this.op_latitude = op_latitude || -999;
    this.op_longitude = op_longitude || -999;
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

  getUserLatitude(): number {
    return this.us_latitude;
  }

  getUserLongitude(): number {
    return this.us_longitude;
  }
  getOperatorLocationName(): string {
    return this.op_location;
  }
  getOperatorLatitude(): number {
    return this.op_latitude;
  }

  getOperatorLongitude(): number {
    return this.op_longitude;
  }
}
