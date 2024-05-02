import { Item } from "../src/types/Item";
import { RootStackParamList } from "../src/types/RootStackParamList";

const orderedItem: Item = new Item(1, "item 1", "description", 0, 0, 1.99);
const mockRootStackParamList: RootStackParamList = {
  Login: undefined,
  SignUp: undefined,
  ForgotPassword: undefined,
  OrderMenu: undefined,
  Map: undefined,
  OrderPlaced: {
    orderedItem: orderedItem,
    placedAt: Date.now(),
    userLocation: "123 Main St",
  },
  OrderHistory: {
    userId: "123",
    opOrders: true,
  },
};

describe("RootStackParamList", () => {
  it("should have the correct properties", () => {
    expect(mockRootStackParamList).toHaveProperty("OrderPlaced");
    expect(mockRootStackParamList).toHaveProperty("OrderHistory");

    expect(mockRootStackParamList).toHaveProperty("Login");
    expect(mockRootStackParamList.Login).toBeUndefined();
    expect(mockRootStackParamList).toHaveProperty("Map");
    expect(mockRootStackParamList.Map).toBeUndefined();
    expect(mockRootStackParamList).toHaveProperty("ForgotPassword");
    expect(mockRootStackParamList.ForgotPassword).toBeUndefined();
    expect(mockRootStackParamList).toHaveProperty("SignUp");
    expect(mockRootStackParamList.SignUp).toBeUndefined();
    expect(mockRootStackParamList).toHaveProperty("OrderMenu");
    expect(mockRootStackParamList.OrderMenu).toBeUndefined();
  });

  it("should have the correct types", () => {
    expect(mockRootStackParamList.OrderPlaced).toHaveProperty("orderedItem");
    expect(mockRootStackParamList.OrderPlaced).toHaveProperty("placedAt");
    expect(mockRootStackParamList.OrderPlaced).toHaveProperty("userLocation");
    expect(mockRootStackParamList.OrderHistory).toHaveProperty("opOrders");
    expect(mockRootStackParamList.OrderHistory).toHaveProperty("userId");
  });

  it("should have the correct values", () => {
    expect(mockRootStackParamList.OrderPlaced.orderedItem).toBeInstanceOf(Item);
    expect(mockRootStackParamList.OrderPlaced.userLocation).toEqual(
      "123 Main St"
    );
    expect(mockRootStackParamList.OrderHistory.opOrders).toBeTruthy();
  });
});
