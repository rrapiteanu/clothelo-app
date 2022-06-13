import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import React, {Fragment, useEffect, useState} from 'react';
import {Keyboard, Platform, Text, View} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import ForgotScreen from '../screens/ForgotScreen';
import HomeScreen from '../screens/HomeScreen';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import SettingsScreen from '../screens/SettingsScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const InboxScreen = () => {
  return (
    <View>
      <Text>inbox screen</Text>
    </View>
  );
};

const FavoritesScreen = () => {
  return (
    <View>
      <Text>FavoritesScreen</Text>
    </View>
  );
};

function MyTabs() {
  const [keyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    if (Platform.OS !== 'android') {
      return;
    }
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        setKeyboardVisible(false);
      },
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setKeyboardVisible(true);
      },
    );
    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: keyboardVisible ? {} : {},
        tabBarHideOnKeyboard: true,
      }}>
      <Tab.Screen
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({color, size}) => (
            <MaterialCommunityIcons name="home" color={color} size={size} />
          ),
        }}
        name="Home"
        component={HomeScreen}
      />

      <Tab.Screen
        options={{
          tabBarLabel: 'Favorites',
          tabBarIcon: ({color, size}) => (
            <MaterialCommunityIcons name="account" color={color} size={size} />
          ),
        }}
        name="Favorites"
        component={FavoritesScreen}
      />

      <Tab.Screen
        options={{
          tabBarLabel: 'Inbox',
          tabBarIcon: ({color, size}) => (
            <MaterialCommunityIcons name="inbox" color={color} size={size} />
          ),
        }}
        name="Inbox"
        component={InboxScreen}
      />

      <Tab.Screen
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({color, size}) => (
            <MaterialCommunityIcons name="account" color={color} size={size} />
          ),
        }}
        name="Settings"
        component={SettingsScreen}
      />
    </Tab.Navigator>
  );
}

const authScreens = {
  SignIn: LoginScreen,
  SignUp: RegisterScreen,
  Forgot: ForgotScreen,
};

const Screen1 = () => {
  return (
    <View>
      <Text>Screen1</Text>
    </View>
  );
};

const Screen2 = () => {
  return (
    <View>
      <Text>Screen2</Text>
    </View>
  );
};

const screens = {
  Screen2: {screen: Screen2, options: {headerShown: false}},
  Screen1: {
    screen: Screen1,
    options: {title: 'Screen1 Title'},
  },
};

const SplashScreen = () => {
  return (
    <View>
      <Text>splash screen</Text>
    </View>
  );
};

const AppNavigator = ({isLoggedIn, isLoading}: any) => {
  if (isLoading) {
    // We haven't finished checking for the token yet
    return <SplashScreen />;
  }
  return (
    <Fragment>
      {isLoggedIn && (
        <NavigationContainer>
          <Stack.Navigator
            screenOptions={{
              headerStyle: {
                backgroundColor: '#fff',
              },
              headerTintColor: '#000',
              headerTitleStyle: {
                fontWeight: 'bold',
              },
            }}>
            <Stack.Screen
              options={{headerShown: false}}
              name="Main"
              component={MyTabs}
            />
            {Object.entries({
              ...screens,
            }).map(([name, {screen, options = {}}]) => (
              <Stack.Screen
                name={name}
                options={options}
                component={screen}
                key={name}
              />
            ))}
          </Stack.Navigator>
        </NavigationContainer>
      )}
      {!isLoggedIn && (
        <NavigationContainer>
          <Stack.Navigator>
            {Object.entries({
              ...authScreens,
            }).map(([name, component]) => (
              <Stack.Screen
                name={name}
                component={component}
                key={name}
                options={{
                  headerShown: !['SignIn', 'SignUp', 'Forgot'].includes(name),
                }}
              />
            ))}
          </Stack.Navigator>
        </NavigationContainer>
      )}
    </Fragment>
  );
};

export default AppNavigator;
