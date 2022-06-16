import React, {useEffect} from 'react';
import {
  ActivityIndicator,
  Text,
  Alert,
  Button,
  Image,
  StyleSheet,
  View,
} from 'react-native';
import {useGetItemQuery} from '../generated/graphql';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  imageContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  item: {
    padding: 10,
    fontSize: 18,
    height: 44,
  },
  image: {
    height: 180,
    width: 180,
    marginBottom: 10,
  },
  itemName: {
    fontSize: 25,
  },
  detailsContainer: {
    marginTop: 15,
    marginBottom: 15,
    flexDirection: 'column',
  },
});

const ItemScreen = ({route, navigation}) => {
  const {itemId, title} = route.params;

  const {data} = useGetItemQuery({
    variables: {itemId: parseInt(itemId, 10)},
  });

  const handleBuy = () => {
    Alert.alert('You bought ' + title);
  };

  useEffect(() => {
    if (title) {
      navigation.setOptions({
        title,
      });
    }
  }, [title, navigation]);

  if (!data) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#3fb9f3" />
      </View>
    );
  }

  const item = data.getItem;

  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <Image style={styles.image} source={{uri: item.image}} />
      </View>
      <View>
        <Text style={styles.itemName}>{item.title}</Text>
      </View>
      <View style={styles.detailsContainer}>
        <Text>Price: {item.price}</Text>
        <Text>Description: {item.description}</Text>
      </View>

      <Button title="Buy item" onPress={handleBuy} />
    </View>
  );
};

export default ItemScreen;
