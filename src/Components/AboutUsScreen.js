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

const { height, width } = Dimensions.get('window');

export default class AboutUsScreen extends Component {
	constructor(props) {
		super(props);
		this.state = {};
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

	componentDidMount() {
		BackHandler.addEventListener('hardwareBackPress', this.props.navigation.goBack);
	}

	redirectTo() {
		this.props.navigation.navigate();
	}

	render() {
		return (
			<ImageBackground source={require('../Images/background.png')} style={{ width: '100%', height: '100%' }}>
				<View style={styles.container}>
					<View style={{ flexDirection: 'row' }}>
						<TouchableOpacity onPress={() => this.props.navigation.goBack()}>
							<Icon name="chevron-left" size={20} color="#000000" style={{ margin: 15 }} />
						</TouchableOpacity>
						<View style={{ width: '80%' }}>
							<Text
								style={{
									fontSize: 18,
									fontFamily: 'GoogleSans-Medium',
									color: 'black',
									paddingTop: 15,
									textAlign: 'center'
								}}
							>
								ABOUT US
							</Text>
						</View>
					</View>

					<View style={{ marginTop: 20, padding: 20 }}>
						<Image source={require('../Images/1234.jpg')} style={{ height: height * 0.3, width: width * 0.9 }} />
					</View>

					<View style={{ padding: 15, backgroundColor: '#F4F2E8', borderRadius: 15, margin: 10, elevation: 8 }}>
						<Text style={{ color: '#64480D', lineHeight: 30 }}>
							JAIPUR VIDYUT VITRAN NIGAM LIMITED (JAIPUR DISCOM) IS ENGAGED IN DISTRIBUTION AND SUPPLY OF ELECTRICITY IN
							12 DISTRICTS OF RAJASTHAN, NAMELY JAIPUR, DAUSA, ALWAR, BHARATPUR, DHOLPUR, KOTA, BUNDI, BARAN, JHALAWAR,
							SAWAIMADHOPUR, TONK AND KARAULI. (EXCEPT KOTA & BHARATPUR CITY)
						</Text>
					</View>
				</View>
			</ImageBackground>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1
	}
});
