/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
'use strict';

var React = require('react-native');

var Swiper = require('react-native-swiper'); //轮播图组件

var SearchPage = require('./sources/SearchPage'); //跳转页面的视图

var REQUEST_URL = 'http://platform.sina.com.cn/sports_all/client_api?app_key=3571367214&_sport_t_=football&_sport_s_=opta&_sport_a_=teamOrder&type=213&season=2015&format=json';

var {
  TouchableHighlight,
  DatePickerIOS,
  AppRegistry,
  StyleSheet,
  Image,
  Text,
  View,
  StatusBarIOS,
  ScrollView,
} = React;

var nativeApp = React.createClass({ //启动界面

  getDefaultProps: function() {
    return {
      wwww: '这个家伙很懒，什么都没留下'
    };
  },

  render: function() {

    StatusBarIOS.setStyle(1, false); //设置状态栏颜色

    return (
      <React.NavigatorIOS
        style={styles.container}
        barTintColor={'#35a8d4'}
        titleTextColor={'#fff'}
        tintColor={'#fff'}
        ref={'nav'}
        // itemWrapperStyle={styles.wrapper}
        initialRoute={{
          title: '首页',
          component: IndexPage,
          // backButtonTitle: 'Custom Back',
          leftButtonTitle: '变',
          onLeftButtonPress: this._handleLeftButtonPress,
          rightButtonTitle: '日程管理',
          onRightButtonPress: this._handleRightButtonPress,
          passProps: {
            exampleText: this.props.passProps || '暂无数据'
          },
        }}
        renderScene={this._onRenderScene}/>
    );

  },

  _handleLeftButtonPress: function() {
    StatusBarIOS.setStyle(1, true); //设置状态栏颜色
    this.refs.nav.pop();
  },

  _handleRightButtonPress: function() {

    this.refs.nav.push({
      title: '日程管理',
      component: SearchPage,
      // backButtonTitle: '返回',
      leftButtonTitle: '切回今天',
      onLeftButtonPress: () => {this._resultsView && this._resultsView._handleLeftButtonPress()},
      rightButtonTitle: '下一步',
      onRightButtonPress: () => {this._resultsView && this._resultsView._handleRightButtonPress()},
      passProps: {
        passData: '1234',
        ref: this._onResultsRef,
      }
    });
  },

  _onRenderScene: function () {
    console.log(this.props);
  },

  _onResultsRef: function(resultsViewRef) {
    this._resultsView = resultsViewRef;
  },

});

var sliderImgs = [
  'http://images3.c-ctrip.com/SBU/apph5/201505/16/app_home_ad16_640_128.png',
  'http://images3.c-ctrip.com/rk/apph5/C1/201505/app_home_ad49_640_128.png',
  'http://images3.c-ctrip.com/rk/apph5/D1/201506/app_home_ad05_640_128.jpg'
];
var Slider = React.createClass({
  render: function(){
    return (
      <Swiper style={styles.wrapper} showsButtons={true} autoplay={true} height={80} showsPagination={true}>
        <Image style={[styles.slide,]} source={{uri:sliderImgs[0]}}></Image>
        <Image style={[styles.slide,]} source={{uri:sliderImgs[1]}}></Image>
        <Image style={[styles.slide,]} source={{uri:sliderImgs[2]}}></Image>
      </Swiper>
    );
  }
});

var clickTimes = 0;

var IndexPage = React.createClass({ //route下的视图

  getInitialState: function() {
    return {
      clicked: false,
    };
  },
  
  render: function() {

    this.props.route.hideNavbar = false;

    console.log(this.props);

    return (
      <ScrollView contentContainerStyle={styles.container}
                  onScroll={() => {console.log('onScroll!')}}
                  scrollEventThrottle={200}>

        <Text style={styles.name}>{this.props.exampleText}</Text>
        <Text style={styles.name}>{this.state.clicked}</Text>


        <Slider/>


        <View style={[styles.sbu_red, styles.sbu_view]}>
          <TouchableHighlight onPress={this._changeState} underlayColor={'red'} style={{flex:1}}>
            <View style={[styles.sbu_flex, styles.sbu_borderRight]}>
              <View style={[styles.sub_con_flex, styles.sub_text]}>
                <Text style={[styles.font16]}>酒店</Text>
              </View>
            </View>
          </TouchableHighlight>
          <View style={[styles.sbu_flex, styles.sbu_borderRight]}>
            <View style={[styles.sub_con_flex, styles.sub_text, styles.sbu_borderBottom]}>
              <Text style={[styles.font16]}>海外</Text>
            </View>
            <View style={[styles.sub_con_flex, styles.sub_text]}>
                <Text style={[styles.font16]}>周边</Text>
            </View>
          </View>
          <View style={[styles.sbu_flex]}>
            <View style={[styles.sub_con_flex, styles.sub_text, styles.sbu_borderBottom]}>
              <Text style={[styles.font16]}>团购.特惠</Text>
            </View>
            <View style={[styles.sub_con_flex, styles.sub_text]}>
              <Text style={[styles.font16]}>客栈.公寓</Text>
            </View>
          </View>
        </View>

        <View style={[styles.sbu_blue, styles.sbu_view]}>
          <TouchableHighlight onPress={this._changeState} underlayColor={'red'} style={{flex:1}}>
            <View style={[styles.sbu_flex, styles.sbu_borderRight]}>
              <View style={[styles.sub_con_flex, styles.sub_text]}>
                <Text style={[styles.font16]}>酒店</Text>
              </View>
            </View>
          </TouchableHighlight>
          <View style={[styles.sbu_flex, styles.sbu_borderRight]}>
            <View style={[styles.sub_con_flex, styles.sub_text, styles.sbu_borderBottom]}>
              <Text style={[styles.font16]}>海外</Text>
            </View>
            <View style={[styles.sub_con_flex, styles.sub_text]}>
                <Text style={[styles.font16]}>周边</Text>
            </View>
          </View>
          <View style={[styles.sbu_flex]}>
            <View style={[styles.sub_con_flex, styles.sub_text, styles.sbu_borderBottom]}>
              <Text style={[styles.font16]}>团购.特惠</Text>
            </View>
            <View style={[styles.sub_con_flex, styles.sub_text]}>
              <Text style={[styles.font16]}>客栈.公寓</Text>
            </View>
          </View>
        </View>

        <View style={[styles.sbu_green, styles.sbu_view]}>
          <TouchableHighlight onPress={this._changeState} underlayColor={'red'} style={{flex:1}}>
            <View style={[styles.sbu_flex, styles.sbu_borderRight]}>
              <View style={[styles.sub_con_flex, styles.sub_text]}>
                <Text style={[styles.font16]}>酒店</Text>
              </View>
            </View>
          </TouchableHighlight>
          <View style={[styles.sbu_flex, styles.sbu_borderRight]}>
            <View style={[styles.sub_con_flex, styles.sub_text, styles.sbu_borderBottom]}>
              <Text style={[styles.font16]}>海外</Text>
            </View>
            <View style={[styles.sub_con_flex, styles.sub_text]}>
                <Text style={[styles.font16]}>周边</Text>
            </View>
          </View>
          <View style={[styles.sbu_flex]}>
            <View style={[styles.sub_con_flex, styles.sub_text, styles.sbu_borderBottom]}>
              <Text style={[styles.font16]}>团购.特惠</Text>
            </View>
            <View style={[styles.sub_con_flex, styles.sub_text]}>
              <Text style={[styles.font16]}>客栈.公寓</Text>
            </View>
          </View>
        </View>

        <View style={[styles.sbu_yellow, styles.sbu_view]}>
          <TouchableHighlight onPress={this._changeState} underlayColor={'red'} style={{flex:1}}>
            <View style={[styles.sbu_flex, styles.sbu_borderRight]}>
              <View style={[styles.sub_con_flex, styles.sub_text]}>
                <Text style={[styles.font16]}>酒店</Text>
              </View>
            </View>
          </TouchableHighlight>
          <View style={[styles.sbu_flex, styles.sbu_borderRight]}>
            <View style={[styles.sub_con_flex, styles.sub_text, styles.sbu_borderBottom]}>
              <Text style={[styles.font16]}>海外</Text>
            </View>
            <View style={[styles.sub_con_flex, styles.sub_text]}>
                <Text style={[styles.font16]}>周边</Text>
            </View>
          </View>
          <View style={[styles.sbu_flex]}>
            <View style={[styles.sub_con_flex, styles.sub_text, styles.sbu_borderBottom]}>
              <Text style={[styles.font16]}>团购.特惠</Text>
            </View>
            <View style={[styles.sub_con_flex, styles.sub_text]}>
              <Text style={[styles.font16]}>客栈.公寓</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    );
  },

  _changeState: function() {
    this.setState({
      clicked: 'clicked...' + clickTimes++
    });
  },

});

var styles = StyleSheet.create({
  container:{
    flex:1,
  },
  hide_nav_bar: {
    top: -64,
  },
  loading: {
    // border: '1px solid red',
    // flex: 1,
    height: 40,
    backgroundColor:'#F2F2F2',
    alignItems: 'center',
    justifyContent: 'center'
  },
  name: {
    fontSize: 20,
    lineHeight: 22,
    color: 'blue',
    alignSelf: 'center',
  },
  wrapper: {
    // backgroundColor:'#F2F2F2',
    height:80
  },
  slide: {
    height:80,
    resizeMode: Image.resizeMode.contain,
  },
  sbu_view:{
    height:84,
    marginLeft: 5,
    marginRight:5,
    borderWidth:1,
    borderRadius:5,
    marginBottom:10,
    flexDirection:'row',
  },
  sbu_red:{
    backgroundColor: '#FA6778',
    borderColor:'#FA6778',
  },
  sbu_blue:{
    backgroundColor: '#3D98FF',
    borderColor:'#3D98FF',
  },
  sbu_green:{
    backgroundColor: '#5EBE00',
    borderColor:'#5EBE00',
  },
  sbu_yellow:{
    backgroundColor: '#FC9720',
    borderColor:'#FC9720',
  },
  sbu_flex:{
    flex:1,
  },
  sbu_borderRight:{
    borderColor:'#fff',
    borderRightWidth: 0.5,
  },
  sbu_icon_img:{
    height:40,
    width:40,
    resizeMode:Image.resizeMode.contain,
  },
  sub_con_flex:{
    flex:1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sub_text:{
    justifyContent:'center',
  },
  font16:{
    fontSize:17,
    color:'#FFF',
    fontWeight:'900',
  },
  sbu_borderBottom:{
    borderBottomWidth:0.5,
    borderBottomColor:'#fff',
  },
  img_view:{
    height:62,
    marginLeft:5,
    marginRight:5,
    flexDirection: 'row',
    marginBottom:20,
    backgroundColor:'#fff',
  },
  img_flex:{
    flex:1,
    borderWidth:1,
    borderColor:'#ccc',
  },
  img_wh: {
    height:59,
    borderRightWidth:0,
    resizeMode:Image.resizeMode.contain,
  },
});

module.exports = nativeApp;

AppRegistry.registerComponent('nativeApp', () => nativeApp);
