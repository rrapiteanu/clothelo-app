import React, {useState} from 'react';
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {useLoginMutation} from '../generated/graphql';
import AuthContext from '../utils/AuthContext';

const LoginScreen = props => {
  const {signIn}: any = React.useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [login] = useLoginMutation();

  const showAlert = mesaj => {
    Alert.alert('Eroare la autentificare', mesaj);
  };

  const handleLogin = async () => {
    try {
      console.log(`[${email}][${password}]`);

      const res = await login({
        variables: {email, password},
      });

      console.log('res', res);

      signIn(res.data.login.accessToken);
    } catch (error) {
      if (error.message.includes('Network request failed')) {
        showAlert('Verifica conexiunea la internet');
        return;
      }

      if (error.graphQLErrors[0].message) {
        showAlert(error.graphQLErrors[0].message);
      }
      console.log(error);
    }
  };
  return (
    <View style={styles.container}>
      <Text style={styles.logo}>Clothelo</Text>
      <View style={styles.inputView}>
        <TextInput
          style={styles.inputText}
          placeholder="Email..."
          placeholderTextColor="#003f5c"
          onChangeText={text => setEmail(text)}
        />
      </View>
      <View style={styles.inputView}>
        <TextInput
          secureTextEntry
          style={styles.inputText}
          placeholder="Parola..."
          placeholderTextColor="#003f5c"
          onChangeText={text => setPassword(text)}
        />
      </View>
      <TouchableOpacity style={styles.loginBtn} onPress={handleLogin}>
        <Text style={styles.loginText}>Conecteaza-te</Text>
      </TouchableOpacity>
      <TouchableOpacity>
        <Text
          style={styles.loginText}
          onPress={() => props.navigation.push('SignUp')}>
          Creeaza un cont nou
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#003f5c',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    fontWeight: 'bold',
    fontSize: 50,
    color: '#fb5b5a',
    marginBottom: 40,
  },
  inputView: {
    width: '80%',
    backgroundColor: '#465881',
    borderRadius: 25,
    height: 50,
    marginBottom: 20,
    justifyContent: 'center',
    padding: 20,
  },
  inputText: {
    height: 50,
    color: 'white',
  },
  forgot: {
    color: 'white',
    fontSize: 11,
  },
  loginBtn: {
    width: '80%',
    backgroundColor: '#fb5b5a',
    borderRadius: 25,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 40,
    marginBottom: 10,
  },
  loginText: {
    color: 'white',
  },
});

export default LoginScreen;
