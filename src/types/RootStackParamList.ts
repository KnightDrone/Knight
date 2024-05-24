// Types for navigation handling

import { Item } from "./Item";
import { OrderLocation } from "./Order";

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
  ContentIndex: undefined;
  Guide1: undefined;
  Guide2: undefined;
  Guide3: undefined;
  Guide4: undefined;
  Guide5: undefined;
};
