import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { useFonts } from "expo-font";
import KaiseiRegular from "../../assets/fonts/KaiseiDecol-Regular.ttf";
import { Item } from "../types/Item";
import Icon from "react-native-vector-icons/FontAwesome";
import { BlurView } from "expo-blur";

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
  const [fontsLoaded] = useFonts({
    "Kaisei-Regular": KaiseiRegular,
  });

  if (!isVisible) {
    return null;
  }

  return (
    <View style={styles.visibleCard}>
      <BlurView intensity={10} style={styles.blurContainer} testID="blur-view">
        <View style={styles.card}>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={handleClose}
            testID="close-button"
          >
            <Icon name="close" size={20} color="#000" testID="close-icon" />
          </TouchableOpacity>
          <Text style={styles.title}>{item.getName()}</Text>
          <Text style={styles.description}>{item.getDescription()}</Text>
          <Image
            style={styles.image}
            source={item.getImage()}
            testID="item-image"
          />
          <View style={styles.bottomRow}>
            <Text style={styles.price} testID="price-text">
              Price: {item.getPrice()} CHF
            </Text>
            <TouchableOpacity
              style={styles.orderButton}
              onPress={handleOrder}
              testID="order-button"
            >
              <Text style={styles.orderButtonText}>Order</Text>
            </TouchableOpacity>
          </View>
        </View>
      </BlurView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  visibleCard: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1,
    elevation: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  blurContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center", // Ensure the content of BlurView is also centered
    alignItems: "center", // This will center the card horizontally and vertically
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    width: "90%",
    height: "65%",
    alignSelf: "center",
  },
  closeButton: {
    alignSelf: "flex-start",
  },
  closeButtonText: {
    fontFamily: "Kaisei-Regular",
    fontSize: 18,
  },
  title: {
    fontFamily: "Kaisei-Regular",
    fontSize: 24,
    fontWeight: "bold",
    marginVertical: 8,
  },
  description: {
    fontFamily: "Kaisei-Regular",
    fontSize: 16,
    textAlign: "center",
    marginVertical: 8,
  },
  image: {
    width: 200,
    height: 200,
    marginVertical: 8,
  },
  price: {
    fontFamily: "Kaisei-Regular",
    fontSize: 18,
    marginVertical: 8,
  },
  orderButton: {
    backgroundColor: "blue",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
    marginVertical: 8,
  },
  orderButtonText: {
    fontFamily: "Kaisei-Regular",
    fontSize: 18,
    color: "#fff",
    textAlign: "center",
  },
  bottomRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
  },
});

export default ItemCard;
