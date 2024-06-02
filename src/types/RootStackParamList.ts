// Types for navigation handling

// Should navigation be handled in a separate file??
export type RootStackParamList = {
  Login: undefined;
  SignUp: undefined;
  OperatorSignup: undefined;
  ForgotPassword: undefined;
  OrderMenu: undefined;
  OrderPlaced: {
    orderId: string;
  };
  OrderHistory: {
    historyOp: boolean;
  };
  PendingOrders: undefined; // Added for PendingOrders
  OperatorDrawer: undefined;
  UserDrawer: undefined;
  ContentIndex: undefined;
  Guide1: undefined;
  Guide2: undefined;
  Guide3: undefined;
  Guide4: undefined;
  Guide5: undefined;
  Profile: {
    userId: string;
  };
  Setting: undefined;
  FAQs: undefined;
  TermsAndConditions: undefined;
  Privacy: undefined;
  Notifications: undefined;
  Map: undefined;
};
