/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
'use strict';

var React = require('react-native');

var Fetch = require('fetch');

var MOCKED_MOVIES_DATA = [
  {
    title: 'Title',
    year: '2015',
    posters: {
      thumbnail: 'http://i.imgur.com/UePbdph.jpg'
    }
  },
];

var {
  AppRegistry,
  StyleSheet,
  Text,
  Image,
  View,
} = React;

var nativeApp = React.createClass({
  render: function() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>
          Welcome to Native APP!
        </Text>
        <Text style={styles.instructions}>
          我现在就是写原生native，牛逼啊
        </Text>
        <Text style={styles.instructions}>
          Press Cmd+R to reload,{'\n'}
          Cmd+D or shake for dev menu
        </Text>
        <Image source={{uri: 'http://img1.cache.netease.com/f2e/news/commend/images/eplove326.jpg'}} style={styles.thumbnail}/>
      </View>
    );
  }
});

console.log(Fetch);

var styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#EEEEEE',
  },
  welcome: {
    fontSize: 26,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  thumbnail: {
    justifyContent: 'center',
    width: 163,
    height: 30,
  },
});

AppRegistry.registerComponent('nativeApp', () => nativeApp);
