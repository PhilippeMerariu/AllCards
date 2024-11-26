import { StyleSheet, View, Text, Pressable, TextInput} from 'react-native';
import { router } from 'expo-router';
import { useRef, useState } from 'react';
import { displayMessage } from '@/utilities/displayMessage';
import * as storage from '@/utilities/storage';
import * as constants from '@/utilities/constants';

export default function CardFormScreen({}) {
  const [store, setStore] = useState("")
  const [barcode, setBarcode] = useState("")
  const [color, setColor] = useState("")
  const [logo, setLogo] = useState("")

  const barcodeInputRef = useRef<TextInput>(null);
  const colorInputRef = useRef<TextInput>(null);
  const logoInputRef = useRef<TextInput>(null);

  const handleAddCard = async () => {
    const res = await fetch(`${constants.SERVER_URL}/addcard`, {
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({store: store, barcode: barcode, color: color, logo: logo, user: storage.getUser()})
    });
    const resjson = await res.json();
    if (res.ok){
      console.log("Successfully created card for", resjson.card.store);
      router.replace("/cards");
    }else{
      displayMessage(`ERROR: ${resjson.error}`);
    }
  };

  return (
    <View style={styles.page}>
      <TextInput 
        style={styles.inputboxes}
        placeholder="Store"
        placeholderTextColor={'gray'}
        onChangeText={s => setStore(s)}
        onSubmitEditing={() => {barcodeInputRef.current?.focus()}}/>
      <TextInput 
        style={styles.inputboxes}
        placeholder="Barcode"
        placeholderTextColor={'gray'}
        ref={barcodeInputRef}
        onChangeText={b => setBarcode(b)}
        onSubmitEditing={() => {colorInputRef.current?.focus()}}/>
      <TextInput 
        style={styles.inputboxes}
        placeholder="Color"
        placeholderTextColor={'gray'}
        ref={colorInputRef}
        onChangeText={c => setColor(c)}
        onSubmitEditing={() => {logoInputRef.current?.focus()}}/>
        <TextInput 
        style={styles.inputboxes}
        placeholder="Logo"
        placeholderTextColor={'gray'}
        ref={logoInputRef}
        onChangeText={l => setLogo(l)}
        onSubmitEditing={handleAddCard}/>
      <Pressable style={styles.signupButton} onPress={handleAddCard}>
        <Text style={styles.buttonText}>Add Card</Text>
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
