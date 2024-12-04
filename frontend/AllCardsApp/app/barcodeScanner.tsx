import { StyleSheet, View, Text, Pressable, TextInput } from 'react-native';
import { router } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { displayMessage } from '@/utilities/displayMessage';
import * as storage from '@/utilities/storage';
import * as constants from '@/utilities/constants';
import { useRoute } from '@react-navigation/native';
import { useCameraPermission, useCameraDevice, Camera, useCodeScanner } from 'react-native-vision-camera'

// const { hasPermission, requestPermission } = useCameraPermission()

export default function BarcodeScannerScreen({}) {
    const device = useCameraDevice('back')
    const { hasPermission, requestPermission } = useCameraPermission()
    const codeScanner = useCodeScanner({
        codeTypes: ['qr', 'ean-13'],
        onCodeScanned: (codes) => {
            for (const code of codes){
                console.log(`Scanned ${code.type} code => ${code.value}`);
            }
        //   console.log(`Scanned ${codes} code!`)
        }
    });

    // if (!hasPermission) return <PermissionsPage />
    // if (device == null) return <NoCameraDeviceError />

    useEffect(() => {
        // displayMessage("barcode scanner page!");
        if (!hasPermission){
            requestPermission().then((result) => {
                displayMessage(result.toString());
            })
        }
    }, []);


    return (
        <Camera
            style={StyleSheet.absoluteFill}
            device={device}
            isActive={true}
            codeScanner={codeScanner}
        />
    );
}

// const styles = StyleSheet.create({
//   page: {
//     backgroundColor: "#CCCCCC",
//     flex: 1
//   },
//   signupButton: {
//     backgroundColor: "#FFFFFF",
//     width: 300,
//     height: 40,
//     borderRadius: 10,
//     alignSelf: "center",
//     justifyContent: "center",
//     marginTop: 20
//   },
//   buttonText: {
//     color: "#000000",
//     textAlign: "center",
//     fontWeight: "bold"
//   },
//   inputboxes: {
//     color: "#000000",
//     backgroundColor: "#ffffff",
//     borderColor: "#000000",
//     borderWidth: 2,
//     borderRadius: 10,
//     width: 300,
//     height: 40,
//     marginTop: 20,
//     alignSelf: "center",
//     textAlign: "left",
//     paddingLeft: 10
//   }
// });

