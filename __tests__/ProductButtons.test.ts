import { productButtons } from "../src/types/ProductButtons";

describe("ProductButtons", () => {
  it("productButtons is an array", () => {
    expect(Array.isArray(productButtons)).toBe(true);
  });

  it("should have the correct number of buttons", () => {
    expect(productButtons).toHaveLength(4);
  });

  productButtons.forEach((button, index) => {
    it(`button ${index} has item and onPress properties`, () => {
      expect(button).toHaveProperty("item");
      expect(button).toHaveProperty("onPress");
    });

    it(`button ${index} onPress logs correct message`, () => {
      console.log = jest.fn();
      const messages = [
        "First aid kit",
        "Flashlight",
        "Thermal blanket",
        "Power bank",
      ];

      button.onPress();
      expect(console.log).toHaveBeenCalledWith(messages[index]);
    });
  });
});
