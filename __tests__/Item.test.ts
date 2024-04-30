import { Item } from "../src/types/Item";

describe("Item", () => {
  let item: Item;
  let imageDir: string = "../assets/images/splash.png";
  let image: number = require(imageDir);

  beforeEach(() => {
    item = new Item(1, "Test Item", "This is a test item", 100, image, image);
  });

  test("getId returns the correct id", () => {
    expect(item.getId()).toBe(1);
  });

  test("getName returns the correct name", () => {
    expect(item.getName()).toBe("Test Item");
  });

  test("getDescription returns the correct description", () => {
    expect(item.getDescription()).toBe("This is a test item");
  });

  test("getIcon returns the correct icon", () => {
    expect(item.getIcon()).toBe(require("../assets/images/splash.png"));
  });

  test("getImage returns the correct image", () => {
    expect(item.getImage()).toBe(require("../assets/images/splash.png"));
  });

  test("getPrice returns the correct price", () => {
    expect(item.getPrice()).toBe(100);
  });

  test("toDict returns the correct dictionary", () => {
    const expectedDict = {
      id: "1",
      name: "Test Item",
      description: "This is a test item",
      price: "100",
      image: image.toString(),
    };
    expect(item.toDict()).toEqual(expectedDict);
  });
});
