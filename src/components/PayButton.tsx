import {
  PaymentSheetError,
  StripeError,
  useStripe,
} from "@stripe/stripe-react-native";
import React, { useEffect, useState } from "react";
import { Button } from "../ui/Button";
import { Alert } from "react-native";

export function PayButton({
  amount,
  onSuccessfulPayment,
  onError,
}: {
  amount: number;
  onSuccessfulPayment: () => void;
  onError?: (error: StripeError<PaymentSheetError>) => void;
}) {
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const [loading, setLoading] = useState(true);

  const fetchPaymentSheetParams = async () => {
    if (!process.env.EXPO_PUBLIC_STRIPE_ENDPOINT_URL) {
      console.error(
        "Missing env var: EXPO_PUBLIC_STRIPE_ENDPOINT_URL, please set it as described in the env.example file."
      );
      throw new Error("Missing env var: EXPO_PUBLIC_STRIPE_ENDPOINT_URL");
    }

    const response = await fetch(
      `${process.env.EXPO_PUBLIC_STRIPE_ENDPOINT_URL}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ amount }),
      }
    );

    const { paymentIntent, ephemeralKey, customer } = await response.json();

    return {
      paymentIntent,
      ephemeralKey,
      customer,
    };
  };

  const initializePaymentSheet = async () => {
    setLoading(true);

    const { paymentIntent, ephemeralKey, customer } =
      await fetchPaymentSheetParams();

    const { error } = await initPaymentSheet({
      merchantDisplayName: "kNight Services Sarl.",
      customerId: customer,
      customerEphemeralKeySecret: ephemeralKey,
      paymentIntentClientSecret: paymentIntent,
      // Set `allowsDelayedPaymentMethods` to true if your business can handle payment
      // methods that complete payment after a delay, like SEPA Debit and Sofort.
      allowsDelayedPaymentMethods: true,
      defaultBillingDetails: {
        name: "Jane Doe",
      },
      returnURL: "knight://stripe-redirect",
    });
    if (!error) {
      setLoading(false);
    }
  };

  const openPaymentSheet = async () => {
    const { error } = await presentPaymentSheet();

    if (error) {
      if (onError) {
        onError(error);
      }
    } else {
      onSuccessfulPayment();
    }
  };

  useEffect(() => {
    initializePaymentSheet();
  }, []);

  return (
    <Button
      testID="pay-button"
      style="primary"
      text={loading ? "Loading..." : `CHF ${amount / 100}`}
      onPress={loading ? () => Alert.alert("Please wait") : openPaymentSheet}
    />
  );
}
