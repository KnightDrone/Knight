import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { Item } from "../../types/Item";
import Icon from "react-native-vector-icons/FontAwesome";
import { BlurView } from "expo-blur";
import { PayButton } from "../buttons/PayButton";
import { useTranslation } from "react-i18next";
import { TranslationKeys } from "../../types/translation-keys";

interface ItemCardProps {
  isVisible: boolean;
  handleClose: () => void;
  handleOrder: () => void;
  item: Item;
}

function ItemCard({
  isVisible,
  handleClose,
  handleOrder,
  item,
}: ItemCardProps) {
  const { t } = useTranslation();

  if (!isVisible) {
    return null;
  }

  return (
    <View
      className="absolute top-0 left-0 right-0 bottom-0 z-10 justify-center items-center"
      testID={`item-card-view-${item.getId()}`}
    >
      <BlurView
        intensity={10}
        className="absolute top-0 left-0 right-0 bottom-0 justify-center items-center"
        testID="blur-view"
      >
        <View className="bg-white rounded-2xl p-5 items-center justify-center shadow-lg w-[90%] h-[55%] self-center">
          <TouchableOpacity
            className="self-start"
            onPress={handleClose}
            testID="close-button"
          >
            <Icon name="close" size={20} color="#000" testID="close-icon" />
          </TouchableOpacity>
          <Text className="text-2xl font-bold my-2 text-center">
            {t(item.getName() as TranslationKeys)}
          </Text>
          <Text className="text-lg text-center my-2">
            {t(item.getDescription() as TranslationKeys)}
          </Text>
          <Image
            className="w-50 h-50 my-2"
            source={item.getImage()}
            testID="item-image"
          />
          <View className="flex-row items-center justify-between w-full">
            <PayButton
              amount={item.getPrice() * 100}
              onSuccessfulPayment={handleOrder}
            />
          </View>
        </View>
      </BlurView>
    </View>
  );
}
export default ItemCard;
