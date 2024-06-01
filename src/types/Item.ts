/**
 * Represents an item in the game.
 */
export class Item {
  private id: number;
  private name: string;
  private description: string;
  private icon: number;
  private image: number;
  private price: number;

  /**
   * Creates a new instance of the Item class.
   * @param id - The ID of the item.
   * @param name - The name of the item.
   * @param description - The description of the item.
   * @param price - The price of the item.
   * @param icon - The icon of the item (optional).
   * @param image - The image of the item (optional).
   */
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
    this.image = image || 0;
    this.icon = icon || 0;
  }

  /**
   * Gets the ID of the item.
   * @returns The ID of the item.
   */
  getId(): number {
    return this.id;
  }

  /**
   * Gets the name of the item.
   * @returns The name of the item.
   */
  getName(): string {
    return this.name;
  }

  /**
   * Gets the description of the item.
   * @returns The description of the item.
   */
  getDescription(): string {
    return this.description;
  }

  /**
   * Gets the icon of the item.
   * @returns The icon of the item.
   */
  getIcon(): number {
    return this.icon;
  }

  /**
   * Gets the image of the item.
   * @returns The image of the item.
   */
  getImage(): number {
    return this.image;
  }

  /**
   * Gets the price of the item.
   * @returns The price of the item.
   */
  getPrice(): number {
    return this.price;
  }

  /**
   * Converts the item to a dictionary object.
   * @returns The item as a dictionary object.
   */
  toDict(): { [key: string]: string } {
    return {
      id: this.id.toString(),
      name: this.name,
      description: this.description,
      price: this.price.toString(),
    };
  }
}
