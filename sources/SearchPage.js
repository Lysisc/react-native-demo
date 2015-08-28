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
  TouchableWithoutFeedback,
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

  // porpTypes: {
  //   username: React.PropTypes.string,
  //   age: React.propTypes.number,
  // },

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
      weekList: [],
    };
  },

  componentDidMount: function() { //get data

    var today = 28,
      todayIndex = 4,
      baseDate = [{
        index: 0,
        weekName: '一'
      }, {
        index: 1,
        weekName: '二'
      }, {
        index: 2,
        weekName: '三'
      }, {
        index: 3,
        weekName: '四'
      }, {
        index: 4,
        weekName: '五'
      }, {
        index: 5,
        weekName: '六'
      }, {
        index: 6,
        weekName: '日'
      }],

      buildDate = (n) => {

        var tmpArr = [],
            fristDay = today + n * 7 - (todayIndex + 1); //拿到每周第一天

        for (var i = 0; i < baseDate.length; i++) {

          fristDay++;

          var tmpDay = fristDay > 31 ? (fristDay - 31) : fristDay,
            tmpType = () => {
              if (fristDay > 28) {
                return '';
              }

              if (fristDay === 28) {
                return 'todayactive';
              }

              if (fristDay < 28) {
                return 'disable';
              }

            }();

          var item = {
            index: baseDate[i].index,
            weekName: baseDate[i].weekName,
            day: tmpDay,
            type: tmpType,
            weekIndex: n
          };

          tmpArr.push(item);

        }

      return tmpArr;

      };

    this.setState({
      weekList: [buildDate(0), buildDate(1), buildDate(2), buildDate(3)],
    });

    this.props.getSlider(this);

  },

  render: function(){

    var weekList = [],
        ds = this.state.dataSource;

    if (this.state.weekList.length === 0) {
      return <View></View>;
    }

    return (
      <Swiper style={styles.wrapper}
              loop={false}
              showsButtons={true}
              buttonWrapperStyle={styles.buttonWrapperStyle}
              nextButton={<Text style={styles.nextButton}>〉</Text>}
              prevButton={<Text style={styles.prevButton}>〈</Text>}
              height={80}
              showsPagination={false}>

        <ListView dataSource={ds.cloneWithRows(this.state.weekList[0])}
                  renderRow={this._dateList}
                  horizontal={true}
                  centerContent={true}
                  pageSize={7}
                  contentContainerStyle={styles.dateWrapper}/>
        
        <ListView dataSource={ds.cloneWithRows(this.state.weekList[1])}
                  renderRow={this._dateList}
                  horizontal={true}
                  centerContent={true}
                  pageSize={7}
                  contentContainerStyle={styles.dateWrapper}/>

        <ListView dataSource={ds.cloneWithRows(this.state.weekList[2])}
                  renderRow={this._dateList}
                  horizontal={true}
                  centerContent={true}
                  pageSize={7}
                  contentContainerStyle={styles.dateWrapper}/>

        <ListView dataSource={ds.cloneWithRows(this.state.weekList[3])}
                  renderRow={this._dateList}
                  horizontal={true}
                  centerContent={true}
                  pageSize={7}
                  contentContainerStyle={styles.dateWrapper}/>

      </Swiper>
    );
  },

  _dateList: function(v) {

    var styleCircle = styles.dateCircle,
        styleFont14 = styles.dateFont14,
        styleFont16 = styles.dateFont16,
        weekIndex = v.weekIndex;

    switch (v.type) {
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
    }

    return (
      <TouchableWithoutFeedback onPress={() => this._onDateListPressed(weekIndex, v.index)}>
        <View style={styles.dateView}>
          <Text style={styleFont14}>{v.weekName}</Text>
          <View style={styleCircle}>
            <Text style={styleFont16}>{v.day}</Text>
          </View>
        </View>
      </TouchableWithoutFeedback>
    );
  },

  _onDateListPressed: function(weekIndex, index) {

    var thisDay = this.state.weekList[weekIndex][index];

    if (/disable/g.test(thisDay.type)) {
      return;
    }

    if (/active/g.test(thisDay.type)) {

      thisDay.type.replace('active', '');

    } else {

      for (var i = 0; i < this.state.weekList.length; i++) {
        var iWeek = this.state.weekList[i];
        for (var j = 0; j < iWeek.length; j++) {
          iWeek[j].type = iWeek[j].type.replace('active', '');
        }
      }

      thisDay.type += 'active';

    }

    this.setState({
      weekList: this.state.weekList,
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
    return {
      searchString: 'london',
      isLoading: false,
      message: ''
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

    var self = this,
      tools = {
        getSlider: (slider) => {
          self.slider = slider;
        }
      };

    return (
      <View style={styles.container}>

        <Slider {...tools} message={1234}/>

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

    var weekList = this.slider.state.weekList;

    for (var i = 0; i < weekList.length; i++) {
      var iWeek = weekList[i];
      for (var j = 0; j < iWeek.length; j++) {
        iWeek[j].type = iWeek[j].type.replace('active', '');
        if (/today/g.test(iWeek[j].type)) {
          iWeek[j].type = 'todayactive';
        }
      }
    }

    this.slider.setState({
      dateList: weekList
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