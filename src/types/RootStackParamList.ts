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
  OrderPlaced: {
    orderId: string;
  };
  OrderHistory: {
    opOrders: boolean;
    userId: string;
  };
};
