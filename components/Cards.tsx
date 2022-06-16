import {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Alert,
  Button,
  Image,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import axios from 'axios';
import React from 'react';
import CardsSwiper from './CardsSwiper/CardsSwiper';
import Loader from './Loader';
import {API_URL} from '../utils/config';
import {useAddFavouriteMutation} from '../generated/graphql';

const LIMIT = 10;

function Cards(): JSX.Element {
  const [items, setItems] = useState([]);
  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);

  const [addFavourite] = useAddFavouriteMutation();

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async (off: number = 0) => {
    try {
      setLoading(true);
      const response = await axios.get<any[]>(
        `${API_URL}/items?offset=${offset}&limit=${LIMIT}`,
      );
      const list = response.data;

      setItems(list);
      setOffset(off);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      setError(true);
      Alert.alert('Something went wrong');
    }
  };

  const handleRefetch = async (isError = false) => {
    if (isError) {
      fetchItems(offset);
    } else {
      fetchItems(offset + LIMIT);
    }
  };

  const handleRetry = async () => {
    handleRefetch(true);
  };

  const handleSwipedRight = async (index: number) => {
    const itemId = items[index].id;
    console.log('item swiped right', itemId);

    try {
      await addFavourite({
        variables: {itemId},
      });
    } catch (err) {
      console.log('errorare la fav', err);
      Alert.alert('Something went wrong while adding to favourites');
    }
  };

  const renderYes = () => {
    return (
      <View style={styles.like}>
        <Text style={styles.likeLabel}>YEP</Text>
      </View>
    );
  };

  const renderNope = () => {
    return (
      <View style={styles.nope}>
        <Text style={styles.nopeLabel}>NOPE</Text>
      </View>
    );
  };

  if (error) {
    return (
      <View style={styles.container}>
        <Button title="Retry" onPress={handleRetry} />
      </View>
    );
  }

  if (loading && items.length === 0) {
    return (
      <View style={styles.container}>
        <ActivityIndicator animating={true} color="blue" size={'large'} />
      </View>
    );
  }

  if (!loading && items.length === 0) {
    return (
      <View style={styles.container}>
        <Text>Come back later</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Loader isLoading={loading} />

      <CardsSwiper
        loop={false}
        cards={items}
        renderYep={renderYes}
        renderNope={renderNope}
        onSwipedRight={handleSwipedRight}
        onNoMoreCards={handleRefetch}
        cardContainerStyle={styles.cardContainer}
        renderCard={card => (
          <View style={styles.card}>
            {card && (
              <Image
                style={styles.cardImg}
                source={{
                  uri: card.image,
                }}
              />
            )}
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardContainer: {
    width: '92%',
    height: '70%',
  },
  card: {
    width: '100%',
    height: '100%',
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.07,
    shadowRadius: 3.3,
  },
  cardImg: {
    width: '100%',
    height: '100%',
    borderRadius: 13,
  },
  noMoreCard: {
    width: '100%',
    height: '100%',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  like: {
    borderWidth: 5,
    borderRadius: 6,
    padding: 8,
    marginLeft: 30,
    marginTop: 20,
    borderColor: 'white',
    transform: [{rotateZ: '-22deg'}],
  },
  likeLabel: {
    fontSize: 32,
    color: 'white',
    fontWeight: 'bold',
  },
  nope: {
    borderWidth: 5,
    borderRadius: 6,
    padding: 8,
    marginRight: 30,
    marginTop: 25,
    borderColor: 'white',
    transform: [{rotateZ: '22deg'}],
  },
  nopeLabel: {
    fontSize: 32,
    color: 'white',
    fontWeight: 'bold',
  },
});

export default Cards;
