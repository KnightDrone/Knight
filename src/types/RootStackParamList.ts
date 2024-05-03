// Types for navigation handling

import { Item } from "./Item";

// Should navigation be handled in a separate file??
export type RootStackParamList = {
  Login: undefined;
  SignUp: undefined;
  ForgotPassword: undefined;
  OrderMenu: undefined;
  Map: undefined;
  Settings: undefined;
  OrderPlaced: {
    orderedItem: Item;
    placedAt: number;
    userLocation: string;
  };
  OrderHistory: {
    historyOp: boolean;
    userId: string;
  };
  PendingOrders: undefined; // Added for PendingOrders
};
