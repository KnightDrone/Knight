import React, { useState } from "react";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import Button from "../components/Button";
import {
    GoogleAuthProvider,
    onAuthStateChanged,
    signInWithCredential,
} from "firebase/auth";
import { auth } from "../firebase";
import * as Google from "expo-auth-session/providers/google";
import * as WebBrowser from "expo-web-browser";
import AsyncStorage from "@react-native-async-storage/async-storage";
import LoginScreen from "./Login";
import { User } from 'firebase/auth';

WebBrowser.maybeCompleteAuthSession();
export default function App() {
    const [count, setCount] = useState(0);
    const increment = () => setCount(count + 1);
    const [userInfo, setUserInfo] = React.useState<User | null>(null);
    const [loading, setLoading] = React.useState(false);
    const [request, response, promptAsync] = Google.useAuthRequest({
        iosClientId: '983400403511-gi5mo0akb89fcecaivk4q509c63hrvtl.apps.googleusercontent.com',
        androidClientId: '983400403511-i43set67i4o1e3kb7fl91vrh9r6aemcb.apps.googleusercontent.com'
    });

    const checkLocalUser = async () => {
        try {
            setLoading(true);
            const userJSON = await AsyncStorage.getItem("@user");
            const userData = userJSON != null ? JSON.parse(userJSON) : null;
            console.log("local storage:", userData);
            setUserInfo(userData);
        } catch (e) {
            alert(e);
        } finally {
            setLoading(false);
        }
    };

    React.useEffect(() => {
        if (response?.type === 'success') {
            const { id_token } = response.params;
            const credential = GoogleAuthProvider.credential(id_token);
            signInWithCredential(auth, credential);
        }
    }, [response]);

    React.useEffect(() => {
        checkLocalUser();
        const unsub = onAuthStateChanged(auth, async (user) => {
            if (user) {
                console.log(JSON.stringify(user, null, 2));
                setUserInfo(user);
                try {
                    await AsyncStorage.setItem("@user", JSON.stringify(user));
                } catch (e) {
                    alert(e);
                }
            } else {

            }
        });

        return () => unsub(); // for performance
    }, []);
    // TODO: Add a loading screen, also check for previous email login
    if (loading) {
        return <Text>Loading...</Text>; 
    }
    return <LoginScreen promptAsync={promptAsync} />;
    /*return (
        <View style={styles.container}>
            <Text>Tiberiu was here!</Text>
            <StatusBar style="auto" />
            <Button title="Press me" onPress={increment} />
            <Text>Count: {count}</Text>
        </View>
    );*/
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
