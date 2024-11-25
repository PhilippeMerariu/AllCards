import { StyleSheet, Pressable, Text, FlatList, View, Image, TouchableHighlight } from 'react-native';
import { images } from '@/utilities/imageImporter';
import { useEffect, useState } from 'react';
import { router } from 'expo-router';

export default function CardsScreen() {
  const [cards, setCards] = useState(new Array<any>());

  const whoami = async (card: any) => {
  }

  useEffect(() => {
    getCardList();
  }, []);

  const getCardList = () => {
    const allCards = new Array<any>();
    images.forEach((v, k) => {
      allCards.push({key: k, imgSource: v});
    });
    setCards(allCards);
  }

  const handleCustomCard = () => {
    router.push("/cardForm");
  }

  const test = () => {
    // console.log(Array.from(images));
    const allCards = new Array<any>();
    console.log(images)
    images.forEach((v, k) => {
      // console.log(k , v);
      allCards.push({key: k, imgSource: v});
    })
    console.log(allCards);
  }


  return (
    <View style={styles.page}>
      <Pressable style={{backgroundColor: 'gray', width: 100, height: 30}} onPress={handleCustomCard}>
        <Text>Add Custom Card</Text>
      </Pressable>
      <FlatList
        data={cards} 
        renderItem={({item}) =>
          <TouchableHighlight onPress={() => {whoami(item)}}>
            <View>
              <Image 
                source={images.get(item.key)}
                style={styles.cardLogo}
                />
              <Text>{item.key}</Text>
            </View>
          </TouchableHighlight>
        }
      />
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
