import { StyleSheet, Pressable, FlatList, View, Image, TouchableHighlight, Text } from 'react-native';
import { displayMessage } from '@/utilities/displayMessage';
import * as storage from '@/utilities/storage';
import * as constants from '@/utilities/constants';
import { images } from '@/utilities/imageImporter';
import { useEffect, useState } from 'react';
import { router, Stack } from 'expo-router';
import { useNavigation } from '@react-navigation/native';
import { IconSymbol } from '@/components/ui/IconSymbol';
import Loader from '@/components/Loader';

// const pngImages = require.context("./../../assets/images", true, /\.png$/);

export default function CardsScreen() {
  const [cards, setCards] = useState(new Array<any>());
  const [isLoading, setIsLoading] = useState(false);

  const navigation = useNavigation();

  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => getCards(), 1000);
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
    setIsLoading(false);
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

  const handleAddCard = () => {
    router.push("/cardList");
  }

  const cardColor = (card: any) => {
    return card.color;
  }

  return (
    <View style={styles.page}>
      <Stack.Screen
        options={{
          headerRight: () => (
            <TouchableHighlight
                style={styles.headerButton}
                underlayColor={'lightblue'}
                onPress={handleAddCard}
              >
                <IconSymbol size={28} name="add.icon" color={'white'} />
              </TouchableHighlight>
          )
        }}
      />
      <FlatList
        data={cards} 
        renderItem={({item}) =>
          <Pressable style={[styles.cardTiles, {backgroundColor: cardColor(item)}]} onPress={() => {handleSelectCard(item)}}>
            { item.logo == "" ? 
              <View style={styles.noCardView}>
                <IconSymbol size={60} name={'card.fill'} color={'white'} style={styles.noCardLogo}/>
                <Text style={styles.noCardName}>{item.store}</Text> 
              </View>
              :
              <Image 
                source={{uri: item.logo}}
                // source={images.get(item.store)}
                style={styles.cardLogo}
              />
            }
          </Pressable>
        }
        numColumns={2}/>
        <Loader isLoading={isLoading} />
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1
  },
  headerButton: {
    width: 30,
    height: 30,
    borderRadius: 2,
    marginRight: 15
  },
  cardLogo: {
    width: "60%",
    height: "60%",
    resizeMode: "contain",
    alignSelf: "center",
    marginVertical: "auto"
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
  },
  noCardView: {
    height: '100%'
  },
  noCardLogo: {
    alignSelf: "center",
    verticalAlign: "middle",
    marginTop: 8
  },
  noCardName: {
    width: '70%',
    color: 'white',
    fontSize: 14,
    textAlign: "center",
    alignSelf: "center",
  }
});
