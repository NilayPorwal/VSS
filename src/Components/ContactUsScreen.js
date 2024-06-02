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
	SafeAreaView,
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

import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';

const { height, width } = Dimensions.get('window');

var markers = [
	{
		latlng: { latitude: 27.217, longitude: 77.4895 },
		title: 'Bharatpur Circle'
	},
	{
		latlng: { latitude: 27.553, longitude: 76.6346 },
		title: 'Alwar Circle'
	},
	{
		latlng: { latitude: 24.5973, longitude: 76.161 },
		title: 'Jhalawar Circle'
	},
	{
		latlng: { latitude: 25.1011, longitude: 76.5132 },
		title: 'Baran Circle'
	},
	{
		latlng: { latitude: 25.4305, longitude: 75.6499 },
		title: 'Bundi Circle'
	},
	{
		latlng: { latitude: 26.8932, longitude: 76.3375 },
		title: 'Dausa Circle'
	},
	{
		latlng: { latitude: 26.7025, longitude: 77.8934 },
		title: 'Dholpur Circle'
	},
	{
		latlng: { latitude: 25.2138, longitude: 75.8648 },
		title: 'Kota Circle'
	},
	{
		latlng: { latitude: 26.0378, longitude: 76.3522 },
		title: 'Sawai Madhopur Circle'
	},
	{
		latlng: { latitude: 27.217, longitude: 77.4895 },
		title: 'Karauli Circle'
	}
];

const coordinates = [
	{ latitude: 27.553, longitude: 76.6346 },
	{ latitude: 26.4883, longitude: 77.0161 },
	{ latitude: 26.0378, longitude: 76.3522 },
	{ latitude: 25.4305, longitude: 75.6499 },
	{ latitude: 25.4305, longitude: 75.6499 },
	{ latitude: 24.5973, longitude: 76.161 },
	{ latitude: 27.553, longitude: 76.6346 },
	{ latitude: 26.7025, longitude: 77.8934 }
];

export default class ContactUsScreen extends Component {
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

	markerClick(index, title) {
		this.props.navigation.navigate('CircleDetails', { title, index });
	}

	render() {
		return (
			<SafeAreaView>
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
									Contact Us
								</Text>
							</View>
						</View>

						{
							<View style={{ alignItems: 'center' }}>
								<MapView
									ref={ref => {
										this.mapRef = ref;
									}}
									style={{ height: height * 0.9, width: width }}
									provider={PROVIDER_GOOGLE}
									loadingEnabled={true}
									onLayout={() =>
										this.mapRef.fitToCoordinates(coordinates, {
											edgePadding: { top: 50, right: 20, bottom: 50, left: 20 },
											animated: true
										})
									}
								>
									{markers.map((marker, index) => (
										<Marker
											coordinate={marker.latlng}
											title={marker.title}
											onPress={() => this.markerClick(index, marker.title)}
										/>
									))}
								</MapView>
							</View>
						}
					</View>
				</ImageBackground>
			</SafeAreaView>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1
	}
});
