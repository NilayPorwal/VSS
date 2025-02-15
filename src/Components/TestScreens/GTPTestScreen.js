import React, { Component } from 'react';
import {
	Platform,
	StyleSheet,
	Text,
	View,
	BackHandler,
	Image,
	TouchableOpacity,
	ScrollView,
	ImageBackground,
	Modal,
	ToastAndroid,
	TextInput,
	TouchableWithoutFeedback,
	KeyboardAvoidingView,
	FlatList,
	ActivityIndicator,
	Alert
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import APIManager from '../Managers/APIManager';
import Loader from 'react-native-modal-loader';
import { launchImageLibrary } from 'react-native-image-picker/src';

global.GTPTestScreen;
export default class GTPTestScreen extends Component {
	constructor(props) {
		super(props);
		this.state = {
			isLoading: false,
			isLoading2: false,
			isRefreshing: true,
			isRefreshing2: false,
			testModalVisible: false,
			test: [{ testname: '', observation: '', result: 0 }],
			gtpStatus: null,
			gtpRemarks: '',
			gtpAiId: null,
			image: '',
			video: '',
			imageData: null,
			photoExtension: '',
			gtpList: [],
			itemIndex: null,
			siteOfferDetails: this.props.navigation.state.params.siteOfferDetails,
			materialDetails: this.props.navigation.state.params.materialDetails,
			gtpItems: [],
			remarks: [],
			value: ''
		};
		global.GTPTestScreen = this;
		this.handleChange = this.handleChange.bind(this);
		// alert(JSON.stringify(this.props.navigation.state.params.siteOfferDetails))
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
		this.getGTPList();
		BackHandler.addEventListener('hardwareBackPress', global.GTPTestScreen.handleAndroidBackButton);
	}
	componentWillUnmount() {
		BackHandler.removeEventListener('hardwareBackPress', global.GTPTestScreen.handleAndroidBackButton);
	}

	handleAndroidBackButton() {
		Alert.alert(
			'Are you sure you want to go back ?',
			'It will clear all your test data ',
			[
				{ text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
				{ text: 'OK', onPress: () => global.GTPTestScreen.props.navigation.goBack() }
			],
			{ cancelable: true }
		);
		return true;
	}

	getGTPList() {
		APIManager.getGTPList(
			this.state.siteOfferDetails.materialAiId,
			this.state.siteOfferDetails.materialSubcategoryAiId,
			this.state.siteOfferDetails.vendorWoAiId,
			this.props.navigation.state.params.from,
			responseJson => {
				//alert(JSON.stringify(responseJson.data));
				this.setState({ gtpList: responseJson.data, isRefreshing: false });
			},
			err => {
				Alert.alert('Failed to get GTP List', err.message);
			}
		);
	}

	addGTPStatus() {
		this.setState({ isLoading: true });
		const Details = [
			{
				inspactMatAiId: this.state.materialDetails.inspectionMatAiId,
				gtpAiId: this.state.gtpAiId,
				gtpStatus: this.state.gtpStatus,
				gtpRemarks: this.state.gtpRemarks,
				gtpPhoto: this.state.imageData,
				photoExtension: this.state.photoExtension,
				gtpVid: '',
				videoExtension: ''
			}
		];
		// alert(JSON.stringify(Details))
		APIManager.addGTPStatus(
			Details,
			this.props.navigation.state.params.from,
			responseJson => {
				if (responseJson.status == 'SUCCESS') {
					//alert(JSON.stringify(responseJson));
					const array = [...this.state.gtpList];
					const index = this.state.itemIndex;
					array.splice(index, 1);
					this.setState({
						gtpList: array,
						testModalVisible: false,
						isLoading: false,
						gtpStatus: null,
						gtpRemarks: '',
						gtpPhoto: '',
						imageData: null
					});
				} else {
					alert('PLEASE TRY AGAIN');
				}
			},
			error => {
				this.setState({ isLoading: false });
				console.log(JSON.stringify(error));
				Alert.alert('Failed to update', error.message);
			}
		);
	}

	onPassTest(item, index) {
		this.setState({ gtpStatus: 0, gtpAiId: item.gtpId, itemIndex: index, isLoading2: true }, () => {
			this.addGTPStatus();
		});
		ToastAndroid.show('GTP Pass Successfuly !', ToastAndroid.CENTER);
	}

	onGtpObs(item, index) {
		this.setState({
			testModalVisible: true,
			gtpStatus: 0,
			gtpAiId: item.gtpId,
			itemIndex: index,
			gtpRemarks: item.gtpStandard
		});
	}

	async on_PassAll() {
		let array = this.state.gtpList;
		//alert(array.length)
		for (var i = 0; i < array.length; i++) {
			let test = {
				inspactMatAiId: this.state.materialDetails.inspectionMatAiId,
				gtpAiId: array[i].gtpId,
				gtpStatus: '0',
				gtpRemarks: array[i].gtpStandard != '' ? array[i].gtpStandard : 'null',
				gtpPhoto: '',
				photoExtension: '',
				gtpVid: '',
				videoExtension: ''
			};

			await this.state.gtpItems.push(test);
		}
	}

	async on_FailAll() {
		let array = this.state.gtpList;
		//alert(array.length)
		for (var i = 0; i < array.length; i++) {
			let test = {
				inspactMatAiId: this.state.materialDetails.inspectionMatAiId,
				gtpAiId: array[i].gtpId,
				gtpStatus: '1',
				gtpRemarks: array[i].gtpStandard,
				gtpPhoto: '',
				photoExtension: '',
				gtpVid: '',
				videoExtension: ''
			};

			await this.state.gtpItems.push(test);
		}
	}

	async onPassAll() {
		let array = this.state.gtpList;
		//alert(array.length)
		for (var i = 0; i < array.length; i++) {
			let test = {
				inspactMatAiId: this.state.materialDetails.inspectionMatAiId,
				gtpAiId: array[i].gtpId,
				gtpStatus: '0',
				gtpRemarks: array[i].gtpStandard != '' ? array[i].gtpStandard : 'null',
				gtpPhoto: '',
				photoExtension: '',
				gtpVid: '',
				videoExtension: ''
			};

			await this.state.gtpItems.push(test);
			if (array.length == this.state.gtpItems.length) {
				this.setState({ isLoading2: true });
				let Details = await this.state.gtpItems;
				// alert(JSON.stringify(Details))
				APIManager.addGTPStatus(
					Details,
					this.props.navigation.state.params.from,
					responseJson => {
						if (responseJson.status == 'SUCCESS') {
							this.setState({ gtpList: [], gtpItems: [], isLoading2: false });
							ToastAndroid.show('GTP Passed Successfuly !', ToastAndroid.CENTER);
						} else {
							this.setState({ isLoading2: false, gtpItems: [] });
							Alert.alert('Failed to update', responseJson.message);
						}
					},
					error => {
						this.setState({ isLoading2: false });
						console.log(JSON.stringify(error));
						Alert.alert('Failed to update', error.message);
					}
				);
			}
		}
	}

	async onFailAll() {
		let array = this.state.gtpList;
		//alert(array.length)
		for (var i = 0; i < array.length; i++) {
			let test = {
				inspactMatAiId: this.state.materialDetails.inspectionMatAiId,
				gtpAiId: array[i].gtpId,
				gtpStatus: '1',
				gtpRemarks: array[i].gtpStandard,
				gtpPhoto: '',
				photoExtension: '',
				gtpVid: '',
				videoExtension: ''
			};

			await this.state.gtpItems.push(test);
			if (array.length == this.state.gtpItems.length) {
				this.setState({ isLoading2: true });
				let Details = await this.state.gtpItems;
				// alert(JSON.stringify(Details))
				APIManager.addGTPStatus(
					Details,
					this.props.navigation.state.params.from,
					responseJson => {
						if (responseJson.status == 'SUCCESS') {
							// alert(JSON.stringify(responseJson));
							this.setState({ gtpList: [], gtpItems: [], isLoading2: false });
							ToastAndroid.show('GTP Fail Successfuly !', ToastAndroid.CENTER);
						} else {
							this.setState({ gtpItems: [], isLoading2: false });
							Alert.alert('Failed to update', responseJson.message);
						}
					},
					error => {
						this.setState({ isLoading2: false });
						console.log(JSON.stringify(error));
						Alert.alert('Failed to update', error.message);
					}
				);
			}
		}
	}

	async _PassAll() {
		// await this.on_PassAll()
		//alert(JSON.stringify(this.state.gtpItems))
		Alert.alert(
			'Are you sure ?',
			'You wants to Pass all GTP Standards',
			[
				{ text: 'NO', onPress: () => this.setState({ gtpItems: [] }), style: 'cancel' },
				{ text: 'Yes', onPress: () => global.GTPTestScreen.onPassAll() }
			],
			{ cancelable: true }
		);
		return true;
	}

	async _FailAll() {
		//await  this.on_FailAll()
		Alert.alert(
			'Are you sure ?',
			'You wants to Fail all GTP Standards',
			[
				{
					text: 'NO',
					onPress: () =>
						this.setState({ gtpItems: [] }, () => {
							console.log('Cancel Pressed');
						}),
					style: 'cancel'
				},
				{ text: 'Yes', onPress: () => global.GTPTestScreen.onFailAll() }
			],
			{ cancelable: true }
		);
		return true;
	}

	onSubmit() {
		this.addGTPStatus();
		ToastAndroid.show('Observation Added Successfuly!', ToastAndroid.CENTER);
	}

	onCamera() {
		var options = {
			title: 'Select Avatar',
			includeBase64: true,
			quality: 0.3,
			storageOptions: {
				path: 'images'
			}
		};
		launchImageLibrary(options, response => {
			console.log('Response = ', response);

			if (response.didCancel) {
				console.log('User cancelled image picker');
			} else if (response.error) {
				console.log('ImagePicker Error: ', response.error);
			} else {
				let source = response.uri;
				let type = response.type.slice(6, 10);
				// You can also display the image using data:
				//let source = 'data:image/jpeg;base64,' + response.data ;

				this.setState({
					image: source,
					imageData: response?.base64,
					photoExtension: type
				});
			}
		});
	}

	onBack() {
		const { navigation } = this.props;
		navigation.goBack();
		navigation.state.params.onSelect();
	}

	onRemark(value, gtpId) {
		//alert(value)
		this.setState({ remarks: [...this.state.remarks, { remark: value, gtpId: gtpId }] });
	}
	handleChange(event) {
		const { key, value } = event.nativeEvent;
		let processedData = value;

		this.setState({ [remarks]: processedData });
	}

	render() {
		return (
			<ImageBackground source={require('../../Images/background.png')} style={{ width: '100%', height: '100%' }}>
				<ScrollView>
					<View style={styles.container}>
						<Loader loading={this.state.isLoading2} color="#40a7ab" />

						<View style={{ width: '100%', flexDirection: 'row' }}>
							<TouchableOpacity onPress={() => global.GTPTestScreen.handleAndroidBackButton()}>
								<Icon name="chevron-left" size={20} color="#000000" style={{ margin: 15 }} />
							</TouchableOpacity>
							<View style={{ width: '90%' }}>
								<Text
									style={{
										fontSize: 18,
										fontFamily: 'GoogleSans-Medium',
										color: 'black',
										paddingTop: 15,
										textAlign: 'center'
									}}
								>
									Test As Per GTP
								</Text>
							</View>
						</View>

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

						{this.state.gtpList != '' ? (
							<View style={{ flexDirection: 'row' }}>
								<View style={{ width: '50%', paddingHorizontal: 20 }}>
									<TouchableOpacity
										onPress={() => this._PassAll()}
										style={{ borderRadius: 5, backgroundColor: '#3CB043', paddingHorizontal: 15 }}
									>
										<Text
											style={{
												fontSize: 15,
												color: '#ffffff',
												fontFamily: 'GoogleSans-Medium',
												paddingVertical: 10,
												textAlign: 'center'
											}}
										>
											PASS
										</Text>
									</TouchableOpacity>
								</View>
								<View style={{ width: '50%', paddingHorizontal: 20 }}>
									<TouchableOpacity
										onPress={() => this._FailAll()}
										style={{ borderRadius: 5, backgroundColor: 'red', paddingHorizontal: 15 }}
									>
										<Text
											style={{
												fontSize: 15,
												color: '#ffffff',
												fontFamily: 'GoogleSans-Medium',
												paddingVertical: 10,
												textAlign: 'center'
											}}
										>
											FAIL
										</Text>
									</TouchableOpacity>
								</View>
							</View>
						) : null}

						{this.state.isRefreshing == false ? (
							<FlatList
								data={this.state.gtpList}
								keyExtractor={item => item.index}
								renderItem={({ item, index }) => (
									<View style={{ margin: 15, borderRadius: 5, elevation: 8, backgroundColor: '#ffffff', padding: 15 }}>
										<View style={{ flexDirection: 'row' }}>
											<Text style={{ color: '#000000', fontFamily: 'GoogleSans-Medium', fontSize: 15, width: '50%' }}>
												GTP Particulars
											</Text>
											<Text
												style={{
													color: '#000000',
													fontSize: 15,
													flex: 1,
													flexWrap: 'wrap',
													textAlign: 'right',
													width: '50%'
												}}
											>
												{item.gtpPartculars}
											</Text>
										</View>

										<View style={{ flexDirection: 'row', marginTop: 10 }}>
											<Text style={{ color: '#000000', fontFamily: 'GoogleSans-Medium', fontSize: 15, width: '50%' }}>
												GTP Unit
											</Text>
											<Text
												style={{
													color: '#000000',
													fontSize: 15,
													flex: 1,
													flexWrap: 'wrap',
													textAlign: 'right',
													width: '50%'
												}}
											>
												{item.gtpUnit}
											</Text>
										</View>

										<View style={{ flexDirection: 'row', marginTop: 10 }}>
											<Text style={{ color: '#000000', fontFamily: 'GoogleSans-Medium', fontSize: 15, width: '50%' }}>
												GTP Standard
											</Text>
											<Text
												style={{
													color: '#000000',
													fontSize: 15,
													flex: 1,
													flexWrap: 'wrap',
													textAlign: 'right',
													width: '50%'
												}}
											>
												{item.gtpStandard}
											</Text>
										</View>

										<View style={{ flexDirection: 'row' }}>
											<View style={{ width: '50%' }}></View>

											<View style={{ width: '50%' }}>
												<TouchableOpacity
													onPress={() => this.onGtpObs(item, index)}
													style={{ borderRadius: 5, backgroundColor: '#418bca', marginTop: 10 }}
												>
													<Text
														style={{
															fontSize: 15,
															color: '#ffffff',
															fontFamily: 'GoogleSans-Medium',
															paddingVertical: 10,
															textAlign: 'center',
															elevation: 5
														}}
													>
														GTP Observation
													</Text>
												</TouchableOpacity>
											</View>
										</View>
									</View>
								)}
							/>
						) : (
							<View style={{ justifyContent: 'center' }}>
								<ActivityIndicator size="large" color="orange" />
							</View>
						)}

						<View style={{ marginBottom: 20, marginTop: 20 }}>
							<TouchableOpacity onPress={() => this.onBack()} style={styles.button}>
								<Text style={styles.buttonText}>Back</Text>
							</TouchableOpacity>
						</View>

						<Modal
							transparent={true}
							visible={this.state.testModalVisible}
							onRequestClose={() => {
								this.setState({ testModalVisible: false });
							}}
						>
							<View
								onPress={() => this.setState({ testModalVisible: false })}
								style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#00000080' }}
							>
								<View
									style={{
										width: 300,
										backgroundColor: '#ffffff',
										padding: 10,
										borderRadius: 10,
										justifyContent: 'center'
									}}
								>
									{this.state.isLoading == false ? (
										<View>
											{this.state.imageData == null ? (
												<View style={{ flexDirection: 'row', padding: 10, marginTop: 10, alignItems: 'center' }}>
													<Text style={{ fontFamily: 'GoogleSans-Medium', fontSize: 15, color: 'black' }}>
														Upload Documents (if any)
													</Text>
													<TouchableOpacity
														onPress={() => {
															this.onCamera();
														}}
														style={{ padding: 17, marginLeft: 15, borderRadius: 30, elevation: 4 }}
													>
														<Icon name="camera" size={30} color="black" />
													</TouchableOpacity>
												</View>
											) : (
												<View style={{ flexDirection: 'row', padding: 10, marginTop: 10, alignItems: 'center' }}>
													<Text style={{ fontFamily: 'GoogleSans-Medium', fontSize: 15, color: 'black' }}>
														Document Uploaded
													</Text>
													<TouchableOpacity style={{ paddingLeft: 20 }}>
														<Icon name="file-text" size={30} color="black" />
													</TouchableOpacity>
												</View>
											)}

											<View style={{ width: '100%', marginTop: 20 }}>
												<Text style={styles.text}>Observation</Text>
												<TextInput
													style={[styles.textInput, { height: 100 }]}
													onChangeText={gtpRemarks => this.setState({ gtpRemarks })}
													value={this.state.gtpRemarks}
													placeholder="Observation..."
													multiline={true}
													//underlineColorAndroid='orange'
												/>
											</View>

											<View style={{ marginTop: 10, alignItems: 'center' }}>
												<TouchableOpacity onPress={() => this.onSubmit()} style={styles.button}>
													<Text style={styles.buttonText}>SUBMIT</Text>
												</TouchableOpacity>
											</View>
										</View>
									) : (
										<View style={{ alignItems: 'center' }}>
											<ActivityIndicator size="large" color="#000000" />
										</View>
									)}

									<TouchableOpacity
										onPress={() => this.setState({ testModalVisible: false, gtpRemarks: '' })}
										style={{ position: 'absolute', top: 0, right: 5 }}
									>
										<Icon name="x" size={25} color="black" />
									</TouchableOpacity>
								</View>
							</View>
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
		backgroundColor: '#ff7f00'
	},
	buttonText: {
		fontSize: 15,
		color: '#ffffff',
		fontFamily: 'GoogleSans-Medium',
		paddingVertical: 10,
		paddingHorizontal: 25
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
		backgroundColor: '#3CB043',
		marginTop: 20
	},

	rejectButton: {
		borderRadius: 5,
		backgroundColor: '#fb0102',
		marginTop: 20
	}
});
