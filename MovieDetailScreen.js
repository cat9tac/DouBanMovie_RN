'use strict';
var React=require('react-native');
var{
	View,
	StyleSheet,
	Text,
	Image,
	ScrollView,
	Dimensions,
	ProgressBarAndroid
}=React;

var REQUEST_MOVIE_DETAIL_URL = 'https://api.douban.com/v2/movie/subject/';
var coverWidth=Dimensions.get('window').width/2.2;
var coverHeight=Dimensions.get('window').height/2.5;

var MovieDetailScreen=React.createClass({
	getInitialState:function(){
		return({
			isLoading:false,
			});
	},
	componentDidMount:function(){
		this.setState({
			isLoading:true,
		});
		this.requstMovieDetail();
	},
	requstMovieDetail: function() {
		let url=REQUEST_MOVIE_DETAIL_URL+this.props.movie.id
    	fetch(url)
      		.then((response) => response.json())
      		.catch((error) => {
        		this.setState({
          			isLoading: false,
        		});        
      		})
      		.then((responseData) => {
      			this.detail = responseData;
      			console.log('summary : ' + this.detail.summary);
       			this.setState({
          			isLoading: false,
        		});
        		
      }).done();
  	},
	renderLoadingView:function(){
		return (
      <View style={styles.outSideContainer}>
      <View style={styles.container}>
        <ProgressBarAndroid styleAttr="Small"  />
        <Text style={{}}>正在加载详情</Text>
      </View>
      </View>
    )

	},
	getActors:function(movie){
		let actors=new Array();
		if(movie.directors[0]){
			actors.push(movie.directors[0]);
		}
		for(let i in movie.casts){
			actors.push(movie.casts[i].name);
		}
		if(movie.genres[0]){
			actors.push(movie.genres[0]);
		}
		return actors.join('/');

	},
	renderDetailView:function(){
		var summary = 'NO SUMMARY';
  		if(this.detail){
  			summary = this.detail.summary;
  		}
		return(
			<View style={styles.outSideContainer}>
			<ScrollView style={styles.detailContainer}
			showsVerticalScrollIndicator={false}>
			<View style={styles.detailContainerAbove}>
			<Image style={styles.bigCover}
			source={{uri:this.props.movie.images.large}}/>
			</View>
			<Text style={styles.detailTitle}>
			{this.props.movie.title}
			</Text>
			<View style={styles.detailRatingContainer}>
			<Text style={styles.detailRatingText}>
			{this.props.movie.rating.average}分
			</Text>
			<Text style={styles.detailStarsCountText}>
			{this.props.movie.rating.stars}人评分
			</Text>
			</View>
			<Text style={styles.detailActorsText}>
			{this.getActors(this.props.movie)}
			</Text>
			<View style={styles.detailSplitLine}>
			</View>
			<Text style={styles.detailSummaryTitle}>
			剧情简介
			</Text>
			<Text style={styles.detailSummaryText}>
			{summary}
			</Text>
			</ScrollView>
  			</View>

			);

	},


	render:function(){
		if(this.state.isLoading){
			return this.renderLoadingView();
		}
		return this.renderDetailView();
	}
});
var styles=StyleSheet.create({
	outSideContainer:{
		flex:1,
		flexDirection:'column',
		backgroundColor:'#FAFAFA',

	},
	container: {
	  	flex: 1,
    	justifyContent:'center',
    	alignItems:'center',
    	backgroundColor:'white',
	},
	detailContainer:{
		flex:1,
		flexDirection:'column',
		backgroundColor:'white',

	},
	detailContainerAbove:{
		flex:1,
		justifyContent:'center',
		alignItems:'center',
		backgroundColor:'#9a7972',

	},
	bigCover:{
		height:coverHeight,
		width:coverWidth,
		marginTop:15,
		marginBottom:15,

	},
	detailTitle:{
		fontSize:18,
		fontWeight:'500',
		marginTop:15,
		marginLeft:20,
	},
	detailRatingContainer:{
		flex:1,
		flexDirection:'row',
		marginTop:5,
	},
	detailRatingText:{
		color:'#b8b8b8',
		fontSize:11,
		marginLeft:21,
	},
	detailStarsCountText:{
		color:'#b8b8b8',
		fontSize:11,
		marginLeft:10,
	},
	detailActorsText:{
		color:'#a5a5a5',
		fontSize:12,
		marginTop:10,
		marginLeft:21,
		marginRight:100,

	},
	detailSplitLine:{
		height:0.5,
		backgroundColor:'#ececec',
		marginLeft:20,
		marginTop:10,
	},
	detailSummaryTitle:{
		color: '#9b9b9b',
		fontSize: 14,
		marginTop: 10,
		marginLeft: 21,
	},
	detailSummaryText:{
		color: '#4f4f4f',
		fontSize: 14,
		marginTop: 10,
		marginLeft: 21,
		marginRight: 21,
		marginBottom: 20,
	},

});

module.exports=MovieDetailScreen;
