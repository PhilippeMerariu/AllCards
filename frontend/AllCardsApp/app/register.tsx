import { StyleSheet, View, Text, Pressable, TextInput} from 'react-native';
import { router } from 'expo-router';
import { useRef, useState } from 'react';
import * as EmailValidator from 'email-validator';
import * as constants from '@/utilities/constants';
import { displayMessage } from '@/utilities/displayMessage';

export default function RegisterScreen({}) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  const passwordInputRef = useRef<TextInput>(null);
  const confirmPassInputRef = useRef<TextInput>(null);

  const validateInfo = () => {
    if (!email || ! password || !confirmPassword){
        displayMessage("Please enter ALL fields and press 'Sign Up'");
        return false;
    }
    if (!EmailValidator.validate(email)){
        displayMessage("Please enter a valid email address");
        return false;
    }
    if (password.length < 6){
        displayMessage("Password must be at least 6 characters");
        return false;
    }
    if (password != confirmPassword){
        displayMessage("Please make sure the Password and Confirmation are the same");
        return false;
    }
    return true;
  };

  const handleSignup = async () => {
    if (!validateInfo()){
        return;
    }
    const res = await fetch(`${constants.SERVER_URL}/signup`, {
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
      router.replace("/cards");
    }else{
      displayMessage(`ERROR: ${resjson.error}`);
    }
  };

  const emailBoderColor = (email.length < 3 || EmailValidator.validate(email)) ? { borderColor: 'black' } : { borderColor: 'red' };
  const passwordBorderColor = (password.length < 3 || confirmPassword.length < 3 || password == confirmPassword) ? { borderColor: 'black' } : { borderColor: 'red' };

  return (
    <View style={styles.page}>
      <TextInput 
        style={[styles.inputboxes, emailBoderColor]}
        placeholder="Email"
        placeholderTextColor={'gray'}
        autoCapitalize="none"
        autoCorrect={false}
        onChangeText={u => setEmail(u)}
        onSubmitEditing={() => {passwordInputRef.current?.focus()}}/>
      <TextInput 
        style={[styles.inputboxes, passwordBorderColor]}
        placeholder="Password"
        placeholderTextColor={'gray'}
        autoCapitalize="none"
        autoCorrect={false}
        secureTextEntry={true}
        ref={passwordInputRef}
        onChangeText={p => setPassword(p)}
        onSubmitEditing={() => {confirmPassInputRef.current?.focus()}}/>
      <TextInput 
        style={[styles.inputboxes, passwordBorderColor]}
        placeholder="Confirm Password"
        placeholderTextColor={'gray'}
        autoCapitalize="none"
        autoCorrect={false}
        secureTextEntry={true}
        ref={confirmPassInputRef}
        onChangeText={p => setConfirmPassword(p)}
        onSubmitEditing={handleSignup}/>
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
