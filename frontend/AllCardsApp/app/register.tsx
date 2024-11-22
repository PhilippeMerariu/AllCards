import { Platform, StyleSheet, View, Text, Pressable, TextInput, ToastAndroid} from 'react-native';
import { router } from 'expo-router';
import { useState } from 'react';

export default function RegisterScreen({}) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  const handleSignup = async () => {
    if (password != confirmPassword){
        alert("Please make sure the Password and Confirmation are the same");
        return;
    }
    const SERVER_URL = "http://192.168.68.76:5000/signup"
    const res = await fetch(SERVER_URL, {
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({email: email, password: password, confirmPassword: confirmPassword})
    });
    const resjson = await res.json();
    if (res.ok){
      console.log("Successfully created account for", resjson.email);
      router.replace("/home");
    }else{
      console.log("ERROR:", resjson.error);
      if (Platform.OS == "android"){
        ToastAndroid.show(`ERROR: ${resjson.error}`, ToastAndroid.SHORT);
      }else if (Platform.OS == "web"){
        alert(`ERROR: ${resjson.error}`);
      }
    }
  };

  const passwordBorderColor = (password == confirmPassword) ? { borderColor: 'black' } : { borderColor: 'red' }

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
        onChangeText={p => setConfirmPassword(p)}/>
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
