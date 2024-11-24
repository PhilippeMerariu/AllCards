import { StyleSheet, View, Pressable, Text } from 'react-native';
import * as storage from '@/utilities/storage';
import { router } from 'expo-router';

export default function SettingsScreen() {
  const handleLogout = async () => {
    await storage.clearUser();
    router.replace("/");
  }

  return (
    <View style={styles.page}>
      <Pressable style={{backgroundColor: 'gray', width: 100, height: 30}} onPress={handleLogout}>
        <Text>Logout</Text>
      </Pressable>
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
  page: {
    flex: 1,
  },
  cardTiles:{
    width: "42%",
    height: 100,
    backgroundColor: 'lightgray',
    marginTop: 20,
    borderRadius: 20,
    marginLeft: 10,
    marginRight: "auto",
    position: "static"
  }
});
