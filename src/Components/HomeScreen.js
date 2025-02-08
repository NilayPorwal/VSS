import React, { Component } from 'react';
import {
	Platform,
	StyleSheet,
	Text,
	View,
	Image,
	BackHandler,
	TouchableOpacity,
	ImageBackground,
	DatePickerAndroid,
	ScrollView,
	Modal,
	TouchableWithoutFeedback,
	TextInput,
	PermissionsAndroid,
	Linking,
	Alert
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import APIManager from './Managers/APIManager';
import RNFetchBlob from 'react-native-fetch-blob';
import { Base64 } from 'js-base64';
import Loader from 'react-native-modal-loader';
import { getData, removeData } from '../helper';

global.HomeScreen;
export default class HomeScreen extends Component {
	constructor(props) {
		super(props);
		this.state = {
			firstName: '',
			lastName: '',
			middleName: '',
			roleName: null,
			imageLink: '',
			siteOfferDetails: {},
			displayName: null,
			isRefreshing: true
		};
		global.HomeScreen = this;
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
		this.getInspDetails();
		APIManager.getAPI();
		APIManager.getCredentials();
		BackHandler.addEventListener('hardwareBackPress', this.handleAndroidBackButton);
	}

	handleAndroidBackButton() {
		BackHandler.exitApp();
	}

	componentWillUnmount() {
		BackHandler.removeEventListener('hardwareBackPress', this.handleAndroidBackButton);
	}

	onFinalSubmit() {
		this.setState({ testModalVisible2: false, testModalVisible: false });
		this.props.navigation.push('MaterialInspected');
	}

	_calender() {
		DatePickerAndroid.open({
			date: new Date()
		});
	}

	async getInspDetails() {
		await getData('roleName').then(value => {
			if (value != null) {
				this.setState({ roleName: value });
			}
		});

		await getData('displayName').then(value => {
			if (value != null) {
				this.setState({ displayName: value, isRefreshing: false });
			}
		});
	}

	onLogOut() {
		Alert.alert(
			'Logout Confirmation',
			'Do you want to Logout ?',
			[
				{ text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
				{ text: 'OK', onPress: () => this.removeStoreData() }
			],
			{ cancelable: true }
		);
		return true;
	}

	async removeStoreData() {
		this.setState({ displayName: null, roleName: null });
		await removeData('login');
		await removeData('displayName');
		await removeData('roleName');
		await removeData('InspId');
		await removeData('ssoId');
		await removeData('apiSeceretKey');
		await removeData('userId');
		//.then(()=>this.props.navigation.push('LogInScreen'))
		if (Platform.OS == 'ios') {
			this.props.navigation.push('LandingScreen');
		} else {
			this.props.navigation.push('LogInScreen');
		}
	}

	getVendorData() {
		APIManager.getCredentials();
	}

	getDownloadLink1() {
		APIManager.getDownloadLink1(
			this.state.roleName == 'INSPECTOR' ? 5 : 4,
			responseJson => {
				console.log(JSON.stringify(responseJson));
				if (responseJson.status == 'SUCCESS') {
					this.appUses(responseJson.data);
				} else {
					// alert('Drawing NOT FOUND')
				}
			},
			error => {
				console.log(JSON.stringify(error));
			}
		);
	}

	appUses(url) {
		let URL = 'https://jvvnlvendor.ugoerp.com/' + url;
		//if(this.state.roleName=="INSPECTOR"){
		//  URL = "http://137.116.54.31/vss-uploads/training_manual/INSPECTOR_PPT_MOBILE_APP.pdf"
		// }
		//else{
		// URL = "http://137.116.54.31/vss-uploads/training_manual/VENDOR_PPT_MOBILE_APP.pdf"
		// }
		Linking.openURL(URL).catch(err => console.error('An error occurred', err));
	}

	render() {
		return (
			<ImageBackground source={require('../Images/background.png')} style={{ flex: 1 }}>
				<ScrollView contentContainerStyle={{ flexGrow: 1 }}>
					<View style={styles.container}>
						{Platform.OS == 'android' ? <Loader loading={this.state.isRefreshing} color="#40a7ab" /> : null}

						<Text
							style={{
								fontSize: 15,
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
								fontSize: 15,
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

						{this.state.roleName == 'INSPECTOR' && this.state.isRefreshing == false ? (
							<View style={{ marginTop: '40%' }}>
								<TouchableOpacity onPress={() => this.props.navigation.push('MMInspection')} style={styles.button}>
									<Text style={styles.buttonText}>MM Inspection</Text>
								</TouchableOpacity>
								<TouchableOpacity
									onPress={() => this.props.navigation.push('SetwInspection')}
									style={[styles.button, { marginTop: '15%' }]}
								>
									<Text style={styles.buttonText}>SETW / RDSS Inspection</Text>
								</TouchableOpacity>
							</View>
						) : null}
						{this.state.roleName == 'VENDOR' && this.state.isRefreshing == false ? (
							<View>
								<View style={{ flexDirection: 'row', width: '90%', marginTop: 30 }}>
									<TouchableOpacity
										onPress={() => this.props.navigation.push('PDIOfferScreen', { type: 'PDI' })}
										style={{ width: '50%', justifyContent: 'center', alignItems: 'center' }}
									>
										<Image
											source={require('../Images/HomeScreenIcons/pdi-offer.png')}
											style={{ borderWidth: 1, borderRadius: 5 }}
										/>
									</TouchableOpacity>
									<TouchableOpacity
										onPress={() => this.props.navigation.push('InspectorConfirmationScreen', { from: '' })}
										style={{ width: '50%', justifyContent: 'center', alignItems: 'center' }}
									>
										<Image
											source={require('../Images/HomeScreenIcons/Confirm-Inspection.png')}
											style={{ borderWidth: 1, borderRadius: 5 }}
										/>
									</TouchableOpacity>
								</View>

								<View style={{ flexDirection: 'row', width: '90%', marginTop: 30 }}>
									<TouchableOpacity
										onPress={() => this.props.navigation.push('AddressConfirmation')}
										style={{ width: '50%', justifyContent: 'center', alignItems: 'center' }}
									>
										<Image
											source={require('../Images/HomeScreenIcons/work-address.png')}
											style={{ borderWidth: 1, borderRadius: 5 }}
										/>
									</TouchableOpacity>

									<TouchableOpacity
										onPress={() => this.props.navigation.push('PDIOfferScreen', { type: 'DDS' })}
										style={{ width: '50%', justifyContent: 'center', alignItems: 'center' }}
									>
										<Image
											source={require('../Images/HomeScreenIcons/double-delivery.png')}
											style={{ borderWidth: 1, borderRadius: 5 }}
										/>
									</TouchableOpacity>
								</View>
								<View style={{ flexDirection: 'row', width: '90%', marginTop: 30 }}>
									<TouchableOpacity
										onPress={() => this.props.navigation.push('GPInspectorConfirmationScreen')}
										style={{ width: '50%', justifyContent: 'center', alignItems: 'center' }}
									>
										<Image
											source={require('../Images/HomeScreenIcons/Confirm-GPInspection.png')}
											style={{ borderWidth: 1, borderRadius: 5 }}
										/>
									</TouchableOpacity>
									<TouchableOpacity
										onPress={() => this.props.navigation.push('InspectorConfirmationScreen', { from: 'setw' })}
										style={styles.box}
									>
										<Text style={{ color: '#fff', fontSize: 16, fontFamily: 'GoogleSans-Medium' }}>SETW / RDSS</Text>
										<Text style={{ color: '#fff', fontSize: 14, paddingTop: 10, fontFamily: 'GoogleSans-Medium' }}>
											Confirm Inspection
										</Text>
									</TouchableOpacity>
								</View>
							</View>
						) : null}

						<View
							style={
								this.state.roleName == 'VENDOR'
									? {
											width: '82%',
											flexDirection: 'row',
											alignSelf: 'center',
											justifyContent: 'space-between',
											marginVertical: 15
									  }
									: {
											alignItems: 'center',
											marginTop: '15%'
									  }
							}
						>
							<TouchableOpacity onPress={() => this.onLogOut()} style={styles.button}>
								<Text style={styles.buttonText}>LogOut</Text>
							</TouchableOpacity>
							<TouchableOpacity onPress={() => this.getDownloadLink1()} style={{ marginTop: 10 }}>
								<Text style={{ textDecorationLine: 'underline' }}>How to use App ?</Text>
							</TouchableOpacity>
						</View>
					</View>
				</ScrollView>
			</ImageBackground>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: 'center'
	},
	button: {
		borderRadius: 5,
		backgroundColor: '#ff7f00',
		paddingVertical: 10,
		paddingHorizontal: 20,
		height: 40,
		alignItems: 'center'
	},
	buttonText: {
		fontSize: 18,
		color: '#ffffff',
		fontFamily: 'GoogleSans-Medium'
	},
	box: {
		backgroundColor: '#0A141A',
		width: '40%',
		justifyContent: 'center',
		alignItems: 'center',
		borderRadius: 5,
		marginLeft: 18
	}
});
