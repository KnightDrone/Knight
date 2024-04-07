import Item from "./Item";

enum OrderStatus {
    Pending = "Pending",
    Shipped = "Shipped",
    Delivered = "Delivered",
    Cancelled = "Cancelled"
}

class Order {
    private user: string;
    private item: Item;
    private orderDate: Date;
    private status: OrderStatus;
    private deliveryDate: Date;
    private location: number[]; // [latitude, longitude]


    constructor(user: string, item: Item, orderDate: Date, status: OrderStatus, deliveryDate: Date, location: number[]) {
        this.user = user;
        this.item = item;
        this.orderDate = new Date();
        this.status = OrderStatus.Pending;
        this.deliveryDate = new Date();
        this.location = [0, 0];
    }


}
