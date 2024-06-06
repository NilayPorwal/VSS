import React, { Component } from 'react';
import {
	Platform,
	StyleSheet,
	Text,
	View,
	Image,
	TouchableOpacity,
	ScrollView,
	Modal,
	TouchableWithoutFeedback,
	BackHandler,
	Linking,
	TextInput,
	ImageBackground,
	Picker,
	Alert,
	ToastAndroid,
	CameraRoll
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import APIManager from './Managers/APIManager';
import RNFetchBlob from 'react-native-fetch-blob';
import { Base64 } from 'js-base64';
import Loader from 'react-native-modal-loader';

export default class Inspection extends Component {
	constructor(props) {
		super(props);
		// alert(JSON.stringify(this.props.navigation.state.params.siteOfferDetails))
		this.state = {
			isRefreshing: false,
			testModalVisible: false,
			testModalVisible2: false,
			overAllTestStatus: null,
			sealStartNo: '',
			sealEndNo: '',
			siteOfferDetails: this.props.navigation.state.params.siteOfferDetails,
			materialDetails: this.props.navigation.state.params.materialDetails,
			reason: 'other',
			reasonExp: '',
			uatCount: 0,
			obsCount: 0,
			gtpCount: 0,
			inspectionStatus: {},
			imageLink: null
		};
		global.Inspection = this;
		// alert(JSON.stringify(this.props.navigation.state.params.materialDetails))
	}

	componentDidMount() {
		this.getTestStatus();
		BackHandler.addEventListener('hardwareBackPress', global.Inspection.handleAndroidBackButton);
	}
	componentWillUnmount() {
		BackHandler.removeEventListener('hardwareBackPress', global.Inspection.handleAndroidBackButton);
	}

	handleAndroidBackButton() {
		Alert.alert(
			'Please Confirm',
			'Do you want to go back ?',
			[
				{ text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
				{ text: 'OK', onPress: () => global.Inspection.goBack() }
			],
			{ cancelable: true }
		);
		return true;
	}

	goBack() {
		const { navigation } = this.props;
		navigation.goBack();
		this.props.navigation.state.params.onBack();
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

	getTestStatus() {
		//alert(this.state.materialDetails.inspectionMatAiId)
		APIManager.checkTestStatus(this.state.materialDetails.inspectionMatAiId, responseJson => {
			//alert(JSON.stringify(responseJson));
			this.setState({
				uatCount: responseJson.data.uatCount,
				obsCount: responseJson.data.obsCount,
				gtpCount: responseJson.data.gtpCount
			});
		});
	}

	checkTestStatus() {
		if (this.state.gtpCount == 0) {
			alert('Please Complete GTP Test');
		} else if (this.state.uatCount == 0 || this.state.obsCount == 0) {
			this.checkForTest();
		} else {
			this.setState({ testModalVisible: true });
		}
	}

	onPassTest() {
		this.getTestStatus();
		this.setState({ overAllTestStatus: 2 }, () => {
			this.checkTestStatus();
		});
	}
	onFailTest() {
		this.getTestStatus();
		this.setState({ overAllTestStatus: 3, testModalVisible: true });
	}

	onSelect = data => {
		this.setState(data);
	};

	checkForTest() {
		Alert.alert(
			'Are you sure you wants to submit test ?',
			'You Have Not Performed Any One OF the Test ',
			[
				{ text: 'NO', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
				{ text: 'YES', onPress: () => this.onConfirmInsp() }
			],
			{ cancelable: true }
		);
		return true;
	}

	onConfirmInsp() {
		const Details = JSON.stringify({
			inspectionMatAiId: this.state.materialDetails.inspectionMatAiId,
			itemInspectionStatus: this.state.overAllTestStatus,
			inspectionRemarks: 'xxxxxx'
		});
		//alert(Details)
		APIManager.updateMatInspStatus(
			Details,
			responseJson => {
				//alert(JSON.stringify(responseJson));
				if (responseJson.status == 'SUCCESS') {
					const { navigation } = this.props;
					navigation.goBack();
					this.props.navigation.state.params.onBack();
				} else {
					this.setState({ isLoading: false });
					alert('Please try again');
				}
			},
			error => {
				this.setState({ isLoading: false });
				console.log(JSON.stringify(error));
				alert('Please try again');
			}
		);
	}

	onYes() {
		this.setState({ testModalVisible: false }, () => this.onConfirmInsp());
	}

	onFinalSubmit() {
		this.setState({ testModalVisible2: false, testModalVisible: false });
		//this.props.navigation.push('MaterialInspected', {parentView: 'Inspection', navigation.state.params.onSelect({ data: true }); })
		const { navigation } = this.props;
		navigation.goBack();
		navigation.state.params.onSelect({ matSrNo: this.state.materialDetails.materialSrNo });
	}

	reDirectTo = screen => {
		this.props.navigation.push(screen, {
			onSelect: () => this.getTestStatus(),
			siteOfferDetails: this.state.siteOfferDetails,
			materialDetails: this.state.materialDetails
		});
	};

	downloadAprdDrawing() {
		const str = this.state.imageLink.substring(this.state.imageLink.length - 3, this.state.imageLink.length);

		const credentials = APIManager.Sso_Id + ':' + APIManager.Api_Key;
		const hash = Base64.encode(credentials);
		const Basic = 'Basic ' + hash;
		const link = this.state.imageLink.slice(8);
		const res = link.replace(/\\/g, '/');

		// Linking.canOpenURL(APIManager.host+res).then(supported => {
		//     if (supported) {
		//       Linking.openURL(APIManager.host+res);
		//     } else {
		//       alert("Don't know how to open URI: " + APIManager.host+res);
		//     }
		//   });
		RNFetchBlob.config({
			trusty: true,
			fileCache: true,
			addAndroidDownloads: {
				notification: true,
				title: 'VSS Approved Drawing ',
				description: 'An image file.',
				mime: str == 'pdf' ? 'application/pdf' : 'image/png',
				mediaScannable: true,
				useDownloadManager: true
			}
		})
			.fetch('GET', APIManager.host + res, { Authorization: Basic })
			.then(res => {
				//alert(JSON.stringify(res));
				if (Platform.OS === 'ios') {
					alert('Drawing Downloaded Successfuly !');
				} else {
					ToastAndroid.showWithGravity('Drawing Downloaded Successfuly !', ToastAndroid.LONG, ToastAndroid.CENTER);
				}
				this.setState({ isRefreshing: false });
			})
			.catch(error => {
				this.setState({ isRefreshing: false });
				if (Platform.OS === 'ios') {
					Alert.alert('Success !!', 'Drawing Downloaded Successfuly !');
				} else {
					ToastAndroid.showWithGravity('Drawing Downloaded Successfuly !', ToastAndroid.LONG, ToastAndroid.CENTER);
				}
			});
	}

	getDownloadLink() {
		APIManager.getDownloadLink(
			this.state.materialDetails.woAiId,
			responseJson => {
				//alert(JSON.stringify(responseJson));
				if (responseJson.status == 'SUCCESS') {
					this.setState({ imageLink: responseJson.data.file }, () => {
						this.downloadAprdDrawing();
					});
				} else {
					Alert.alert('Drawing Not Found');
				}
			},
			error => {
				this.setState({ isRefreshing: false });
				console.log(JSON.stringify(error));
				alert('Please try again');
			}
		);
	}

	render() {
		return (
			<ImageBackground source={require('../Images/background.png')} style={{ width: '100%', height: '100%' }}>
				<View style={{ flexDirection: 'row' }}>
					<TouchableOpacity onPress={() => global.Inspection.goBack()}>
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
							INSPECTION
						</Text>
					</View>
				</View>

				<ScrollView>
					<View style={styles.container}>
						<Loader loading={this.state.isRefreshing} color="#40a7ab" />

						<View
							style={{
								borderWidth: 0,
								borderRadius: 5,
								padding: 15,
								backgroundColor: '#FEC1A5',
								width: '90%',
								elevation: 8
							}}
						>
							<View style={{ flexDirection: 'row' }}>
								<Text style={{ color: '#000000', fontFamily: 'GoogleSans-Medium', width: '50%' }}>SITE OFFER ID</Text>
								<Text style={{ color: '#000000', flex: 1, flexWrap: 'wrap', textAlign: 'right', width: '50%' }}>
									{this.state.siteOfferDetails.siteOfferUnqId}
								</Text>
							</View>

							<View style={{ flexDirection: 'row', marginTop: 20 }}>
								<Text style={{ color: '#000000', fontFamily: 'GoogleSans-Medium', width: '50%' }}>Materials Name</Text>
								<Text style={{ color: '#000000', flex: 1, flexWrap: 'wrap', textAlign: 'right', width: '50%' }}>
									{this.state.siteOfferDetails.materialName}
								</Text>
							</View>

							<View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 }}>
								<Text style={{ color: '#000000', fontFamily: 'GoogleSans-Medium' }}>Materials Serial No.</Text>
								<Text style={{ color: '#000000' }}>{this.state.materialDetails.materialSrNo}</Text>
							</View>
						</View>

						<View style={{ flexDirection: 'row', margin: 15 }}>
							<TouchableOpacity
								disabled={this.state.uatCount != 0 ? true : false}
								onPress={() => this.reDirectTo('AcceptanceTest')}
								style={{ width: '50%', justifyContent: 'center', alignItems: 'center' }}
							>
								<Image
									source={require('../Images/IspectionTestIcons/Acceptance-Test.png')}
									style={{ borderWidth: 1, borderRadius: 5 }}
								/>
								{this.state.uatCount != 0 ? (
									<Icon
										name="check-circle"
										size={25}
										color="#3CB043"
										style={{ position: 'absolute', top: 0, right: 10 }}
									/>
								) : null}
							</TouchableOpacity>

							<TouchableOpacity
								disabled={this.state.gtpCount != 0 ? true : false}
								onPress={() => this.reDirectTo('GTPTestScreen')}
								style={{ width: '50%', justifyContent: 'center', alignItems: 'center' }}
							>
								<Image
									source={require('../Images/IspectionTestIcons/gtp-master.png')}
									style={{ borderWidth: 1, borderRadius: 5 }}
								/>
								{this.state.gtpCount != 0 ? (
									<Icon
										name="check-circle"
										size={25}
										color="#3CB043"
										style={{ position: 'absolute', top: 0, right: 10 }}
									/>
								) : null}
							</TouchableOpacity>
						</View>

						<View style={{ flexDirection: 'row', margin: 15 }}>
							<TouchableOpacity
								onPress={() => this.getDownloadLink()}
								style={{ width: '50%', justifyContent: 'center', alignItems: 'center' }}
							>
								<Image
									source={require('../Images/IspectionTestIcons/approved-drawing.png')}
									style={{ borderWidth: 1, borderRadius: 5 }}
								/>
							</TouchableOpacity>

							<TouchableOpacity
								disabled={this.state.obsCount != 0 ? true : false}
								onPress={() => this.reDirectTo('ObservationsScreen')}
								style={{ width: '50%', justifyContent: 'center', alignItems: 'center' }}
							>
								<Image
									source={require('../Images/IspectionTestIcons/Observations.png')}
									style={{ borderWidth: 1, borderRadius: 5 }}
								/>
								{this.state.obsCount != 0 ? (
									<Icon
										name="check-circle"
										size={25}
										color="#3CB043"
										style={{ position: 'absolute', top: 0, right: 10 }}
									/>
								) : null}
							</TouchableOpacity>
						</View>

						<View style={{ flexDirection: 'row', margin: 15 }}>
							<TouchableOpacity onPress={() => this.onPassTest()} style={styles.acceptButton}>
								<Text style={styles.buttonText}>PASS</Text>
							</TouchableOpacity>

							<TouchableOpacity onPress={() => this.onFailTest()} style={styles.rejectButton}>
								<Text style={styles.buttonText}>FAIL</Text>
							</TouchableOpacity>
						</View>

						<Modal
							transparent={true}
							visible={this.state.testModalVisible}
							onRequestClose={() => {
								this.setState({ testModalVisible: false });
							}}
						>
							<TouchableOpacity
								onPress={() => this.setState({ testModalVisible: false })}
								style={{ flex: 1, justifyContent: 'flex-end', alignItems: 'center', backgroundColor: '#00000080' }}
							>
								<TouchableWithoutFeedback>
									<View
										style={{ width: 300, height: 300, backgroundColor: '#ffffff', borderRadius: 10, marginBottom: 20 }}
									>
										<View style={{ backgroundColor: 'black', padding: 15 }}>
											<Text
												style={{ fontFamily: 'GoogleSans-Medium', color: 'white', fontSize: 18, textAlign: 'center' }}
											>
												OVERALL TEST RESULT
											</Text>
											{this.state.overAllTestStatus == 2 ? (
												<Text
													style={{ fontFamily: 'GoogleSans-Medium', color: 'green', fontSize: 25, textAlign: 'center' }}
												>
													MATERIAL PASSED
												</Text>
											) : (
												<Text
													style={{ fontFamily: 'GoogleSans-Medium', color: 'red', fontSize: 25, textAlign: 'center' }}
												>
													MATERIAL FAILED
												</Text>
											)}
										</View>

										<View style={{ justifyContent: 'center', padding: 10, marginTop: 20 }}>
											<Text style={{ color: 'black', textAlign: 'center' }}>
												DO YOU WANT TO SUBMIT YOUR TEST REPORT FOR MATERIAL S.NO.{' '}
												{this.state.materialDetails.materialSrNo}?
											</Text>
										</View>

										<View style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 15 }}>
											<TouchableOpacity
												onPress={() => this.onYes()}
												style={{ borderRadius: 5, backgroundColor: '#ff7f00', margin: 15 }}
											>
												<Text style={styles.buttonText}>Yes</Text>
											</TouchableOpacity>

											<TouchableOpacity
												onPress={() => this.setState({ testModalVisible: false })}
												style={{ borderRadius: 5, backgroundColor: '#ff7f00', margin: 15 }}
											>
												<Text style={styles.buttonText}>N0</Text>
											</TouchableOpacity>
										</View>
									</View>
								</TouchableWithoutFeedback>
							</TouchableOpacity>
						</Modal>

						<Modal
							transparent={true}
							visible={this.state.testModalVisible2}
							onRequestClose={() => {
								this.setState({ testModalVisible2: false });
							}}
						>
							<TouchableOpacity
								onPress={() => this.setState({ testModalVisible2: false })}
								style={{ flex: 1, justifyContent: 'flex-end', alignItems: 'center', backgroundColor: '#00000080' }}
							>
								<TouchableWithoutFeedback>
									<View
										style={{
											width: 300,
											height: 300,
											backgroundColor: '#ffffff',
											borderRadius: 10,
											marginBottom: 20,
											padding: 15
										}}
									>
										<View style={{ flexDirection: 'row', marginTop: 20 }}>
											<Text
												style={{ color: 'black', textAlign: 'center', width: '80%', fontFamily: 'GoogleSans-Medium' }}
											>
												Upload the form 9 duly signed by You and Vendor
											</Text>
											<TouchableOpacity
												style={{ padding: 10, borderWidth: 1, borderRadius: 5, backgroundColor: 'brown', width: '20%' }}
											>
												<Icon name="file-text" size={30} color="white" />
											</TouchableOpacity>
										</View>

										<View style={{ flexDirection: 'row', marginTop: 20 }}>
											<Text
												style={{ color: 'black', textAlign: 'center', width: '40%', fontFamily: 'GoogleSans-Medium' }}
											>
												Seal Start No.
											</Text>

											<TextInput
												style={{ borderWidth: 1, width: '60%', height: 40 }}
												onChangeText={sealStartNo => this.setState({ sealStartNo })}
												value={this.state.sealStartNo}
												//underlineColorAndroid='orange'
											/>
										</View>

										<View style={{ flexDirection: 'row', marginTop: 20 }}>
											<Text
												style={{ color: 'black', textAlign: 'center', width: '40%', fontFamily: 'GoogleSans-Medium' }}
											>
												Seal End No.
											</Text>

											<TextInput
												style={{ borderWidth: 1, width: '60%', height: 40 }}
												onChangeText={sealEndNo => this.setState({ sealEndNo })}
												value={this.state.sealEndNo}
												//underlineColorAndroid='orange'
											/>
										</View>
										<View style={{ marginTop: 10, alignItems: 'center' }}>
											<TouchableOpacity onPress={() => this.onFinalSubmit()} style={styles.button}>
												<Text style={styles.buttonText}>SUBMIT</Text>
											</TouchableOpacity>
										</View>
									</View>
								</TouchableWithoutFeedback>
							</TouchableOpacity>
						</Modal>
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

	tableHeader: {
		flexDirection: 'row',
		backgroundColor: '#33a0ff',
		borderBottomColor: 'lightgrey',
		borderBottomWidth: 1
	},
	tableHeaderText: {
		padding: 10,
		fontFamily: 'GoogleSans-Medium',
		color: 'black',
		textAlign: 'center',
		borderRightColor: 'lightgrey',
		borderRightWidth: 1
	},
	tableContent: {
		flexDirection: 'row',
		backgroundColor: '#f9cda0',
		borderBottomColor: 'lightgrey',
		borderBottomWidth: 1
	},
	tableContentText: {
		padding: 10,
		color: 'black',
		borderRightColor: 'lightgrey',
		textAlign: 'center',
		borderRightWidth: 1,
		fontSize: 12
	},
	linkText: {
		paddingTop: 10,
		paddingBottom: 10,
		color: '#1b6379',
		textAlign: 'center',
		textDecorationLine: 'underline',
		width: '40%'
	},
	button: {
		borderRadius: 5,
		backgroundColor: '#ff7f00',
		marginTop: 20,
		marginBottom: 50
	},
	buttonText: {
		fontSize: 18,
		color: '#ffffff',
		fontFamily: 'GoogleSans-Medium',
		textAlign: 'center',
		padding: 10
	},
	acceptButton: {
		borderRadius: 5,
		backgroundColor: '#3CB043',
		width: '40%',
		margin: 10
	},

	rejectButton: {
		borderRadius: 5,
		backgroundColor: '#fb0102',
		width: '40%',
		margin: 10
	}
});
