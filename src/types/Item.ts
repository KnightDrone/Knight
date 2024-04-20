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
    price: number,
    icon?: number,
    image?: number
  ) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.price = price;
    this.icon = icon || 0;
    this.image = image || 0;
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

  toDict(): { [key: string]: string } {
    return {
      id: this.id.toString(),
      name: this.name,
      description: this.description,
      price: this.price.toString(),
    };
  }
}
