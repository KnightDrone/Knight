import React from "react";
import { useTranslation } from "react-i18next";
import { View, StyleSheet, TouchableOpacity, Text, Switch } from "react-native";

const PrivacyScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [isAdsEnabled, setIsAdsEnabled] = React.useState(true);
  const [isTrackingEnabled, setIsTrackingEnabled] = React.useState(true);
  const [isLocationEnabled, setIsLocationEnabled] = React.useState(true);

  const toggleAds = () => setIsAdsEnabled((previousState) => !previousState);
  const toggleTracking = () =>
    setIsTrackingEnabled((previousState) => !previousState);
  const toggleLocation = () =>
    setIsLocationEnabled((previousState) => !previousState);

  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      <View style={styles.boxes}>
        <TouchableOpacity style={styles.buttons} testID="data-button">
          <View style={styles.textView}>
            <Text style={styles.text} testID="data-text">
              {t("settings.privacy.data-tracking.title")}
            </Text>
            <Text style={styles.subtext} testID="data-subtext">
              {t("settings.privacy.data-tracking.description")}
            </Text>
          </View>
          <Switch
            trackColor={{ false: "#767577", true: "#A0D1E4" }}
            onValueChange={toggleTracking}
            value={isTrackingEnabled}
            testID="data-switch"
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.buttons}>
          <View style={styles.textView}>
            <Text style={styles.text} testID="ad-text">
              {t("settings.privacy.personalized-ads.title")}
            </Text>
            <Text style={styles.subtext} testID="ad-subtext">
              {t("settings.privacy.personalized-ads.description")}
            </Text>
          </View>
          <Switch
            trackColor={{ false: "#767577", true: "#A0D1E4" }}
            onValueChange={toggleAds}
            value={isAdsEnabled}
            testID="ad-switch"
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.buttons} testID="location-button">
          <View style={styles.textView}>
            <Text style={styles.text} testID="location-text">
              {t("settings.privacy.share-live-location.title")}
            </Text>
            <Text style={styles.subtext} testID="location-subtext">
              {t("settings.privacy.share-live-location.description")}
            </Text>
          </View>
          <Switch
            trackColor={{ false: "#767577", true: "#A0D1E4" }}
            onValueChange={toggleLocation}
            value={isLocationEnabled}
            testID="location-switch"
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate("TermsAndConditions")}
          style={styles.buttons}
          testID="tos-button"
        >
          <Text style={styles.text} testID="tos-text">
            {t("settings.privacy.terms-of-service")}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f7f7f7",
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  textView: {
    flexDirection: "column",
  },
  boxes: {
    marginTop: 100,
  },
  buttons: {
    backgroundColor: "#ffffff",
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  text: {
    fontSize: 18,
    color: "#333",
  },
  subtext: {
    fontSize: 12,
    color: "#666",
  },
});

export default PrivacyScreen;
