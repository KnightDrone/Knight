export class Item {
    private name: string;
    private description: string;
    private image: string;
    private price: number;


    constructor(name: string, description: string, image: string, price: number) {
        this.name = name;
        this.description = description;
        this.image = image;
        this.price = price;
    }

    getName(): string {
        return this.name;
    }

    getDescription(): string {
        return this.description;
    }

    getImage(): string {
        return this.image;
    }

    getPrice(): number {
        return this.price;
    }
}