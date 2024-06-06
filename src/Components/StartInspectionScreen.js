import React, { Component } from 'react';
import {
	Platform,
	StyleSheet,
	Text,
	View,
	Image,
	TouchableOpacity,
	ImageBackground,
	ActivityIndicator,
	BackHandler
} from 'react-native';
import geolib from 'geolib';
import Icon from 'react-native-vector-icons/FontAwesome';
import Loader from 'react-native-modal-loader';
import APIManager from './Managers/APIManager';
import Geolocation from '@react-native-community/geolocation';
import { removeData } from '../helper';

global.StartInspectionScreen;
export default class StartInspectionScreen extends Component {
	constructor(props) {
		super(props);
		this.state = {
			latitude: null,
			longitude: null,
			error: null,
			isRefreshing: true,
			atLocation: 0,
			vendorDetails: this.props.navigation.state.params.vendorDetails,
			inspPosition: { lng: '', lat: '' },
			distance: ''
		};
		//alert(JSON.stringify(this.props.navigation.state.params.vendorDetails))
		global.StartInspectionScreen = this;
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
		Geolocation.getCurrentPosition(
			position => {
				global.StartInspectionScreen.calDistance(position);
				this.setState(
					{
						latitude: position.coords.latitude,
						longitude: position.coords.longitude,
						error: null
					},
					() => {
						this.matchLocation();
					}
				);
			},
			error => {
				// See error code charts below.
				console.log(error.code, error.message);
			},
			{ enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
		);

		BackHandler.addEventListener('hardwareBackPress', this.props.navigation.goBack);
	}

	componentWillUnmount = () => {
		navigator.geolocation.clearWatch(this.watchID);
	};

	async calDistance(position) {
		const workAddressLat = this.state.vendorDetails.workAddressLat;
		const workAddressLong = this.state.vendorDetails.workAddressLong;

		const dist = await geolib.getDistance(position.coords, {
			latitude: workAddressLat,
			longitude: workAddressLong
		});
		this.setState({ distance: dist });
	}

	_distPerc() {
		const number2 = 500;
		const number1 = 500 + this.state.distance;
		const dist = Math.floor((number1 / number2) * 100);
		//alert(dist);
	}

	onStartInsp() {
		let Details = {
			vendorAiId: this.state.vendorDetails.vendorAiId,
			vendorWoAiId: this.state.vendorDetails.vendorWoAiId,
			inspectorAiId: this.state.vendorDetails.inspectorAiId,
			pdiOfferAiId: this.state.vendorDetails.pdiOfferAiId,
			nominationAiId: this.state.vendorDetails.nominationAiId,
			materialAiId: this.state.vendorDetails.materialAiId,
			materialSubcategoryAiId: this.state.vendorDetails.materialSubcategoryAiId,
			siteLat: this.state.latitude,
			siteLong: this.state.longitude,
			siteDistance: this.state.distance.toString()
		};

		//alert(JSON.stringify(Details))
		APIManager.uploadLatLong(
			Details,
			responseData => {
				//alert(JSON.stringify(responseData))
				this.reDirectTo();
			},
			error => {
				this.setState({ isRefreshing: false });
				console.log(JSON.stringify(error));
			}
		);
	}

	reDirectTo() {
		this.props.navigation.push('ActiveSiteOffers', {
			vendorDetails: this.state.vendorDetails,
			insId: this.state.inspId,
			vndrId: this.state.vendorId,
			woId: this.state.woId,
			matId: this.state.matId,
			matscId: this.state.matscId
		});
	}

	async matchLocation() {
		const workAddressLat = this.state.vendorDetails.workAddressLat;
		const workAddressLong = this.state.vendorDetails.workAddressLong;

		const lat = this.state.latitude;
		const long = this.state.longitude;

		let result = await geolib.isPointInCircle(
			{ latitude: workAddressLat, longitude: workAddressLong },
			{ latitude: lat, longitude: long },
			500
		);
		// alert(result)
		if (result == true) {
			this.setState({ atLocation: 0, isRefreshing: false });
		} else {
			this.setState({ atLocation: 1, isRefreshing: false });
			// alert('You are not at site')
		}
	}

	componentWillUnmount = () => {
		navigator.geolocation.clearWatch(this.watchID);
	};

	onLogOut() {
		this.removeStoreData();
		this.props.navigation.push('logInScreen');
	}

	async removeStoreData() {
		await removeData('login');
		await removeData('InspName');
		await removeData('InspId');
		await removeData('ssoId');
		await removeData('apiSeceretKey');
		await removeData('userId');
	}

	render() {
		return (
			<ImageBackground source={require('../Images/background.png')} style={{ width: '100%', height: '100%' }}>
				<View style={{ width: '20%', flexDirection: 'row' }}>
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
							SITE OFFER
						</Text>
					</View>
				</View>

				<View style={styles.container}>
					<Text
						style={{
							fontSize: 18,
							fontFamily: 'GoogleSans-Medium',
							color: '#ff7f00',
							marginTop: 10,
							textAlign: 'center'
						}}
					>
						Mapping Geolocation With Work Address
					</Text>

					{this.state.isRefreshing == true ? (
						<View style={{ marginTop: 50 }}>
							<ActivityIndicator size="large" color="#ff7f00" />
						</View>
					) : (
						<View>
							{this.state.atLocation == 0 ? (
								<View style={{ alignItems: 'center' }}>
									<Icon name="check" size={35} color="green" />
									<Text style={{ fontSize: 20, color: 'green', fontFamily: 'GoogleSans-Medium', marginTop: 10 }}>
										You Are At Site
									</Text>
								</View>
							) : (
								<View style={{ alignItems: 'center' }}>
									<Text style={{ fontSize: 20, color: 'red', fontFamily: 'GoogleSans-Medium', marginTop: 10 }}>
										You Are Not At Site
									</Text>
								</View>
							)}
						</View>
					)}

					<TouchableOpacity onPress={() => this.onStartInsp()} style={styles.button}>
						<Text style={styles.buttonText}>START</Text>
					</TouchableOpacity>
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
	button: {
		borderRadius: 5,
		backgroundColor: '#ff7f00',
		marginTop: 20,
		paddingVertical: 10,
		paddingHorizontal: 20
	},
	buttonText: {
		fontSize: 18,
		color: '#ffffff',
		fontFamily: 'GoogleSans-Medium'
	}
});
