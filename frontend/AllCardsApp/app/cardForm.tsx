import { StyleSheet, View, Text, Pressable, TextInput, Image} from 'react-native';
import { router } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { displayMessage } from '@/utilities/displayMessage';
import * as storage from '@/utilities/storage';
import * as constants from '@/utilities/constants';
import { useRoute, useFocusEffect, useNavigation } from '@react-navigation/native';
import bwipjs from '@bwip-js/react-native';

export default function CardFormScreen({}) {
  const [store, setStore] = useState("");
  const [barcode, setBarcode] = useState("");
  const [color, setColor] = useState("");
  const [logo, setLogo] = useState("");
  const [barcodeObject, setBarcodeObject] = useState({width: 0, height: 0, uri: ""});

  const barcodeInputRef = useRef<TextInput>(null);
  const colorInputRef = useRef<TextInput>(null);
  const logoInputRef = useRef<TextInput>(null);

  const route = useRoute();
  const navigation = useNavigation<any>();

  useEffect(() => {
    console.log("mount effect");
    if (route.params?.card){
      setStore(route.params?.card.store);
      setBarcode(route.params?.card.barcode);
      setColor(route.params?.card.color);
      setLogo(route.params?.card.logo);
    }
  }, []);

  useEffect(() => {
    console.log("barcode effect");
    generateBarcode();
    return () => {
      if (route.params?.barcode){
        // FIXME: avoid resetting params when navigating to other screen...
        navigation.setParams({barcode: undefined});
      }
    }
  }, [barcode])

  useFocusEffect(() => {
    console.log("focus effect");
    if (route.params?.barcode){
      console.log("focus setting barcode", route.params?.barcode);
      setBarcode(route.params?.barcode);
    }
  });

  // const getCardInfo = async (cardName) => {
  //   const user = await storage.getUser();
  //   const res = await fetch(`${constants.SERVER_URL}/getcard`, {
  //     method: "POST",
  //     headers: {
  //       "Accept": "application/json",
  //       "Content-Type": "application/json"
  //     },
  //     body: JSON.stringify({email: user.email, card: cardName})
  //   });
  //   const resjson = await res.json();
  //   if (res.ok){
  //     setStore(resjson.card.store);
  //     setBarcode(resjson.card.barcode);
  //     setColor(resjson.card.color);
  //     setLogo(resjson.card.logo);
  //   }else{
  //     displayMessage(`ERROR: ${resjson.error}`);
  //   }
  // }

  const validateCardData = () => {
    if (!store || !barcode || !color){
      displayMessage("Please enter a store name, barcode and color");
      return false;
    }
    return true;
  }

  const handleAddCard = async () => {
    if (!validateCardData()){
      return;
    }
    const user = await storage.getUser();

    const res = await fetch(`${constants.SERVER_URL}/addcard`, {
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({store: store, barcode: barcode, color: color, logo: logo, user: user})
    });
    const resjson = await res.json();
    if (res.ok){
      console.log("moving to cards screen");
      router.replace("/cards");
    }else{
      displayMessage(`ERROR: ${resjson.error}`);
    }
  };

  const handleBarcode = () => {
    router.push("/barcodeScanner");
  };

  const generateBarcode = async () => {
    let img;
    try {
      img = await bwipjs.toDataURL({bcid: "ean13", text: barcode});
      setBarcodeObject(img);
    } catch (e) {
      console.log(e);
    }
  }

  return (
    <View style={styles.page}>
      <TextInput 
        style={styles.inputboxes}
        placeholder="Store"
        placeholderTextColor={'gray'}
        defaultValue={store}
        onChangeText={s => setStore(s)}
        onSubmitEditing={() => {barcodeInputRef.current?.focus()}}/>
      <TextInput 
        style={styles.inputboxes}
        placeholder="Barcode"
        placeholderTextColor={'gray'}
        ref={barcodeInputRef}
        defaultValue={barcode}
        onChangeText={b => setBarcode(b)}
        onSubmitEditing={() => {colorInputRef.current?.focus()}}/>
      <TextInput 
        style={styles.inputboxes}
        placeholder="Color"
        placeholderTextColor={'gray'}
        ref={colorInputRef}
        defaultValue={color}
        onChangeText={c => setColor(c)}
        onSubmitEditing={() => {logoInputRef.current?.focus()}}/>
        <TextInput 
        style={styles.inputboxes}
        placeholder="Logo"
        placeholderTextColor={'gray'}
        ref={logoInputRef}
        defaultValue={logo}
        onChangeText={l => setLogo(l)}
        onSubmitEditing={handleAddCard}/>
      <Pressable style={styles.signupButton} onPress={handleAddCard}>
        <Text style={styles.buttonText}>Add Card</Text>
      </Pressable>
      <Pressable style={styles.signupButton} onPress={handleBarcode}>
        <Text style={styles.buttonText}>BARCODE</Text>
      </Pressable>
      <Image 
        style={{width: barcodeObject.width, height: barcodeObject.height}}
        source={{uri:barcodeObject.uri}}
      />
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
