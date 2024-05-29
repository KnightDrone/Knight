import React from "react";
import { useTranslation } from "react-i18next";
import { ScrollView, View, Text, StyleSheet, SafeAreaView } from "react-native";

const questionIds = [
  1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18,
] as const;

const FAQs = () => {
  const { t } = useTranslation();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {questionIds.map((id) => (
          <View key={id} style={styles.faqItem}>
            <Text style={styles.question}>{t(`faq.${id}.question`)}</Text>
            <Text style={styles.answer}>{t(`faq.${id}.answer`)}</Text>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f7f7f7",
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  faqItem: {
    backgroundColor: "#ffffff",
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  question: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#333",
  },
  answer: {
    fontSize: 16,
    color: "#666",
  },
});

export default FAQs;
