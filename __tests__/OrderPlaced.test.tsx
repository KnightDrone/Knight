import React from "react";
import { render } from "@testing-library/react-native";
import OrderPlaced from "../src/app/OrderPlaced";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

const Stack = createStackNavigator();
const OrderPlacedTest = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={"OrderPlaced"}>
        <Stack.Screen name="OrderPlaced">
          {(props) => <OrderPlaced {...props} />}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
};

describe("OrderPlaced", () => {
  it("renders the order placed message", () => {
    // Render the component
    const { getByText } = render(<OrderPlacedTest />);

    const orderPlacedMessage = getByText("Your order has been placed.");
    expect(orderPlacedMessage).toBeTruthy();
  });

  it("renders the arrival time", () => {
    // Render the component
    const { getByText } = render(<OrderPlacedTest />);

    const arrivalTime = getByText("Arriving at 12:15");
    expect(arrivalTime).toBeTruthy();
  });

  it("renders the order summary", () => {
    // Render the component
    const { getByText } = render(<OrderPlacedTest />);

    const orderSummary = getByText("Order summary");
    expect(orderSummary).toBeTruthy();
  });
});
