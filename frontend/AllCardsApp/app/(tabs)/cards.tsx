import { StyleSheet, Pressable, Text, FlatList, View } from 'react-native';
import { displayMessage } from '@/utilities/displayMessage';
import * as storage from '@/utilities/storage';
import { useEffect, useState } from 'react';
import { router } from 'expo-router';

export default function CardsScreen() {
  const [cards, setCards] = useState(new Array<any>());

  const whoami = async (card: any) => {
    displayMessage(`${card.store}: ${card.barcode}`);
  }

  useEffect(() => {
    getCards();
  }, []);

  const getCards = async () => {
    const user = await storage.getUser();

    const SERVER_URL = "http://192.168.68.76:5000/getcards"
    const res = await fetch(SERVER_URL, {
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({email: user.email})
    });
    
    const resjson = await res.json();
    if (res.ok){
      setCards(resjson.cards);
    }
    else{
      displayMessage(`ERROR: ${resjson.error}`);
      setCards([]);
    }
  }

  const addCard = () => {
    router.push("/cardForm");
  }

  const cardColor = (card: any) => {
    return card.color;
  }

  return (
    <View style={styles.page}>
      <Pressable style={{backgroundColor: 'gray', width: 100, height: 30}} onPress={addCard}>
        <Text>ADD CARD</Text>
      </Pressable>
      <FlatList
        data={cards} 
        renderItem={({item}) =>
          <Pressable style={[styles.cardTiles, {backgroundColor: cardColor(item)}]} onPress={() => {whoami(item)}}>
            <Text>{item.store}</Text>
          </Pressable>
        }
        numColumns={2}/>
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
