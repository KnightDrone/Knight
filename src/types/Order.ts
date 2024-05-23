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
  private userId: string;
  private item: Item;
  private usrLocation: OrderLocation;
  private orderDate: Date;
  private status: OrderStatus;
  private deliveryDate: Date;
  private usrLocName: string;
  private operatorId: string;
  private opLocation: OrderLocation;
  private operatorName: string;

  constructor(
    userId: string,
    item: Item,
    usrLocation: OrderLocation,
    orderDate?: Date,
    status?: OrderStatus,
    deliveryDate?: Date,
    usrLocName?: string, // this is for when reconstructing from Firestore
    operatorId?: string,
    operatorName?: string,
    opLocation?: OrderLocation,
    id?: string
  ) {
    this.id = id || uuid.v4().toString();
    this.userId = userId;
    this.item = item;
    this.usrLocation = usrLocation;
    this.orderDate = orderDate || new Date();
    this.status = status || OrderStatus.Pending;
    this.deliveryDate = deliveryDate || new Date();
    this.usrLocName =
      usrLocName ||
      `Lat: ${usrLocation.latitude}, Long: ${usrLocation.longitude}`; //default boring name
    this.operatorId = operatorId || "";
    this.operatorName = operatorName || "Unaccepted";
    this.opLocation = opLocation || { latitude: -999, longitude: -999 };
  }
  // This is done outside constructor as it is bad practice to have async calls in constructor, this method sh
  async locSearch() {
    const location = this.getUsrLocation();
    try {
      const response = (await Promise.race([
        fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${location.latitude}&lon=${location.longitude}`
        ),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error("Timeout")), 5000)
        ), // in case of timeout error is thrown, and we go to catch block
      ])) as Response;
      const data = await response.json();
      this.usrLocName = data.name || this.usrLocName;
    } catch {
      console.error(
        "Failed to fetch location name with Nominatim API. Request timed out"
      );
      this.usrLocName = `Lat: ${location.latitude}, Long: ${location.longitude}`; //default boring name
    }
  }

  getId(): string {
    return this.id;
  }

  getUserId(): string {
    return this.userId;
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

  setStatus(status: OrderStatus) {
    this.status = status;
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

  getOperator(): string {
    return this.operatorId;
  }

  getOpLocation(): OrderLocation {
    return this.opLocation;
  }

  getOpName(): string {
    return this.operatorName;
  }
}

export function getDistanceOpToUser(
  opLoc: OrderLocation,
  userLoc: OrderLocation
) {
  // based on this https://stackoverflow.com/questions/27928/calculate-distance-between-two-latitude-longitude-points-haversine-formula
  const lat1 = userLoc.latitude;
  const lon1 = userLoc.longitude;
  const lat2 = opLoc.latitude;
  const lon2 = opLoc.longitude;
  var R = 6371; // Radius of the earth in km
  var dLat = deg2rad(lat2 - lat1); // deg2rad below
  var dLon = deg2rad(lon2 - lon1);
  var a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) *
      Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  var d = R * c; // Distance in km
  return d;
}

function deg2rad(deg: number) {
  return deg * (Math.PI / 180);
}

const orderConverter = {
  toFirestore: (order: Order) => {
    return {
      userId: order.getUserId(),
      operatorId: order.getOperator(),
      item: order.getItem().toDict(),
      orderDate: order.getOrderDate(),
      usrLocation: {
        latitude: order.getUsrLocation().latitude,
        longitude: order.getUsrLocation().longitude,
      },
      status: order.getStatus(),
      deliveryDate: order.getDeliveryDate(),
      usrLocName: order.getUsrLocName(),
      opLocation: {
        latitude: order.getOpLocation().latitude,
        longitude: order.getOpLocation().longitude,
      },
      operatorName: order.getOpName(),
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
      data.userId,
      item,
      {
        latitude: data.usrLocation.latitude,
        longitude: data.usrLocation.longitude,
      },
      new Date(data.orderDate.seconds * 1000),
      data.status,
      new Date(data.deliveryDate.seconds * 1000),
      data.usrLocName,
      data.operatorId,
      data.operatorName,
      {
        latitude: data.opLocation.latitude,
        longitude: data.opLocation.longitude,
      },
      id
    );

    return order;
  },
};
const sortOrders = (option: string, orders: Order[]) => {
  switch (option) {
    case "ascendingDate":
      return [...orders].sort(
        (a, b) => a.getOrderDate().getTime() - b.getOrderDate().getTime()
      );
    case "descendingDate":
      return [...orders].sort(
        (a, b) => b.getOrderDate().getTime() - a.getOrderDate().getTime()
      );
    case "ascendingPrice":
      return [...orders].sort(
        (a, b) => b.getItem().getPrice() - a.getItem().getPrice()
      );
    case "descendingPrice":
      return [...orders].sort(
        (a, b) => a.getItem().getPrice() - b.getItem().getPrice()
      );
    default:
      return orders;
  }
};
export { OrderStatus, OrderLocation, Order, orderConverter, sortOrders };
