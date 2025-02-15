import React, { Component } from 'react';
import {
	Platform,
	StyleSheet,
	Text,
	View,
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
	ActivityIndicator,
	Keyboard
} from 'react-native';
import APIManager from './Managers/APIManager';
import { Base64 } from 'js-base64';
import Icon from 'react-native-vector-icons/Feather';
import { setData } from '../helper';

global.logInScreen;
const { width, height } = Dimensions.get('window');

export default class LogInScreen extends Component {
	constructor(props) {
		super(props);
		this.state = {
			//username: 'mukeshsinghsikarwar1101@gmail.com', //xenvgjpdc@gmail.com,
			// username: 'maharajacables78@rediffmail.com',
			// username: 'balaraamchaudhary1969@gmail.com',
			// password: 'Balarch@9',
			// username: '67neerajsharma@gmail.com',
			// password: 'Neerajs@0',
			username: '',
			password: '',
			data: { mh: '' },
			otpModalVisible: false,
			OTP: '',
			isRefreshing: false,
			loginData: {},
			APIModal: false,
			securePassword: true,
			blockedTime: 0,
			disabled: false,
			otpBlockedTime: 0,
			otpDisabled: false
		};
		global.logInScreen = this;
	}

	static navigationOptions = {
		header: (
			<Image
				source={require('../Images/Header3.png')}
				style={{ width: '100%', marginTop: Platform.OS === 'ios' ? 30 : 0 }}
			/>
		),
		headerLeft: null
	};

	componentDidMount() {
		BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
	}

	componentWillUnmount() {
		BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
	}

	handleBackPress() {
		BackHandler.exitApp();
		return true;
	}

	async onLogIn() {
		Keyboard.dismiss();
		const pass = await Base64.encode(global.logInScreen.state.password);
		const user = this.state.username;
		if (this.state.username != '' && this.state.password != '') {
			this.setState({ isRefreshing: true });

			APIManager.signin(
				user,
				pass,
				response => {
					// this.setState({isRefreshing:false})
					//alert(JSON.stringify(response));
					if (response.valid == true) {
						global.logInScreen.setState({ loginData: response }, () => {
							this._storeLoginData();
						});

						if (response.roleName != 'IOS_TEST_LOGIN') {
							APIManager.getOTP(
								response.mobile,
								//this.state.username,
								responseJson => {
									//alert(JSON.stringify(responseJson));
									global.logInScreen.setState({ data: responseJson.data, isRefreshing: false, otpModalVisible: true });
								},
								error => {
									ToastAndroid.showWithGravity('Please Try again', ToastAndroid.LONG, ToastAndroid.CENTER);
								}
							);
						} else {
							fetch(APIManager.host + 'public/sso/otp/generator?title=IOS_REG_OTP_MSG_EMAIL&type=e&receiver=' + user, {
								method: 'POST',
								headers: {
									'Content-Type': 'application/json'
								}
							})
								.then(response => response.json())
								.then(responseJson => {
									// alert(JSON.stringify(responseJson));
									this.setState({ data: responseJson.data, isRefreshing: false, otpModalVisible: true });
								})
								.catch(error => {
									this.setState({ isRefreshing: false });
									console.log(JSON.stringify(error));
								});
						}
					} else {
						this.setState({ isRefreshing: false });

						if (response.message == 'Tried max limit') {
							Alert.alert('Login failed...', 'Too many failed attempts, please try after one minute.');
							this.setState({ disabled: true });
							let sec = 61;
							const interval = setInterval(() => {
								sec = sec - 1;
								this.setState({
									blockedTime: sec
								});
								if (sec == 0) {
									this.setState({ disabled: false });
									clearInterval(interval);
								}
							}, 1000);
						} else {
							Alert.alert('Login failed...', 'Invalid Username or Password.');
						}
					}
				},
				error => {
					this.setState({ isRefreshing: false });
					ToastAndroid.showWithGravity('Please Try again', ToastAndroid.LONG, ToastAndroid.CENTER);
				}
			);
		} else {
			Alert.alert('Wait', 'Please enter Username and Password');
		}
	}

	async onSubmitOtp() {
		Keyboard.dismiss();
		const otp = await this.state.OTP;
		const mh = (await (this.state.loginData.roleName != 'IOS_TEST_LOGIN')) ? this.state.data.mh : this.state.data.eh;
		this.setState({ isRefreshing: true });
		APIManager.validateOTP(
			otp,
			mh,
			responseJson => {
				this.setState({ isRefreshing: false });
				//alert(JSON.stringify(responseJson));

				if (responseJson?.status == 'SUCCESS') {
					if (responseJson?.data?.message == 'Otp has been expired') {
						this.showMessage('Your Otp has been expired. Please retry login');
					} else if (responseJson?.data?.message == 'You are blocked for 1 minute') {
						this.showMessage('You have tried maximum attempt so blocked for 1 minute..Please retry after sometime');
						this.setState({ otpDisabled: true });
						let sec = 61;
						const interval = setInterval(() => {
							sec = sec - 1;
							this.setState({
								otpBlockedTime: sec
							});
							if (sec == 0) {
								this.setState({ otpDisabled: false });
								clearInterval(interval);
							}
						}, 1000);
					} else if (responseJson?.data?.message == 'Invalid OTP') {
						this.showMessage('Please try with valid otp');
					} else {
						global.logInScreen.setState({ otpModalVisible: false, OTP: '', username: '', password: '' });

						if (this.state.loginData.roleName != 'IOS_TEST_LOGIN') {
							setData('login', '1');
							global.logInScreen.props.navigation.push('HomeScreen');
						} else {
							setData('login', '2');
							global.logInScreen.props.navigation.push('PublicUserScreen');
						}
					}
				} else {
					this.showMessage(responseJson?.message);
				}
			},
			error => {
				this.setState({ isRefreshing: false });
				ToastAndroid.showWithGravity('Please Try again', ToastAndroid.LONG, ToastAndroid.CENTER);
			}
		);
	}

	showMessage(message) {
		Alert.alert('OTP Failed...', message);
	}

	_storeLoginData() {
		setData('InspId', this.state.loginData.mapId.toString());
		setData('ssoId', this.state.loginData.ssoId);
		setData('apiSeceretKey', this.state.loginData.apiSeceretKey);
		setData('userId', this.state.loginData.userId.toString());
		setData('roleName', this.state.loginData.roleName);
		setData('displayName', this.state.loginData.displayName);
	}

	render() {
		return (
			<ImageBackground source={require('../Images/background.png')} style={{ flex: 1 }}>
				<ScrollView showsVerticalScrollIndicator={false}>
					<KeyboardAvoidingView behavior="position" keyboardVerticalOffset={Platform.OS === 'ios' ? 40 : 20}>
						<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
							<View style={{ alignItems: 'center', marginTop: height * 0.1 }}>
								<Image source={require('../Images/login-icon.png')} style={{ width: 100, height: 100 }} />
								<Text style={{ fontSize: 25, fontFamily: 'GoogleSans-Medium', color: '#3B495C' }}>LOGIN</Text>
							</View>

							<View style={{ width: '80%', flexDirection: 'row', marginTop: 50 }}>
								<View style={{ width: '15%', justifyContent: 'center', alignItems: 'center' }}>
									<Icon name="user" size={20} color="black" />
								</View>
								<TextInput
									style={styles.textInput}
									onChangeText={username => this.setState({ username })}
									value={this.state.username}
									placeholder="USERNAME"
									underlineColorAndroid="#141F25"
									selectTextOnFocus={false}
									autoFocus
									autoCapitalize={false}
									autoComplete="email"
								/>
							</View>
							<View style={{ marginTop: 10, width: '80%', flexDirection: 'row' }}>
								<View style={{ width: '15%', justifyContent: 'center', alignItems: 'center' }}>
									<Icon name="lock" size={20} color="black" />
								</View>
								<TextInput
									style={styles.textInput}
									onChangeText={password => this.setState({ password })}
									value={this.state.password}
									placeholder="PASSWORD"
									underlineColorAndroid="#141F25"
									selectTextOnFocus={false}
									secureTextEntry={this.state.securePassword}
									autoCapitalize={false}
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
							</View>

							{this.state.isRefreshing == true ? (
								<ActivityIndicator size="small" color="#000000" style={{ marginTop: 10 }} />
							) : (
								<>
									<TouchableOpacity
										onPress={() => global.logInScreen.onLogIn()}
										disabled={this.state.disabled}
										style={styles.button}
									>
										<Text style={styles.buttonText}>SUBMIT</Text>
									</TouchableOpacity>
									{this.state.disabled && (
										<Text style={{ fontSize: 15, fontFamily: 'GoogleSans-Medium', color: 'red', paddingTop: 10 }}>
											Retry after : {this.state.blockedTime}
										</Text>
									)}
								</>
							)}

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
											{this.state.loginData.roleName != 'IOS_TEST_LOGIN' ? (
												<Text>You will receive a text message with your verification code</Text>
											) : (
												<Text>You will receive a mail with your verification code</Text>
											)}

											{this.state.isRefreshing == true ? (
												<ActivityIndicator size="small" color="#000000" style={{ marginTop: 10 }} />
											) : (
												<>
													<TouchableOpacity
														disabled={!this.state.OTP || this.state.otpDisabled}
														onPress={() => this.onSubmitOtp()}
														style={styles.otpButton}
													>
														<Text style={{ fontSize: 15, color: '#ffffff', paddingVertical: 12, textAlign: 'center' }}>
															SUBMIT
														</Text>
													</TouchableOpacity>
													{this.state.otpDisabled && (
														<Text
															style={{ fontSize: 15, fontFamily: 'GoogleSans-Medium', color: 'red', paddingTop: 10 }}
														>
															Retry after : {this.state.otpBlockedTime}
														</Text>
													)}
												</>
											)}
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

							{Platform.OS == 'ios' ? (
								<TouchableOpacity
									onPress={() => this.props.navigation.goBack()}
									style={{ position: 'absolute', top: 10, left: 10 }}
								>
									<Icon name="chevron-left" size={20} color="#000000" />
								</TouchableOpacity>
							) : null}
						</View>
					</KeyboardAvoidingView>
				</ScrollView>
				{APIManager.isDev == true ? (
					<View style={{ position: 'absolute', bottom: 15, left: 15 }}>
						<TouchableOpacity
							onPress={() => this.props.navigation.push('APIScreen')}
							style={{ borderRadius: 5, backgroundColor: 'brown', padding: 10 }}
						>
							<Icon name="plus-circle" size={18} color="white" />
						</TouchableOpacity>
					</View>
				) : null}
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
		marginTop: 15,
		width: '75%',
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
