import React, { Component } from 'react';
import {
	Platform,
	StyleSheet,
	Text,
	View,
	Image,
	TouchableOpacity,
	Alert,
	BackHandler,
	Modal,
	TouchableWithoutFeedback,
	ImageBackground,
	TextInput,
	ActivityIndicator,
	ScrollView,
	FlatList,
	ToastAndroid
} from 'react-native';
import APIManager from '../Managers/APIManager';
import { Base64 } from 'js-base64';
import Loader from 'react-native-modal-loader';
import Icon from 'react-native-vector-icons/Feather';
import { getData } from '../../helper';
import { launchImageLibrary } from 'react-native-image-picker/src';

var dateFormat = require('dateformat');

global.GPInspectorConfirmationScreen;
export default class GPInspectorConfirmationScreen extends Component {
	constructor(props) {
		super(props);
		this.state = {
			details: [],
			woDetails: [],
			vendId: '',
			isRefreshing: true,
			error: false,
			offerQty: '',
			modalVisible: false,
			siteofferQty: null,
			inspectionCnfrmAiId: null,
			item: {},
			packStartSrno: null,
			packEndSrno: null,
			image: [],
			imageData: [],
			qtystatus: null,
			pdiofferAiId: null,
			showSrNo: false
		};
		global.GPInspectorConfirmationScreen = this;
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
		this.getInspId();

		BackHandler.addEventListener('hardwareBackPress', this.props.navigation.goBack);
	}

	async getInspId() {
		await getData('InspId').then(value =>
			this.setState({ vendId: value }, () => {
				this.getGPInspectorConfirmationDetails();
			})
		);
	}

	getGPInspectorConfirmationDetails() {
		APIManager.getGPInspectorConfirmationDetails(
			this.state.vendId,
			responseJson => {
				console.log(JSON.stringify(responseJson));
				if (responseJson.status == 'SUCCESS') {
					this.setState({ details: responseJson.data, isRefreshing: false });
				} else {
					this.setState({ error: true, isRefreshing: false });
				}
			},
			error => {
				this.setState({ isRefreshing: false });
				console.log(JSON.stringify(error));
			}
		);
	}

	onCnfm(item) {
		//alert(item.pdiOfferAiId)
		this.setState({ item: item }, () => {
			this.setState({ modalVisible: true });
		});
	}

	onConfirm() {
		this.setState({ isRefreshing: true });
		const Details = {
			inspectIonCnfrmGPAiId: this.state.item.inspectionCnfrmGpAiId,
			inspectionSiteOfferQty: this.state.item.offerQty,
			totalPackageNo: 0,
			qtyPerPackage: 0,
			siteInspectionStatusRemarks: 'thanks from mobile',
			siteInspectionForm: ''
		};
		console.log(JSON.stringify(Details));
		APIManager.GPVendorConfirmation(
			Details,
			responseJson => {
				this.setState({ isRefreshing: false });
				console.log(JSON.stringify(responseJson));
				if (responseJson.status == 'SUCCESS') {
					//this.props.navigation.navigate('HomeScreen')
					this.getGPInspectorConfirmationDetails();
					Alert.alert('Confirmation Success !!', responseJson.message);
					this.closeModal();
				} else {
					Alert.alert('Confirmation Failure !!', responseJson.message);
				}
				//this.setState({offerDetails:responseJson.data})
			},
			error => {
				console.log(JSON.stringify(error));
				Alert.alert('Confirmation Failure !!', error.message);
				this.setState({ isRefreshing: false });
			}
		);
	}

	onCamera() {
		if (this.state.image.length >= 5) {
			return Alert.alert('Maximum number of document exceeded');
		}

		var options = {
			title: 'Select Avatar',
			quality: 0.2,
			includeBase64: true,
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
				//  let type = response.type.slice(6, 10)
				// You can also display the image using data:
				// console.log('data:image/jpeg;base64,'response.data);
				let source = {
					inspectionCnfrmAiId: this.state.item.inspectionCnfrmAiId,
					uploadPackingListPhotoPath: 'data:image/jpeg;base64,' + response?.base64,
					extn: 'png'
				};

				this.setState({
					image: [...this.state.image, { image: response.uri }],
					imageData: [...this.state.imageData, source],
					photoExtension: 'png'
				});
			}
		});
	}

	closeModal() {
		this.setState({
			modalVisible: false,
			imageData: [],
			image: [],
			packStartSrno: null,
			packEndSrno: null,
			isRefreshing: false,
			item: {},
			siteofferQty: null
		});
	}

	render() {
		return (
			<ImageBackground source={require('../../Images/background.png')} style={{ width: '100%', height: '100%' }}>
				<ScrollView>
					<View style={styles.container}>
						<Loader loading={this.state.isRefreshing} color="#40a7ab" />

						<View style={{ width: '100%', flexDirection: 'row' }}>
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
									Confirmation By Inspector
								</Text>
							</View>
						</View>

						{this.state.details.length > 0 ? (
							<FlatList
								data={this.state.details}
								keyExtractor={item => item.index}
								renderItem={({ item, index }) => (
									<View key={index} style={[styles.cardStyle, { borderLeftColor: '#61B865' }]}>
										<View style={{ flexDirection: 'row' }}>
											<View style={{ width: '50%' }}>
												<Text style={{ color: '#000000', fontFamily: 'GoogleSans-Medium', fontSize: 15 }}>
													Inspector Name
												</Text>
												<Text style={{ color: '#000000', fontSize: 13 }}>{item.inspectorName}</Text>
											</View>
											<View style={{ width: '50%' }}>
												<Text
													style={{
														color: '#000000',
														fontFamily: 'GoogleSans-Medium',
														fontSize: 15,
														textAlign: 'right'
													}}
												>
													Contact Number
												</Text>
												<Text style={{ color: '#000000', fontSize: 13, textAlign: 'right' }}>{item.mobileOffice}</Text>
											</View>
										</View>

										<View style={{ flexDirection: 'row', marginTop: 10 }}>
											<View style={{ width: '50%' }}>
												<Text style={{ color: '#000000', fontFamily: 'GoogleSans-Medium', fontSize: 15 }}>
													Proposed Inspection Date
												</Text>
												<Text style={{ color: '#000000', fontSize: 13 }}>
													{dateFormat(item.inspectionDate, 'dd-mm-yyyy')}
												</Text>
											</View>

											<View style={{ width: '50%' }}>
												<Text
													style={{
														color: '#000000',
														fontFamily: 'GoogleSans-Medium',
														fontSize: 15,
														textAlign: 'right'
													}}
												>
													Time of Arival
												</Text>
												<Text style={{ color: '#000000', fontSize: 13, textAlign: 'right' }}>{item.arrivalTime}</Text>
											</View>
										</View>

										<View style={{ flexDirection: 'row', marginTop: 10 }}>
											<View style={{ width: '50%' }}>
												<Text style={{ color: '#000000', fontFamily: 'GoogleSans-Medium', fontSize: 15 }}>
													Pick Up Location
												</Text>
												<Text style={{ color: '#000000', fontSize: 13 }}>{item.pickUpLocation}</Text>
											</View>

											<View style={{ width: '50%' }}>
												<Text
													style={{
														color: '#000000',
														fontFamily: 'GoogleSans-Medium',
														fontSize: 15,
														textAlign: 'right'
													}}
												>
													Mode of Travel
												</Text>
												<Text style={{ color: '#000000', fontSize: 13, textAlign: 'right' }}>{item.travelMode}</Text>
											</View>
										</View>

										<TouchableOpacity
											onPress={() => {
												this.onCnfm(item);
											}}
											style={{ borderRadius: 5, backgroundColor: '#418bca', marginVertical: 15 }}
										>
											<Text
												style={{
													fontSize: 18,
													color: '#ffffff',
													fontFamily: 'GoogleSans-Medium',
													paddingVertical: 10,
													textAlign: 'center',
													elevation: 5
												}}
											>
												CONFIRM
											</Text>
										</TouchableOpacity>
									</View>
								)}
							/>
						) : (
							<View style={{ justifyContent: 'center', height: 100 }}>
								<Text style={{ fontFamily: 'GoogleSans-Medium', fontSize: 15 }}>No Data Found</Text>
							</View>
						)}

						<Modal
							transparent={true}
							visible={this.state.modalVisible}
							onRequestClose={() => {
								this.closeModal();
							}}
						>
							<View
								onPress={() => this.closeModal()}
								style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#00000080' }}
							>
								<View style={{ width: '80%', backgroundColor: '#ffffff', padding: 15, borderRadius: 10 }}>
									<Text
										style={{ textAlign: 'center', color: '#ff7f00', fontFamily: 'GoogleSans-Medium', fontSize: 18 }}
									>
										Do you want to confirm inspection ?
									</Text>

									{this.state.isRefreshing == true ? (
										<ActivityIndicator size="small" color="#000000" style={{ marginTop: 10 }} />
									) : (
										<View style={{ flexDirection: 'row', justifyContent: 'space-between', marginVertical: 20 }}>
											<TouchableOpacity
												onPress={() => this.onConfirm()}
												style={{ borderRadius: 5, backgroundColor: '#3CB043' }}
											>
												<Text
													style={{
														fontSize: 15,
														color: '#ffffff',
														fontFamily: 'GoogleSans-Medium',
														paddingVertical: 10,
														paddingHorizontal: 20,
														elevation: 5
													}}
												>
													Yes
												</Text>
											</TouchableOpacity>
											<TouchableOpacity
												onPress={() => this.setState({ modalVisible: false })}
												style={{ borderRadius: 5, backgroundColor: 'red' }}
											>
												<Text
													style={{
														fontSize: 15,
														color: '#ffffff',
														fontFamily: 'GoogleSans-Medium',
														paddingVertical: 10,
														paddingHorizontal: 20,
														elevation: 5
													}}
												>
													No
												</Text>
											</TouchableOpacity>
										</View>
									)}
									<TouchableOpacity
										onPress={() => this.closeModal()}
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
	cardStyle: {
		margin: 15,
		borderRadius: 5,
		elevation: 8,
		backgroundColor: '#ffffff',
		padding: 15,
		borderLeftWidth: 5
	},
	tableHeader: {
		flexDirection: 'row',
		backgroundColor: '#000000',
		borderBottomColor: 'lightgrey',
		borderBottomWidth: 1
	},
	tableHeaderText: {
		paddingVertical: 10,
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
		color: 'black',
		borderRightColor: 'lightgrey',
		textAlign: 'center',
		borderRightWidth: 1,
		fontSize: 14,
		paddingVertical: 10
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
	},
	detailsView: {
		borderWidth: 1,
		margin: 15,
		padding: 15,
		backgroundColor: '#FEC1A5',
		elevation: 8,
		borderColor: 'transparent'
	}
});
