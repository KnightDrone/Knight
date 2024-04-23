// Types for navigation handling

import { Item } from "./Item";

// Should navigation be handled in a separate file??
export type RootStackParamList = {
  Login: undefined;
  SignUp: undefined;
  ForgotPassword: undefined;
  OrderMenu: undefined;
  Map: undefined;
  OrderPlaced: {
    orderedItem: Item;
    placedAt: Date;
    userLocation: string;
  };
  OrderHistory: {
    opOrders: boolean;
  };
};
