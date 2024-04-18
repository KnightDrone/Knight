import {
  Image,
  ImageSourcePropType,
  Text,
  TouchableHighlight,
  TouchableOpacity,
} from "react-native";
import { twMerge } from "tailwind-merge";

export function Button({
  text,
  imgSrc,
  onPress,
  testID,
  className,
  style,
}: {
  text: string;
  imgSrc?: ImageSourcePropType;
  onPress: () => void;
  testID?: string;
  className?: string;
  style: "primary" | "secondary";
}) {
  return (
    <TouchableOpacity
      className={twMerge(
        "w-full rounded-full flex-row items-center justify-center h-12 gap-2",
        style == "primary" ? "bg-primary-400" : "bg-gray-200",
        className
      )}
      onPress={onPress}
      testID={testID}
    >
      {imgSrc && <Image source={imgSrc} className="w-6 h-6" />}
      <Text
        className={twMerge(
          "text-lg text-center",
          style == "primary" ? "text-white font-bold" : "text-black"
        )}
      >
        {text}
      </Text>
    </TouchableOpacity>
  );
}
