import {
  Image,
  ImageSourcePropType,
  Text,
  TouchableOpacity,
} from "react-native";
import { twMerge } from "tailwind-merge";

export function Button({
  text,
  children,
  imgSrc,
  onPress,
  testID,
  className,
  style,
}: {
  text?: string;
  children?: React.ReactNode;
  imgSrc?: ImageSourcePropType;
  onPress: () => void;
  testID?: string;
  className?: string;
  style: "primary" | "secondary" | "tertiary";
}) {
  return (
    <TouchableOpacity
      className={twMerge(
        "w-full rounded-full flex-row items-center justify-center h-12 gap-2",
        style == "primary"
          ? "bg-primary-400"
          : style == "secondary"
            ? "bg-gray-100"
            : "bg-primary-500",
        className
      )}
      onPress={onPress}
      testID={testID}
    >
      {imgSrc && <Image source={imgSrc} className="w-6 h-6" />}
      {text && (
        <Text
          className={twMerge(
            "text-lg text-center",
            style == "primary"
              ? "text-white font-bold"
              : style == "secondary"
                ? "text-black"
                : "text-white font-bold"
          )}
        >
          {text}
        </Text>
      )}
      {children}
    </TouchableOpacity>
  );
}
