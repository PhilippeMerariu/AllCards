import AsyncStorage from '@react-native-async-storage/async-storage';

export async function saveUser(user: any){
    try{
        await AsyncStorage.setItem("user.id", user.id);
        await AsyncStorage.setItem("user.email", user.email);
        await AsyncStorage.setItem("user.country", user.country);
    }catch(err){
        console.log(`[storage.saveUser] ERROR: ${err}`);
    }
}

export async function getUser(){
    try{
        const id = await AsyncStorage.getItem("user.id");
        const email = await AsyncStorage.getItem("user.email");
        const country = await AsyncStorage.getItem("user.country");
        return{
            id: id,
            email: email,
            country: country
        }
    }catch(err){
        console.log(`[storage.getUser] ERROR: ${err}`);
        return {};
    }
}

export async function clearUser(user: any){
    try{
        await AsyncStorage.clear();
    }catch(err){
        console.log(`[storage.clearUser] ERROR: ${err}`);
    }
}