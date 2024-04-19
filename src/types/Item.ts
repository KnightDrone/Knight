export class Item {
  private id: number;
  private name: string;
  private description: string;
  private icon: number;
  // private iconDir: string;
  private image: number;
  // private imageDir: string;
  private price: number;

  constructor(
    id: number,
    name: string,
    description: string,
    icon: number,
    // iconDir: string,
    image: number,
    // imageDir: string,
    price: number
  ) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.icon = icon;
    // this.iconDir = iconDir;
    this.image = image;
    // this.imageDir = imageDir;
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

  toDict(): { [key: string]: string } {
    return {
      id: this.id.toString(),
      name: this.name,
      description: this.description,
      // icon: this.iconDir,
      // image: this.imageDir,
      price: this.price.toString(),
    };
  }
}
