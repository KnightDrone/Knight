import { createStackNavigator } from "@react-navigation/stack";
import Setting from "./Setting";
import ProfileScreen from "./ProfileScreen";
import FAQs from "./FAQs";
import TermsAndConditions from "./TermsAndConditions";
import PrivacyScreen from "./PrivacyScreen";
import NotificationsScreen from "./NotificationsScreen";
import { NavigationContainer } from "@react-navigation/native";
import { SettingsStackParamList } from "../../types/SettingsStackParamList";

const { Navigator, Screen, Group } =
  createStackNavigator<SettingsStackParamList>();

const Stack = createStackNavigator<SettingsStackParamList>();

interface SettingsStackProps {
  userId: string;
}

export const SettingsStack: React.FC<SettingsStackProps> = ({ userId }) => {
  return (
    <Stack.Navigator initialRouteName="Settings">
      <Stack.Screen
        name="Settings"
        component={Setting}
        initialParams={{ userId: userId }}
      />
      <Stack.Screen
        name="Profile"
        component={ProfileScreen}
        initialParams={{ userId: userId }}
      />
      <Stack.Screen name="FAQs" component={FAQs} />
      <Stack.Screen name="TermsAndConditions" component={TermsAndConditions} />
      <Stack.Screen name="Privacy" component={PrivacyScreen} />
      <Stack.Screen name="Notifications" component={NotificationsScreen} />
    </Stack.Navigator>
  );
};
