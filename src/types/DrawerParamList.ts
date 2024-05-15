export type DrawerParamList = {
  Map: undefined;
  Profile: {
    userId: string;
  };
  Settings: {
    userId: string;
  };
  OrderHistory: {
    historyOp: boolean;
    userId: string;
  };
  OrderMenu: {
    latitude: number;
    longitude: number;
  };
};
