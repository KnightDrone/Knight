// Types for navigation handling

import { StackNavigationProp } from "@react-navigation/stack";
import { Item } from "./Item";
import { Order, OrderLocation } from "./Order";

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
    orderId: Order;
  };
  OrderHistory: {
    historyOp: boolean;
    userId: string;
  };
  PendingOrders: undefined; // Added for PendingOrders
  OperatorMap: undefined;
  OperatorOrderPlaced: {
    orderId: Order;
  };
};
