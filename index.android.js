/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
'use strict';

var React = require('react-native');
var {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Navigator,
  BackAndroid,
  DrawerLayoutAndroid,
  ToolbarAndroid,
  TouchableHighlight,
  Image,
  ListView,
} = React;

var MovieListScreen=require('./MovieListScreen');
var MovieDetailScreen=require('./MovieDetailScreen');
var SplashScreen = require('./SplashScreen');
var TimerMixin = require('react-timer-mixin');

var _navigator;

BackAndroid.addEventListener('hardwareBackPress', () => {
  if (_navigator && _navigator.getCurrentRoutes().length > 1) {
    _navigator.pop();
    return true;
  }
  return false;
});

var DrawerLayout=React.createClass({
  getDefaultProps: function() {
    return {
      icon: {uri: "android_back_white", isStatic: true},
    }
  },

  openDrawer: function() {
    this.refs.drawer.openDrawer();
  },
    selectMenu: function(title, link) {
     this.props.navigator.push({
        title: title,
        name: link,
      });
    },
    
  renderMenu:function(menu){
    return(
      <View style={{}}>
      <TouchableHighlight
          style={{
            height: 50,
             padding: 20,
            paddingLeft: 30,
          }}
          underlayColor="white"
          onPress={() => this.selectMenu(menu.text, menu.link)}>
            <Text style={{color: 'white'}}>{menu.text}</Text>
        </TouchableHighlight>
      </View>
      );
  },


  render:function(){
    var dataSource=new ListView.DataSource({
      rowHasChanged: (row1, row2) => row1 !== row2,
    });

    var navigationView=(
      <View 
      style={{flex:1,
        backgroundColor:'white',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'stretch'}}>
        <View style={{
          flex: 1,
          justifyContent: 'center',
          height: 60,
          alignItems: 'stretch',
          backgroundColor: 'white',
          flexDirection: 'column',
        }}>
          <Text style={styles.logotext}>
          豆瓣电影
          </Text>
        </View>
        <View style={{ 
          flex: 2,
          backgroundColor: '#2FC5CC',
        }}>
        <ListView
        dataSource={dataSource.cloneWithRows([
          {
                id: 1,
                text: '正在上映',
                link: 'in_theaters'
            },
            {
                id: 2,
                text: '即将上映',
                link: 'coming_soon'
            },
            {
                id: 3,
                text: 'Top250',
                link: 'top250'
            },
            {
                id: 4,
                text: '北美票房榜',
                link: 'us_box'
            },
            ])}

            renderRow={this.renderMenu}
            style={styles.listMenu}
        />
        </View>
      </View>
      );


    return(
      <DrawerLayoutAndroid
      ref="drawer"
      drawerWidth={300}
      drawerPosition={DrawerLayoutAndroid.positions.Left}
      renderNavigationView={()=>navigationView}
      >
      <View style={{flex: 1}}>
          <ToolbarAndroid
            actions={[]}
            navIcon={this.props.icon}
            onIconClicked={this.openDrawer}
            style={styles.toolbar}
            titleColor="white"
            title={this.props.title}
             />
             {this.props.children}
        </View>
    
      </DrawerLayoutAndroid>
      );
  }
});
/*{icon:{uri:'android_search_white', isStatic: true}}*/



var RouteMapper=function(route,navigationOperations,onComponentRef){
    _navigator=navigationOperations;
    switch(route.name){
    case 'in_theaters':
    case 'coming_soon':
    case 'top250':
    case 'us_box':
    return(
        <DrawerLayout icon={{uri: "android_menu_white", isStatic: true}} title={route.title} navigator={navigationOperations}>
          <MovieListScreen category={route.name} navigator={navigationOperations}/>
        </DrawerLayout>
      );
    break;
    
    case 'movie':
    return(
      <View style={{flex: 1}}>
            <ToolbarAndroid
              actions={[]}
              navIcon={{uri: "android_back_white", isStatic: true}}
              onIconClicked={navigationOperations.pop}
              style={styles.toolbar}
              titleColor="white"
              title={route.title} />
      <MovieDetailScreen
      movie={route.movie}
      navigator={navigationOperations}
      title={route.title}
      />
      </View>
      );
    break;

    }
    return(<Text>Not Found</Text>);
  };

var DouBanMovie_RN = React.createClass({
  mixins: [TimerMixin],
  getInitialState: function() {
     return {
        splashed: false,
     };
  },
 componentDidMount: function() {
    this.setTimeout(
      () => {
        this.setState({splashed: true});
      },
      4000,
    );
  },
  render: function() {
    var initialRoute = {name: 'in_theaters', title: '正在上映', };
    if(!this.state.splashed){
      return ( <SplashScreen /> );
    }else{
    return (
      <Navigator
        style={styles.container}
        initialRoute={initialRoute}
        configureScene={() => Navigator.SceneConfigs.FadeAndroid}
        renderScene={RouteMapper} />
    );
    }
  }
});

var styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
  },
 

   toolbar: {
    backgroundColor: '#2FC5CC',
    height: 56,
  },
  listMenu: {

  },
   rowSeparator: {
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    height: 1,
    marginLeft: 4,
  },
   rowSeparatorHide: {
    opacity: 0.0,
  },
  logotext:{
    color:'#2FC5CC',
    textAlign: 'center',
    fontSize: 40,


  }
});

AppRegistry.registerComponent('DouBanMovie_RN', () => DouBanMovie_RN);
