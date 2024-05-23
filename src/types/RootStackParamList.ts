// Types for navigation handling

import { StackNavigationProp } from "@react-navigation/stack";
import { Item } from "./Item";
import { Order, OrderLocation } from "./Order";

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
    orderId: Order;
  };
  OrderHistory: {
    historyOp: boolean;
  };
  PendingOrders: undefined; // Added for PendingOrders
  OperatorMap: undefined;
  OperatorOrderPlaced: {
    orderId: Order;
  };
  OperatorDrawer: undefined;
  UserDrawer: undefined;
};
