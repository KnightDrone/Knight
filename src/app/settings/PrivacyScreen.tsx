import React from "react";
import { View, TouchableOpacity, Text, Switch } from "react-native";

const PrivacyScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [isAdsEnabled, setIsAdsEnabled] = React.useState(true);
  const [isTrackingEnabled, setIsTrackingEnabled] = React.useState(true);
  const [isLocationEnabled, setIsLocationEnabled] = React.useState(true);

  const toggleAds = () => setIsAdsEnabled((previousState) => !previousState);
  const toggleTracking = () =>
    setIsTrackingEnabled((previousState) => !previousState);
  const toggleLocation = () =>
    setIsLocationEnabled((previousState) => !previousState);

  return (
    <View className="flex-1 bg-gray-100 px-5 py-2.5">
      <View className="mt-25">
        <TouchableOpacity
          className="bg-white rounded-lg p-4 mb-2.5 shadow-md flex-row items-center justify-between"
          testID="data-button"
        >
          <View className="flex-col">
            <Text className="text-lg text-gray-800" testID="data-text">
              Data Tracking
            </Text>
            <Text className="text-xs text-gray-600" testID="data-subtext">
              Control what data is used for personalization
            </Text>
          </View>
          <Switch
            className="ml-auto"
            trackColor={{ false: "#767577", true: "#A0D1E4" }}
            onValueChange={toggleTracking}
            value={isTrackingEnabled}
            testID="data-switch"
          />
        </TouchableOpacity>
        <TouchableOpacity className="bg-white rounded-lg p-4 mb-2.5 shadow-md flex-row items-center justify-between">
          <View className="flex-col">
            <Text className="text-lg text-gray-800" testID="ad-text">
              Personalized Ads
            </Text>
            <Text className="text-xs text-gray-600" testID="ad-subtext">
              For a more tailored ad experience
            </Text>
          </View>
          <Switch
            className="ml-auto"
            trackColor={{ false: "#767577", true: "#A0D1E4" }}
            onValueChange={toggleAds}
            value={isAdsEnabled}
            testID="ad-switch"
          />
        </TouchableOpacity>
        <TouchableOpacity
          className="bg-white rounded-lg p-4 mb-2.5 shadow-md flex-row items-center justify-between"
          testID="location-button"
        >
          <View className="flex-col">
            <Text className="text-lg text-gray-800" testID="location-text">
              Share Live Location
            </Text>
            <Text className="text-xs text-gray-600" testID="location-subtext">
              Allow access to your location in case of emergency
            </Text>
          </View>
          <Switch
            className="ml-auto"
            trackColor={{ false: "#767577", true: "#A0D1E4" }}
            onValueChange={toggleLocation}
            value={isLocationEnabled}
            testID="location-switch"
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate("TermsAndConditions")}
          className="bg-white rounded-lg p-4 mb-2.5 shadow-md flex-row items-center justify-between"
          testID="tos-button"
        >
          <Text className="text-lg text-gray-800" testID="tos-text">
            Terms of Service
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default PrivacyScreen;
