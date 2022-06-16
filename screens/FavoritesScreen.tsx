import {clone} from 'lodash';
import React, {useRef} from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {Swipeable, TouchableOpacity} from 'react-native-gesture-handler';
import {
  GetFavoritesDocument,
  useGetFavoritesQuery,
  useRemoveFavouriteMutation,
} from '../generated/graphql';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexGrow: 1,
  },
  item: {
    fontSize: 18,
    marginBottom: 5,
  },
  image: {
    height: 100,
    borderRadius: 13,
  },

  textContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
  },
});

const FavouriteItem = ({
  data: {id, title, image},
  navigation,
  removeFromFavourites,
}) => {
  const swipeableRef = useRef(null);

  const handleItemSelect = () => {
    navigation.navigate('ItemDetails', {
      itemId: id,
      title,
      image,
    });
  };

  const handleRemove = () => {
    removeFromFavourites(id);
  };

  const renderRightActions = () => {
    return (
      <TouchableOpacity
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          padding: 10,
          backgroundColor: 'red',
        }}
        onPress={handleRemove}>
        <Text style={{color: 'white'}}>Remove</Text>
      </TouchableOpacity>
    );
  };

  return (
    <Swipeable
      ref={swipeableRef}
      renderRightActions={renderRightActions}
      rightThreshold={-100}>
      <TouchableOpacity onPress={handleItemSelect}>
        <View
          style={{
            borderBottomWidth: 1,
            borderColor: '#e0e0e0',
            padding: 10,
            backgroundColor: 'white',
          }}>
          <Text style={styles.item}>{title}</Text>
          <Image
            style={styles.image}
            source={{
              uri: image,
            }}
          />
        </View>
      </TouchableOpacity>
    </Swipeable>
  );
};

const FavoritesList = ({favorites, navigation, removeFromFavourites}) => {
  return (
    <FlatList
      data={favorites}
      renderItem={({item}) => (
        <FavouriteItem
          removeFromFavourites={removeFromFavourites}
          navigation={navigation}
          data={item}
        />
      )}
    />
  );
};

const FavoritesScreen = ({navigation}) => {
  const {data, loading, refetch} = useGetFavoritesQuery();
  const [removeFromFavourites] = useRemoveFavouriteMutation();

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      refetch();
    });

    return unsubscribe;
  }, [navigation]);

  console.log('data', data);

  const handleRemove = async id => {
    try {
      await removeFromFavourites({
        variables: {itemId: parseInt(id, 10)},
        optimisticResponse: {removeFavourite: true, __typename: 'Mutation'},
        update: store => {
          const temp: {getFavorites: any[]} | null = store.readQuery({
            query: GetFavoritesDocument,
          });

          if (temp && temp.getFavorites) {
            let update = clone(temp.getFavorites);
            update = update.filter((item: any) => item.id !== id);

            store.writeQuery({
              query: GetFavoritesDocument,
              data: {
                getFavorites: update,
              },
            });
          }
        },
      });
    } catch (error) {
      Alert.alert('Something went wrong while removing from favourite');
    }
  };

  return (
    <View style={styles.container}>
      {loading && (
        <ActivityIndicator animating={true} color="blue" size={'large'} />
      )}

      {data && data.getFavorites && data.getFavorites.length > 0 && (
        <FavoritesList
          favorites={data.getFavorites}
          navigation={navigation}
          removeFromFavourites={handleRemove}
        />
      )}

      {data && data.getFavorites && data.getFavorites.length === 0 && (
        <View style={styles.textContainer}>
          <Text>No favourites yet</Text>
        </View>
      )}
    </View>
  );
};

export default FavoritesScreen;
