import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, Image} from 'react-native';
import Button from "../components/Button";

export default function Login() {

  const [user, getUser] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = () => {
    if(user === 'admin' && password === 'admin'){
      console.log('Login success');
    } else {
      setError('Invalid credentials');
    }
  }

  return (
    <View style={styles.container}>
      <Image 
        style={{ width: 100, height: 100, marginBottom: 20 }}
        source={require('../assets/logo.png')} 
      />

      <Text style={styles.title}>Login</Text>

      <TextInput
        style={styles.input}
        placeholder='Enter your username or email'
        value={user}
        onChangeText={getUser}
      />

      <TextInput
        style={styles.input}
        placeholder='Enter your password'
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <Button title='Login' onPress={handleLogin} />

      {/** TODO: Forgot password **/}
      <Text>Forgot password?</Text>

      {/** TODO: Add line **/}

      <div style={{height: 20}}>
        <Image 
          style={{ width: 100, height: 100, marginBottom: 20 }}
          source={require('../assets/logo.png')}
        />

        <Text style={styles.text}>Continue with Google</Text>
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
  }

  text: {

  }
  
});


