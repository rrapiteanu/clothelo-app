import {
  ApolloClient,
  ApolloProvider,
  createHttpLink,
  InMemoryCache,
  split,
} from '@apollo/client';
import {setContext} from '@apollo/client/link/context';
import {WebSocketLink} from '@apollo/client/link/ws';
import {getMainDefinition} from '@apollo/client/utilities';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {NativeBaseProvider} from 'native-base';
import * as React from 'react';
import {Text} from 'react-native';
import AppNavigator from './navigation/AppNavigator';
import AuthContext from './utils/AuthContext';
import {API_URL, WS_URL} from './utils/config';

export default function App() {
  const [state, dispatch] = React.useReducer(
    (prevState, action) => {
      switch (action.type) {
        case 'RESTORE_TOKEN':
          return {
            ...prevState,
            userToken: action.token,
            isLoading: false,
          };
        case 'SIGN_IN':
          return {
            ...prevState,
            isSignout: false,
            isLoading: false,
            userToken: action.token,
          };
        case 'SIGN_OUT':
          return {
            ...prevState,
            isLoading: false,
            isSignout: true,
            userToken: null,
          };
      }
    },
    {
      isLoading: true,
      isSignout: false,
      userToken: null,
    },
  );

  React.useEffect(() => {
    const bootstrapAsync = async () => {
      let userToken;

      try {
        userToken = await AsyncStorage.getItem('userToken');
      } catch (e) {
        console.log('restore token failed');
      }

      dispatch({type: 'RESTORE_TOKEN', token: userToken});
    };

    bootstrapAsync();
  }, []);

  const authContext = React.useMemo(
    () => ({
      signIn: async data => {
        await AsyncStorage.setItem('userToken', data);
        dispatch({type: 'SIGN_IN', token: data});
      },
      signOut: async () => {
        await AsyncStorage.removeItem('userToken');
        dispatch({type: 'SIGN_OUT'});
      },
      signUp: async data => {
        dispatch({type: 'SIGN_IN', token: data});
      },
    }),
    [],
  );

  const [client, setClient] = React.useState(null);

  React.useEffect(() => {
    async function init() {
      const cache = new InMemoryCache();

      const httpLink = createHttpLink({
        uri: `${API_URL}/api`,
      });

      const authLink = setContext(async (_, {headers}) => {
        const token = await AsyncStorage.getItem('userToken');
        return {
          headers: {
            ...headers,
            authorization: token ? `Bearer ${token}` : '',
          },
        };
      });

      const finalHttpLink = authLink.concat(httpLink);

      const wsToken = await AsyncStorage.getItem('userToken');

      const wsLink = new WebSocketLink({
        uri: WS_URL,
        options: {
          reconnect: true,
          connectionParams: {
            authToken: wsToken,
          },
        },
      });

      const link = split(
        ({query}) => {
          const definition = getMainDefinition(query);
          return (
            definition.kind === 'OperationDefinition' &&
            definition.operation === 'subscription'
          );
        },
        wsLink,
        finalHttpLink,
      );

      setClient(
        new ApolloClient({
          link: link,
          cache,
        }),
      );
    }

    init().catch(console.error);
  }, [state]);

  if (!client) {
    return <Text>Initializing app...</Text>;
  }

  return (
    <ApolloProvider client={client}>
      <AuthContext.Provider value={authContext}>
        <NativeBaseProvider>
          <AppNavigator
            isLoggedIn={state.userToken}
            isLoading={state.isLoading}
          />
        </NativeBaseProvider>
      </AuthContext.Provider>
    </ApolloProvider>
  );
}
