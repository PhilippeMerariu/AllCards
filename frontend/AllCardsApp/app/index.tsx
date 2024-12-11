import { StyleSheet, View, Text, Pressable, Button, TextInput } from 'react-native';
import { Link, router, Stack } from 'expo-router';
import { useRef, useState } from 'react';
import { displayMessage } from '@/utilities/displayMessage';
import * as storage from '@/utilities/storage';
import * as constants from '@/utilities/constants';
import * as EmailValidator from 'email-validator';
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
  const [count, setCount] = useState(0);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const passwordInputRef = useRef<TextInput>(null);

  const validateInfo = () => {
    if (!email || ! password){
        displayMessage("Please enter ALL fields and press 'Login'");
        return false;
    }
    if (!EmailValidator.validate(email)){
        displayMessage("Please enter a valid email address");
        return false
    }
    return true;
  };

  const handleEmailLogin = async () => { 
    if (!validateInfo()){
      return;
    }
    const res = await fetch(`${constants.SERVER_URL}/login`, {
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({email: email, password: password})
    });

    const resjson = await res.json();
    if (res.ok){
      console.log("LOGIN SUCCESSFUL --> welcome", resjson.user.email);
      storage.saveUser(resjson.user);
      router.push("/cards");
    }else{
      console.log("ERROR:", resjson.error);
      displayMessage(`ERROR: ${resjson.error}`);
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
        autoCapitalize="none"
        autoCorrect={false}
        onChangeText={u => setEmail(u)}
        onSubmitEditing={() => { passwordInputRef.current?.focus() }}/>
      <TextInput
        style={styles.inputboxes}
        placeholder="Password"
        placeholderTextColor={'gray'}
        autoCapitalize="none"
        autoCorrect={false}
        secureTextEntry={true}
        ref={passwordInputRef}
        onChangeText={p => setPassword(p)}
        onSubmitEditing={handleEmailLogin}/>
      <Pressable style={styles.loginButton} onPress={handleEmailLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </Pressable>
      <View style={styles.separator}/>
      <Text style={styles.signupText}>Don't have an accout? <Link href="/register" style={styles.signupLink}>Sign up now.</Link></Text>
      <Text style={{margin: 20}}>Count: {count}</Text>
      <Link href="/cards" asChild>
        <Pressable style={styles.loginButton}>
          <Text style={styles.buttonText}>TEST</Text>
        </Pressable>
      </Link>
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
