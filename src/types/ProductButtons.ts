import { Item } from "./Item";

interface ProductButton {
  item: Item;
  onPress: () => void;
}

const names: string[] = [
  "First aid kit",
  "Flashlight",
  "Thermal blanket",
  "Power bank",
];

const iconDirs: string[] = [
  "../../assets/icons/first_aid_icon.png",
  "../../assets/icons/flashlight_icon.png",
  "../../assets/icons/blanket_icon.png",
  "../../assets/icons/powerbank_icon.png",
];

const imageDirs: string[] = [
  "../../assets/images/first_aid.png",
  "../../assets/images/flashlight.png",
  "../../assets/images/thermal_blanket.png",
  "../../assets/images/powerbank.png",
];

// require is used to import images,
// it returns a number that can be used to display the image
const icons: number[] = [
  require("../../assets/icons/first_aid_icon.png"),
  require("../../assets/icons/flashlight_icon.png"),
  require("../../assets/icons/blanket_icon.png"),
  require("../../assets/icons/powerbank_icon.png"),
];

const images: number[] = [
  require("../../assets/images/first_aid.png"),
  require("../../assets/images/flashlight.png"),
  require("../../assets/images/thermal_blanket.png"),
  require("../../assets/images/powerbank.png"),
];

const prices: number[] = [20, 15, 10, 30];

const descriptions: string[] = [
  "Constains bandages, plasters, rubbing alcohol, asthma pump.",
  "1000 lumens. Powered by two AA batteries.",
  "Made of reflective material to contain body heat.",
  "20000 mAh battery. USB-C, lightning and USB-A connections.",
];

const items: Item[] = names.map((name, i) => {
  return new Item(i, name, descriptions[i], prices[i], icons[i], images[i]);
});

const productButtons: ProductButton[] = [
  {
    item: items[0],
    onPress: () => console.log("First aid kit"),
  },
  {
    item: items[1],
    onPress: () => console.log("Flashlight"),
  },
  {
    item: items[2],
    onPress: () => console.log("Thermal blanket"),
  },
  {
    item: items[3],
    onPress: () => console.log("Power bank"),
  },
];

export { ProductButton, productButtons, images };
