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
  TouchableWithoutFeedback,
  Image,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { auth } from "../../services/Firebase";
import { logoutUser } from "../../utils/Auth";
import FirestoreManager from "../../services/FirestoreManager";
import { useTranslation } from "react-i18next";
import { langIcons, locales, useLocale } from "../../lang/i18n";

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
  const { t } = useTranslation();

  const [locale, setLocale] = useLocale();

  const handleBecomeOperator = async () => {
    Alert.alert(
      t("settings.popups.become-operator.title"),
      t("settings.popups.become-operator.message"),
      [
        {
          text: t("settings.popups.cancel"),
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        {
          text: t("settings.popups.confirm"),
          onPress: () => updateOperatorRole(),
        },
      ],
      { cancelable: false }
    );
  };

  const updateOperatorRole = async () => {
    const user = auth.currentUser;
    if (user != null) {
      const userData = await firestoreManager.getUser(user.uid);
      if (userData && userData.role === "operator") {
        Alert.alert(
          t("settings.popups.error"),
          t("settings.popups.become-operator.already-operator")
        );
      } else {
        firestoreManager.updateUser(user.uid, { role: "operator" });
        Alert.alert(
          t("settings.popups.success"),
          t("settings.popups.become-operator.success"),
          [{ text: "OK", onPress: () => logoutUser(navigation) }]
        );
      }
    } else {
      Alert.alert(
        t("settings.popups.error"),
        t("settings.popups.user-not-found")
      );
    }
  };

  const handleBecomeUser = async () => {
    Alert.alert(
      t("settings.popups.become-user.title"),
      t("settings.popups.become-user.message"),
      [
        {
          text: t("settings.popups.cancel"),
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        { text: t("settings.popups.confirm"), onPress: () => updateUserRole() },
      ],
      { cancelable: false }
    );
  };

  const updateUserRole = async () => {
    const user = auth.currentUser;
    if (user != null) {
      const userData = await firestoreManager.getUser(user.uid);
      if (userData && userData.role === "user") {
        Alert.alert(
          t("settings.popups.error"),
          t("settings.popups.become-user.already-user")
        );
      } else {
        firestoreManager.updateUser(user.uid, { role: "user" });
        Alert.alert(
          t("settings.popups.success"),
          t("settings.popups.become-user.success"),
          [{ text: "OK", onPress: () => logoutUser(navigation) }]
        );
      }
    } else {
      Alert.alert(
        t("settings.popups.error"),
        t("settings.popups.user-not-found")
      );
    }
  };

  const handleLogout = () => {
    Alert.alert(
      t("settings.popups.logout.title"),
      t("settings.popups.logout.message"),
      [
        {
          text: t("settings.popups.cancel"),
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        {
          text: t("settings.popups.confirm"),
          onPress: () => logoutUser(navigation),
        },
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
      title: t("settings.account.title"),
      data: [
        {
          name: t("settings.account.subsections.edit-profile"),
          icon: "edit",
          action: () => navigation.navigate("Profile"),
        } as { name: string; icon: string; action: () => void },
        {
          name: t("settings.account.subsections.notifications"),
          icon: "notifications",
          action: () => {
            navigation.navigate("Notifications");
          },
        },
        {
          name: t("settings.account.subsections.privacy"),
          icon: "privacy-tip",
          action: () => {
            navigation.navigate("Privacy");
          },
        },
      ],
    },
    {
      title: t("settings.support.title"),
      data: [
        {
          name: t("settings.support.subsections.faq"),
          icon: "help",
          action: () => navigation.navigate("FAQs"),
        },
        {
          name: t("settings.support.subsections.tnc"),
          icon: "gavel",
          action: () => navigation.navigate("TermsAndConditions"),
        },
      ],
    },
    {
      title: t("settings.actions.title"),
      data: [
        {
          name:
            role == "user"
              ? t("settings.actions.actions.become-operator")
              : t("settings.actions.actions.become-user"),
          id: "role-button",
          action: role == "operator" ? handleBecomeUser : handleBecomeOperator,
          icon: "work",
        },
        {
          name: t("settings.actions.actions.logout"),
          action: handleLogout,
          icon: "logout",
        },
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

        <View className="flex flex-row items-center justify-center gap-4 mt-12">
          {locales.map((lang) => (
            <TouchableWithoutFeedback
              key={lang}
              onPress={() => setLocale(lang)}
            >
              <Image
                key={lang}
                className={`w-6 h-6 transition-opacity ${locale != lang && "opacity-40"}`}
                source={langIcons[lang]}
              />
            </TouchableWithoutFeedback>
          ))}
        </View>
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
    paddingTop: 30,
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
