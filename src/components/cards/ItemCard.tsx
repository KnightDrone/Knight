import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
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
      className="absolute top-2/3 z-10 justify-center items-center"
      testID={`item-card-view-${item.getId()}`}
    >
      <BlurView
        className="absolute h-screen justify-center items-center"
        intensity={10}
        testID="blur-view"
      >
        <View className="bg-white w-2/3 h-auto rounded-2xl p-5 items-center justify-center shadow-lg ">
          <TouchableOpacity
            className="absolute top-5 right-5"
            onPress={handleClose}
            testID="close-button"
          >
            <Icon name="close" size={20} color="#000" testID="close-icon" />
          </TouchableOpacity>
          <Image
            className="w-40 h-40 my-2"
            source={item.getImage()}
            testID="item-image"
          />
          <Text className="text-2xl font-bold my-2 text-center">
            {t(item.getName() as TranslationKeys)}
          </Text>
          <Text className="text-lg text-center my-2">
            {t(item.getDescription() as TranslationKeys)}
          </Text>
          <View className="w-full mt-4">
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
