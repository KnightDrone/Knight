import React, { useState } from "react";
import {
  FlatList,
  View,
  Text,
  StyleSheet,
  Button,
  TextInput,
  ActivityIndicator,
} from "react-native";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: "#fff",
  },
  userMessage: {
    alignSelf: "flex-end",
    backgroundColor: "#0044ee",
    borderRadius: 5,
    padding: 10,
    marginVertical: 5,
  },
  botMessage: {
    alignSelf: "flex-start",
    backgroundColor: "#f1f0f0",
    borderRadius: 5,
    padding: 10,
    marginVertical: 5,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginVertical: 10,
    marginRight: 10,
  },
  loadingIndicator: {
    marginVertical: 10,
  },
});

type Message = {
  id: string;
  text: string;
  sender: "user" | "assistant";
};

const ChatScreen = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      text: input,
      sender: "user",
    };

    setMessages([...messages, newMessage]);
    setInput("");
    setLoading(true);

    try {
      const completion = await openai.chat.completions.create({
        messages: [
          {
            role: "system",
            content: `
      You are a helpful assistant in a hiking app built by EPFL bachelor students. 
      Your primary role is to provide health tips related to hiking, answer questions about hiking gear, 
      and offer advice on hiking safety and best practices. Additionally, you can inform users about the various hiking items we sell. 
      Always maintain a friendly and supportive tone, and politely decline any requests not related to hiking or health tips. 
      If a user asks about purchasing items, provide information about our products and their benefits.
    `,
          },
          ...messages.map((msg) => ({ role: msg.sender, content: msg.text })),
          { role: "user", content: input },
        ],
        model: "gpt-3.5-turbo",
      });

      const responseMessage: Message = {
        id: Date.now().toString(),
        text: completion.choices[0].message.content as string,
        sender: "assistant",
      };

      setMessages((prevMessages) => [...prevMessages, responseMessage]);
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        testID="messages-list"
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View
            style={
              item.sender === "user" ? styles.userMessage : styles.botMessage
            }
          >
            <Text>{item.text}</Text>
          </View>
        )}
      />
      {loading && (
        <ActivityIndicator
          style={styles.loadingIndicator}
          testID="loading-indicator"
        />
      )}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={input}
          onChangeText={setInput}
          placeholder="Type a message..."
        />
        <Button title="Send" onPress={handleSend} />
      </View>
    </View>
  );
};

export default ChatScreen;
