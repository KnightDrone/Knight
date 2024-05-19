import React, { useEffect, useState } from "react";
import { HeaderBackButton } from "@react-navigation/elements";
import { DrawerParamList } from "../../types/DrawerParamList";
import { createDrawerNavigator } from "@react-navigation/drawer";

// Stack Navigation Screens
import { auth, User } from "../../services/Firebase";
import OrderMenu from "../../app/order/OrderMenu";
import MapOverview from "../../app/maps/Map";

// Drawer Navigation Screens
import Profile from "../../app/settings/ProfileScreen";
import Setting from "../../app/settings/Setting";
import OrderHistory from "../../app/order/OrderHistory";
import { CustomDrawerContent } from "./CustomDrawerContent";
import FirestoreManager from "../../services/FirestoreManager";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

const Drawer = createDrawerNavigator<DrawerParamList>();

interface UserDrawerProps {
  user?: User | null;
}

export function UserDrawer<UserDrawerProps>(user: UserDrawerProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [photoURL, setPhotoURL] = useState("");
  const [userId, setUserId] = useState("");
  const firestoreManager = new FirestoreManager();

  useEffect(() => {
    console.log("USer Drawer user", auth);
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
          }
        });
      }
    }
  }, []);

  return (
    <Drawer.Navigator
      initialRouteName="Map"
      drawerContent={(props) => (
        <CustomDrawerContent
          {...props}
          name={name}
          email={email}
          photoURL={photoURL}
          isOperator={false}
        />
      )}
      screenOptions={{
        drawerActiveTintColor: "black",
        drawerItemStyle: { marginVertical: 5 },
        drawerActiveBackgroundColor: "#f9f9f9",
        drawerInactiveTintColor: "grey",
        drawerInactiveBackgroundColor: "white",
        headerTintColor: "black",
      }}
    >
      <Drawer.Screen
        name="Map"
        options={{
          headerShown: false,
          drawerIcon: ({ color, size }) => (
            <Icon name="map" color={color} size={size} />
          ),
        }}
      >
        {(props: any) => <MapOverview {...props} />}
      </Drawer.Screen>
      <Drawer.Screen
        name="Profile"
        options={{
          drawerIcon: ({ color, size }) => (
            <Icon name="account" color={color} size={size} />
          ),
        }}
      >
        {(props: any) => {
          return <Profile {...props} />;
        }}
      </Drawer.Screen>
      <Drawer.Screen
        name="Settings"
        options={{
          drawerIcon: ({ color }) => (
            <Icon name="cog-outline" color={color} size={22} />
          ),
        }}
      >
        {(props: any) => <Setting {...props} />}
      </Drawer.Screen>
      <Drawer.Screen
        name="OrderMenu"
        options={{
          drawerLabel: "Order Menu",
          headerTransparent: true,
          headerTitle: "",
          drawerIcon: ({ color }) => (
            <Icon name="cart" color={color} size={22} />
          ),
        }}
      >
        {(props: any) => <OrderMenu {...props} />}
      </Drawer.Screen>

      <Drawer.Screen
        name="OrderHistory"
        options={{
          headerTransparent: true,
          drawerLabel: "Order History",
          headerTitle: "Order History",
          drawerIcon: ({ color }) => (
            <Icon name="history" color={color} size={22} />
          ),
        }}
      >
        {(props: any) => (
          <OrderHistory
            {...props}
            route={{ params: { historyOp: false, userId: userId } }}
          />
        )}
      </Drawer.Screen>
    </Drawer.Navigator>
  );
}
