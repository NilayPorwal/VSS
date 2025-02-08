import React, { Component } from 'react';
import {
	Platform,
	StyleSheet,
	Text,
	View,
	Image,
	BackHandler,
	TouchableOpacity,
	ScrollView,
	Modal,
	TextInput,
	TouchableWithoutFeedback,
	KeyboardAvoidingView,
	Alert,
	ImageBackground,
	ActivityIndicator
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import ImagePicker from 'react-native-image-picker';
import APIManager from '../Managers/APIManager';
import { Base64 } from 'js-base64';
import Loader from 'react-native-modal-loader';
import DocumentPicker from 'react-native-document-picker';
var RNFS = require('react-native-fs');

global.AcceptanceTest;
export default class AcceptanceTest extends Component {
	constructor(props) {
		super(props);
		this.state = {
			testModalVisible: false,
			testname: '',
			observation: '',
			uatStatus: null,
			test: [],
			image: [],
			imageData: null,
			type: '',
			video: '',
			isDisabled: false,
			isRefreshing: false,
			siteOfferDetails: this.props.navigation.state.params.siteOfferDetails,
			materialDetails: this.props.navigation.state.params.materialDetails,
			pickerModalVisible: false
		};
		// alert(JSON.stringify(this.props.navigation.state.params.materialDetails))
		global.AcceptanceTest = this;
	}
	static navigationOptions = {
		header: (
			<Image
				source={require('../../Images/Header3.png')}
				style={{ width: '100%', marginTop: Platform.OS === 'ios' ? 24 : 0 }}
			/>
		),
		headerLeft: null
	};

	componentDidMount() {
		BackHandler.addEventListener('hardwareBackPress', global.AcceptanceTest.handleAndroidBackButton);
	}
	componentWillUnmount() {
		BackHandler.removeEventListener('hardwareBackPress', global.AcceptanceTest.handleAndroidBackButton);
	}

	handleAndroidBackButton() {
		Alert.alert(
			'Are you sure you want to go back ?',
			'It will clear all your test data ',
			[
				{ text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
				{ text: 'OK', onPress: () => global.AcceptanceTest.props.navigation.goBack() }
			],
			{ cancelable: true }
		);
		return true;
	}

	onAddTest() {
		this.setState({ testModalVisible: true });
	}

	onPassTest() {
		const inspectionMatAiId = this.state.materialDetails.inspectionMatAiId;
		if (this.state.testname !== '') {
			this.setState(
				{
					test: [
						...this.state.test,
						{
							inspactMatAiId: inspectionMatAiId,
							uatTestName: this.state.testname,
							uatRemarks: this.state.observation,
							uatPhoto: this.state.imageData,
							photoExtension: this.state.type,
							uatVid: this.state.video,
							videoExtension: 'mp4',
							uatStatus: '0'
						}
					]
				},
				() => this.setState({ testModalVisible: false, testname: '', imageData: null, observation: '' })
			);
		} else {
			alert('Please fill the Test Name');
		}
	}

	onFailTest() {
		const inspectionMatAiId = this.state.materialDetails.inspectionMatAiId;
		if (this.state.testname !== '') {
			this.setState(
				{
					test: [
						...this.state.test,
						{
							inspactMatAiId: inspectionMatAiId,
							uatTestName: this.state.testname,
							uatRemarks: this.state.observation,
							uatPhoto: this.state.imageData,
							photoExtension: this.state.type,
							uatVid: this.state.video,
							videoExtension: 'mp4',
							uatStatus: '1'
						}
					]
				},
				() => this.setState({ testModalVisible: false, testname: '', imageData: null, observation: '' })
			);
		} else {
			alert('Please fill the Test Name');
		}
	}

	async onCamera() {
		var options = {
			title: 'Select Avatar',
			quality: 0.3,
			storageOptions: {
				path: 'images'
			}
		};
		ImagePicker.launchCamera(options, response => {
			console.log('Response = ', response);
			//alert(JSON.stringify(response))
			if (response.didCancel) {
				console.log('User cancelled image picker');
			} else if (response.error) {
				console.log('ImagePicker Error: ', response.error);
			} else {
				let source = response.uri;
				// let type = response.type.slice(6, 10)

				this.setState({
					image: source,
					imageData: response.data,
					type: 'png'
				});
			}
		});
	}

	async onDoc() {
		try {
			const res = await DocumentPicker.pick({
				type: [DocumentPicker.types.pdf, DocumentPicker.types.images]
			});
			console.log('Response = ', res);
			RNFS.readFile(res.uri, 'base64').then(result => {
				console.log(result);
				this.setState({
					imageData: result,
					type: 'pdf'
				});
			});
		} catch (err) {
			if (DocumentPicker.isCancel(err)) {
				// User cancelled the picker, exit any dialogs or menus and move on
			} else {
				throw err;
			}
		}
	}

	uploadAcceptanceTest() {
		if (this.state.test.length > 0) {
			this.setState({ isDisabled: true, isRefreshing: true });
			let Details = JSON.stringify(this.state.test);
			APIManager.uploadAcceptanceTest(
				Details,
				this.props.navigation.state.params.from,
				responseJson => {
					console.log(JSON.stringify(responseJson));
					if (responseJson.status == 'SUCCESS') {
						this.setState({ isDisabled: false, isRefreshing: false });
						const { navigation } = this.props;
						navigation.goBack();
						navigation.state.params.onSelect();
					} else {
						this.setState({ isDisabled: false, isRefreshing: false });
						// alert('Please Try To Submit Again')
					}
				},
				error => {
					this.setState({ isRefreshing: false });
					console.log(JSON.stringify(error));
					alert('Please try again');
				}
			);
		} else {
			alert('Please Add Test');
		}
	}

	onSubmit() {
		this.uploadAcceptanceTest();
		if (this.state.isRefreshing == true) {
			setTimeout(() => {
				this.setState({ isDisabled: false, isRefreshing: false });
				alert('Please Try Again to Submit Test');
			}, 20000);
		}
	}

	onModalClose() {
		this.setState({ testModalVisible: false, testname: null, observation: null, image: [], imageData: null });
	}

	removeDoc() {
		Alert.alert(
			'Hold on!',
			'Do you want to remove this document ?',
			[
				{ text: 'No', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
				{
					text: 'Yes',
					onPress: () => {
						this.setState({ imageData: null });
					}
				}
			],
			{ cancelable: true }
		);
	}

	render() {
		return (
			<ImageBackground source={require('../../Images/background.png')} style={{ width: '100%', height: '100%' }}>
				<View style={{ width: '20%', flexDirection: 'row' }}>
					<TouchableOpacity onPress={() => global.AcceptanceTest.handleAndroidBackButton()}>
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
							Acceptance Test
						</Text>
					</View>
				</View>

				<Loader loading={this.state.isRefreshing} color="#40a7ab" />
				<ScrollView>
					<View style={styles.container}>
						<View
							style={{
								borderWidth: 0,
								borderRadius: 5,
								margin: 15,
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

						<View style={{ borderWidth: 1, margin: 15 }}>
							<View style={styles.tableHeader}>
								<Text style={[styles.tableHeaderText, { width: '50%' }]}>Test Name</Text>
								<Text style={[styles.tableHeaderText, { width: '50%' }]}>Status</Text>
							</View>

							{this.state.test.length > 0
								? this.state.test.map(item => (
										<View style={styles.tableContent}>
											<Text style={[styles.tableContentText, { width: '50%' }]}>{item.uatTestName}</Text>
											{item.uatStatus == '0' ? (
												<Text style={[styles.tableContentText, { width: '50%' }]}>PASS</Text>
											) : (
												<Text style={[styles.tableContentText, { width: '50%' }]}>FAIL</Text>
											)}
										</View>
								  ))
								: null}
						</View>

						<View style={{ flexDirection: 'row', marginTop: 50, justifyContent: 'space-between', width: '90%' }}>
							<TouchableOpacity disabled={this.state.isDisabled} onPress={() => this.onSubmit()} style={styles.button}>
								<Text style={styles.buttonText}>SUBMIT</Text>
							</TouchableOpacity>

							<TouchableOpacity
								onPress={() => this.onAddTest()}
								style={{ borderRadius: 25, backgroundColor: '#ff7f00', padding: 15, elevation: 8 }}
							>
								<Icon name="plus" size={18} color="white" />
							</TouchableOpacity>
						</View>

						<Modal transparent={true} visible={this.state.testModalVisible} onRequestClose={() => this.onModalClose()}>
							<TouchableOpacity
								onPress={() => this.onModalClose()}
								style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#00000080' }}
							>
								<TouchableWithoutFeedback>
									<View style={{ width: 300, height: 300, backgroundColor: '#ffffff', padding: 10, borderRadius: 10 }}>
										<View style={{ flexDirection: 'row' }}>
											<View style={{ width: '70%' }}>
												<Text style={styles.text}>Test Name</Text>
												<TextInput
													style={[styles.textInput, { height: 40 }]}
													onChangeText={testname => this.setState({ testname })}
													value={this.state.testname}
													//underlineColorAndroid='orange'
												/>
											</View>
											{this.state.imageData == null ? (
												<View
													style={{
														flexDirection: 'row',
														marginTop: 10,
														justifyContent: 'center',
														alignItems: 'center',
														width: '30%'
													}}
												>
													<TouchableOpacity onPress={() => this.onCamera()} style={{}}>
														<Icon name="camera" size={28} color="black" />
													</TouchableOpacity>
													<TouchableOpacity onPress={() => this.onDoc()} style={{ marginLeft: 10 }}>
														<Icon name="image" size={28} color="black" />
													</TouchableOpacity>
												</View>
											) : (
												<TouchableOpacity
													onPress={() => this.removeDoc()}
													style={{ width: '30%', marginTop: 10, justifyContent: 'center', alignItems: 'center' }}
												>
													<Icon name="file-text" size={30} color="black" />
												</TouchableOpacity>
											)}
										</View>

										<View style={{ width: '100%', marginTop: 20 }}>
											<Text style={styles.text}>Observation</Text>
											<TextInput
												style={[styles.textInput, { height: 100 }]}
												onChangeText={observation => this.setState({ observation })}
												value={this.state.observation}
												multiline={true}
												//underlineColorAndroid='orange'
											/>
										</View>

										<View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%' }}>
											<TouchableOpacity onPress={() => this.onPassTest()} style={styles.acceptButton}>
												<Text style={styles.buttonText}>PASS</Text>
											</TouchableOpacity>

											<TouchableOpacity onPress={() => this.onFailTest()} style={styles.rejectButton}>
												<Text style={styles.buttonText}>FAIL</Text>
											</TouchableOpacity>
										</View>

										<TouchableOpacity
											onPress={() => this.onModalClose()}
											style={{ position: 'absolute', top: 0, right: 5 }}
										>
											<Icon name="x" size={20} color="black" />
										</TouchableOpacity>
									</View>
								</TouchableWithoutFeedback>
							</TouchableOpacity>
						</Modal>

						<Modal
							transparent={true}
							visible={this.state.pickerModalVisible}
							onRequestClose={() => this.setState({ pickerModalVisible: false })}
						>
							<TouchableOpacity
								onPress={() => this.setState({ pickerModalVisible: false })}
								style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#00000080' }}
							>
								<TouchableWithoutFeedback>
									<View style={{ width: '80%', backgroundColor: '#ffffff', padding: 10, borderRadius: 10 }}>
										<TouchableOpacity style={{ margin: 10 }} onPress={() => this.onCamera(0)}>
											<Text style={{ color: '#000' }}>Take Picture</Text>
										</TouchableOpacity>
										<TouchableOpacity style={{ margin: 10 }} onPress={() => this.onCamera(1)}>
											<Text style={{ color: '#000' }}>Select from Gallary</Text>
										</TouchableOpacity>
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
		backgroundColor: '#141F25',
		borderBottomColor: 'lightgrey',
		borderBottomWidth: 1
	},
	tableHeaderText: {
		padding: 10,
		fontFamily: 'GoogleSans-Medium',
		color: '#ffffff',
		textAlign: 'center',
		borderRightColor: 'lightgrey',
		borderRightWidth: 1
	},
	tableContent: {
		flexDirection: 'row',
		backgroundColor: '#ffffff',
		borderBottomColor: 'lightgrey',
		borderBottomWidth: 1
	},
	tableContentText: {
		color: '#1b6379',
		borderRightColor: 'lightgrey',
		textAlign: 'center',
		borderRightWidth: 1,
		fontSize: 15,
		paddingVertical: 10,
		fontFamily: 'GoogleSans-Medium'
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
		backgroundColor: '#3CB043',
		elevation: 6
	},
	buttonText: {
		fontSize: 15,
		color: '#ffffff',
		fontFamily: 'GoogleSans-Medium',
		paddingVertical: 10,
		paddingHorizontal: 20,
		textAlign: 'center'
	},
	text: {
		color: 'black',
		fontSize: 15,
		fontFamily: 'GoogleSans-Medium'
	},
	textInput: {
		borderWidth: 1
	},
	acceptButton: {
		borderRadius: 5,
		backgroundColor: '#ff7f00',
		marginTop: 20
	},

	rejectButton: {
		borderRadius: 5,
		backgroundColor: '#fb0102',
		marginTop: 20
	}
});
