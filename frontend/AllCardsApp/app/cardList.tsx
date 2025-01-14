import { StyleSheet, Pressable, Text, FlatList, View, Image, TouchableHighlight, TextInput, ScrollView } from 'react-native';
import { useEffect, useState } from 'react';
import { router } from 'expo-router';
import { useNavigation } from '@react-navigation/native';
import * as constants from '@/utilities/constants';
import { displayMessage } from '@/utilities/displayMessage';
import { IconSymbol } from '@/components/ui/IconSymbol';

export default function CardsScreen() {
  const [cards, setCards] = useState(new Array<any>());
  const [allCards, setAllCards] = useState(new Array<any>());
  const [noData, setNoData] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    getCardList();
  }, []);

  const getCardList = async () => {
    const res = await fetch(`${constants.SERVER_URL}/cardTemplates`, {
      method: "GET",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json"
      }
    });
    const resjson = await res.json();
    if (res.ok){
      setCards(resjson.card_templates.templates);
      setAllCards(resjson.card_templates.templates);
    }else{
      displayMessage(`ERROR: ${resjson.error}`);
    }
  }

  const filterCardList = (str: string) => {
    let filteredCards = allCards.filter((card) => {
      return card.cardName.toLowerCase().match(str.toLowerCase());
    });
    setCards(filteredCards);
    
    setNoData(filteredCards.length <= 0);
  }

  const handleSelectedCard = (card) => {
    navigation.navigate("cardForm", {cardTemplate: card});
  }

  const handleCustomCard = () => {
    router.push("/cardForm");
  }

  return (
    <View style={styles.page}>
      <View style={styles.searchSection}>
        <IconSymbol size={30} name={'search.fill'} color={'black'} style={styles.searchIcon} />
        <TextInput 
          style={styles.searchbox}
          placeholder="Search..."
          placeholderTextColor={'gray'}
          onChangeText={s => filterCardList(s)} />
      </View>

      <TouchableHighlight style={styles.cardSection} underlayColor={'lightgray'} onPress={handleCustomCard}>
        <View style={styles.separator}>
          <IconSymbol size={42} name="card.fill" color={'black'} style={styles.cardLogo} />
          <Text style={styles.cardName}>
            Custom Card
          </Text>
        </View>
      </TouchableHighlight>
      { noData ? <Text style={styles.noDataText}>NO CARDS...</Text> :
      <FlatList
        data={cards} 
        renderItem={({item}) =>
          <TouchableHighlight style={styles.cardSection} underlayColor={'lightgray'} onPress={() => {handleSelectedCard(item)}}>
            <View style={styles.separator}>
              <Image 
                source={{uri: item.image}}
                style={styles.cardLogo}
              />
              <Text style={styles.cardName}>
                {item.friendlyName}
              </Text>
            </View>
          </TouchableHighlight>
        }
      />}
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1
  },
  searchSection: {
    flexDirection: "row",
    height: 50,
    alignSelf: "center",
    marginTop: 10
  },
  searchIcon: {
    verticalAlign: "middle",
    marginRight: 10
  },
  searchbox: {
    width: 200,
    borderBottomWidth: 1,
    fontSize: 16,
    verticalAlign: "bottom",
    paddingBottom: 6,
    height: 35
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
    textAlign: "center",
    marginRight: 10
  },
  cardName: {
    fontSize: 20,
    width: "70%",
    alignSelf: "center"
  },
  cardSection:{
    width: "100%",
    height: 65,
  },
  noDataText: {
    fontSize: 20,
    fontStyle: "italic",
    textAlign: "center",
    marginTop: 30
  }
});
