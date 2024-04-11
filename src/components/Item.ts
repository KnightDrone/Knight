export class Item {
  private id: number;
  private name: string;
  private description: string;
  private icon: number;
  private image: number;
  private price: number;

  constructor(
    id: number,
    name: string,
    description: string,
    icon: number,
    image: number,
    price: number
  ) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.icon = icon;
    this.image = image;
    this.price = price;
  }

  getId(): number {
    return this.id;
  }

  getName(): string {
    return this.name;
  }

  getDescription(): string {
    return this.description;
  }

  getIcon(): number {
    return this.icon;
  }

  getImage(): number {
    return this.image;
  }

  getPrice(): number {
    return this.price;
  }
}
