import {useIsFocused} from '@react-navigation/native';
import {Button, Avatar} from 'native-base';
import React from 'react';
import {ScrollView, StyleSheet, Text, View} from 'react-native';
import {useMeQuery} from '../generated/graphql';
import AuthContext from '../utils/AuthContext';

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
  avatar: {
    height: 100,
    width: 100,
  },
  userName: {
    fontSize: 25,
  },
  button: {
    backgroundColor: 'red',
    padding: 10,
    marginTop: 5,
  },
  buttonEdit: {
    backgroundColor: 'green',
    padding: 10,
    marginTop: 5,
  },
  buttonEditDisabled: {
    backgroundColor: 'lightgray',
    padding: 10,
    marginTop: 5,
  },
  buttonDate: {
    backgroundColor: 'grey',
    padding: 10,
    justifyContent: 'flex-start',
    marginTop: 5,
  },
  input: {
    height: 55,
  },
});

const SettingsScreen = () => {
  const isFocused = useIsFocused();
  const {signOut}: any = React.useContext(AuthContext);
  const {data} = useMeQuery();

  const handleLogout = async () => {
    signOut();
  };

  if (!data) {
    return (
      <View>
        <Text>loading..</Text>
      </View>
    );
  }

  const {email, name, avatarUrl} = data.me;

  return (
    <ScrollView
      contentContainerStyle={{flex: 1, width: '100%', flexDirection: 'column'}}>
      {isFocused && (
        <View
          style={{
            flex: 1,
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Avatar style={styles.avatar} source={{uri: avatarUrl}} />
          <Text style={styles.userName}>{name}</Text>
          <Text>{email}</Text>

          <View style={{flexDirection: 'column', width: '100%', padding: 10}}>
            <Button
              onPress={handleLogout}
              style={styles.button}
              full
              color="red"
              accessibilityLabel="Delogare">
              <Text style={{color: 'white'}}>Delogare</Text>
            </Button>
          </View>
        </View>
      )}
    </ScrollView>
  );
};

export default SettingsScreen;
