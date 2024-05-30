import React from "react";
import { ScrollView, View, Text, SafeAreaView } from "react-native";
import { useTranslation } from "react-i18next";

const questionIds = [
  1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18,
] as const;

const FAQs = () => {
  const { t } = useTranslation();

  return (
    <SafeAreaView className="flex-1 bg-gray-100 px-5 py-2.5">
      <ScrollView>
        {questionIds.map((id) => (
          <View key={id} className="bg-white rounded-lg p-4 mb-2.5 shadow-md">
            <Text className="text-lg font-bold mb-1.5 text-gray-800">
              {t(`faq.${id}.question`)}
            </Text>
            <Text className="text-base text-gray-600">
              {t(`faq.${id}.answer`)}
            </Text>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

export default FAQs;
