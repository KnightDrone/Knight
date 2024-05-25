// Types for navigation handling

// Should navigation be handled in a separate file??
export type RootStackParamList = {
  Login: undefined;
  SignUp: undefined;
  OperatorSignup: undefined;
  ForgotPassword: undefined;
  OrderMenu: {
    latitude: number;
    longitude: number;
  };
  OrderPlaced: {
    orderId: string;
  };
  OrderHistory: {
    historyOp: boolean;
  };
  PendingOrders: undefined; // Added for PendingOrders
  OperatorDrawer: undefined;
  UserDrawer: undefined;
};
