import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, Image, TouchableOpacity } from 'react-native';
import Button from "../components/Button";
import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithCredential,
} from "firebase/auth";
import {auth} from "../firebase";
import * as Google from "expo-auth-session/providers/google";
import * as WebBrowser from "expo-web-browser";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { signInWithEmailAndPassword } from 'firebase/auth';



export default function LoginScreen( {promptAsync}) {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');


  const handleLogin = () => {
    if (email === 'admin' && password === 'admin') {
      console.log('Login success');
    } else {
      setError('Invalid credentials');
    }
  };

  const logInWithEmail = async () => {
    if (email && password) {
      try {
        const response = await signInWithEmailAndPassword(auth, email, password);
        if (response.user) {
          console.log('Login success');
          // navigate.("home);
        } else {
          setError('Invalid credentials');
        }

      } catch (e) {

      }
    }
  };

  return (
    <View style={styles.container}>
      <Image
        style={{ width: 100, height: 100, marginBottom: 20 }}
        source={require('../assets/images/usedLogo.png')}
      />

      <Text style={styles.title}>Wild Knight</Text>

      <TextInput
        style={styles.input}
        placeholder='Enter your username or email'
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        style={styles.input}
        placeholder='Enter your password'
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <Button sytle={styles.loginIn} title='Log in' onPress={logInWithEmail} />

      {/** TODO: Forgot password **/}
      <Text>Forgot password?</Text>

      {/** TODO: Add line **/}
      
      <div style={{ height: 20 }}>
        <Image
          style={{ width: 100, height: 100, marginBottom: 20 }}
          source={require('../assets/logo.png')}
        />

        <TouchableOpacity onPress={() => promptAsync()}> 
          <Text style={styles.text}>Continue with Google</Text>
        </TouchableOpacity>
      </div>

      {/** TODO: Add line **/}

      <Text style={styles.text}>Don't have an account? Sign Up!</Text>

      <Text style={styles.error}>{error}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  input: {
    width: '80%',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    padding: 10,
  },
  error: {
    color: 'red',
    marginTop: 10,
  },

  text: {
    color: 'black',
    fontSize: 16,
  }

});


