import { StyleSheet, View, Text, Pressable, TextInput, TouchableHighlight, Image } from 'react-native';
import { router } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { displayMessage } from '@/utilities/displayMessage';
import * as storage from '@/utilities/storage';
import * as constants from '@/utilities/constants';
import { useRoute } from '@react-navigation/native';
import { useCameraPermission, useCameraDevice, Camera, useCodeScanner } from 'react-native-vision-camera'

// const { hasPermission, requestPermission } = useCameraPermission()

export default function BarcodeScannerScreen({}) {
    const device = useCameraDevice(
        'back'
    )
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
        <View style={styles.page}>
            <Camera
                style={styles.preview}
                device={device}
                isActive={true}
                codeScanner={codeScanner}
            />
            <TouchableHighlight 
                style={styles.actionButton}
                underlayColor={'lightgray'}
                onPress={() => {alert("snap!")}}>
                <></>
            </TouchableHighlight>
            <TouchableHighlight 
                style={styles.scanSection}
                underlayColor={'lightgray'}
                onPress={() => {alert("snap!")}}>
                <></>
            </TouchableHighlight>
        </View>
    );
}

const styles = StyleSheet.create({
  page: {
    backgroundColor: "#CCCCCC",
    flex: 1
  },
  preview: {
    flex: 1,
  },
  actionButton: {
        width: 100,
        height: 100,
        borderWidth: 8,
        borderColor: 'lightgray',
        borderRadius: 50,
        position: "absolute",
        bottom: 30,
        alignSelf: "center"
  },
  scanSection: {
    borderWidth: 8,
    borderRadius: 20,
    borderColor: "lightgray",
    width: 350,
    height: 200,
    position: "absolute",
    alignSelf: "center",
    top: 250
  }
});

