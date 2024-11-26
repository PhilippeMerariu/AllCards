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
          <TouchableHighlight style={styles.cardSection} underlayColor={'gray'} onPress={() => {whoami(item)}}>
            <View style={styles.separator}>
              <Image 
                source={images.get(item.key)}
                style={styles.cardLogo}
              />
              <Text style={styles.cardName}>
                {item.key}
              </Text>
            </View>
          </TouchableHighlight>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1
  },
  separator: {
    flex: 1,
    flexDirection: "row",
    borderBottomWidth: 1.5,
  },
  cardLogo: {
    width: "30%",
    height: "60%",
    resizeMode: "contain",
    alignSelf: "center",
    marginRight: 10
  },
  cardName: {
    fontSize: 20,
    width: "70%",
    alignSelf: "center"
  },
  cardSection:{
    width: "100%",
    height: 80,
  }
});
