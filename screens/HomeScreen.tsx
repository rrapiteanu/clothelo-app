import {Box} from 'native-base';
import React from 'react';
import {StatusBar, StyleSheet, View} from 'react-native';
import Cards from '../components/Cards';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 22,
  },
  item: {
    padding: 10,
    fontSize: 18,
    height: 44,
  },
  button: {
    margin: 5,
  },
});

const HomeScreen = ({navigation}) => {
  const goToSpecialtySelect = () => {
    navigation.navigate('SpecialtySelect');
  };

  const goToSymptomPicker = () => {
    navigation.navigate('SymptomPicker');
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ecf0f1" />
      <Box
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          flex: 1,
        }}>
        <Cards />
      </Box>
    </View>
  );
};

export default HomeScreen;
