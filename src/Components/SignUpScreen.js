import React, { Component } from 'react';
import {
	Platform,
	SafeAreaView,
	Image,
	Modal,
	ImageBackground,
	TouchableOpacity,
	Dimensions,
	StyleSheet,
	Text,
	View,
	AsyncStorage,
	TouchableNativeFeedback,
	TextInput,
	Button,
	Alert,
	ScrollView,
	KeyboardAvoidingView
} from 'react-native';
import { Base64 } from 'js-base64';
import APIManager from './Managers/APIManager';
import Icon from 'react-native-vector-icons/Feather';
import Loader from 'react-native-modal-loader';

const { width, height } = Dimensions.get('window');

global.SignUpScreen;

export class SignUpScreen extends React.Component {
	// hide navigation backgroud
	static navigationOptions = { header: null };

	constructor(props) {
		super(props);
		this.state = {
			selectedTab: 'signIn',
			FirstName: null,
			LastName: null,
			Password: null,
			Email: null,
			Mobile: null,
			signInMail: null,
			signInPassword: null,
			otpModalVisible: false,
			OTP: null,
			loginData: {},
			data: { mh: '' }
		};
		global.SignUpScreen = this;
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

	onSignUp() {
		//this.props.navigation.navigate("TabBarController1")
		const password = Base64.encode(this.state.Password);

		const Details = {
			userName: this.state.Email,
			userPassword: password,
			apiSecretKey: 'j74XdYZt0O6EFNnekSP3EsEVc3Lr2pVA',
			firstName: this.state.FirstName,
			middleName: '',
			lastName: '',
			mobileName: this.state.Mobile,
			emailAddress: this.state.Email,
			roleName: 'IOS_TEST_LOGIN',
			mapId: '0'
		};

		const credentials = 'iostest@skyras.in' + ':' + 'j74XdYZt0O6EFNnekSP3EsEVc3Lr2pVA';
		const hash = Base64.encode(credentials);
		const Basic = 'Basic ' + hash;

		fetch(APIManager.host + 'v1/users/create', {
			method: 'POST',
			headers: {
				// "loggedInUserId":APIManager.User_Id,
				Authorization: Basic,
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(Details)
		})
			.then(response => response.json())
			.then(function (responseJSON) {
				// alert(JSON.stringify(responseJSON));
				if (responseJSON.status == 'SUCCESS') {
					global.SignUpScreen._storeLoginData();
				} else {
					Alert.alert('This mail id is already exist, please try with different mail id ');
				}
			})
			.catch(function (error) {
				console.log(JSON.stringify(error));
			});
	}

	getOTP() {
		if (
			this.state.FirstName != null &&
			this.state.Password != null &&
			this.state.Email != null &&
			this.state.Mobile != null
		) {
			fetch(
				APIManager.host + 'public/sso/otp/generator?title=IOS_REG_OTP_MSG_EMAIL&type=e&receiver=' + this.state.Email,
				{
					method: 'POST',
					headers: {
						'Content-Type': 'application/json'
					}
				}
			)
				.then(response => response.json())
				.then(responseJson => {
					// alert(JSON.stringify(responseJson));
					this.setState({ data: responseJson.data, isRefreshing: false, otpModalVisible: true });
				})
				.catch(error => {
					console.log(JSON.stringify(error));
				});
		} else {
			Alert.alert('Please fill all the details');
		}
	}

	async onSubmitOtp() {
		const otp = await this.state.OTP;
		const mh = await this.state.data.eh;

		APIManager.validateOTP(otp, mh, responseJson => {
			// alert(JSON.stringify(responseJson));
			if (responseJson.status == 'SUCCESS') {
				this.setState({ otpModalVisible: false, OTP: null });

				this.onSignUp();
			} else {
				alert('Invalid OTP');
			}
		});
	}

	async onLogIn() {
		if (this.state.signInPassword != null && this.state.signInMail != null) {
			const pass = await Base64.encode(this.state.signInPassword);
			const user = await this.state.signInMail;

			APIManager.signin(user, pass, responseJson => {
				// alert(JSON.stringify(responseJson));
				if (responseJson.valid == true) {
					this.setState({ loginData: responseJson }, () => {
						this._storeLoginData();
					});

					APIManager.getOTP(responseJson.mobile, responseJson => {
						// alert(JSON.stringify(responseJson));
						this.setState({ data: responseJson.data, isRefreshing: false, otpModalVisible: true });
					});
				} else {
					this.setState({ isRefreshing: false }, () => {
						Alert.alert('Invalid Username or Password');
					});
				}
			});
		} else {
			Alert.alert('Please enter Username and Password');
		}
	}

	async _storeLoginData() {
		await AsyncStorage.setItem('login', '2');
		await AsyncStorage.setItem('displayName', global.SignUpScreen.state.FirstName);
		global.SignUpScreen.props.navigation.navigate('PublicUserScreen');
		// AsyncStorage.setItem('firstName',this.state.loginData.firstName);
		// AsyncStorage.setItem('middleName',this.state.loginData.middleName);
		// AsyncStorage.setItem('lastName',this.state.loginData.lastName);
	}

	render() {
		return (
			<ImageBackground source={require('../Images/background.png')} style={{ width: '100%', flex: 1 }}>
				<ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
					<Loader loading={this.state.isRefreshing} color="#40a7ab" />
					<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
						<View style={{ alignItems: 'center', marginTop: height * 0.05 }}>
							<Image source={require('../Images/login-icon.png')} style={{ width: 100, height: 100 }} />
							<Text style={{ fontSize: 25, fontFamily: 'GoogleSans-Medium', color: '#3B495C' }}>SIGNUP</Text>
						</View>

						<View style={{ width: '75%', flexDirection: 'row', marginTop: 30 }}>
							<View style={{ width: '15%', justifyContent: 'center', alignItems: 'center' }}>
								<Icon name="user" size={20} color="black" />
							</View>
							<TextInput
								style={styles.textInput}
								onChangeText={FirstName => this.setState({ FirstName })}
								value={this.state.FirstName}
								placeholder="NAME"
								underlineColorAndroid="#141F25"
								selectTextOnFocus={true}
							/>
						</View>

						<View style={{ width: '75%', flexDirection: 'row', marginTop: 15 }}>
							<View style={{ width: '15%', justifyContent: 'center', alignItems: 'center' }}>
								<Icon name="mail" size={20} color="black" />
							</View>
							<TextInput
								style={styles.textInput}
								onChangeText={Email => this.setState({ Email })}
								value={this.state.Email}
								placeholder="EMAIL"
								underlineColorAndroid="#141F25"
								selectTextOnFocus={true}
							/>
						</View>

						<View style={{ width: '75%', flexDirection: 'row', marginTop: 15 }}>
							<View style={{ width: '15%', justifyContent: 'center', alignItems: 'center' }}>
								<Icon name="smartphone" size={20} color="black" />
							</View>
							<TextInput
								style={styles.textInput}
								onChangeText={Mobile => this.setState({ Mobile })}
								value={this.state.Mobile}
								placeholder="MOBILE"
								underlineColorAndroid="#141F25"
								selectTextOnFocus={true}
							/>
						</View>

						<KeyboardAvoidingView style={{ marginTop: 15, width: '75%', flexDirection: 'row' }}>
							<View style={{ width: '15%', justifyContent: 'center', alignItems: 'center' }}>
								<Icon name="lock" size={20} color="black" />
							</View>
							<TextInput
								style={styles.textInput}
								onChangeText={Password => this.setState({ Password })}
								value={this.state.Password}
								placeholder="PASSWORD"
								underlineColorAndroid="#141F25"
								selectTextOnFocus={true}
								secureTextEntry={this.state.securePassword}
							/>
							<TouchableOpacity
								onPress={() => this.setState({ securePassword: !this.state.securePassword })}
								style={{ position: 'absolute', right: 0, paddingTop: 10 }}
							>
								{this.state.securePassword == true ? (
									<Icon name="eye" size={18} color="black" />
								) : (
									<Icon name="eye-off" size={18} color="black" />
								)}
							</TouchableOpacity>
						</KeyboardAvoidingView>

						<TouchableOpacity onPress={() => this.getOTP()} style={styles.button}>
							<Text style={styles.buttonText}>SUBMIT</Text>
						</TouchableOpacity>

						<TouchableOpacity
							onPress={() => this.props.navigation.goBack()}
							style={{ position: 'absolute', top: 10, left: 10 }}
						>
							<Icon name="chevron-left" size={20} color="#000000" />
						</TouchableOpacity>
					</View>
				</ScrollView>

				<Modal
					//animationType="slide"
					transparent={true}
					visible={this.state.otpModalVisible}
					onRequestClose={() => {
						this.setState({ otpModalVisible: false });
					}}
				>
					<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#00000080' }}>
						<View
							style={{
								width: '80%',
								backgroundColor: '#ffffff',
								borderRadius: 10,
								justifyContent: 'center',
								alignItems: 'center',
								padding: 15
							}}
						>
							<View style={{ marginTop: 10 }}>
								<Text style={styles.text}>Verify OTP</Text>
								<TextInput
									style={{
										marginTop: 5,
										borderBottomWidth: Platform.OS === 'ios' ? 1 : 0,
										paddingVertical: Platform.OS === 'ios' ? 10 : 10
									}}
									onChangeText={OTP => this.setState({ OTP })}
									value={this.state.OTP}
									underlineColorAndroid="orange"
									keyboardType="numeric"
								/>
								<Text>You will receive a mail with your verification code</Text>

								<TouchableOpacity onPress={() => this.onSubmitOtp()} style={styles.otpButton}>
									<Text style={{ fontSize: 15, color: '#ffffff', paddingVertical: 12, textAlign: 'center' }}>
										SUBMIT
									</Text>
								</TouchableOpacity>
							</View>

							<TouchableOpacity
								onPress={() => this.setState({ otpModalVisible: false })}
								style={{ position: 'absolute', top: 0, right: 5 }}
							>
								<Icon name="x" size={20} color="black" />
							</TouchableOpacity>
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
	container: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center'
		// justifyContent:'center'
		// padding:15
	},
	button: {
		borderRadius: 5,
		backgroundColor: '#ff7f00',
		marginTop: 15,
		width: '80%',
		height: 50,
		justifyContent: 'center',
		alignItems: 'center',
		elevation: 8
	},
	buttonText: {
		fontSize: 20,
		color: '#ffffff',
		fontFamily: 'GoogleSans-Medium'
	},
	text: {
		color: 'black',
		fontSize: 15,
		fontFamily: 'GoogleSans-Medium'
	},
	textInput: {
		width: '85%',
		borderBottomWidth: Platform.OS === 'ios' ? 1 : 0,
		paddingVertical: Platform.OS === 'ios' ? 10 : 10
	},
	otpButton: {
		borderRadius: 5,
		backgroundColor: '#ff7f00',
		marginTop: 15
	}
});
