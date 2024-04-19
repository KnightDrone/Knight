import { Text, View } from "react-native";

export function OrSeparator() {
  return (
    <View className="flex-row items-center w-full my-8">
      <View className="flex-1 h-[2px] rounded bg-gray-200" />
      <Text className="mx-4 text-gray-400 font-bold">OR</Text>
      <View className="flex-1 h-[2px] rounded bg-gray-200" />
    </View>
  );
}
