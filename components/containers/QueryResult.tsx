import {View} from 'native-base';
import React from 'react';
import {ActivityIndicator, Text} from 'react-native';

const QueryResult = ({loading, error, data, children}) => {
  if (loading) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator size="large" color="#3fb9f3" />
      </View>
    );
  } else if (error) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <Text>eroare</Text>
      </View>
    );
  } else {
    return children({data});
  }
};

export default QueryResult;
