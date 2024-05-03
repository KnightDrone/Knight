// Settings.tsx
import React from "react";
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
  action?: () => void;
}

const Settings: React.FC<SettingsProps> = ({
  onItemPress,
  navigation,
}: any) => {
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
        { text: "OK", onPress: () => logoutUser() },
      ],
      { cancelable: false }
    );
  };

  const logoutUser = async () => {
    try {
      await auth.signOut();
      navigation.reset({
        index: 0,
        routes: [{ name: "Login" }],
      });
    } catch (error) {
      Alert.alert("Logout Failed", "Unable to logout at this time.");
    }
  };
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
        { name: "Log out", action: handleLogout, icon: "logout" },
      ],
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
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
                testID={`${item.name}-button`}
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
