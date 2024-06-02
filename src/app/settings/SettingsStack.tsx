import { createStackNavigator } from "@react-navigation/stack";
import Setting from "./Setting";
import ProfileScreen from "./ProfileScreen";
import FAQs from "./FAQs";
import TermsAndConditions from "./TermsAndConditions";
import PrivacyScreen from "./PrivacyScreen";
import NotificationsScreen from "./NotificationsScreen";
import { SettingsStackParamList } from "../../types/SettingsStackParamList";
import { View } from "react-native";

const Stack = createStackNavigator<SettingsStackParamList>();

interface SettingsStackProps {
  userId: string;
}

export const SettingsStack: React.FC<SettingsStackProps> = ({ userId }) => {
  return (
    <View className="flex-1 mt-10">
      <Stack.Navigator initialRouteName="Settings">
        <Stack.Screen
          name="Settings"
          component={Setting}
          initialParams={{ userId: userId }}
          options={{
            header: () => null,
          }}
        />
        <Stack.Screen
          name="Profile"
          component={ProfileScreen}
          initialParams={{ userId: userId }}
        />
        <Stack.Screen name="FAQs" component={FAQs} />
        <Stack.Screen
          name="TermsAndConditions"
          component={TermsAndConditions}
        />
        <Stack.Screen name="Privacy" component={PrivacyScreen} />
        <Stack.Screen name="Notifications" component={NotificationsScreen} />
      </Stack.Navigator>
    </View>
  );
};
