'use strict';

var React = require('react-native');

var Swiper = require('react-native-swiper'); //轮播图组件

var SearchResults = require('./SearchResults');

var {
  StyleSheet,
  Text,
  Image,
  TextInput,
  View,
  TouchableHighlight,
  TouchableOpacity,
  ActivityIndicatorIOS,
  StatusBarIOS,
  ListView,
  Navigator,
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

  getDefaultProps: function() {
    return {
      touchId: 1
    };
  },

  getInitialState: function() {
    return {
      dataSource: new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2,
      }),
    };
  },

  componentDidMount: function() { //get data
    var date = [{
      index: 0,
      day: 24,
      weekName: '一',
      type: 'disable'
    }, {
      index: 1,
      day: 25,
      weekName: '二',
      type: 'disable'
    }, {
      index: 2,
      day: 26,
      weekName: '三',
      type: 'disable'
    }, {
      index: 3,
      day: 27,
      weekName: '四',
      type: 'disable'
    }, {
      index: 4,
      day: 28,
      weekName: '五',
      type: 'disable'
    }, {
      index: 5,
      day: 29,
      isToday: true,
      weekName: '六',
      type: 'today'
    }, {
      index: 6,
      day: 30,
      weekName: '日',
      type: 'active'
    }];

    this.setState({
      dateList: date,
      dataSource: this.state.dataSource.cloneWithRows(date),
    });

  },

  // [1,2,3,4].map(i => {
  //   return (
  //     <ListView key={i} dataSource={this.state.dataSource}
  //               renderRow={this._dateList}
  //               horizontal={true}
  //               centerContent={true}
  //               pageSize={7}
  //               contentContainerStyle={styles.dateWrapper}/>
  //   )
  // })

  render: function(){

    this.props.getSlider(this);

    return (
      <Swiper style={styles.wrapper}
              showsButtons={true}
              buttonWrapperStyle={styles.buttonWrapperStyle}
              nextButton={<Text style={styles.nextButton}>〉</Text>}
              prevButton={<Text style={styles.prevButton}>〈</Text>}
              height={80}
              showsPagination={false}>

        <ListView dataSource={this.state.dataSource}
                  renderRow={this._dateList}
                  horizontal={true}
                  centerContent={true}
                  pageSize={7}
                  contentContainerStyle={styles.dateWrapper}/>

        <ListView dataSource={this.state.dataSource}
                  renderRow={this._dateList}
                  horizontal={true}
                  centerContent={true}
                  pageSize={7}
                  contentContainerStyle={styles.dateWrapper}/>

        <ListView dataSource={this.state.dataSource}
                  renderRow={this._dateList}
                  horizontal={true}
                  centerContent={true}
                  pageSize={7}
                  contentContainerStyle={styles.dateWrapper}/>

        <ListView dataSource={this.state.dataSource}
                  renderRow={this._dateList}
                  horizontal={true}
                  centerContent={true}
                  pageSize={7}
                  contentContainerStyle={styles.dateWrapper}/>
        
      </Swiper>
    );
  },

  _dateList: function(date) {
    var styleCircle = styles.dateCircle,
        styleFont14 = styles.dateFont14,
        styleFont16 = styles.dateFont16;

    switch (date.type) {
      case 'disable':
        styleFont14 = [styles.dateFont14, styles.disable];
        styleFont16 = [styles.dateFont16, styles.disable];
        break;
      case 'today':
        styleCircle = [styles.dateCircle, styles.todayCircle];
        styleFont16 = [styles.dateFont16, styles.todayFont16];
        break;
      case 'todayactive':
      case 'active':
        styleCircle = [styles.dateCircle, styles.activeCircle];
        styleFont16 = [styles.dateFont16, styles.activeFont16];
        break;
      default:
        styleCircle = styles.dateCircle;
        styleFont14 = styles.dateFont14;
        styleFont16 = styles.dateFont16;
    }

    return (
      <TouchableOpacity onPress={() => this._onDateListPressed(date.index)}
                        activeOpacity={1}>
        <View style={styles.dateView}>
          <Text style={styleFont14}>{date.weekName}</Text>
          <View style={styleCircle}>
            <Text style={styleFont16}>{date.day}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  },

  _onDateListPressed: function(index) {

    var thisObj = this.state.dateList[index];

    if (/disable/g.test(thisObj.type)) {
      return;
    }

    for (var i = 0; i < this.state.dateList.length; i++) {
      this.state.dateList[i].type = this.state.dateList[i].type.replace('active', '');
    }

    if (!/active/g.test(thisObj.type)) {
      thisObj.type += 'active';
    }

    this.setState({
      dateList: this.state.dateList,
    });
  },

});

//组件的生命周期
// componentWillMount：组件创建之前
// getInitialState：初始化状态
// render：渲染视图
// componentDidMount：渲染视图完成后
// componentWillUnmount：组件被卸载之前

var SearchPage = React.createClass({ //route下的视图

  // porpTypes:{
  //   username: React.PropTypes.string,
  //   age: React.propTypes.number,
  // },

  getDefaultProps: function() {
    return {
      getSlider: 123
    };
  },

  getInitialState: function() {
    var self = this;
    return {
      searchString: 'london',
      isLoading: false,
      getSlider: (slider) => {
        self.slider = slider;
      },
    };
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

        <Slider {...this.state}/>

        <View style={styles.flowRight}>
          <TextInput
            style={styles.searchInput}
            value={this.state.searchString}
            onChange={this._onSearchTextChanged}
            placeholder='请输入'/>
          <TouchableHighlight style={styles.button}
              onPress={this._onSearchPressed}
              underlayColor={'#99d9f4'}>
            <Text style={styles.buttonText}>Go</Text>
          </TouchableHighlight>
        </View>

        <TouchableHighlight style={styles.button}
            onPress={this._onAlertMessage}
            underlayColor={'#99d9f4'}>
          <Text style={styles.buttonText}>返回上一页</Text>
        </TouchableHighlight>

        {spinner}

        <Text style={styles.description}>{this.state.message}</Text>

      </View>
    );
  },

  _onSearchTextChanged: function(event) {
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

  _onSearchPressed: function() {
    var query = urlForQueryAndPage('place_name', this.state.searchString, 1);
    this._executeQuery(query);
  },

  _onAlertMessage: function() {
    this.props.navigator.pop();
  },

  _handleLeftButtonPress: function() {

    var sliderState = this.slider.state;

    for (var i = 0; i < sliderState.dateList.length; i++) {
      sliderState.dateList[i].type = sliderState.dateList[i].type.replace('active', '');
      if (/today/g.test(sliderState.dateList[i].type)) {
        sliderState.dateList[i].type = 'todayactive';
      }
    }

    this.slider.setState({
      dateList: sliderState.dateList
    });

  },

  _handleRightButtonPress: function() {
    // console.log(this.props.navigator);
    this.props.navigator.push({
      title: '列表页',
      component: SearchResults,
      backButtonTitle: '返回',
      // leftButtonTitle: '返回',
      // onLeftButtonPress: () => {this._resultsView && this._resultsView._handleLeftButtonPress()},
      passProps: {
        passData: '1234',
        ref: this._onResultsRef,
      }
    });
  },

  _onResultsRef: function(resultsViewRef) {
    this._resultsView = resultsViewRef;
  },
  
});

// <Image source={require('image!house')} style={styles.image} />

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
    paddingLeft: 12,
    paddingRight: 12,
  },
  dateWrapper: {
    width: width,
    paddingRight: 48,
  },
  dateView: {
    flex: 1,
    alignItems: 'center',
  },
  dateFont14: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
    marginBottom: 10,
  },
  dateFont16: {
    color: '#333',
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
    backgroundColor: 'transparent',
  },
  dateCircle: {
    width: 32,
    height: 32,
    borderWidth: 1,
    borderColor: '#fff',
    backgroundColor: 'transparent',
    borderRadius: 16,
  },
  todayCircle: {
    borderColor: '#0790c7',
    backgroundColor: '#fff',
  },
  activeCircle: {
    borderColor: '#0790c7',
    backgroundColor: '#0790c7',
  },
  disable: {
    color: '#ccc',
  },
  todayFont16: {
    color: '#0790c7',
  },
  activeFont16: {
    color: '#fff',
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