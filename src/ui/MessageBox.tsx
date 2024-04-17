import { Text } from "react-native";
import { twMerge } from "tailwind-merge";

export function MessageBox({
  className,
  message,
  style,
  onClose,
  testID,
}: {
  className?: string;
  message: string;
  style: "error" | "success";
  onClose?: () => void;
  testID?: string;
}) {
  return (
    <Text
      className={twMerge(
        "font-bold w-full text-center p-4 rounded mb-8",
        style == "error"
          ? "text-red-700 bg-red-100"
          : "text-green-700 bg-green-100",
        className
      )}
      onPress={onClose}
      testID={testID}
    >
      {message}
    </Text>
  );
}
