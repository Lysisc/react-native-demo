'use strict';

var React = require('react-native');

var Swiper = require('react-native-swiper'); //轮播图组件

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

var Slider = React.createClass({
  render: function(){
    return (
      <Swiper style={styles.wrapper}
              showsButtons={true}
              buttonWrapperStyle={styles.buttonWrapperStyle}
              nextButton={<Text style={styles.nextButton}>〉</Text>}
              prevButton={<Text style={styles.prevButton}>〈</Text>}
              height={80}
              showsPagination={false}>
        <View style={styles.dateWrapper}>
          <TouchableHighlight style={styles.dateView}
              onPress={this.onSearchPressed}
              underlayColor={'#fff'}>
            <View>
              <Text style={[styles.dateFont14,styles.disable]}>一</Text>
              <Text style={[styles.dateFont16,styles.disable]}>24</Text>
            </View>
          </TouchableHighlight>
          <TouchableHighlight style={styles.dateView}
              onPress={this.onSearchPressed}
              underlayColor={'#fff'}>
            <View>
              <Text style={[styles.dateFont14,styles.disable]}>二</Text>
              <Text style={[styles.dateFont16,styles.disable]}>25</Text>
            </View>
          </TouchableHighlight>
          <TouchableHighlight style={styles.dateView}
              onPress={this.onSearchPressed}
              underlayColor={'#fff'}>
            <View>
              <Text style={[styles.dateFont14,styles.disable]}>三</Text>
              <Text style={[styles.dateFont16,styles.disable]}>26</Text>
            </View>
          </TouchableHighlight>
          <TouchableHighlight style={styles.dateView}
              onPress={this.onSearchPressed}
              underlayColor={'#fff'}>
            <View>
              <Text style={[styles.dateFont14,styles.disable]}>四</Text>
              <Text style={[styles.dateFont16,styles.disable]}>27</Text>
            </View>
          </TouchableHighlight>
          <TouchableHighlight style={styles.dateView}
              onPress={this.onSearchPressed}
              underlayColor={'#fff'}>
            <View>
              <Text style={[styles.dateFont14,]}>五</Text>
              <Text style={[styles.dateFont16,styles.today]}>28</Text>
            </View>
          </TouchableHighlight>
          <TouchableHighlight style={styles.dateView}
              onPress={this.onSearchPressed}
              underlayColor={'#fff'}>
            <View>
              <Text style={[styles.dateFont14,]}>六</Text>
              <Text style={[styles.dateFont16,]}>29</Text>
            </View>
          </TouchableHighlight>
          <TouchableHighlight style={styles.dateView}
              onPress={this.onSearchPressed}
              underlayColor={'#fff'}>
            <View>
              <Text style={[styles.dateFont14,]}>日</Text>
              <View style={styles.active}></View>
              <Text style={styles.dateFont16}>30</Text>
            </View>
          </TouchableHighlight>
        </View>
      </Swiper>
    );
  }
});

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
    this.props.navigator.pop();
  },

  _handleLeftButtonPress: function () {
    StatusBarIOS.setStyle(1, false);
  },

  _handleRightButtonPress: function () {
    // console.log(this.props.navigator);
    this.props.navigator.push({
      title: '列表页',
      component: SearchResults,
      backButtonTitle: '返回',
      // leftButtonTitle: '返回',
      // onLeftButtonPress: () => {this._resultsView && this._resultsView._handleLeftButtonPress()},
      passProps: {
        passData: '1234',
        ref: this.onResultsRef,
      }
    });
  },

  onResultsRef: function(resultsViewRef) {
    this._resultsView = resultsViewRef;
  },

  render: function() {

    // StatusBarIOS.setStyle(0, true); //设置状态栏颜色

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

        <Slider/>

        <View style={styles.flowRight}>
          <TextInput
            style={styles.searchInput}
            value={this.state.searchString}
            onChange={this.onSearchTextChanged}
            placeholder='请输入'/>
          <TouchableHighlight style={styles.button}
              onPress={this.onSearchPressed}
              underlayColor={'#99d9f4'}>
            <Text style={styles.buttonText}>Go</Text>
          </TouchableHighlight>
        </View>
        <TouchableHighlight style={styles.button}
            onPress={this.onAlertMessage}
            underlayColor={'#99d9f4'}>
          <Text style={styles.buttonText}>返回上一页</Text>
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
  nextButton: {
    color: '#ccc',
    fontSize: 20,
    left: 13,
  },
  prevButton: {
    color: '#ccc',
    fontSize: 20,
    right: 13,
  },
  wrapper: {
    flex: 1,
    paddingLeft: 12,
    paddingRight: 12,
  },
  dateWrapper: {
    flex: 1,
    flexDirection: 'row',
  },
  dateView: {
    flex: 1,
    flexDirection: 'row',
  },
  disable: {
    color: '#ccc',
    borderColor: '#fff',
  },
  today: {
    color: '#0790c7',
    borderColor: '#0790c7',
  },
  active: {
    color: '#fff',
    borderColor: '#0790c7',
    backgroundColor: '#0790c7',
    width: 32,
    height: 32,
    borderWidth: 1,
    borderRadius: 16,
  },
  dateFont14: {
    fontSize: 14,
    color: '#333',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 10,
  },
  dateFont16: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
    marginTop: -31,
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