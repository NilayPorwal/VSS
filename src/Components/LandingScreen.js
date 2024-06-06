import React, { Component } from 'react';
import {
	Platform,
	Dimensions,
	StyleSheet,
	View,
	ScrollView,
	Text,
	StatusBar,
	SafeAreaView,
	TouchableOpacity,
	Image,
	ImageBackground,
	BackHandler
} from 'react-native';
import Carousel, { Pagination } from 'react-native-snap-carousel';
import SliderEntry from './SliderEntry';

const { height, width } = Dimensions.get('window');
const IS_ANDROID = Platform.OS === 'android';
const SLIDER_1_FIRST_ITEM = 0;

const ENTRIES1 = [
	{
		title: 'About Us',
		subtitle: 'Lorem ipsum dolor sit amet et nuncat mergitur',
		illustration: require('../Images/LandingScreen/aboutus.png')
	},
	{
		title: 'JVVNL USER',
		subtitle: 'Lorem ipsum dolor sit amet et nuncat mergitur',
		illustration: require('../Images/LandingScreen/signin.png')
	},
	{
		title: 'NEW USER',
		subtitle: 'Lorem ipsum dolor sit amet',
		illustration: require('../Images/LandingScreen/signup.png')
	}
];

global.LandingScreen;
export default class LandingScreen extends Component {
	// hide navigation backgroud
	static navigationOptions = { header: null };

	constructor(props) {
		super(props);
		this.state = {
			slider1ActiveSlide: SLIDER_1_FIRST_ITEM
		};
		global.LandingScreen = this;
	}

	componentDidMount() {
		BackHandler.addEventListener('hardwareBackPress', this.handleAndroidBackButton);
	}

	handleAndroidBackButton() {
		BackHandler.exitApp();
	}

	componentWillUnmount() {
		BackHandler.removeEventListener('hardwareBackPress', this.handleAndroidBackButton);
	}

	_renderItemWithParallax({ item, index }, parallaxProps) {
		// alert(index)
		return (
			<SliderEntry
				navigate={global.LandingScreen.props.navigation.navigate}
				index={index}
				data={item}
				even={(index + 1) % 2 === 0}
				parallax={true}
				parallaxProps={parallaxProps}
				onPress={global.LandingScreen.redirectTo.bind(this)}
			/>
		);
	}

	onPressBack() {
		this.setState({ slider1ActiveSlide: this.state.slider1ActiveSlide - 1 });
	}

	onPressNext() {
		this.setState({ slider1ActiveSlide: this.state.slider1ActiveSlide + 1 });
	}

	mainExample(number, title) {
		const { slider1ActiveSlide } = this.state;

		return (
			<View style={styles.exampleContainer}>
				<Carousel
					ref={c => (this._slider1Ref = c)}
					data={ENTRIES1}
					renderItem={this._renderItemWithParallax}
					sliderWidth={sliderWidth}
					itemWidth={itemWidth}
					hasParallaxImages={true}
					firstItem={SLIDER_1_FIRST_ITEM}
					inactiveSlideScale={0.94}
					inactiveSlideOpacity={0.7}
					// inactiveSlideShift={20}
					containerCustomStyle={styles.slider}
					contentContainerCustomStyle={styles.sliderContentContainer}
					loop={true}
					loopClonesPerSide={2}
					autoplay={true}
					autoplayDelay={500}
					autoplayInterval={3000}
					onSnapToItem={index => this.setState({ slider1ActiveSlide: index })}
				/>
				<Pagination
					dotsLength={ENTRIES1.length}
					activeDotIndex={slider1ActiveSlide}
					containerStyle={styles.paginationContainer}
					dotColor="#44acac"
					dotStyle={styles.paginationDot}
					inactiveDotColor="#282E43"
					inactiveDotOpacity={0.4}
					inactiveDotScale={0.6}
					carouselRef={this._slider1Ref}
					tappableDots={!!this._slider1Ref}
				/>
			</View>
		);
	}

	redirectTo() {
		if (global.LandingScreen.state.slider1ActiveSlide == 1) {
			global.LandingScreen.props.navigation.push('logInScreen');
		} else if (global.LandingScreen.state.slider1ActiveSlide == 2) {
			global.LandingScreen.props.navigation.push('SignUpScreen');
		} else {
			global.LandingScreen.props.navigation.push('AboutUsScreen');
		}
	}

	render() {
		const example1 = this.mainExample(
			1,
			'Default layout | Loop | Autoplay | Parallax | Scale | Opacity | Pagination with tappable dots'
		);

		return (
			<SafeAreaView style={styles.container}>
				<ImageBackground source={require('../Images/background.png')} style={{ width: '100%', height: '100%' }}>
					<View style={{ height: height * 0.4, alignItems: 'center', justifyContent: 'center' }}>
						<Image source={require('../Images/vss-left-logo-dashboard.png')} style={{}} />
					</View>
					<ScrollView style={styles.scrollview} scrollEventThrottle={200} directionalLockEnabled={true}>
						{example1}
					</ScrollView>

					{
						// <TouchableOpacity style={{margin:10, backgroundColor:"#ff7f00", borderRadius:10}} onPress={()=>this.redirectTo() } >
						//   <Text style={{color:"#ffffff", fontFamily:'GoogleSans-Medium', textAlign:"center", padding:15, fontSize:15}}>Continue</Text>
						//  </TouchableOpacity>
					}
				</ImageBackground>
			</SafeAreaView>
		);
	}
}

const IS_IOS = Platform.OS === 'ios';
const { width: viewportWidth, height: viewportHeight } = Dimensions.get('window');

function wp(percentage) {
	const value = (percentage * viewportWidth) / 100;
	return Math.round(value);
}

const slideHeight = viewportHeight * 0.36;
const slideWidth = wp(75);
const itemHorizontalMargin = wp(2);

const sliderWidth = viewportWidth;
const itemWidth = slideWidth + itemHorizontalMargin * 2;

const entryBorderRadius = 8;

const colors = {
	black: '#1a1917',
	gray: '#888888',
	background1: '#ffffff',
	background2: '#21D4FD'
};

const styles = StyleSheet.create({
	safeArea: {
		flex: 1,
		backgroundColor: colors.black
	},
	container: {
		flex: 1,
		justifyContent: 'center'

		// backgroundColor: "#282E43"
	},
	gradient: {
		...StyleSheet.absoluteFillObject
	},
	scrollview: {
		flex: 1,
		marginTop: 20
	},
	exampleContainer: {
		// paddingVertical: 30
	},
	exampleContainerDark: {
		backgroundColor: colors.black
	},
	exampleContainerLight: {
		backgroundColor: 'white'
	},
	title: {
		paddingHorizontal: 30,
		backgroundColor: 'transparent',
		color: 'rgba(255, 255, 255, 0.9)',
		fontSize: 20,
		fontFamily: 'GoogleSans-Medium',
		textAlign: 'center'
	},
	titleDark: {
		color: colors.black
	},
	subtitle: {
		marginTop: 5,
		paddingHorizontal: 30,
		backgroundColor: 'transparent',
		color: 'rgba(255, 255, 255, 0.75)',
		fontSize: 13,
		fontStyle: 'italic',
		textAlign: 'center'
	},
	slider: {
		marginTop: 15,
		overflow: 'visible' // for custom animations
	},
	sliderContentContainer: {
		paddingVertical: 10 // for custom animation
	},
	paginationContainer: {
		paddingVertical: 8
	},
	paginationDot: {
		width: 8,
		height: 8,
		borderRadius: 4,
		marginHorizontal: 8
	}
});
