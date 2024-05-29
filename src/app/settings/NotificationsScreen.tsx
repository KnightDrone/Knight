import React from "react";
import { View, StyleSheet, TouchableOpacity, Text, Switch } from "react-native";

const NotificationsScreen = () => {
  const [isOffersEnabled, setIsOffersEnabled] = React.useState(true);
  const [isOrderEnabled, setIsOrderEnabled] = React.useState(true);
  const [isItemEnabled, setIsItemEnabled] = React.useState(true);

  const toggleOffers = () =>
    setIsOffersEnabled((previousState) => !previousState);
  const toggleOrder = () =>
    setIsOrderEnabled((previousState) => !previousState);
  const toggleItem = () => setIsItemEnabled((previousState) => !previousState);

  return (
    <View style={styles.container}>
      <View style={styles.boxes}>
        <TouchableOpacity style={styles.buttons} testID="order-button">
          <View style={styles.textView}>
            <Text style={styles.text} testID="order-text">
              Order Tracking
            </Text>
            <Text style={styles.subtext} testID="order-subtext">
              Get periodic updates on your order
            </Text>
          </View>
          <Switch
            trackColor={{ false: "#767577", true: "#A0D1E4" }}
            onValueChange={toggleOrder}
            value={isOrderEnabled}
            testID="order-switch"
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.buttons}>
          <View style={styles.textView}>
            <Text style={styles.text} testID="offers-text">
              Discounts and Offers
            </Text>
            <Text style={styles.subtext} testID="offers-subtext">
              Get notified when there are discounts and offers
            </Text>
          </View>
          <Switch
            trackColor={{ false: "#767577", true: "#A0D1E4" }}
            onValueChange={toggleOffers}
            value={isOffersEnabled}
            testID="offers-switch"
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.buttons} testID="item-button">
          <View style={styles.textView}>
            <Text style={styles.text} testID="item-text">
              New Items
            </Text>
            <Text style={styles.subtext} testID="item-subtext">
              Get notified when there are new items available
            </Text>
          </View>
          <Switch
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

export default NotificationsScreen;
