import { getFocusedRouteNameFromRoute, NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import 'expo-asset';
import * as firebase from 'firebase';
import _ from 'lodash';
import React, { Component } from 'react';
import { Image, LogBox } from 'react-native';
import { Provider } from 'react-redux';
import { applyMiddleware, createStore } from 'redux';
import thunk from 'redux-thunk';
import LoginScreen from './components/auth/Login';
import RegisterScreen from './components/auth/Register';
import MainScreen from './components/Main';
import SaveScreen from './components/main/add/Save';
import ChatScreen from './components/main/chat/Chat';
import ChatListScreen from './components/main/chat/List';
import CommentScreen from './components/main/post/Comment';
import PostScreen from './components/main/post/Post';
import EditScreen from './components/main/profile/Edit';
import ProfileScreen from './components/main/profile/Profile';
import BlockedScreen from './components/main/random/Blocked';
import { container } from './components/styles';
import rootReducer from './redux/reducers';
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

const store = createStore(rootReducer, applyMiddleware(thunk))

LogBox.ignoreLogs(['Setting a timer']);
const _console = _.clone(console);
console.warn = message => {
  if (message.indexOf('Setting a timer') <= -1) {
    _console.warn(message);
  }
};

// Import the functions you need from the SDKs you need
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAl17XoaXOyGS_fC_VIvlacIKRM1KahDb4",
  authDomain: "dh-23-ca72c.firebaseapp.com",
  databaseURL: "https://dh-23-ca72c-default-rtdb.firebaseio.com",
  projectId: "dh-23-ca72c",
  storageBucket: "dh-23-ca72c.appspot.com",
  messagingSenderId: "1067223079092",
  appId: "1:1067223079092:web:804335e60eee4886e89fe1",
  measurementId: "G-80BFHM8XW8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

const logo = require('./assets/logo.png')

if (firebase.apps.length === 0) {
  firebase.initializeApp(firebaseConfig)
}

const Stack = createStackNavigator();

export class App extends Component {
  constructor(props) {
    super()
    this.state = {
      loaded: false,
    }
  }

  componentDidMount() {
    firebase.auth().onAuthStateChanged((user) => {
      if (!user) {
        this.setState({
          loggedIn: false,
          loaded: true,
        })
      } else {
        this.setState({
          loggedIn: true,
          loaded: true,
        })
      }
    })
  }
  render() {
    const { loggedIn, loaded } = this.state;
    if (!loaded) {
      return (
        <Image style={container.splash} source={logo} />
      )
    }

    if (!loggedIn) {
      return (
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Login">
            <Stack.Screen name="Register" component={RegisterScreen} navigation={this.props.navigation} options={{ headerShown: false }} />
            <Stack.Screen name="Login" navigation={this.props.navigation} component={LoginScreen} options={{ headerShown: false }} />
          </Stack.Navigator>
        </NavigationContainer>
      );
    }

    return (
      <Provider store={store}>
        <NavigationContainer >
          <Stack.Navigator initialRouteName="Main">
            <Stack.Screen key={Date.now()} name="Main" component={MainScreen} navigation={this.props.navigation} options={({ route }) => {
              const routeName = getFocusedRouteNameFromRoute(route) ?? 'Feed';

              switch (routeName) {
                case 'Camera': {
                  return {
                    headerTitle: 'Camera',
                  };
                }
                case 'chat': {
                  return {
                    headerTitle: 'Chat',
                  };
                }
                case 'Profile': {
                  return {
                    headerTitle: 'Profile',
                  };
                }
                case 'Search': {
                  return {
                    headerTitle: 'Search',
                  };
                }
                case 'Feed':
                default: {
                  return {
                    headerTitle: 'Instagram',
                  };
                }
              }
            }}
            />
            <Stack.Screen key={Date.now()} name="Save" component={SaveScreen} navigation={this.props.navigation} />
            <Stack.Screen key={Date.now()} name="video" component={SaveScreen} navigation={this.props.navigation} />
            <Stack.Screen key={Date.now()} name="Post" component={PostScreen} navigation={this.props.navigation} />
            <Stack.Screen key={Date.now()} name="Chat" component={ChatScreen} navigation={this.props.navigation} />
            <Stack.Screen key={Date.now()} name="ChatList" component={ChatListScreen} navigation={this.props.navigation} />
            <Stack.Screen key={Date.now()} name="Edit" component={EditScreen} navigation={this.props.navigation} />
            <Stack.Screen key={Date.now()} name="Profile" component={ProfileScreen} navigation={this.props.navigation} />
            <Stack.Screen key={Date.now()} name="Comment" component={CommentScreen} navigation={this.props.navigation} />
            <Stack.Screen key={Date.now()} name="ProfileOther" component={ProfileScreen} navigation={this.props.navigation} />
            <Stack.Screen key={Date.now()} name="Blocked" component={BlockedScreen} navigation={this.props.navigation} options={{ headerShown: false }} />
          </Stack.Navigator>
        </NavigationContainer>
      </Provider>
    )
  }
}

export default App
