// Settings.tsx
import React, { useEffect, useState } from "react";
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Alert,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { auth } from "../../services/Firebase";
import { logoutUser } from "../../utils/Auth";
import FirestoreManager from "../../services/FirestoreManager";

interface SettingsProps {
  onItemPress?: (itemName: string) => void;
}

interface SettingsSection {
  title: string;
  data: SettingsItem[];
}

interface SettingsItem {
  name: string;
  icon: string;
  id?: string;
  action?: () => void;
}

const Settings: React.FC<SettingsProps> = ({
  onItemPress,
  navigation,
}: any) => {
  const firestoreManager = new FirestoreManager();
  const [role, setRole] = useState<string>("");

  const handleBecomeOperator = async () => {
    Alert.alert(
      "Confirm",
      "Are you sure you want to become an operator? You will be logged out.",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        { text: "OK", onPress: () => updateOperatorRole() },
      ],
      { cancelable: false }
    );
  };

  const updateOperatorRole = async () => {
    const user = auth.currentUser;
    if (user != null) {
      const userData = await firestoreManager.getUser(user.uid);
      if (userData && userData.role === "operator") {
        Alert.alert("Already an operator", "You are already an operator.");
      } else {
        firestoreManager.updateUser(user.uid, { role: "operator" });
        Alert.alert("Success", "You are now an operator.", [
          { text: "OK", onPress: () => logoutUser(navigation) },
        ]);
      }
    } else {
      Alert.alert("Error", "Could not find user.");
    }
  };

  const handleBecomeUser = async () => {
    Alert.alert(
      "Confirm",
      "Are you sure you want to become a user? You will be logged out.",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        { text: "OK", onPress: () => updateUserRole() },
      ],
      { cancelable: false }
    );
  };

  const updateUserRole = async () => {
    const user = auth.currentUser;
    if (user != null) {
      const userData = await firestoreManager.getUser(user.uid);
      if (userData && userData.role === "user") {
        Alert.alert("Already a user", "You are already a user.");
      } else {
        firestoreManager.updateUser(user.uid, { role: "user" });
        Alert.alert("Success", "You are now a user.", [
          { text: "OK", onPress: () => logoutUser(navigation) },
        ]);
      }
    } else {
      Alert.alert("Error", "Could not find user.");
    }
  };

  const handleLogout = () => {
    Alert.alert(
      "Confirm Logout",
      "Are you sure you want to logout?",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        { text: "OK", onPress: () => logoutUser(navigation) },
      ],
      { cancelable: false }
    );
  };

  useEffect(() => {
    const fetchRole = async () => {
      const user = auth.currentUser;
      if (user != null) {
        const userData = await firestoreManager.getUser(user.uid);
        if (userData) {
          setRole(userData.role);
        }
      }
    };
    fetchRole();
  }, []);

  const settingsSections: SettingsSection[] = [
    {
      title: "Account",
      data: [
        {
          name: "Edit profile",
          icon: "edit",
          action: () => navigation.navigate("ProfileScreen"),
        } as { name: string; icon: string; action: () => void },
        { name: "Security", icon: "security" },
        { name: "Notifications", icon: "notifications" },
        { name: "Privacy", icon: "privacy-tip" },
      ],
    },
    {
      title: "Support & About",
      data: [
        { name: "My Subscription", icon: "subscriptions" },
        { name: "Help & Support", icon: "help" },
        { name: "Terms and Policies", icon: "gavel" },
      ],
    },
    {
      title: "Actions",
      data: [
        { name: "Report a problem", icon: "report-problem" },
        { name: "Add account", icon: "person-add" },
        {
          name: `Become ${role == "operator" ? "a user" : "an operator"}`,
          id: "role-button",
          action: role == "operator" ? handleBecomeUser : handleBecomeOperator,
          icon: "work",
        },
        { name: "Log out", action: handleLogout, icon: "logout" },
      ],
    },
  ];

  return (
    <SafeAreaView style={styles.container} testID="settings-screen">
      <ScrollView>
        {settingsSections.map((section, index) => (
          <View key={index} style={styles.section}>
            <Text style={styles.header}>{section.title}</Text>
            {section.data.map((item, itemIndex) => (
              <TouchableOpacity
                key={itemIndex}
                style={styles.item}
                onPress={
                  item.action
                    ? item.action
                    : () =>
                        onItemPress
                          ? onItemPress(item.name)
                          : console.log(`${item.name} pressed`)
                }
                testID={item.id ? `${item.id}` : `${item.name}-button`}
              >
                <Icon
                  name={item.icon}
                  size={24}
                  style={styles.icon}
                  testID={`${item.icon}-icon`}
                />
                <Text style={styles.text}>{item.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9F9F9",
  },
  mainHeader: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    paddingVertical: 20,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 1.5,
    elevation: 3,
  },
  section: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
    backgroundColor: "#FFF",
  },
  header: {
    fontSize: 18,
    fontWeight: "bold",
    paddingVertical: 10,
    color: "#000",
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
  },
  icon: {
    color: "#757575",
    marginRight: 20,
  },
  text: {
    fontSize: 16,
    color: "#424242",
  },
});

export default Settings;
