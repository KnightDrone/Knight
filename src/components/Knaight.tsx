import React, { useState, useRef, useEffect } from "react";
import {
  FlatList,
  View,
  Text,
  StyleSheet,
  TextInput,
  ActivityIndicator,
  Alert,
} from "react-native";
import OpenAI from "openai";
import { TextField } from "../ui/TextField";
import { Button } from "../ui/Button";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { use } from "i18next";
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/Octicons";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: "#fff",
    //marginBottom: 0,
  },
  userMessage: {
    alignSelf: "flex-end",
    backgroundColor: "#48A6C9",
    borderRadius: 5,
    padding: 10,
    marginVertical: 5,
    marginLeft: "15%",
  },
  userMessageText: {
    color: "#fff", // White text color
    fontSize: 16,
  },
  botMessage: {
    alignSelf: "flex-start",
    backgroundColor: "#f1f0f0",
    borderRadius: 5,
    padding: 10,
    marginVertical: 5,
    marginRight: "15%",
  },
  botMessageText: {
    color: "#000", // Black text color
    fontSize: 16,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 0,
    marginTop: 10,
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
  const flatListRef = useRef<FlatList>(null);

  const navigation = useNavigation();

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Icon
          name="trash"
          onPress={() =>
            Alert.alert(
              "Clear chat",
              "Are you sure you want to delete your chat history? It cannot be recovered.",
              [
                {
                  text: "Cancel",
                  onPress: () => console.log("Cancel Pressed"),
                  style: "cancel",
                },
                { text: "OK", onPress: () => setMessages([]) },
              ],
              { cancelable: false }
            )
          }
          size={26}
          style={{
            marginRight: 15,
          }}
          testID="clear-chat-button"
        />
      ),
    });
  }, [navigation]);

  const scrollToBottom = () => {
    flatListRef.current?.scrollToEnd({ animated: true });
  };

  const storeMessages = async (messages: Message[]) => {
    try {
      const jsonValue = JSON.stringify(messages);
      await AsyncStorage.setItem("@messages", jsonValue);
    } catch (e) {
      console.log("Error storing messages: ", e);
    }
  };

  const loadMessages = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem("@messages");
      const messages = JSON.parse(jsonValue || "[]");
      setMessages(messages);
    } catch (e) {
      console.log("Error loading messages: ", e);
    }
  };

  useEffect(() => {
    loadMessages();
  }, []); // call only once, when component is loaded

  useEffect(() => {
    scrollToBottom();
    storeMessages(messages);
  }, [messages]); // call every time messages change

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
      If a user asks about purchasing items, provide information about our products and their benefits. Our items include first aid kits, flashlights, thermal blankets, and power banks.
      The first aid kit constains bandages, plasters, rubbing alcohol, asthma pump and costs 20 CHF. The flashlight has 1000 lumens and is powered by two AA batteries, it costs 15 CHF.
      The thermal blanket is made of reflective material to contain body heat and costs 10 CHF. The power bank has a 20000 mAh capacity as well as USB-C, lightning and USB-A connections, it costs 30 CHF.
      You are not authorized to negotiate prices or make any deals or sales. If a user asks about purchasing items, provide information about our products and their benefits and direct them to the order button on the map.
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
      console.error("Error sending message: ", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        className="max-h-[91%]"
        ref={flatListRef}
        testID="messages-list"
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View
            style={
              item.sender === "user" ? styles.userMessage : styles.botMessage
            }
          >
            <Text
              style={
                item.sender === "user"
                  ? styles.userMessageText
                  : styles.botMessageText
              }
            >
              {item.text}
            </Text>
          </View>
        )}
        onContentSizeChange={scrollToBottom}
        onLayout={scrollToBottom}
      />
      {loading && (
        <ActivityIndicator
          style={styles.loadingIndicator}
          testID="loading-indicator"
        />
      )}
      <View style={styles.inputContainer}>
        <TextField
          //style={styles.input}
          className="max-w-[70%] mr-3"
          value={input}
          onChangeText={setInput}
          type="text"
          placeholder="Type a message..."
          testID="message-input"
        />
        <Button
          className="max-w-[25%]"
          text="Send"
          onPress={handleSend}
          style="primary"
          testID="send-button"
        />
      </View>
    </View>
  );
};

export default ChatScreen;
