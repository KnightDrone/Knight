import { useState } from "react";
import { Image, TextInput, TouchableOpacity, View } from "react-native";
import { twMerge } from "tailwind-merge";

export function TextField({
  className,
  placeholder,
  onChangeText,
  value,
  type,
}: {
  className?: string;
  placeholder: string;
  onChangeText: (text: string) => void;
  value: string;
  type: "email" | "password" | "text";
}) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View
      className={twMerge(
        "flex-row items-center w-full h-12 px-4 border border-gray-400 rounded-full bg-gray-50",
        className
      )}
    >
      <TextInput
        className="h-12 w-full"
        placeholder={placeholder}
        value={value}
        secureTextEntry={type === "password" && !showPassword}
        onChangeText={onChangeText}
        autoCapitalize={type === "text" ? "sentences" : "none"}
        autoCorrect={type === "text"}
      />
      <TouchableOpacity
        testID="password-toggle"
        className="absolute right-2"
        onPress={() => setShowPassword(!showPassword)}
      >
        {type === "password" && (
          <Image
            source={
              showPassword
                ? require("../../assets/images/eye-hide.png")
                : require("../../assets/images/eye-show.png")
            }
            className="w-5 h-5"
          />
        )}
      </TouchableOpacity>
    </View>
  );
}
