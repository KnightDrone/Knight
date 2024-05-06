import { act, fireEvent, render, waitFor } from "@testing-library/react-native";
import { Alert } from "react-native";
import { PayButton } from "../src/components/buttons/PayButton";
import { useStripe } from "@stripe/stripe-react-native";
import React from "react";
import { initI18n } from "../src/lang/i18n";

beforeEach(() => {
  process.env.EXPO_PUBLIC_STRIPE_ENDPOINT_URL = "https://example.com/stripe";

  Alert.alert = jest.fn();

  global.fetch = jest.fn().mockReturnValue(
    Promise.resolve({
      json: () =>
        Promise.resolve({
          paymentIntent: "pi_123",
          ephemeralKey: "ek_123",
          customer: "cus_123",
        }),
    })
  );

  initI18n();
});

describe("PayButton", () => {
  it("should do a payment", async () => {
    // Your test goes here

    const amount = 1000;
    const onSuccessfulPayment = jest.fn();
    const onError = jest.fn();

    const wrapper = render(
      <PayButton
        amount={amount}
        onSuccessfulPayment={onSuccessfulPayment}
        onError={onError}
      />
    );

    await waitFor(() => {
      expect(wrapper.getByText("CHF 10")).toBeTruthy();
    });

    const button = wrapper.getByText("CHF 10");
    expect(button).toBeTruthy();

    act(() => {
      fireEvent.press(button);
    });

    await waitFor(() => {
      expect(onSuccessfulPayment).toHaveBeenCalled();
    });
  });

  it("initPaymentSheet error", async () => {
    const amount = 1000;
    const onSuccessfulPayment = jest.fn();
    const onError = jest.fn();

    (useStripe as jest.Mock).mockReturnValue({
      initPaymentSheet: jest
        .fn()
        .mockReturnValue(Promise.resolve({ error: "Error" })),
    });

    const wrapper = render(
      <PayButton
        amount={amount}
        onSuccessfulPayment={onSuccessfulPayment}
        onError={onError}
      />
    );

    await waitFor(() => {
      expect(wrapper.getByText("Loading...")).toBeTruthy();
    });

    const button = wrapper.getByText("Loading...");
    expect(button).toBeTruthy();

    act(() => {
      fireEvent.press(button);
    });

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalled();
    });
  });

  it("open payment sheet error", async () => {
    const amount = 1000;
    const onSuccessfulPayment = jest.fn();
    const onError = jest.fn();

    (useStripe as jest.Mock).mockReturnValue({
      presentPaymentSheet: jest
        .fn()
        .mockReturnValue(Promise.resolve({ error: "Error" })),
      initPaymentSheet: jest
        .fn()
        .mockReturnValue(Promise.resolve({ error: null })),
    });

    const wrapper = render(
      <PayButton
        amount={amount}
        onSuccessfulPayment={onSuccessfulPayment}
        onError={onError}
      />
    );

    await waitFor(() => {
      expect(wrapper.getByText("Loading...")).toBeTruthy();
    });

    const button = wrapper.getByTestId("pay-button");
    expect(button).toBeTruthy();

    act(() => {
      fireEvent.press(button);
    });

    await waitFor(() => {
      expect(onError).toHaveBeenCalled();
    });
  });
});
