import { StyleSheet, Pressable, Text, FlatList, View, Image } from 'react-native';
import { displayMessage } from '@/utilities/displayMessage';
import * as storage from '@/utilities/storage';
import * as constants from '@/utilities/constants';
import { images } from '@/utilities/imageImporter';
import { useEffect, useState } from 'react';
import { router } from 'expo-router';
import { useNavigation } from '@react-navigation/native';

// const pngImages = require.context("./../../assets/images", true, /\.png$/);

export default function CardsScreen() {
  const [cards, setCards] = useState(new Array<any>());
  const navigation = useNavigation();

  useEffect(() => {
    getCards();
  }, []);

  const getCards = async () => {
    const user = await storage.getUser();

    const res = await fetch(`${constants.SERVER_URL}/getcards`, {
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

  // not working on mobile
  // currently not being used
  // const getCardImage = (card: any) => {
  //   let imgSources = new Map<string, any>();
  //   pngImages.keys().forEach((k) => {
  //     imgSources.set(k, pngImages(k));
  //   });
  //   return imgSources.get(`./${card.logo}`).uri;
  // }

  const handleSelectCard = (card) => {
    navigation.navigate("cardForm", {card: card})
  }

  const addCard = () => {
    router.push("/cardList");
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
          <Pressable style={[styles.cardTiles, {backgroundColor: cardColor(item)}]} onPress={() => {handleSelectCard(item)}}>
            <Image 
              // source={{uri:getCardImage(item)}}
              source={images.get(item.store)}
              style={styles.cardLogo}
            />
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
  cardLogo: {
    width: "60%",
    height: "60%",
    resizeMode: "contain",
    alignSelf: "center",
    marginVertical: "auto"
  },
  page: {
    flex: 1
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
