import uuid from "react-native-uuid";
import { Item } from "./Item";

enum OrderStatus {
  Pending = "Pending",
  Shipped = "Shipped",
  Delivered = "Delivered",
  Cancelled = "Cancelled",
  Accepted = "Accepted",
}

interface OrderLocation {
  latitude: number;
  longitude: number;
}

class Order {
  private id: string;
  private user: string;
  private item: Item;
  private usrLocation: OrderLocation;
  private orderDate: Date;
  private status: OrderStatus;
  private deliveryDate: Date;
  private usrLocName: string;
  private opName: string;
  private opLocation: OrderLocation;

  constructor(
    user: string,
    item: Item,
    usrLocation: OrderLocation,
    orderDate?: Date,
    status?: OrderStatus,
    deliveryDate?: Date,
    usrLocName?: string, // this is for when reconstructing from Firestore
    opName?: string,
    op_location?: OrderLocation,
    id?: string
  ) {
    this.id = id || uuid.v4().toString();
    this.user = user;
    this.item = item;
    this.usrLocation = usrLocation;
    this.orderDate = orderDate || new Date();
    this.status = status || OrderStatus.Pending;
    this.deliveryDate = deliveryDate || new Date();
    this.usrLocName =
      usrLocName ||
      `Lat: ${usrLocation.latitude}, Long: ${usrLocation.longitude}`; //default boring name
    this.opName = opName || "";
    this.opLocation = op_location || { latitude: -999, longitude: -999 };
  }
  // This is done outside constructor as it is bad practice to have async calls in constructor, this method sh
  async locSearch() {
    const location = this.getUsrLocation();
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${location.latitude}&lon=${location.longitude}`
      );
      const data = await response.json();
      this.usrLocName = data.name;
    } catch {
      console.error("Failed to fetch location name with Nominatim API");
      this.usrLocName = `Lat: ${location.latitude}, Long: ${location.longitude}`; //default boring name
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

  getUsrLocation(): OrderLocation {
    return this.usrLocation;
  }
  getUsrLocName(): string {
    return this.usrLocName;
  }

  getOpLocName(): string {
    return this.opName;
  }

  getOpLocation(): OrderLocation {
    return this.opLocation;
  }

  toDict(): { [key: string]: string } {
    return {
      id: this.id,
      user: this.user,
      operator: this.opName,
      item: JSON.stringify(this.item.toDict()),
      orderDate: this.orderDate.toString(),
      status: this.status,
      deliveryDate: this.deliveryDate.toString(),
      location: JSON.stringify(this.usrLocation),
    };
  }
}

const orderConverter = {
  toFirestore: (order: Order) => {
    return {
      user: order.getUser(),
      item: order.getItem().toDict(),
      orderDate: order.getOrderDate(),
      usrLocation: {
        latitude: order.getUsrLocation().latitude,
        longitude: order.getUsrLocation().longitude,
      },
      status: order.getStatus(),
      deliveryDate: order.getDeliveryDate(),
      usrLocName: order.getUsrLocName(),
      operator: order.getOpLocName(),
      opLocation: {
        latitude: order.getOpLocation().latitude,
        longitude: order.getOpLocation().longitude,
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
      {
        latitude: data.usrLocation.latitude,
        longitude: data.usrLocation.longitude,
      },
      new Date(data.orderDate.seconds * 1000),
      data.status,
      new Date(data.deliveryDate.seconds * 1000),
      data.usrLocName,
      data.operator,
      {
        latitude: data.opLocation.latitude,
        longitude: data.opLocation.longitude,
      },
      id
    );

    return order;
  },
};

export { OrderStatus, OrderLocation, Order, orderConverter };
