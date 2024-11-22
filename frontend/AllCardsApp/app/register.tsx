import { Platform, StyleSheet, View, Text, Pressable, Button, TextInput, ToastAndroid, Modal } from 'react-native';
import { Link, router, Stack } from 'expo-router';
import { useState } from 'react';
import { dismiss } from 'expo-router/build/global-state/routing';

export default function RegisterScreen({}) {
  const [error, setError] = useState('');
	const [loading, setLoading] = useState(false);
  const [count, setCount] = useState(0);
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [validPassword, setValidPassword] = useState(true);

  const handleSignup = async () => {
    if (validPassword){
        alert("ALL GOOD");
    }else{
        alert("passwords do not match!");
    }
    const SERVER_URL = "http://192.168.68.76:5000/signup"
    const res = await fetch(SERVER_URL, {
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({email: email, password: password})
    });
    const resjson = await res.json();
    if (res.ok){
      console.log("LOGIN SUCCESSFUL --> welcome", resjson.email);
      router.push("/home");
    }else{
      console.log("ERROR:", resjson.error);
      if (Platform.OS == "android"){
        ToastAndroid.show(`ERROR: ${error}`, ToastAndroid.SHORT);
      }else if (Platform.OS == "web"){

      }
    }
  };

  const isSamePassword = (p: string) => {
    if (p != password){
        setValidPassword(false);
    }else{
        setValidPassword(true);
    }
  }

  const passwordBorderColor = validPassword ? { borderColor: 'black' } : { borderColor: 'red' }

  return (
    <View style={styles.page}>
      <TextInput 
        style={styles.inputboxes}
        placeholder="Email"
        placeholderTextColor={'gray'}
        onChangeText={u => setEmail(u)}/>
      <TextInput 
        style={[styles.inputboxes, passwordBorderColor]}
        placeholder="Password"
        placeholderTextColor={'gray'}
        secureTextEntry={true}
        onChangeText={p => setPassword(p)}/>
      <TextInput 
        style={[styles.inputboxes, passwordBorderColor]}
        placeholder="Confirm Password"
        placeholderTextColor={'gray'}
        secureTextEntry={true}
        onChangeText={p => isSamePassword(p)}/>
      <Pressable style={styles.signupButton} onPress={handleSignup}>
        <Text style={styles.buttonText}>Sign Up</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    backgroundColor: "#CCCCCC",
    flex: 1
  },
  signupButton: {
    backgroundColor: "#FFFFFF",
    width: 300,
    height: 40,
    borderRadius: 10,
    alignSelf: "center",
    justifyContent: "center",
    marginTop: 20
  },
  buttonText: {
    color: "#000000",
    textAlign: "center",
    fontWeight: "bold"
  },
  inputboxes: {
    color: "#000000",
    backgroundColor: "#ffffff",
    borderColor: "#000000",
    borderWidth: 2,
    borderRadius: 10,
    width: 300,
    height: 40,
    marginTop: 20,
    alignSelf: "center",
    textAlign: "left",
    paddingLeft: 10
  }
});
