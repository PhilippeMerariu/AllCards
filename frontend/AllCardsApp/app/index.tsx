import { Image, StyleSheet, Platform, View, Text, Pressable } from 'react-native';
import { Link } from 'expo-router';
import { useState } from 'react';

import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

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
  const [error, setError] = useState('');
	const [loading, setLoading] = useState(false);
  
  const handleGoogleLogin = async () => {
		console.log("clicked...")
	};

  return (
    <View>
      <Text>Username</Text>
      <Text>Password</Text>
      <Link href="/home" asChild>
        <Pressable style={styles.loginButton} onPress={handleGoogleLogin}>
          <Text style={styles.loginButton}>Continue with Google</Text>
        </Pressable>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
  loginButton: {
    backgroundColor: "#FFFFFF",
    color: "#000000",
    width: 300,
    height: 30,
    textAlign: "center",
    verticalAlign: "middle",
    borderRadius: 10,
    fontWeight: "bold"
  }
});
