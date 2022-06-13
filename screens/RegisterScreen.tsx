import React, {useState} from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {useRegisterMutation} from '../generated/graphql';
import {API_URL} from '../utils/config';

const RegisterScreen = ({navigation}) => {
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');

  const [register] = useRegisterMutation();

  const showAlert = mesaj => {
    Alert.alert('Eroare la inregistrare', mesaj);
  };

  const handleRegister = async () => {
    try {
      await register({
        variables: {
          password,
          email,
          firstName: firstname,
          lastName: lastname,
        },
      });
      navigation.navigate('SignIn');
    } catch (err) {
      if (err.message.includes('Network request failed')) {
        console.log('Api_ur', API_URL);
        showAlert('Verifica conexiunea la internet');
        return;
      }
      console.log('eeror', err);

      const DEFAULT_ERRORS = {
        email: 'Email invalid',
        firstName: 'Prenume Invalid',
        lastName: 'Nume invalid',
        password: 'Parola invalida',
      };

      const errors: {[key: string]: string} = {};
      err.graphQLErrors[0].extensions.exception.validationErrors.forEach(
        (validationErr: any) => {
          Object.values(validationErr.constraints).forEach((message: any) => {
            errors[validationErr.property] =
              message === 'already-taken' && validationErr.property === 'email'
                ? 'Email deja folosit'
                : DEFAULT_ERRORS[validationErr.property];
          });
        },
      );
      const mesajErori = Object.entries(errors)
        .map(([_key, val]) => {
          return val;
        })
        .join(', ');

      console.log('mesajeror', mesajErori, errors);
      showAlert(mesajErori);

      console.log(err);
    }
  };
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.logo}>Clothelo</Text>
      <View style={styles.inputView}>
        <TextInput
          style={styles.inputText}
          placeholder="Nume..."
          placeholderTextColor="#003f5c"
          onChangeText={text => setLastname(text)}
        />
      </View>
      <View style={styles.inputView}>
        <TextInput
          style={styles.inputText}
          placeholder="Prenume..."
          placeholderTextColor="#003f5c"
          onChangeText={text => setFirstname(text)}
        />
      </View>
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
      <TouchableOpacity style={styles.loginBtn} onPress={handleRegister}>
        <Text style={styles.loginText}>Creeaza cont</Text>
      </TouchableOpacity>
    </ScrollView>
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

export default RegisterScreen;
