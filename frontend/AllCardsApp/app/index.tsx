import { Platform, StyleSheet, View, Text, Pressable, Button, TextInput, ToastAndroid, Modal } from 'react-native';
import { Link, router, Stack } from 'expo-router';
import { useState } from 'react';
import { dismiss } from 'expo-router/build/global-state/routing';

// import { GoogleSignin } from '@react-native-google-signin/google-signin';

// GoogleSignin.configure({
// 	webClientId: "961061495701-rh07e9ve4eif2lds2jvoqt8q9lrb8m4i.apps.googleusercontent.com",
// 	scopes: ['profile', 'email'],
// });

// const GoogleLogin = async () => {
// 	await GoogleSignin.hasPlayServices();
// 	const userInfo = await GoogleSignin.signIn();
// 	return userInfo;
// };

export default function LoginScreen({}) {
  const [error, setError] = useState('');
	const [loading, setLoading] = useState(false);
  const [count, setCount] = useState(0);
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleEmailLogin = async () => {   
    const SERVER_URL = "http://192.168.68.76:5000/login"
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
  
  const handleGoogleLogin = async () => {
		console.log("logging in as", email, " with password", password)
	};

  const plusButton = () => {
    setCount(c => c + 1);
    console.log("incrementing count to", count+1);
  }

  return (
    <View style={styles.page}>
      <Stack.Screen 
        options={{
          title: "Login",
          headerRight: () => <Button onPress={plusButton} title='hello'/>
        }}
      />
      <TextInput 
        style={[styles.inputboxes, {marginTop: 50}]}
        placeholder="Email"
        placeholderTextColor={'gray'}
        onChangeText={u => setEmail(u)}/>
      <TextInput 
        style={styles.inputboxes}
        placeholder="Password"
        placeholderTextColor={'gray'}
        secureTextEntry={true}
        onChangeText={p => setPassword(p)}/>
      {/* <Link href="/home" asChild> */}
      <Pressable style={styles.loginButton} onPress={handleEmailLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </Pressable>
      <View style={styles.separator}/>
      <Text style={styles.signupText}>Don't have an accout? <Link href="/register" style={styles.signupLink}>Sign up now.</Link></Text>
      {/* </Link> */}
      {/* <Link href="/home" asChild>
        <Pressable style={styles.loginButton} onPress={handleGoogleLogin}>
          <Text style={styles.buttonText}>Continue with Google</Text>
        </Pressable>
      </Link> */}
      <Text style={{margin: 20}}>Count: {count}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    backgroundColor: "#CCCCCC",
    flex: 1
  },
  separator: {
    borderWidth: 1,
    margin: 20,
    color: "#FFFFFF"
  },
  loginButton: {
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
  },
  signupText: {
    textAlign: "center",
    fontSize: 18
  },
  signupLink: {
    fontWeight: "500",
    color: 'blue'
  }
});
