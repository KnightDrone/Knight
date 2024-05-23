import React, { useEffect, useState } from "react";
import { DrawerParamList } from "../../types/DrawerParamList";
import { createDrawerNavigator } from "@react-navigation/drawer";

// Stack Navigation Screens
import { auth, User } from "../../services/Firebase";

// Drawer Navigation Screens
import Profile from "../../app/settings/ProfileScreen";
import Setting from "../../app/settings/Setting";
import OrderHistory from "../../app/order/OrderHistory";
import { CustomDrawerContent } from "./CustomDrawerContent";
import FirestoreManager from "../../services/FirestoreManager";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import OperatorMap from "../../app/maps/OperatorMap";
import PendingOrders from "../../app/order/PendingOrders";
import { reload } from "firebase/auth";
import FAQs from "../../app/settings/FAQs";
import TermsAndConditions from "../../app/settings/TermsAndConditions";

const Drawer = createDrawerNavigator<DrawerParamList>();

interface OperatorDrawerProps {
  user?: User | null;
}

export function OperatorDrawer<OperatorDrawerProps>(user: OperatorDrawerProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [photoURL, setPhotoURL] = useState("");
  const [userId, setUserId] = useState("");
  const [changePFP, setChangePFP] = useState(false);
  const firestoreManager = new FirestoreManager();

  const updateUserProfile = async (user: User) => {
    await reload(user);
    setUserId(user.uid);
    setName(user.displayName || "");
    setEmail(user.email || "");
    if (user.photoURL) {
      setPhotoURL(user.photoURL || "");
    } else {
      const userData = await firestoreManager.getUser(user.uid);
      if (userData) {
        setPhotoURL(userData.photoURL || "");
      }
    }
  };

  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      updateUserProfile(user);
    }
  }, [changePFP]);

  return (
    <Drawer.Navigator
      initialRouteName="Map"
      drawerContent={(props) => (
        <CustomDrawerContent
          {...props}
          name={name}
          email={email}
          photoURL={photoURL}
          isOperator={true}
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
          headerTransparent: true,
          headerTitle: "",
          drawerIcon: ({ color, size }) => (
            <Icon name="map" color={color} size={size} />
          ),
        }}
      >
        {(props: any) => <OperatorMap {...props} />}
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
          return (
            <Profile
              {...props}
              onSaveChanges={() => {
                setChangePFP(!changePFP);
              }}
            />
          );
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
            route={{ params: { historyOp: true, userId: userId } }}
          />
        )}
      </Drawer.Screen>
      <Drawer.Screen
        name="PendingOrders"
        options={{
          headerTransparent: true,
          drawerLabel: "Pending Orders",
          headerTitle: "Pending Orders",
          drawerIcon: ({ color }) => (
            <Icon name="cart" color={color} size={22} />
          ),
        }}
      >
        {(props: any) => <PendingOrders {...props} />}
      </Drawer.Screen>
      <Drawer.Screen
        name="FAQs"
        options={{
          drawerIcon: ({ color, size }) => (
            <Icon name="frequently-asked-questions" color={color} size={size} />
          ),
        }}
      >
        {(props: any) => {
          return <FAQs {...props} />;
        }}
      </Drawer.Screen>
      <Drawer.Screen
        name="Terms and Conditions"
        options={{
          drawerIcon: ({ color, size }) => (
            <Icon name="gavel" color={color} size={size} />
          ),
        }}
      >
        {(props: any) => {
          return <TermsAndConditions {...props} />;
        }}
      </Drawer.Screen>
    </Drawer.Navigator>
  );
}
