import React, { useState } from "react";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import Button from "../components/Button";

export default function App() {
    const [count, setCount] = useState(0);
    const increment = () => setCount(count + 1);

    return (
        <View style={styles.container}>
            <Text>Tiberiu was here!</Text>
            <StatusBar style="auto" />
            <Button title="Press me" onPress={increment} />
            <Text>Count: {count}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "center",
        gap: 20,
    },
});
