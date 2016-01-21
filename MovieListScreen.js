'use strict'

var React=require('react-native');
var{
	AppRegistry,
	StyleSheet,
	DrawerLayoutAndroid,
	ToolBarAndroid,
	TouchableHightLight,
	View,
	Text,
	Image,
	ProgressBarAndroid,	
	ListView,
	PullToRefreshViewAndroid,
}=React;

var MovieCell = require('./MovieCell');
var REQUEST_URL="http://api.douban.com/v2/movie/";

var MovieListScreen=React.createClass({
	getInitialState:function(){
		return({
			dataSource:new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2,}),
			isRefreshing: false,
			isFirstLoading: false,
			loaded: false,
			isScroll:true,
			});
	},
	componentDidMount: function() {
      this.setState({
          isFirstLoading: true,
          isRefreshing:false,
      });
        this.requestHotMovies();
  },
	 getDefaultProps: function() {
    return {
      category: 'in_theaters',
   
    };
  },

  _onRefresh:function(){
  	this.setState({isRefreshing: true});
    setTimeout(() => {
    	this.requestHotMovies();
    	this.setState({
    		isRefreshing: false,
    	});
    	
    }, 5000);
  },
requestHotMovies:function(){
	let  url = REQUEST_URL + this.props.category;
	fetch(url)
	.then((response) => response.json())
	.catch((error) => {
		this.setState({
			loaded: true,
			dataSource: this.getDataSource([]),
			isFirstLoading: false,
		});        
            })
            .then((responseData) => {
 
                this.setState({
                	loaded: true,
                	isFirstLoading: false,
                	dataSource: this.getDataSource(responseData.subjects),
                });
            }).done();

},
  
getDataSource: function(subjects: Array<any>): ListView.DataSource {

       return this.state.dataSource.cloneWithRows(subjects);
	
  },

	renderLoadingView: function() {
    return (
      <View style={styles.outSideContainer}>
      <View style={styles.container}>
        <ProgressBarAndroid styleAttr="Small"  />
        <Text style={styles.loadingText}>正在努力加载</Text>
      </View>
      </View>
    )
  },
  renderMovie:function(
  	movie: Object,
    sectionID: number | string,
    rowID: number | string,
    highlightRowFunc: (sectionID: ?number | string, rowID: ?number | string) => void) {
    return (
      <MovieCell
        key={movie.id}
        onSelect={() => this.selectMovie(movie)}
        onHighlight={() => highlightRowFunc(sectionID, rowID)}
        onUnhighlight={() => highlightRowFunc(null, null)}
        movie={movie} />
    );
  },

  selectMovie:function(movie){
  		this.props.navigator.push({
        title: movie.title,
        name: 'movie',
        movie: movie,
      });
  },
  renderSeparator:function(
  	sectionID:number|string,
  	rowID: number | string,
    adjacentRowHighlighted: boolean
  	){
    var style = styles.rowSeparator;
    if (adjacentRowHighlighted) {
        style = [style, styles.rowSeparatorHide];
    }
    return (
      <View key={'SEP_' + sectionID + '_' + rowID}  style={style}/>
    );
  },
  
  
	render:function(){
		if(!this.state.loaded){
			return this.renderLoadingView();
		}
		return(
			
			<ListView
			ref="listview"
			renderSeparator={this.renderSeparator}
			dataSource={this.state.dataSource}
			renderRow={this.renderMovie}
            style={styles.listView}
           
			/>


			);
	}
});
var styles = StyleSheet.create({
  outSideContainer: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#FAFAFA',
  },
    container: {
      flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
        backgroundColor: 'white',
    },
  titleBarSplitLine: {
    height: 1, 
    backgroundColor: '#e5e5e5',
  },
  loadingText: {
    fontSize: 14,
    textAlign: 'center',
    marginTop: 10,
  },
  rowSeparator: {
    backgroundColor: '#f5f5f5',
    height: 1,
    marginLeft: 10,
    marginRight: 10,
  },
  rowSeparatorHide: {
    opacity: 0.0,
  },
  toolbar: {
    backgroundColor: 'white',
    height: 50,
  },
  ratingbar: {
    height: 50,
    width: 200,
  },
   listView: {
    backgroundColor: '#F5FCFF',
  },
});
module.exports=MovieListScreen;