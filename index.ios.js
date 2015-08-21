/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
'use strict';

var React = require('react-native');

var SearchPage = require('./sources/SearchPage'); //跳转页面的视图

var REQUEST_URL = 'http://platform.sina.com.cn/sports_all/client_api?app_key=3571367214&_sport_t_=football&_sport_s_=opta&_sport_a_=teamOrder&type=213&season=2015&format=json';

var {
  DatePickerIOS,
  AppRegistry,
  Image,
  ListView,
  StyleSheet,
  Text,
  View,
  StatusBarIOS,
  ScrollView,
} = React;


var nativeApp = React.createClass({ //启动界面

  _handleLeftButtonPress: function() {
    console.log(this.refs.nav);
    StatusBarIOS.setStyle(1, true); //设置状态栏颜色
    this.refs.nav.pop();
  },

  _handleRightButtonPress: function() {

    this.refs.nav.push({
      title: '新页面',
      component: SearchPage,
      backButtonTitle: '返回',
      rightButtonTitle: '下一步',
      onRightButtonPress: () => { this._resultsView && this._resultsView._handleRightButtonPress(); },
      passProps: {
        passData: '1234',
        ref: this.onResultsRef,
      }
    });
  },

  onRenderScene: function () {
    console.log(this.props);
  },

  onResultsRef: function(resultsViewRef) {
    this._resultsView = resultsViewRef;
  },

  render: function() {

    StatusBarIOS.setStyle(1, false); //设置状态栏颜色

    return (
      <React.NavigatorIOS
        style={styles.wrapper}
        barTintColor='#35a8d4'
        titleTextColor='#fff'
        tintColor='#fff'
        ref='nav'
        // itemWrapperStyle={styles.wrapper}
        initialRoute={{
          title: '日程管理',
          component: IndexPage,
          // backButtonTitle: 'Custom Back',
          leftButtonTitle: '切回今天',
          onLeftButtonPress: this._handleLeftButtonPress,
          rightButtonTitle: '下一步',
          onRightButtonPress: this._handleRightButtonPress,
          passProps: {exampleText: this.props.passProps || '暂无数据'},
        }}
        renderScene={this.onRenderScene} />
    );
  }
});

var IndexPage = React.createClass({ //route下的视图

  getInitialState: function() {
    return {
      dataSource: new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2,
      }),
      loaded: false,
    };
  },

  // componentDidMount: function() {
  //   this.fetchData();
  // },

  // fetchData: function() {
  //   fetch(REQUEST_URL)
  //     .then((response) => response.json())
  //     .then((responseData) => {
  //       this.setState({
  //         dataSource: this.state.dataSource.cloneWithRows(responseData.result.data),
  //         loaded: true,
  //       });
  //     })
  //     .done();
  // },
  
  render: function() {

    // if (!this.state.loaded) {
    //   return this.renderLoadingView();
    // }

    return (    
      // <ListView
      //   dataSource={this.state.dataSource}
      //   renderRow={this.renderTeam}
      //   style={styles.listView} />
      <ScrollView contentContainerStyle={styles.loading}>
        <Text style={styles.name}>{this.props.exampleText}</Text>
      </ScrollView>
    );
  },

  renderLoadingView: function() {
    return (
      <View style={styles.loading}>
        <Text>Loading teams...</Text>
      </View>
    );
  },

  // renderTeam: function(team) {
  //   return (
  //     <View style={styles.container}>
  //       <Image
  //         source={{uri: team.logo}}
  //         style={styles.thumbnail}
  //       />
  //       <View style={styles.rightContainer}>
  //         <Text style={styles.name}>{team.team_cn}</Text>
  //         <Text style={styles.rank}>排名: {team.team_order}</Text>
  //       </View>
  //     </View>
  //   );
  // },

});

var styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#F5FCFF',
    marginBottom: 20,
  },
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  listView: {
    padding: 20,
    backgroundColor: '#F5FCFF',
  },
  thumbnail: {
    width: 42.5,
    height: 42.5,
  },
  rightContainer: {
    marginLeft: 20,
  },
  name: {
    fontSize: 20,
    lineHeight: 22,
    color: 'blue',
  },
  rank: {
    color: 'red',
  },
  wrapper: {
    flex: 1,
  },
  button: {
    backgroundColor: '#eeeeee',
    padding: 10,
  },
});

module.exports = IndexPage;

AppRegistry.registerComponent('nativeApp', () => nativeApp);
