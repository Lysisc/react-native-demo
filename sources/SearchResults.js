'use strict';

var React = require('react-native');

var {
  StyleSheet,
  Image, 
  View,
  TouchableHighlight,
  ListView,
  Text,
  Component,
  Navigator,
  AlertIOS,
} = React;

var REQUEST_URL = 'http://platform.sina.com.cn/sports_all/client_api?app_key=3571367214&_sport_t_=football&_sport_s_=opta&_sport_a_=teamOrder&type=213&season=2015&format=json'; //api

// class SearchResults extends Component {

var SearchResults = React.createClass({ //route下的视图

  getInitialState: function() {
    return {
      dataSource: new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2,
      }),
      loaded: false,
    };
  },

  // constructor(props) { //init
  //   super(props);

  //   this.state = {
  //     dataSource: new ListView.DataSource({
  //       rowHasChanged: (row1, row2) => row1 !== row2,
  //     }),
  //     loaded: false,
  //   };

  // }

  componentDidMount: function() { //get data
    this.fetchData();
  },

  _handleLeftButtonPress: function () {
    this.props.navigator.pop();
  },

  fetchData: function() { //ajax
    fetch(REQUEST_URL)
      .then((response) => response.json())
      .then((responseData) => {

        // console.log(responseData.result.data);

        this.setState({
          dataSource: this.state.dataSource.cloneWithRows(responseData.result.data),
          loaded: true,
        });
      }).catch(error => {
        alert('网络有问题！');
      })
      .done();
  },

  render: function() {

    if (!this.state.loaded) {
      return this.renderLoadingView();
    }

    return (    
      <ListView
        dataSource={this.state.dataSource}
        renderRow={this.renderTeam}
        pageSize={10}
        style={styles.listView} />
    );
  },

  renderLoadingView: function() { //loading tp
    return (
      <View style={styles.loading}>
        <Text>Loading teams...</Text>
      </View>
    );
  },

  renderTeam: function(team) { //item tp
    return (
      <TouchableHighlight onPress={() => this.rowPressed(team.team_cn.toString())}
        underlayColor={'#ddd'}>
        <View style={styles.container}>
          <Image source={{uri: team.logo}}
            style={styles.thumbnail}
          />
          <View style={styles.rightContainer}>
            <Text style={styles.name}>{team.team_cn}</Text>
            <Text style={styles.rank}>排名: {team.team_order}</Text>
          </View>
        </View>
      </TouchableHighlight>
    );
  },

  rowPressed: function(name) { //item event
    // console.log(require('nativeApp/index.ios.js'));
    // this.props.navigator.popToTop();
    
    AlertIOS.alert(
      '我是标题',
      '球队：' + name,
      [
        {text: 'Foo', onPress: () => console.log('Foo Pressed!')},
        {text: 'Bar', onPress: () => console.log('Bar Pressed!')},
      ]
    );

  }

// }
});

var styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
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
});

module.exports = SearchResults;