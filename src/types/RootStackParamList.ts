// Types for navigation handling

import { Item } from "./Item";
import { OrderLocation } from "./Order";

// Should navigation be handled in a separate file??
export type RootStackParamList = {
  Login: undefined;
  SignUp: undefined;
  ForgotPassword: undefined;
  OrderMenu: {
    latitude: number;
    longitude: number;
  };
  Map: undefined;
  Settings: undefined;
  ProfileScreen: undefined;
  OrderPlaced: {
    orderId: string;
  };
  OrderHistory: {
    historyOp: boolean;
    userId: string;
  };
  PendingOrders: undefined;
  OperatorMap: undefined;
};
