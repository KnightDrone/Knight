import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import { Order } from "../types/Order";

const formatDate = (date: Date) => {
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const day = date.getDate();
  const monthIndex = date.getMonth();
  const year = date.getFullYear();

  return `${monthNames[monthIndex]} ${day}, ${year}`;
};

const OrderCard = ({ order }: { order: Order }) => {
  const item = order.getItem();
  // The parameters that we actually care to display in card
  const name = item.getName();
  const orderDate = order.getOrderDate();
  const price = item.getPrice();
  const locName = order.getOperatorLocationName();
  return (
    <View style={styles.cardContainer}>
      <View style={styles.imageContainer}>
        <Image
          source={require("../../assets/icons/calendar_icon.png")}
          style={styles.image}
        />
      </View>
      <View style={styles.detailsContainer}>
        <Text style={styles.title}>{name}</Text>
        <Text style={styles.subTitle}>{formatDate(orderDate)}</Text>
        <Text style={styles.price}>${price} CHF</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: "#fff",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
    elevation: 3,
    margin: 10,
    flexDirection: "row",
  },
  imageContainer: {
    flex: 1,
    padding: 10,
  },
  image: {
    width: "100%",
    height: 100,
    resizeMode: "contain",
  },
  detailsContainer: {
    flex: 2,
    padding: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
  },
  subTitle: {
    fontSize: 14,
    color: "#888",
  },
  price: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 5,
  },
  status: {
    fontSize: 14,
    color: "#ccc",
    marginTop: 5,
  },
});

export default OrderCard;
