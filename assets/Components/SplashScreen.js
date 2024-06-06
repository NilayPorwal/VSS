import React, { Component } from 'react';
import {
	Image,
	ImageBackground,
	TouchableOpacity,
	Dimensions,
	Linking,
	PermissionsAndroid,
	StyleSheet,
	Text,
	View,
	AsyncStorage,
	Modal,
	Platform,
	TouchableHighlight
} from 'react-native';
import { StackNavigator } from 'react-navigation';
import VersionCheck from 'react-native-version-check';

export class SplashScreen extends React.Component {
	// hide navigation backgroud
	static navigationOptions = { header: null };

	constructor(props) {
		super(props);
		this.state = {
			isRefreshing: true,
			modalVisible: false
		};
	}

	componentDidMount() {
		this._retrieveData();
		this.requestPermission();
		this.checkVersion();
	}

	/**
	 * Initial setup will decide which screen we would have to display.
	 * If user is logged in then we will move to Home Screen,
	 * else we will show LogIn Screen.
	 */

	_retrieveData = async () => {
		await AsyncStorage.getItem('login').then(value =>
			setTimeout(() => {
				{
					if (value == '1') {
						// We have data!!
						this.props.navigation.push('HomeScreen');
					} else if (value == '2') {
						// We have data!!
						this.props.navigation.push('PublicUserScreen');
					} else {
						if (Platform.OS == 'ios') {
							this.props.navigation.push('LandingScreen');
						} else {
							this.props.navigation.push('LogInScreen');
						}
					}
				}
			}, 2000)
		);
	};

	async requestPermission() {
		try {
			const granted = await PermissionsAndroid.requestMultiple([
				PermissionsAndroid.PERMISSIONS.CAMERA,
				PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
				PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
				PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
			]);
			if (granted === PermissionsAndroid.RESULTS.GRANTED) {
				console.log('You can use the camera');
			} else {
				console.log('Camera permission denied');
			}
		} catch (err) {
			console.warn(err);
		}
	}

	checkVersion() {
		VersionCheck.needUpdate()
			.then(res => {
				console.log(JSON.stringify(res));
				if (res.isNeeded) {
					this.setState({ modalVisible: true });
				}
			})
			.catch(err => {
				console.log(JSON.stringify(err));
			});
	}

	onUpdate() {
		if (Platform.OS == 'android') {
			Linking.openURL('https://play.google.com/store/apps/details?id=in.skyras.vss.jvvnl');
		} else {
			Linking.openURL('https://apps.apple.com/us/app/jvvnl-vendor-mitra/id1455593379?ls=1');
		}
	}

	render() {
		return (
			<ImageBackground source={require('../Images/SpalshScreen.png')} style={{ width: '100%', height: '100%' }}>
				<View style={styles.mainContainer}></View>
				<Modal animationType={'slide'} transparent={true} visible={this.state.modalVisible}>
					<View style={styles.modal}>
						<View style={styles.modalView1}>
							<Text style={{ fontSize: 18, paddingTop: 15, textAlign: 'center', color: '#000000' }}>App Update</Text>
							{Platform.OS === 'ios' ? (
								<Text style={{ fontSize: 15, paddingTop: 15, textAlign: 'center', color: '#000000' }}>
									New version of app is available on App Store
								</Text>
							) : (
								<Text style={{ fontSize: 15, paddingTop: 15, textAlign: 'center', color: '#000000' }}>
									New version of app is available on Play Store
								</Text>
							)}

							<View style={{ alignItems: 'center' }}>
								<TouchableHighlight onPress={() => this.onUpdate()} style={styles.updateBtn}>
									<Text style={styles.btnText}>UPDATE</Text>
								</TouchableHighlight>
								{
									//  <TouchableHighlight onPress={()=>this.setState({modalVisible:false})} style={styles.updateBtn}>
									//    <Text style = {styles.btnText}>CANCEL</Text>
									// </TouchableHighlight>
								}
							</View>
						</View>
					</View>
				</Modal>
			</ImageBackground>
		);
	}
}

// Styles
const styles = StyleSheet.create({
	// Containers
	mainContainer: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
		width: Dimensions.get('window').width
	},
	modal: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: '#00000080'
	},
	modalView1: {
		width: '85%',
		backgroundColor: '#ffffff',
		borderRadius: 10,
		justifyContent: 'center',
		padding: 15
	},
	updateBtn: {
		marginTop: 10,
		backgroundColor: '#ff7f00',
		elevation: 4,
		borderRadius: 50,
		alignSelf: 'center',
		padding: 10,
		marginVertical: 10,
		width: '45%',
		alignItems: 'center'
	},
	btnText: {
		fontSize: 15,
		fontFamily: 'Lato-Semibold',
		color: '#FFFFFF'
	}
});
