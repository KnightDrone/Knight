import React from "react";
import { useTranslation } from "react-i18next";
import { ScrollView, View, Text, StyleSheet, SafeAreaView } from "react-native";

const TermsAndConditions = () => {
  const { t } = useTranslation();
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.section}>
          <Text style={styles.content}>{t("terms-and-conditions")}</Text>
        </View>
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
  section: {
    backgroundColor: "#ffffff",
    borderRadius: 8,
    padding: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
    textAlign: "center",
  },
  content: {
    fontSize: 16,
    color: "#666",
    lineHeight: 24,
  },
});

export default TermsAndConditions;
