import React from "react";
import { ScrollView, View, Text, StyleSheet, SafeAreaView } from "react-native";

const FAQs = () => {
  const faqs = [
    {
      question: "What is Wild Knight?",
      answer:
        "Wild Knight is an app designed for mountaineers and outdoor enthusiasts to request essential items such as first aid kits, power banks, and other small products. These items are delivered quickly via drone, typically within a minute.",
    },
    {
      question: "How does Wild Knight work?",
      answer:
        "Users can open the Wild Knight app, select the items they need from the available list, and place an order. A nearby drone will then deliver the requested items to the user's location.",
    },
    {
      question: "What items can I order through Wild Knight?",
      answer:
        "You can order various essential items including first aid kits, power banks, snacks, water, and other small, portable products that may be useful during mountaineering or other outdoor activities.",
    },
    {
      question: "How do I place an order?",
      answer:
        "To place an order, open the Wild Knight app, browse the available items, add the desired products to your cart, and complete the checkout process. The app will then send a drone to deliver your items to your current location.",
    },
    {
      question: "How quickly can I expect my order to arrive?",
      answer:
        "Wild Knight aims to deliver orders within one minute, thanks to our fast and efficient drone delivery system.",
    },
    {
      question: "What should I do if my order doesn't arrive?",
      answer:
        "If your order doesn't arrive within the expected timeframe, you can contact our customer support through the app. We will investigate the issue and ensure that your items are delivered as quickly as possible.",
    },
    {
      question: "Is it safe to use drones for delivery in mountainous areas?",
      answer:
        "Yes, our drones are equipped with advanced navigation and obstacle-avoidance technologies to ensure safe and reliable delivery, even in challenging terrain.",
    },
    {
      question: "What happens if the weather is bad?",
      answer:
        "While our drones are designed to operate in various weather conditions, extremely severe weather may affect delivery times. In such cases, we will notify you of any delays and ensure your items are delivered as soon as it is safe to do so.",
    },
    {
      question: "How do I know if a drone can reach my location?",
      answer:
        "Wild Knight uses advanced GPS and mapping technologies to determine if a drone can safely reach your location. If there are any issues, the app will notify you and suggest alternative solutions.",
    },
    {
      question: "How do I pay for my order?",
      answer:
        "You can pay for your order directly through the Wild Knight app using a variety of payment methods, including credit/debit cards, mobile wallets, and other secure payment options.",
    },
    {
      question: "Are there any additional delivery charges?",
      answer:
        "Delivery charges may vary depending on your location and the items ordered. The total cost, including any delivery fees, will be displayed at checkout before you place your order.",
    },
    {
      question: "How do I create an account?",
      answer:
        "To create an account, download the Wild Knight app, open it, and follow the registration prompts. You will need to provide basic information such as your name, email address, and phone number.",
    },
    {
      question: "What if I forget my password?",
      answer:
        'If you forget your password, you can reset it by clicking the "Forgot Password" link on the login screen. Follow the instructions to receive a password reset link via email.',
    },
    {
      question: "How can I contact customer support?",
      answer:
        'You can contact customer support through the Wild Knight app by navigating to the "Support" or "Help" section. Our support team is available to assist you with any issues or questions you may have.',
    },
    {
      question: "Can I track the drone during delivery?",
      answer:
        "Yes, the Wild Knight app provides real-time tracking so you can monitor the drone's progress and estimated arrival time.",
    },
    {
      question: "Can I cancel my order?",
      answer:
        'Orders can be canceled within a certain timeframe after placement. If you need to cancel an order, go to the "Orders" section in the app and follow the cancellation instructions. Please note that cancellations may not be possible once the drone is en route.',
    },
    {
      question: "What areas does Wild Knight serve?",
      answer:
        "Wild Knight is currently available in select mountainous regions. We are continually expanding our service areas, so stay tuned for updates on new locations.",
    },
    {
      question:
        "Are there any limitations on the weight or size of items that can be delivered?",
      answer:
        "Yes, due to the capabilities of our drones, there are limitations on the weight and size of items that can be delivered. The app will automatically restrict items that exceed these limits.",
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {faqs.map((faq, index) => (
          <View key={index} style={styles.faqItem}>
            <Text style={styles.question}>{faq.question}</Text>
            <Text style={styles.answer}>{faq.answer}</Text>
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
