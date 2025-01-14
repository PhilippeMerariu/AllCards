import { StyleSheet, View, Text, Pressable, TextInput, Image, TouchableHighlight, Modal, Alert} from 'react-native';
import { router, Stack } from 'expo-router';
import { useEffect, useState } from 'react';
import { displayMessage } from '@/utilities/displayMessage';
import * as storage from '@/utilities/storage';
import * as constants from '@/utilities/constants';
import { useRoute, useFocusEffect, useNavigation } from '@react-navigation/native';
import bwipjs from '@bwip-js/react-native';
import { IconSymbol } from '@/components/ui/IconSymbol';
import ColorPicker, { Panel1, Swatches, Preview, OpacitySlider, HueSlider } from 'reanimated-color-picker';

export default function CardFormScreen({}) {
  const [store, setStore] = useState("");
  const [barcode, setBarcode] = useState("");
  const [color, setColor] = useState("");
  const [logo, setLogo] = useState("");
  const [barcodeObject, setBarcodeObject] = useState({width: 0, height: 0, uri: ""});
  const [pageTitle, setPageTitle] = useState("New Card");
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [colorSelected, setColorSelected] = useState("")

  const route = useRoute();
  const navigation = useNavigation<any>();

  useEffect(() => {
    if (route.params?.card){
      setStore(route.params?.card.store);
      setBarcode(route.params?.card.barcode);
      setColor(route.params?.card.color);
      setLogo(route.params?.card.logo);
      setPageTitle("Edit Card");
    }else if (route.params?.cardTemplate){
      setStore(route.params?.cardTemplate.cardName);
      setColor(route.params?.cardTemplate.color);
      setLogo(route.params?.cardTemplate.image);
      setPageTitle("New Card");
    }
  }, []);

  useEffect(() => {
    generateBarcode();
    return () => {
      if (route.params?.barcode){
        // FIXME: avoid resetting params when navigating to other screen...
        navigation.setParams({barcode: undefined});
      }
    }
  }, [barcode])

  useFocusEffect(() => {
    if (route.params?.barcode){
      setBarcode(route.params?.barcode);
    }
  });

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
      router.replace("/cards");
    }else{
      displayMessage(`ERROR: ${resjson.error}`);
    }
  };

  const deleteConfirmationAlert = () =>
    Alert.alert(`Are you sure you want to delete the \"${store}\" card?`, '', [
      {
        text: 'Cancel',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {text: 'OK', onPress: handleDeleteCard},
    ]);

  const handleDeleteCard = async () => {
    const user = await storage.getUser();

    const res = await fetch(`${constants.SERVER_URL}/card`, {
      method: "DELETE",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({card: store, user: user})
    });
    const resjson = await res.json();
    if (res.ok){
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
      img = await bwipjs.toDataURL({bcid: "ean13", text: barcode, includetext: true});
      setBarcodeObject(img);
    } catch (e) {
      console.log(e);
    }
  }

  const onSelectColor = ({ hex }) => {
    setColorSelected(hex);
  };

  const onConfirmColor = () => {
    setColor(colorSelected);
    setShowColorPicker(false);
  }

  return (
    <View style={styles.page}>
      <Stack.Screen 
        options={{
          title: pageTitle,
          headerRight: () => (
            <View style={{flexDirection: "row"}}>
              <TouchableHighlight
                style={styles.headerButtons}
                underlayColor={'lightblue'}
                onPress={deleteConfirmationAlert}
              >
                <IconSymbol size={28} name="delete.fill" color={'white'} />
              </TouchableHighlight>
              <TouchableHighlight
                style={styles.headerButtons}
                underlayColor={'lightblue'}
                onPress={handleAddCard}
              >
                <IconSymbol size={28} name="save.fill" color={'white'} />
              </TouchableHighlight>
            </View>
          )
          
        }}
      />

      <Text style={[styles.inputLabels, {marginTop: 50}]}>Card Name</Text>
      <TextInput 
        style={styles.inputboxes}
        placeholder="Card Name"
        placeholderTextColor={'gray'}
        defaultValue={store}
        onChangeText={s => setStore(s)}/>

      <Text style={[styles.inputLabels]}>Barcode</Text>
      <Pressable style={styles.bardcodeButton} onPress={handleBarcode}>
        <Text style={styles.buttonText}>Scan Barcode</Text>
      </Pressable>
      <Image 
        style={[styles.barcodeImage, {width: barcodeObject.width, height: barcodeObject.height}]}
        source={{uri:barcodeObject.uri}}
      />

      <Text style={[styles.inputLabels]}>Color</Text>
      <Pressable style={[styles.colorPreview, {backgroundColor: color}]} onPress={() => setShowColorPicker(true)}></Pressable>
      
      <Text style={[styles.inputLabels]}>Logo</Text>
      <TextInput 
        style={styles.inputboxes}
        placeholder="Logo"
        placeholderTextColor={'gray'}
        defaultValue={logo}
        onChangeText={l => setLogo(l)}
        onSubmitEditing={handleAddCard}
        editable={false}
        selectTextOnFocus={false}/>

      <Modal visible={showColorPicker} animationType='slide'>
        <ColorPicker style={styles.colorPickerSection} value={color} onComplete={onSelectColor}>
          <Preview style={[styles.colorPickerElements, styles.colorPickerPreview]} hideText={true}/>
          <Panel1 style={styles.colorPickerElements}/>
          <HueSlider style={styles.colorPickerElements}/>
          <OpacitySlider style={styles.colorPickerElements}/>
        </ColorPicker>
        <View style={styles.colorPickerButtonView}>
          <Pressable style={styles.colorPickerButtons} onPress={() => setShowColorPicker(false)}>
            <Text style={styles.colorPickerButtonText}>Cancel</Text>
          </Pressable>
          <Pressable style={styles.colorPickerButtons} onPress={onConfirmColor}>
            <Text style={styles.colorPickerButtonText}>OK</Text>
          </Pressable>
        </View>  
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    backgroundColor: "#CCCCCC",
    flex: 1
  },
  headerButtons: {
    width: 30,
    height: 30,
    borderRadius: 2,
    marginLeft: 20
  },
  bardcodeButton: {
    backgroundColor: "#FFFFFF",
    width: 300,
    height: 40,
    borderRadius: 10,
    alignSelf: "center",
    justifyContent: "center",
    marginTop: 5
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
    marginTop: 5,
    alignSelf: "center",
    textAlign: "left",
    paddingLeft: 10
  },
  inputLabels: {
    width: 300,
    height: "auto",
    alignSelf: "center",
    textAlign: "left",
    fontWeight: "bold",
    fontSize: 18,
    marginTop: 20
  },
  barcodeImage: {
    alignSelf: "center",
    margin: 10
  },
  colorPreview: {
    width: 80,
    height: 80,
    borderRadius: 10,
    borderWidth: 1,
    marginLeft: 55
  },
  colorPickerSection: {
    width: "80%",
    alignSelf: "center",
    marginTop: 80,
  },
  colorPickerElements: {
    marginBottom: 15
  },
  colorPickerPreview: {
    borderWidth: 2,
    height: 40
  },
  colorPickerButtonView: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 40
  },
  colorPickerButtons: {
    width: 100,
    height: 40,
    backgroundColor: 'white',
    borderRadius: 8,
    borderWidth: 2,
    justifyContent: "center"
  },
  colorPickerButtonText: {
    textAlign: "center",
    fontSize: 18,
    fontWeight: "bold"
  }
});
