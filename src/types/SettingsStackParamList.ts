// Types for navigation handling

// Should navigation be handled in a separate file??
export type SettingsStackParamList = {
  Profile: {
    userId: string;
  };
  Settings: {
    userId: string;
  };
  FAQs: undefined;
  Privacy: undefined;
  Notifications: undefined;
  TermsAndConditions: undefined;
};
