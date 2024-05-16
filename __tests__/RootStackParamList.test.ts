import { RootStackParamList } from "../src/types/RootStackParamList";

const mockRootStackParamList: RootStackParamList = {
  Login: undefined,
  SignUp: undefined,
  ForgotPassword: undefined,
  OrderMenu: {
    latitude: -999,
    longitude: -999,
  },
  Map: undefined,
  OrderPlaced: {
    orderId: "1",
  },
  OrderHistory: {
    userId: "123",
    historyOp: true,
  },
  PendingOrders: undefined,
  Settings: undefined,
  ProfileScreen: undefined,
};

describe("RootStackParamList", () => {
  it("should have the correct properties", () => {
    expect(mockRootStackParamList).toHaveProperty("OrderPlaced");
    expect(mockRootStackParamList).toHaveProperty("OrderHistory");
    expect(mockRootStackParamList).toHaveProperty("OrderMenu");

    expect(mockRootStackParamList).toHaveProperty("Login");
    expect(mockRootStackParamList.Login).toBeUndefined();
    expect(mockRootStackParamList).toHaveProperty("Map");
    expect(mockRootStackParamList.Map).toBeUndefined();
    expect(mockRootStackParamList).toHaveProperty("ForgotPassword");
    expect(mockRootStackParamList.ForgotPassword).toBeUndefined();
    expect(mockRootStackParamList).toHaveProperty("SignUp");
    expect(mockRootStackParamList.SignUp).toBeUndefined();
  });

  it("should have the correct types", () => {
    expect(mockRootStackParamList.OrderMenu).toHaveProperty("latitude");
    expect(mockRootStackParamList.OrderMenu).toHaveProperty("longitude");
    expect(mockRootStackParamList.OrderPlaced).toHaveProperty("orderId");
    expect(mockRootStackParamList.OrderHistory).toHaveProperty("opOrders");
    expect(mockRootStackParamList.OrderHistory).toHaveProperty("userId");
  });

  it("should have the correct values", () => {
    expect(mockRootStackParamList.OrderPlaced.orderId).toEqual("1");
    expect(mockRootStackParamList.OrderHistory.historyOp).toBeTruthy();
    expect(mockRootStackParamList.OrderMenu.latitude).toEqual(-999);
    expect(mockRootStackParamList.OrderMenu.longitude).toEqual(-999);
  });
});
