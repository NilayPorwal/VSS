import React, { Component } from 'react';
import {
	Platform,
	StyleSheet,
	Text,
	View,
	Image,
	TouchableOpacity,
	BackHandler,
	Modal,
	TouchableWithoutFeedback,
	ImageBackground,
	ActivityIndicator,
	AsyncStorage,
	ScrollView
} from 'react-native';
import APIManager from './Managers/APIManager';
import { Base64 } from 'js-base64';
import Loader from 'react-native-modal-loader';
import Icon from 'react-native-vector-icons/FontAwesome';

global.InspectionsPerformed;
export default class InspectionsPerformed extends Component {
	constructor(props) {
		super(props);
		this.state = {
			screenType: 'Other',
			isRefreshing: true,
			isLoading: false,
			detailsModalVisible: false,
			inspId: '',
			vendorList: [],
			error: false,
			workAddress: ''
		};
		global.InspectionsPerformed = this;
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
		// APIManager.getCredentials();
		this.getInspDetails();

		this._interval = setInterval(() => {
			this.getVendorList();
		}, 5000);
		BackHandler.addEventListener('hardwareBackPress', this.props.navigation.goBack);
	}

	componentWillUnmount() {
		clearInterval(this._interval);
	}

	async getVendorList() {
		const inspId = await this.state.inspId;
		APIManager.getVendorList(
			inspId,
			responseJson => {
				console.log(JSON.stringify(responseJson));
				this.setState({ vendorList: responseJson.data, isRefreshing: false });
			},
			error => {
				this.setState({ isRefreshing: false });
				console.log(JSON.stringify(error));
			}
		);
	}

	async getInspDetails() {
		this.setState({ isRefreshing: true });
		await AsyncStorage.getItem('InspId').then(value =>
			this.setState({ inspId: value }, () => {
				this.getVendorList();
			})
		);
	}

	reDirectTo(item) {
		this.props.navigation.navigate('StartInspectionScreen', {
			vendorDetails: item
		});
		clearInterval(this._interval);
	}

	navigateTo(item) {
		this.props.navigation.navigate('ActiveSiteOffers', {
			vendorDetails: item
		});
		clearInterval(this._interval);
	}

	viewDetails(item) {
		//alert(item.vendorWorksAddress)
		this.setState({ workAddress: item.vendorWorksAddress }, () => {
			this.setState({ detailsModalVisible: true });
		});
	}

	render() {
		return (
			<ImageBackground source={require('../Images/background.png')} style={{ width: '100%', height: '100%' }}>
				<ScrollView>
					<View style={styles.container}>
						<Loader loading={this.state.isRefreshing} color="#40a7ab" />
						<Text style={{ fontSize: 18, fontFamily: 'GoogleSans-Medium', marginTop: 25, color: 'black' }}>
							INSPECTIONS TO BE PERFORMED
						</Text>

						{this.state.vendorList != null ? (
							<View>
								{this.state.vendorList.map((item, key) => (
									<View style={styles.cardStyle}>
										<View style={{ flexDirection: 'row', backgroundColor: '#141F25', padding: 10 }}>
											<Icon name="hashtag" size={16} color="#ffffff" style={{}} />
											<Text style={{ color: '#ffffff', fontSize: 15, fontFamily: 'GoogleSans-Medium', paddingLeft: 5 }}>
												Offer Id :{' '}
											</Text>
											<Text style={{ color: '#ffffff', fontFamily: 'GoogleSans-Medium', fontSize: 15 }}>
												{item.pdiOfferUnqId}
											</Text>
										</View>

										<View style={{ padding: 10 }}>
											<View style={{ flexDirection: 'row', marginVertical: 5 }}>
												<Icon name="user" size={16} color="black" style={{}} />
												<Text
													style={{ color: '#000000', fontFamily: 'GoogleSans-Medium', fontSize: 15, paddingLeft: 5 }}
													selectable={true}
												>
													{item.vendorFirmName}
												</Text>
											</View>

											<View style={{ flexDirection: 'row', marginVertical: 5 }}>
												<Icon name="mobile" size={18} color="black" style={{}} />
												<Text style={{ color: '#000000', fontSize: 15, paddingLeft: 5 }} selectable={true}>
													{item.vendorContactPersonMobno}
												</Text>
											</View>

											<View style={{ flexDirection: 'row', marginVertical: 5 }}>
												<Icon name="institution" size={16} color="black" style={{}} />
												<Text style={{ color: '#000000', fontSize: 15, paddingLeft: 5, width: '90%' }}>
													{item.vendorWorksAddress}
												</Text>
											</View>
										</View>
										{item.inspectionCompleteState == 0 ? (
											<TouchableOpacity onPress={() => this.reDirectTo(item)} style={{ backgroundColor: '#ff7f00' }}>
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
													INITIATE
												</Text>
											</TouchableOpacity>
										) : null}

										{item.inspectionCompleteState == 1 ? (
											<TouchableOpacity onPress={() => this.navigateTo(item)} style={{ backgroundColor: '#ff7f00' }}>
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
													INPROCESS
												</Text>
											</TouchableOpacity>
										) : null}

										{item.inspectionCompleteState == 2 ? (
											<View style={{ backgroundColor: '#ff7f00' }}>
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
													COMPLETED
												</Text>
											</View>
										) : null}
									</View>
								))}
							</View>
						) : (
							<View style={{ justifyContent: 'center', height: 100, alignItems: 'center' }}>
								<Text style={{ fontFamily: 'GoogleSans-Medium', fontSize: 15 }}>No Inspection Found</Text>
							</View>
						)}

						<TouchableOpacity style={styles.button}>
							<Text onPress={() => this.props.navigation.goBack()} style={styles.buttonText}>
								BACK
							</Text>
						</TouchableOpacity>

						<Modal
							//animationType="slide"
							transparent={true}
							visible={this.state.detailsModalVisible}
							onRequestClose={() => {
								this.setState({ detailsModalVisible: false });
							}}
						>
							<TouchableOpacity
								onPress={() => this.setState({ detailsModalVisible: false, workAddress: '' })}
								style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#00000080' }}
							>
								<TouchableWithoutFeedback>
									<View style={{ width: 300, height: 200, backgroundColor: '#ffffff', padding: 10, borderRadius: 10 }}>
										<Text
											style={{ color: '#ff7f00', textAlign: 'center', fontSize: 20, fontFamily: 'GoogleSans-Medium' }}
										>
											Site Address
										</Text>
										<View style={{ marginTop: 50 }}>
											<Text style={{ color: 'black', fontSize: 15, textAlign: 'center' }}>
												{global.InspectionsPerformed.state.workAddress}
											</Text>
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
	cardStyle: {
		margin: 15,
		borderRadius: 5,
		elevation: 8,
		backgroundColor: '#ffffff'
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
	}
});
