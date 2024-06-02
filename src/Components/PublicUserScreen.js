import React, { Component } from 'react';
import {
	Platform,
	StyleSheet,
	Text,
	View,
	Linking,
	Image,
	TouchableOpacity,
	ToastAndroid,
	Dimensions,
	BackHandler,
	ImageBackground,
	KeyboardAvoidingView,
	ScrollView,
	TextInput,
	Alert,
	Modal,
	TouchableWithoutFeedback,
	AsyncStorage,
	ActivityIndicator,
	CheckBox
} from 'react-native';
import LocalStorageManager from './Managers/LocalStorageManager';
import APIManager from './Managers/APIManager';
import { Base64 } from 'js-base64';
import Loader from 'react-native-modal-loader';
import Icon from 'react-native-vector-icons/Feather';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';

const { height, width } = Dimensions.get('window');
export default class PublicUserScreen extends Component {
	constructor(props) {
		super(props);
		this.state = {
			displayName: null
		};
		global.logInScreen = this;
	}

	static navigationOptions = {
		header: (
			<Image
				source={require('../Images/Header3.png')}
				style={{ width: '100%', marginTop: Platform.OS === 'ios' ? 24 : 0 }}
			/>
		),

		headerLeft: null
	};

	async componentDidMount() {
		await AsyncStorage.getItem('displayName').then(value => {
			if (value != null) {
				this.setState({ displayName: value });
			}
		});

		BackHandler.addEventListener('hardwareBackPress', this.handleAndroidBackButton);
	}

	handleAndroidBackButton() {
		BackHandler.exitApp();
	}

	componentWillUnmount() {
		BackHandler.removeEventListener('hardwareBackPress', this.handleAndroidBackButton);
	}

	redirectTo(screen) {
		this.props.navigation.navigate(screen);
	}

	async onLogOut() {
		await AsyncStorage.removeItem('login');
		await AsyncStorage.removeItem('displayName');
		this.props.navigation.navigate('LandingScreen');
	}

	render() {
		return (
			<ImageBackground source={require('../Images/background.png')} style={{ width: '100%', height: '100%' }}>
				<Text
					style={{
						fontSize: 18,
						fontFamily: 'GoogleSans-Medium',
						marginTop: 25,
						color: 'black',
						letterSpacing: 3,
						paddingHorizontal: 10,
						textAlign: 'center'
					}}
				>
					WELCOME
				</Text>
				<Text
					style={{
						fontSize: 18,
						fontFamily: 'GoogleSans-Medium',
						marginTop: 5,
						color: 'black',
						letterSpacing: 3,
						paddingHorizontal: 10,
						textAlign: 'center'
					}}
				>
					{this.state.displayName}
				</Text>

				<View style={styles.container}>
					{
						//  <View style={{borderWidth:1, borderColor:"#D3D3D3", borderRadius:10, width:width*0.8, backgroundColor:"#ffffff", elevation:8}}>
						//   <TouchableOpacity onPress={()=>this.redirectTo("AboutUsScreen")} style={[styles.tab, {borderBottomWidth:1}]}>
						//    <Text style={styles.text} >About Us</Text>
						//    <Icon name="chevron-right" size={20} />
						//   </TouchableOpacity>
						//   <TouchableOpacity onPress={()=>this.redirectTo("ContactUsScreen")} style={[styles.tab, {borderBottomWidth:1}]}>
						//    <Text style={styles.text}>Contact Us</Text>
						//    <Icon name="chevron-right" size={20} />
						//   </TouchableOpacity>
						//  <TouchableOpacity onPress={()=>this.redirectTo("FeedbackScreen")} style={[styles.tab, {borderBottomWidth:1}]}>
						//    <Text style={styles.text}>Give your Feedback</Text>
						//    <Icon name="chevron-right" size={20} />
						//   </TouchableOpacity>
						//   <TouchableOpacity onPress={()=>this.onLogOut()} style={[styles.tab]}>
						//    <Text style={styles.text}>Log Out</Text>
						//     <SimpleLineIcons name='logout' size={20}  />
						//   </TouchableOpacity>
						// </View>
					}

					<View style={{ flexDirection: 'row', width: '90%' }}>
						<TouchableOpacity
							onPress={() => this.redirectTo('ContactUsScreen')}
							style={{ width: '50%', justifyContent: 'center', alignItems: 'center' }}
						>
							<Image
								source={require('../Images/PublicUserIcons/contactus.png')}
								style={{ borderWidth: 1, borderRadius: 5, elevation: 10 }}
							/>
						</TouchableOpacity>

						<TouchableOpacity
							onPress={() => this.redirectTo('FeedbackScreen')}
							style={{ width: '50%', justifyContent: 'center', alignItems: 'center' }}
						>
							<Image
								source={require('../Images/PublicUserIcons/feedback.png')}
								style={{ borderWidth: 1, borderRadius: 5, elevation: 10 }}
							/>
						</TouchableOpacity>
					</View>

					<View style={{ flexDirection: 'row', width: '90%', marginTop: 50 }}>
						<TouchableOpacity
							onPress={() => this.props.navigation.navigate('ComplaintsScreen')}
							style={{ width: '50%', justifyContent: 'center', alignItems: 'center' }}
						>
							<Image
								source={require('../Images/PublicUserIcons/complaints.png')}
								style={{ borderWidth: 1, borderRadius: 5, elevation: 10 }}
							/>
						</TouchableOpacity>

						<TouchableOpacity
							onPress={() => this.onLogOut()}
							style={{ width: '50%', justifyContent: 'center', alignItems: 'center' }}
						>
							<Image
								source={require('../Images/PublicUserIcons/logout.png')}
								style={{ borderWidth: 1, borderRadius: 5, elevation: 10 }}
							/>
						</TouchableOpacity>
					</View>
				</View>
			</ImageBackground>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center'
	},
	tab: {
		padding: 15,
		flexDirection: 'row',
		justifyContent: 'space-between',
		borderBottomColor: '#D3D3D3'
	},
	text: {
		fontSize: 15,
		fontFamily: 'GoogleSans-Medium'
	}
});
