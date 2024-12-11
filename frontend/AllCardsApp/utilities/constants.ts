// import { NetworkInfo } from "react-native-network-info";

// export function getIP(){
//     let ipv4: string | null = "127.0.0.1";
//     NetworkInfo.getIPV4Address().then(ipv4Address => {
//         console.log("IP ADDR: ", ipv4Address);
//         ipv4 = ipv4Address;
//         return ipv4Address;
//     }).catch(error => {
//         console.log(`[getIP] ERROR: ${error}`);
//         ipv4 = "127.0.0.1";
//         return ipv4;
//     });
//     // console.log("return ipv4...");
//     // return ipv4;
// }
                    
export const SERVER_URL: string = "http://192.168.68.74:5000";
// export const SERVER_URL: string = `http://${getIP()}:5000`;