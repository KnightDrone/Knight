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
import ChatScreen from "../Knaight";
import { reload } from "firebase/auth";
import FAQs from "../../app/settings/FAQs";
import TermsAndConditions from "../../app/settings/TermsAndConditions";
import { SettingsStack } from "../../app/settings/SettingsStack";
import { ContentIndex } from "../../app/content/ContentIndex";
import { OfflineMapStack } from "../../app/maps/offline/OfflineStack";

const Drawer = createDrawerNavigator<DrawerParamList>();

interface UserDrawerProps {
  user?: User | null;
}

export function UserDrawer<UserDrawerProps>(user: UserDrawerProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [photoURL, setPhotoURL] = useState("");
  const [userId, setUserId] = useState("");
  const [changePFP, setChangePFP] = useState(false);
  const firestoreManager = new FirestoreManager();

  const updateUserProfile = async (user: User) => {
    await reload(user);
    setUserId(user.uid);
    setEmail(user.email || "");
    if (user.displayName) {
      setName(user.displayName || "");
    } else {
      const userData = await firestoreManager.getUser(user.uid);
      if (userData) {
        setName(userData.name || "");
      }
    }
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
        name="OfflineMap"
        options={{
          drawerLabel: "Offline Maps",
          headerTitle: "Offline Maps",
          drawerIcon: ({ color }) => (
            <Icon name="map-marker-off" color={color} size={22} />
          ),
        }}
        component={OfflineMapStack}
      />

      <Drawer.Screen
        name="SettingsStack"
        options={{
          drawerLabel: "Settings",
          header: () => null,
          drawerIcon: ({ color }) => (
            <Icon name="cog-outline" color={color} size={22} />
          ),
        }}
      >
        {(props: any) => (
          <SettingsStack {...props} route={{ params: { userId: userId } }} />
        )}
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
        {(props: any) => (
          <OrderMenu {...props} route={{ params: { userId: userId } }} />
        )}
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
      <Drawer.Screen
        name="Knaight"
        options={{
          drawerLabel: "knAIght",
          drawerIcon: ({ color }) => (
            <Icon name="shield-account" color={color} size={22} />
          ),
        }}
        component={ChatScreen}
      />
      <Drawer.Screen
        name="Hiking Guides"
        options={{
          drawerLabel: "Hiker's Guides",
          drawerIcon: ({ color }) => (
            <Icon name="hiking" color={color} size={22} />
          ),
        }}
        component={ContentIndex}
      />
    </Drawer.Navigator>
  );
}
