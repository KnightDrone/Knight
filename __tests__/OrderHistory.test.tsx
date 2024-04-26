import React from "react";
import { render } from "@testing-library/react-native";
import OrderHistory from "../src/app/OrderHistory";

describe("OrderHistory Component", () => {
  it("renders without crashing", () => {
    render(<OrderHistory />);
  });
});
