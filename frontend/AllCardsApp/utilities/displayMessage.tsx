import { Platform, ToastAndroid } from "react-native";

export function displayMessage(msg: string){
    if (Platform.OS == "android"){
        ToastAndroid.show(msg, ToastAndroid.SHORT);
    }else if (Platform.OS == "web"){
        alert(msg);
    }
}
