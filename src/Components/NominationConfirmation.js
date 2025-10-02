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
	TextInput,
	ImageBackground,
	ActivityIndicator,
	ScrollView,
	FlatList,
	CheckBox
} from 'react-native';
import APIManager from './Managers/APIManager';
import { Base64 } from 'js-base64';
import Loader from 'react-native-modal-loader';
import Icon from 'react-native-vector-icons/FontAwesome';
import { getData } from '../helper';
import { Alert } from 'react-native';

global.NominationConfirmation;
export default class NominationConfirmation extends Component {
	constructor(props) {
		super(props);
		this.state = {
			vendorInfo: [],
			nomList: [],
			woDetails: [],
			inspId: '',
			isRefreshing: true,
			error: false,
			check: 0,
			reason: '',
			modalVisible: false,
			selectedData: '',
			isForwarding: false
		};
		global.NominationConfirmation = this;
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
		this.getInspId();

		BackHandler.addEventListener('hardwareBackPress', this.props.navigation.goBack);
	}

	async getInspId() {
		await getData('InspId').then(value =>
			this.setState({ inspId: value }, () => {
				this.getNominationInfo();
				this.getNominationInfoComp();
			})
		);
	}

	getNominationInfo() {
		this.setState({ isRefreshing: true });
		APIManager.getNominationInfo(
			this.state.inspId,
			1,
			this.props.navigation.state.params.from,
			responseJson => {
				//alert(JSON.stringify(responseJson));
				if (responseJson.status == 'SUCCESS') {
					this.setState({ vendorInfo: responseJson.data, isRefreshing: false });
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

	getNominationInfoComp() {
		APIManager.getNominationInfo(
			this.state.inspId,
			2,
			this.props.navigation.state.params.from,
			responseJson => {
				//alert(JSON.stringify(responseJson));
				if (responseJson.status == 'SUCCESS') {
					this.setState({ nomList: responseJson.data, isRefreshing: false });
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

	redirectTo(item) {
		this.setState({ modalVisible: false });
		this.props.navigation.push('ConfirmInspectionScreen', {
			vendorInfo: item,
			onGoBack: () => {
				this.getInspId();
			}
		});
	}

	onForward(item) {
		this.setState({ isForwarding: true });
		APIManager.forwardNomination(
			item?.nominationAiId,
			item?.pdiOfferAiId,
			item?.inspectorAiId,
			this.state.reason,
			this.props.navigation.state.params.from,
			responseJson => {
				console.log(responseJson);
				this.setState({ isForwarding: false });
				if (responseJson.status == 'SUCCESS') {
					this.setState({ modalVisible: false, vendorInfo: [], reason: '', selectedData: '', check: 0 });

					Alert.alert(
						'Success',
						responseJson?.message || '',
						[{ text: 'OK', onPress: () => this.getNominationInfo() }],
						{
							cancelable: false
						}
					);
				} else {
					Alert.alert('Error', 'Something Went Wrong');
				}
			},
			error => {
				this.setState({ isForwarding: true });
				console.log(JSON.stringify(error));
			}
		);
	}

	render() {
		return (
			<ImageBackground source={require('../Images/background.png')} style={{ width: '100%', height: '100%' }}>
				<Loader loading={this.state.isRefreshing} color="#40a7ab" />

				<View style={{ flexDirection: 'row' }}>
					<TouchableOpacity onPress={() => this.props.navigation.goBack()}>
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
							Nomination Confirmation to Vendor
						</Text>
					</View>
				</View>

				<ScrollView>
					<View style={styles.container}>
						<Loader loading={this.state.isRefreshing} color="#40a7ab" />

						{this.state.vendorInfo.length > 0 && (
							<FlatList
								data={this.state.vendorInfo}
								keyExtractor={item => item.index}
								renderItem={({ item, index }) => (
									<View style={[styles.cardStyle, { borderLeftColor: '#61B865' }]}>
										<View style={{ flexDirection: 'row' }}>
											<View style={{ width: '50%' }}>
												<Text style={{ color: '#000000', fontFamily: 'GoogleSans-Medium', fontSize: 15 }}>
													Vendor Name
												</Text>
												<Text style={{ color: '#000000', fontSize: 13 }}>{item.vendorFirmName}</Text>
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
													Work Order Address
												</Text>
												<Text style={{ color: '#000000', fontSize: 13, textAlign: 'right' }}>
													{item.vendorWorksAddress}
												</Text>
											</View>
										</View>

										<View style={{ flexDirection: 'row', marginTop: 10 }}>
											<View style={{ width: '50%' }}>
												<Text style={{ color: '#000000', fontFamily: 'GoogleSans-Medium', fontSize: 15 }}>
													Tender No.
												</Text>
												<Text style={{ color: '#000000', fontSize: 13 }}>{item.tenderNumber}</Text>
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
													Work Order No.
												</Text>
												<Text style={{ color: '#000000', fontSize: 13, textAlign: 'right' }}>{item.woNumber}</Text>
											</View>
										</View>

										<View style={{ flexDirection: 'row', marginTop: 10 }}>
											<View style={{ width: '50%' }}>
												<Text style={{ color: '#000000', fontFamily: 'GoogleSans-Medium', fontSize: 15 }}>
													Work Order Id
												</Text>
												<Text style={{ color: '#000000', fontSize: 13 }}>{item.woCustomUnqId}</Text>
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
													Work Order Date
												</Text>
												<Text style={{ color: '#000000', fontSize: 13, textAlign: 'right' }}>{item.woDate}</Text>
											</View>
										</View>

										<View style={{ flexDirection: 'row', marginTop: 15 }}>
											<View style={{ width: '50%' }}>
												<Text style={{ color: '#000000', fontFamily: 'GoogleSans-Medium', fontSize: 15 }}>
													Offer Id
												</Text>
												<Text style={{ color: '#000000', fontSize: 13 }}>{item.pdiOfferUnqId}</Text>
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
													Second Inspector
												</Text>
												<Text style={{ color: '#000000', fontSize: 13, textAlign: 'right' }}>
													{item.secondInspectorName}
												</Text>
											</View>
										</View>

										<View style={{ flexDirection: 'row', marginTop: 15 }}>
											<View style={{ width: '50%' }}>
												<Text style={{ color: '#000000', fontFamily: 'GoogleSans-Medium', fontSize: 15 }}>
													Vendor Mobile No.
												</Text>
												<Text style={{ color: '#000000', fontSize: 13 }}>{item.vendorContactPersonMobno}</Text>
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
													Date of Readiness
												</Text>
												<Text style={{ color: '#000000', fontSize: 13, textAlign: 'right' }}>
													{item.dateOfReadiness}
												</Text>
											</View>
										</View>

										<View style={{ flexDirection: 'row', marginTop: 15 }}>
											<View style={{ width: '50%' }}></View>

											<View style={{ width: '50%' }}>
												<TouchableOpacity
													onPress={() => {
														if (this.props.navigation.state.params.from == 'setw') {
															this.redirectTo(item);
														} else {
															this.setState({ selectedData: item, modalVisible: true });
														}
													}}
													style={{ borderRadius: 5, backgroundColor: '#418bca' }}
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
														Intimate Vendor
													</Text>
												</TouchableOpacity>
											</View>
										</View>
									</View>
								)}
							/>
						)}
						{this.state.vendorInfo.length == 0 && this.state.nomList.length == 0 && !this.state.isRefreshing && (
							<View style={{ marginTop: '30%' }}>
								<Text style={{ fontFamily: 'GoogleSans-Medium', fontSize: 15 }}>No Data Found</Text>
							</View>
						)}

						{this.state.nomList.length > 0 ? (
							<FlatList
								data={this.state.nomList}
								keyExtractor={item => item.index}
								renderItem={({ item, index }) => (
									<View style={[styles.cardStyle, { borderLeftColor: '#E63E3A' }]}>
										<View style={{ flexDirection: 'row' }}>
											<View style={{ width: '50%' }}>
												<Text style={{ color: '#000000', fontFamily: 'GoogleSans-Medium', fontSize: 15 }}>
													Vendor Name
												</Text>
												<Text style={{ color: '#000000', fontSize: 13 }}>{item.vendorFirmName}</Text>
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
													Work Order Address
												</Text>
												<Text style={{ color: '#000000', fontSize: 13, textAlign: 'right' }}>
													{item.vendorWorksAddress}
												</Text>
											</View>
										</View>

										<View style={{ flexDirection: 'row', marginTop: 10 }}>
											<View style={{ width: '50%' }}>
												<Text style={{ color: '#000000', fontFamily: 'GoogleSans-Medium', fontSize: 15 }}>
													Tender No.
												</Text>
												<Text style={{ color: '#000000', fontSize: 13 }}>{item.tenderNumber}</Text>
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
													Work Order No.
												</Text>
												<Text style={{ color: '#000000', fontSize: 13, textAlign: 'right' }}>{item.woNumber}</Text>
											</View>
										</View>

										<View style={{ flexDirection: 'row', marginTop: 10 }}>
											<View style={{ width: '50%' }}>
												<Text style={{ color: '#000000', fontFamily: 'GoogleSans-Medium', fontSize: 15 }}>
													Work Order Id
												</Text>
												<Text style={{ color: '#000000', fontSize: 13 }}>{item.woCustomUnqId}</Text>
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
													Work Order Date
												</Text>
												<Text style={{ color: '#000000', fontSize: 13, textAlign: 'right' }}>{item.woDate}</Text>
											</View>
										</View>

										<View style={{ flexDirection: 'row', marginTop: 15 }}>
											<View style={{ width: '50%' }}>
												<Text style={{ color: '#000000', fontFamily: 'GoogleSans-Medium', fontSize: 15 }}>
													Offer Id
												</Text>
												<Text style={{ color: '#000000', fontSize: 13 }}>{item.pdiOfferUnqId}</Text>
											</View>
										</View>
									</View>
								)}
							/>
						) : null}
					</View>

					<Modal
						//animationType="slide"
						transparent={true}
						visible={this.state.modalVisible}
						onRequestClose={() => {
							this.setState({ modalVisible: false });
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
								<View style={{ marginTop: 5, width: '100%' }}>
									<Text style={styles.text}>Please confirm your intent in this nomination.</Text>

									<View style={{ flexDirection: 'row', marginTop: 10 }}>
										<View style={{ flexDirection: 'row' }}>
											<CheckBox
												value={this.state.check == 0 ? true : false}
												onValueChange={() => this.setState({ check: 0 })}
											/>
											<Text style={{ paddingTop: 5 }}>Yes</Text>
										</View>
										<View style={{ flexDirection: 'row', marginLeft: 20 }}>
											<CheckBox
												value={this.state.check == 1 ? true : false}
												onValueChange={() => this.setState({ check: 1 })}
											/>
											<Text style={{ paddingTop: 5 }}>No</Text>
										</View>
									</View>

									{this.state.check == 1 ? (
										<>
											<Text style={{ ...styles.text, marginTop: 10 }}>Reason : </Text>
											<TextInput
												style={{
													marginTop: 5,
													borderWidth: 1,
													paddingVertical: 5,
													height: 80
												}}
												onChangeText={text => this.setState({ reason: text })}
												value={this.state.reason}
												multiline={true}
												textAlignVertical="top"
												placeholder="Type Here"
											/>
											{this.state.isForwarding == true ? (
												<ActivityIndicator size="small" color="#000000" style={{ marginTop: 10 }} />
											) : (
												<TouchableOpacity
													onPress={() => this.onForward(this.state.selectedData)}
													style={styles.otpButton}
												>
													<Text style={{ fontSize: 15, color: '#ffffff', paddingVertical: 12, textAlign: 'center' }}>
														Forward
													</Text>
												</TouchableOpacity>
											)}
										</>
									) : (
										<TouchableOpacity onPress={() => this.redirectTo(this.state.selectedData)} style={styles.otpButton}>
											<Text style={{ fontSize: 15, color: '#ffffff', paddingVertical: 10, textAlign: 'center' }}>
												Proceed
											</Text>
										</TouchableOpacity>
									)}
								</View>

								<TouchableOpacity
									onPress={() => this.setState({ modalVisible: false })}
									style={{ position: 'absolute', top: 0, right: 5 }}
								>
									<Icon name="remove" size={20} color="black" />
								</TouchableOpacity>
							</View>
						</View>
					</Modal>
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
	},
	otpButton: {
		borderRadius: 5,
		backgroundColor: '#ff7f00',
		marginTop: 15
	},
	text: {
		color: 'black',
		fontSize: 15,
		fontFamily: 'GoogleSans-Medium'
	}
});
