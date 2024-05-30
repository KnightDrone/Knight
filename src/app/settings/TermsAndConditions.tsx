import React from "react";
import { ScrollView, View, Text, SafeAreaView } from "react-native";
import { useTranslation } from "react-i18next";

const TermsAndConditions = () => {
  const { t } = useTranslation();
  return (
    <SafeAreaView className="flex-1 bg-gray-100 px-5 py-2.5">
      <ScrollView>
        <View className="bg-white rounded-lg p-4 shadow-md">
          <Text className="text-base text-gray-600 leading-6">
            {t("terms-and-conditions")}
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default TermsAndConditions;
