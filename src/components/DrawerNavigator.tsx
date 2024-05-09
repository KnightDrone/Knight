import React, { useContext } from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { useEffect, useState } from "react";
import { FirestoreManager } from "../services/FirestoreManager";
import { CustomDrawerContent } from "./CustomDrawerContent";
import { auth } from "../services/Firebase";
import OrderHistory from "../app/order/OrderHistory";
import Settings from "../app/settings/Settings";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import MapOverview from "../app/Map";
import ProfileScreen from "../app/settings/ProfileScreen";
import { Text } from "react-native";

export const Drawer = createDrawerNavigator();
export const DrawerNavigator = (props: any) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [photoURL, setPhotoURL] = useState("");
  const [isOperator, setIsOperator] = useState(false);
  const [userId, setUserId] = useState("");
  const firestoreManager = new FirestoreManager();

  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      setUserId(user.uid);
      setName(user.displayName || "");
      setEmail(user.email || "");
      if (user.photoURL) {
        setPhotoURL(user.photoURL || "");
      } else {
        firestoreManager.getUser(user.uid).then((user) => {
          if (user) {
            setPhotoURL(user.photoURL || "");
            setIsOperator(user.role === "operator");
          }
        });
      }
    }
  }, []);

  return (
    <Drawer.Navigator
      drawerContent={(props) => (
        <CustomDrawerContent
          {...props}
          name={name}
          email={email}
          photoURL={photoURL}
        />
      )}
      screenListeners={({ navigation }) => ({
        drawerItemPress: (e) => {
          console.log("drawerItemPress", e);
          if (e.target?.includes("Order History")) {
            navigation.setParams({
              historyOp: isOperator,
              userId: userId,
            });
          }
        },
      })}
      initialRouteName="Main Map"
      screenOptions={{
        drawerActiveTintColor: "black",
        drawerItemStyle: { marginVertical: 5 },
        drawerActiveBackgroundColor: "#f9f9f9",
        drawerInactiveTintColor: "grey",
        drawerInactiveBackgroundColor: "white",
        headerTintColor: "black",
        lazy: true,
        overlayColor: "transparent",
      }}
    >
      <Drawer.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          drawerIcon: ({ color, size }) => (
            <Icon name="account" color={color} size={size} />
          ),
        }}
      />
      <Drawer.Screen
        name="Main Map"
        options={{
          headerTitle: "",
          headerTransparent: true,
          drawerIcon: ({ color, size }) => (
            <Icon name="map" color={color} size={size} />
          ),
        }}
        component={MapOverview}
      />
      <Drawer.Screen
        name="Order History"
        options={{
          drawerIcon: ({ color }) => (
            <Icon name="history" color={color} size={22} />
          ),
        }}
        initialParams={{
          userId: userId,
          historyOp: isOperator,
        }}
      >
        {(props: any) => <OrderHistory {...props} />}
      </Drawer.Screen>
      <Drawer.Screen
        name="Settings"
        component={Settings}
        options={{
          drawerIcon: ({ color }) => (
            <Icon name="cog-outline" color={color} size={22} />
          ),
        }}
      />
    </Drawer.Navigator>
  );
};
