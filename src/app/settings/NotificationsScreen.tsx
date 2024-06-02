import React from "react";
import { useTranslation } from "react-i18next";
import { View, TouchableOpacity, Text, Switch } from "react-native";

const NotificationsScreen = () => {
  const [isOffersEnabled, setIsOffersEnabled] = React.useState(true);
  const [isOrderEnabled, setIsOrderEnabled] = React.useState(true);
  const [isItemEnabled, setIsItemEnabled] = React.useState(true);

  const toggleOffers = () =>
    setIsOffersEnabled((previousState) => !previousState);
  const toggleOrder = () =>
    setIsOrderEnabled((previousState) => !previousState);
  const toggleItem = () => setIsItemEnabled((previousState) => !previousState);

  const { t } = useTranslation();

  return (
    <View className="flex-1 bg-gray-100 px-5 py-2.5">
      <View className="mt-25">
        <TouchableOpacity
          className="bg-white rounded-lg p-4 mb-2.5 shadow-md flex-row items-center justify-between"
          testID="order-button"
        >
          <View className="flex-col">
            <Text className="text-lg text-gray-800" testID="order-text">
              {t("settings.notifications.order-tracking.title")}
            </Text>
            <Text className="text-xs text-gray-600" testID="order-subtext">
              {t("settings.notifications.order-tracking.description")}
            </Text>
          </View>
          <Switch
            className="ml-auto"
            trackColor={{ false: "#767577", true: "#A0D1E4" }}
            onValueChange={toggleOrder}
            value={isOrderEnabled}
            testID="order-switch"
          />
        </TouchableOpacity>
        <TouchableOpacity className="bg-white rounded-lg p-4 mb-2.5 shadow-md flex-row items-center justify-between">
          <View className="flex-col">
            <Text className="text-lg text-gray-800" testID="offers-text">
              {t("settings.notifications.offers.title")}
            </Text>
            <Text className="text-xs text-gray-600" testID="offers-subtext">
              {t("settings.notifications.offers.description")}
            </Text>
          </View>
          <Switch
            className="ml-auto"
            trackColor={{ false: "#767577", true: "#A0D1E4" }}
            onValueChange={toggleOffers}
            value={isOffersEnabled}
            testID="offers-switch"
          />
        </TouchableOpacity>
        <TouchableOpacity
          className="bg-white rounded-lg p-4 mb-2.5 shadow-md flex-row items-center justify-between"
          testID="item-button"
        >
          <View className="flex-col">
            <Text className="text-lg text-gray-800" testID="item-text">
              {t("settings.notifications.new-items.title")}
            </Text>
            <Text className="text-xs text-gray-600" testID="item-subtext">
              {t("settings.notifications.new-items.description")}
            </Text>
          </View>
          <Switch
            className="ml-auto"
            trackColor={{ false: "#767577", true: "#A0D1E4" }}
            onValueChange={toggleItem}
            value={isItemEnabled}
            testID="item-switch"
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default NotificationsScreen;
