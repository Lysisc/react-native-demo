'use strict';

var React = require('react-native');

var SearchResults = require('./SearchResults');

var {
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableHighlight,
  ActivityIndicatorIOS,
  Image,
  StatusBarIOS
} = React;

function urlForQueryAndPage(key, value, pageNumber) {
  var data = {
      country: 'uk',
      pretty: '1',
      encoding: 'json',
      listing_type: 'buy',
      action: 'search_listings',
      page: pageNumber
  };
  data[key] = value;

  var querystring = Object.keys(data)
    .map(key => key + '=' + encodeURIComponent(data[key]))
    .join('&');

  return 'http://api.nestoria.co.uk/api?' + querystring;
};

var SearchPage = React.createClass({ //route下的视图

  getInitialState: function() {
    return {
      searchString: 'london',
      isLoading: false,
      message: ''
    };
  },

  onSearchTextChanged: function(event) {
    this.setState({
      searchString: event.nativeEvent.text
    });
  },

  _executeQuery: function(query) {
    console.log(query);
    this.setState({
      isLoading: true
    });
    fetch(query)
      .then(response => response.json())
      .then(json => this._handleResponse(json.response))
      .catch(error => 
         this.setState({
          isLoading: false,
          message: 'Something bad happened ' + error
       }));
  },

  _handleResponse: function (response) {
    this.setState({ isLoading: false , message: '' });
    if (response.application_response_code.substr(0, 1) === '1') {
      console.log('Properties found: ' + response.listings.length);
    } else {
      this.setState({ message: 'Location not recognized; please try again.'});
    }
  },

  onSearchPressed: function() {
    var query = urlForQueryAndPage('place_name', this.state.searchString, 1);
    this._executeQuery(query);
  },

  onAlertMessage: function() {
    alert(1);
  },

  _handleRightButtonPress: function () {
    // console.log(this.props.navigator);
    this.props.navigator.push({
      title: 'Results',
      component: SearchResults,
      backButtonTitle: '返回'
    });
  },

  render: function() {

    StatusBarIOS.setStyle(0, true); //设置状态栏颜色

    var spinner = this.state.isLoading ?
    ( <View style={styles.loading}>
        <ActivityIndicatorIOS
          hidden='true'
          size='large'/>
        <Text>加载中...</Text>
      </View> ) :
    ( <View/>);

    return (
      <View style={styles.container}>
        <Text style={styles.description}>
          Search for houses to buy!
        </Text>
        <Text style={styles.description}>
          Search by place-name, postcode or search near your location.
        </Text>

        <View style={styles.flowRight}>
          <TextInput
            style={styles.searchInput}
            value={this.state.searchString}
            onChange={this.onSearchTextChanged}
            placeholder='请输入'/>
          <TouchableHighlight style={styles.button}
              onPress={this.onSearchPressed}
              underlayColor='#99d9f4'>
            <Text style={styles.buttonText}>Go</Text>
          </TouchableHighlight>
        </View>
        <TouchableHighlight style={styles.button}
            onPress={this.onAlertMessage}
            underlayColor='#99d9f4'>
          <Text style={styles.buttonText}>Location</Text>
        </TouchableHighlight>
        <Image source={require('image!house')} style={styles.image} />
        {spinner}
        <Text style={styles.description}>{this.state.message}</Text>
      </View>
    );
  },
  
});

var Dimensions = require('Dimensions');
var { width, height } = Dimensions.get('window');

var styles = StyleSheet.create({
  description: {
    marginBottom: 20,
    fontSize: 18,
    textAlign: 'center',
    color: '#656565'
  },
  container: {
    flex: 1,
    marginTop: 65,
    alignItems: 'stretch',
  },
  flowRight: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'stretch'
  },
  buttonText: {
    fontSize: 18,
    color: 'white',
    alignSelf: 'center'
  },
  button: {
    height: 36,
    padding: 15,
    flexDirection: 'row',
    backgroundColor: '#48BBEC',
    borderColor: '#48BBEC',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 10,
    alignSelf: 'stretch',
    justifyContent: 'center'
  },
  searchInput: {
    height: 36,
    padding: 4,
    marginRight: 5,
    flex: 4,
    fontSize: 18,
    borderWidth: 1,
    borderColor: '#48BBEC',
    borderRadius: 8,
    color: '#48BBEC'
  },
  image: {
    width: width,
    height: 200
  },
  loading: {
    marginTop: 20,
    alignSelf: 'center',
  }
});

module.exports = SearchPage;