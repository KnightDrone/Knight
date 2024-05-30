// Settings.tsx
import React, { useEffect, useState } from "react";
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  Alert,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { auth } from "../../services/Firebase";
import { logoutUser } from "../../utils/Auth";
import FirestoreManager from "../../services/FirestoreManager";

interface SettingsProps {
  onItemPress?: any;
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
          action: () => navigation.navigate("Profile"),
        } as { name: string; icon: string; action: () => void },
        {
          name: "Notifications",
          icon: "notifications",
          action: () => {
            navigation.navigate("Notifications");
          },
        },
        {
          name: "Privacy",
          icon: "privacy-tip",
          action: () => {
            navigation.navigate("Privacy");
          },
        },
      ],
    },
    {
      title: "Support & About",
      data: [
        {
          name: "FAQs",
          icon: "help",
          action: () => navigation.navigate("FAQs"),
        },
        {
          name: "TermsAndConditions",
          icon: "gavel",
          action: () => navigation.navigate("TermsAndConditions"),
        },
      ],
    },
    {
      title: "Actions",
      data: [
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
    <SafeAreaView className="flex-1 bg-gray-100" testID="settings-screen">
      <ScrollView>
        {settingsSections.map((section, index) => (
          <View
            key={index}
            className="px-5 pt-7.5 pb-5 border-b border-gray-300 bg-white"
          >
            <Text className="text-lg font-bold py-2.5 text-black">
              {section.title}
            </Text>
            {section.data.map((item, itemIndex) => (
              <TouchableOpacity
                key={itemIndex}
                className="flex-row items-center py-2.5"
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
                <Icon name={item.icon} size={24} testID={`${item.icon}-icon`} />
                <Text className="ml-3 text-base text-gray-700">
                  {item.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

export default Settings;
