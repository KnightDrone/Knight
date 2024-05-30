import React from "react";
import { ScrollView, View, Text, SafeAreaView } from "react-native";

const TermsAndConditions = () => {
  const termsAndConditions = `
    Effective Date: September 1, 2024

    1. Acceptance of Terms

    By accessing and using the Wild Knight app, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by these terms, please do not use this app.

    2. Changes to Terms

    Wild Knight reserves the right to modify these terms at any time. We will notify you of any changes by posting the new terms on the app and updating the effective date. Your continued use of the app after any changes constitutes your acceptance of the new terms.

    3. Use of the App

    You agree to use the Wild Knight app only for lawful purposes and in accordance with these terms. You agree not to use the app:
    - In any way that violates any applicable federal, state, local, or international law or regulation.
    - For the purpose of exploiting, harming, or attempting to exploit or harm minors in any way by exposing them to inappropriate content or otherwise.
    - To transmit, or procure the sending of, any advertising or promotional material without our prior written consent.

    4. Account Security

    You are responsible for maintaining the confidentiality of your account and password and for restricting access to your device. You agree to accept responsibility for all activities that occur under your account or password.

    5. Orders and Payments

    All orders placed through the Wild Knight app are subject to our acceptance. We reserve the right to refuse or cancel any order for any reason. You agree to provide current, complete, and accurate purchase and account information for all purchases made via our app.

    6. Delivery

    Wild Knight will make every effort to deliver your items within the promised timeframe. However, we are not liable for any delays or failure to deliver due to circumstances beyond our control.

    7. Intellectual Property Rights

    The app and its original content, features, and functionality are and will remain the exclusive property of Wild Knight and its licensors. The app is protected by copyright, trademark, and other laws of both the United States and foreign countries.

    8. Limitation of Liability

    In no event shall Wild Knight, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from (i) your use or inability to use the app; (ii) any unauthorized access to or use of our servers and/or any personal information stored therein; and (iii) any bugs, viruses, trojan horses, or the like that may be transmitted to or through our app by any third party.

    9. Governing Law

    These terms shall be governed and construed in accordance with the laws of Switzerland, without regard to its conflict of law provisions.

    10. Contact Us

    If you have any questions about these Terms and Conditions, please contact us at yourknightsolution.com.

    Thank you for using Wild Knight!
  `;

  return (
    <SafeAreaView className="flex-1 bg-gray-100 px-5 py-2.5">
      <ScrollView>
        <View className="bg-white rounded-lg p-4 shadow-md">
          <Text className="text-base text-gray-600 leading-6">
            {termsAndConditions}
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default TermsAndConditions;
