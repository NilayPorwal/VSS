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
	ScrollView,
	FlatList,
	CheckBox,
	ToastAndroid
} from 'react-native';
import APIManager from '../Managers/APIManager';
import { Base64 } from 'js-base64';
import Loader from 'react-native-modal-loader';
import Icon from 'react-native-vector-icons/Feather';
var dateFormat = require('dateformat');
import DateTimePicker from 'react-native-modal-datetime-picker';
import { launchImageLibrary } from 'react-native-image-picker/src';

export default class OfferToBeSubmitted extends Component {
	constructor(props) {
		super(props);
		this.state = {
			woDetails: this.props.navigation.state.params.woDetails,
			offerDetails: [],
			ModalVisible: false,
			modalVisible1: false,
			itemDetails: {},
			packStartSrno: null,
			packEndSrno: null,
			withPackingList: false,
			isRefreshing: true,
			error: false,
			siteofferQty: null,
			deliverySchAiId: {},
			offerSupplyDat: {},
			blnsQty: null,
			remainingSchQty: null,
			type: this.props.navigation.state.params.type,
			isheadSchedule: null,
			image: [],
			imageData: [],
			packStartSrno: null,
			packEndSrno: null,
			disabled: false,
			isDatePickerVisible: false,
			Date: null,
			stageInspectionStatus: 'N'
		};
		global.OfferToBeSubmitted = this;
		// alert(JSON.stringify(this.props.navigation.state.params.woDetails))
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
		this.getofferDetails();
		// this.getWorkOrderDetails()
		BackHandler.addEventListener('hardwareBackPress', this.props.navigation.goBack);
	}

	componentWillMount() {
		this.remainingDetails();
	}

	getofferDetails() {
		const materialSubCatAiId =
			typeof this.state.woDetails.materialSubCatAiId != 'undefined'
				? this.state.woDetails.materialSubCatAiId
				: this.state.woDetails.materialSubcatAiId;
		APIManager.getofferDetails(
			this.state.woDetails.woAiId,
			this.state.woDetails.materialAiId,
			materialSubCatAiId,
			this.state.type,
			responseJson => {
				console.log('--Offer List--', JSON.stringify(responseJson.data));
				if (responseJson.status == 'SUCCESS') {
					this.setState({ offerDetails: responseJson.data, isRefreshing: false });
				} else {
					this.setState({ isRefreshing: false, error: true });
				}
			},
			error => {
				this.setState({ isRefreshing: false, error: true });
				console.log(JSON.stringify(error));
			}
		);
	}

	onSubmitOffer() {
		if (this.state.siteofferQty == null || this.state.siteofferQty == '') {
			Alert.alert('Wait', 'Site Offer Quantity required');
		} else if (
			this.state.isHeadSchedule == 'N' &&
			this.state.siteofferQty > this.state.remainingSchQty &&
			this.state.type == 'PDI'
		) {
			Alert.alert('Wait', 'Site Offer Quantity could not be more then Schedule Remaining Quantity');
		} else if (this.state.siteofferQty > this.state.blnsQty) {
			Alert.alert('Wait', 'Site Offer Quantity could not be more then Total Material Schedule Remaining Quantity');
		} else if (this.state.Date == null) {
			Alert.alert('Wait', 'Date of Readiness is required');
		} else {
			this.setState({ disabled: true, isRefreshing: true });
			const Details = {
				deliverySchAiId: this.state.deliverySchAiId,
				offerQty: this.state.siteofferQty,
				offerSupplyDat: this.state.offerSupplyDat,
				pdiOfferAiId: 0,
				packStartSrno: this.state.packStartSrno,
				packEndSrno: this.state.packEndSrno,
				dateOfReadiness: this.state.Date,
				withPackingList: 'Y'
			};
			console.log(JSON.stringify(Details));
			APIManager.onSubmitOffer(
				Details,
				this.state.type,
				responseJson => {
					console.log(JSON.stringify(responseJson));
					if (responseJson.status == 'SUCCESS') {
						if (this.state.stageInspectionStatus == 'Y') {
							return this.updateStageInspection(responseJson.data);
						}

						this.getofferDetails();
						this.remainingDetails();
						// this.props.navigation.navigate('HomeScreen')
						if (this.state.imageData.length == 0) {
							this.setState({
								disabled: false,
								isRefreshing: false,
								modalVisible1: false,
								siteofferQty: null,
								imageData: [],
								images: [],
								packStartSrno: null,
								packEndSrno: null
							});
						} else {
							this.uploadImages(responseJson.data);
						}
					} else {
						ToastAndroid.show('Please Try Again !', ToastAndroid.CENTER);
						this.setState({ isRefreshing: false, disabled: false });
					}
					//this.setState({offerDetails:responseJson.data})
				},
				error => {
					this.setState({ isRefreshing: false, error: true, disabled: false });
					console.log(JSON.stringify(error));
				}
			);
		}
	}

	updateStageInspection(pdiOfferAiId) {
		const Details = {
			pdiOfferAiId: pdiOfferAiId,
			deliverySchAiId: this.state.deliverySchAiId
		};
		console.log(JSON.stringify(Details));
		APIManager.updateStageInspection(
			Details,
			responseJson => {
				console.log(JSON.stringify(responseJson));
				if (responseJson.status == 'SUCCESS') {
					this.getofferDetails();
					this.remainingDetails();
					// this.props.navigation.navigate('HomeScreen')
					if (this.state.imageData.length == 0) {
						this.setState({
							disabled: false,
							isRefreshing: false,
							modalVisible1: false,
							siteofferQty: null,
							imageData: [],
							images: [],
							packStartSrno: null,
							packEndSrno: null
						});
					} else {
						this.uploadImages(pdiOfferAiId);
					}
				} else {
					ToastAndroid.show('Please Try Again !', ToastAndroid.CENTER);
					this.setState({ isRefreshing: false, disabled: false });
				}
				//this.setState({offerDetails:responseJson.data})
			},
			error => {
				this.setState({ isRefreshing: false, error: true, disabled: false });
				console.log(JSON.stringify(error));
			}
		);
	}

	uploadImages(pdiOfferAiId) {
		this.setState({ isRefreshing: true });
		const imageData = this.state.imageData;

		for (let i = 0; i < imageData.length; i++) {
			imageData[i].pdiOfferAiId = pdiOfferAiId;
		}
		//alert(JSON.stringify(Details))
		APIManager.uploadImages(
			imageData,
			responseJson => {
				console.log(JSON.stringify(responseJson));
				if (responseJson.status == 'SUCCESS') {
					// this.props.navigation.navigate('HomeScreen')
					this.setState({
						disabled: false,
						isRefreshing: false,
						modalVisible1: false,
						siteofferQty: null,
						imageData: [],
						images: [],
						packStartSrno: null,
						packEndSrno: null
					});
					ToastAndroid.show('Successfuly Updated !', ToastAndroid.CENTER);
				} else {
					ToastAndroid.show('Please Try Again !', ToastAndroid.CENTER);
					this.setState({ isRefreshing: false, disabled: false });
				}
				//this.setState({offerDetails:responseJson.data})
			},
			error => {
				this.setState({ isRefreshing: false, error: true, disabled: false });
				console.log(JSON.stringify(error));
			}
		);
	}

	remainingDetails() {
		this.setState({ isRefreshing: true });
		// const data = {
		// 	woAiId: this.state.woDetails.woAiId,
		// 	woMatMapAiId: this.state.woDetails.woMatMapAiId,
		// }
		//alert(JSON.stringify(data))
		const woMatMapAiId =
			typeof this.state.woDetails.woMatMapAiId != 'undefined'
				? this.state.woDetails.woMatMapAiId
				: this.state.woDetails.woMaMapAiId;

		let uri = 'v1/vendor/workorder/mat/remaining/qty';
		if (this.state.type != 'PDI') {
			uri = 'v1/vendor/workorder/mat/double/sch/remaining/qty';
		}

		APIManager.getRemainingDetails(
			this.state.woDetails.woAiId,
			woMatMapAiId,
			uri,
			responseJson => {
				console.log(JSON.stringify(responseJson));
				//alert(JSON.stringify(responseJson.data.balanceQty));
				this.setState({ blnsQty: responseJson.data.balanceQty });
			},
			error => {
				console.log(JSON.stringify(error));
				//Alert.alert("Failure !!", JSON.stringify(error))
				this.setState({ isRefreshing: false });
			}
		);
	}

	getRemainingScheduleQty(item, type) {
		//this.setState({ isRefreshing: true })
		this.setState({
			deliverySchAiId: item.delivery_sch_id,
			offerSupplyDat: item.delivery_sch_date,
			isHeadSchedule: item.isHeadSchedule,
			stageInspectionStatus: item.stageInspectionStatus
		});

		let flag = 'N';
		if (item.stageInspectionStatus == 'Y' && type == 0) {
			flag = 'SP';
		} else if (item.stageInspectionStatus == 'Y' && type == 1) {
			flag = 'SN';
		}

		APIManager.getRemainingScheduleQty(
			item.delivery_sch_id,
			flag,
			responseJson => {
				//console.log(JSON.stringify(responseJson));
				//alert(JSON.stringify(responseJson.data.balanceQty));
				this.setState({ remainingSchQty: responseJson.data.remaingQty, modalVisible1: true });
			},
			error => {
				console.log(JSON.stringify(error));
				Alert.alert('Failure !!', JSON.stringify(error));
				this.setState({ isRefreshing: false });
			}
		);
	}

	onOfferReq(item) {
		this.setState({ ModalVisible: true, itemDetails: item });
	}

	onSubmit(item) {
		// 	Alert.alert(
		// 	  'Please Confirm',
		// 	  'Do you want to Submit ?',
		// 	  [
		// 		{text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
		// 		{text: 'OK', onPress: () =>    this.onSubmitOffer(item)},
		// 	  ],
		// 	  { cancelable: true }
		//   )
		//     return true;
		this.setState({
			siteofferQty: item.delivery_sch_qty,
			deliverySchAiId: item.delivery_sch_id,
			offerSupplyDat: item.delivery_sch_date
		});
		this.setState({
			modalVisible1: true
		});
		//alert(JSON.stringify(item.delivery_sch_qty))
		//alert(JSON.stringify(this.state.offerSupplyDat))
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
					inspectionCnfrmAiId: 0,
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

	_handleDatePicked = date => {
		let now = date;
		let Date = dateFormat(now, 'dd-mm-yyyy');
		this.setState({ isDatePickerVisible: false, Date: Date });
	};

	render() {
		return (
			<ImageBackground source={require('../../Images/background.png')} style={{ width: '100%', height: '100%' }}>
				<ScrollView>
					<View style={styles.container}>
						<Loader loading={this.state.isRefreshing} color="#40a7ab" />

						<View style={{ width: '20%', flexDirection: 'row' }}>
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
									Offer To Be Submitted
								</Text>
							</View>
						</View>

						<View style={styles.detailsView}>
							<View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
								<View style={{ width: '50%' }}>
									<Text style={{ color: 'black', fontFamily: 'GoogleSans-Medium' }}>Tendor No.</Text>
									<Text style={{ color: 'black', flex: 1, flexWrap: 'wrap' }}>
										{this.state.woDetails.woTenderNumber}
									</Text>
								</View>

								<View style={{ width: '50%' }}>
									<Text style={{ color: 'black', fontFamily: 'GoogleSans-Medium', textAlign: 'right' }}>
										Work Order No.
									</Text>
									<Text style={{ color: 'black', textAlign: 'right', flex: 1, flexWrap: 'wrap' }}>
										{this.state.woDetails.woNumber}
									</Text>
								</View>
							</View>

							<View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 }}>
								<View style={{ width: '50%' }}>
									<Text style={{ color: 'black', fontFamily: 'GoogleSans-Medium' }}>Work Order Date</Text>
									<Text style={{ color: 'black', flex: 1, flexWrap: 'wrap' }}>{this.state.woDetails.woDate}</Text>
								</View>

								<View style={{ width: '50%' }}>
									<Text style={{ color: 'black', fontFamily: 'GoogleSans-Medium', textAlign: 'right' }}>
										Material Category
									</Text>
									<Text style={{ color: 'black', textAlign: 'right', flex: 1, flexWrap: 'wrap' }}>
										{this.state.woDetails.materialName}
									</Text>
								</View>
							</View>

							<View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 }}>
								<View style={{ width: '50%' }}>
									<Text style={{ color: 'black', fontFamily: 'GoogleSans-Medium' }}>Material Subcategory</Text>
									<Text style={{ color: 'black', flex: 1, flexWrap: 'wrap' }}>
										{this.state.woDetails.materialScName}
									</Text>
								</View>

								<View style={{ width: '50%' }}>
									<Text style={{ color: 'black', fontFamily: 'GoogleSans-Medium', textAlign: 'right' }}>
										Total Quantity
									</Text>
									<Text style={{ color: 'black', textAlign: 'right', flex: 1, flexWrap: 'wrap' }}>
										{this.state.woDetails.materialQty}
									</Text>
								</View>
							</View>
						</View>

						{this.state.offerDetails.length > 0 ? (
							<FlatList
								data={this.state.offerDetails}
								keyExtractor={item => item.index}
								renderItem={({ item, index }) => (
									<View
										style={[styles.cardStyle, { borderLeftColor: item.dispOfferOpt == 'Y' ? '#61B865' : '#E63E3A' }]}
									>
										<View style={{ flexDirection: 'row' }}>
											<View style={{ width: '50%' }}>
												<Text style={{ color: '#000000', fontFamily: 'GoogleSans-Medium', fontSize: 15 }}>
													Supply Schedule No.
												</Text>
												<Text style={{ color: '#000000', fontSize: 13 }}>{index + 1}</Text>
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
													Days From Work Order
												</Text>
												<Text style={{ color: '#000000', fontSize: 13, textAlign: 'right' }}>
													{item.delivery_sch_days}
												</Text>
											</View>
										</View>

										<View style={{ flexDirection: 'row', marginTop: 10 }}>
											<View style={{ width: '50%' }}>
												<Text style={{ color: '#000000', fontFamily: 'GoogleSans-Medium', fontSize: 15 }}>
													Expected Date of Supply
												</Text>
												<Text style={{ color: '#000000', fontSize: 13 }}>{item.delivery_sch_date}</Text>
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
													Expected Suply Quantity
												</Text>
												<Text style={{ color: '#000000', fontSize: 13, textAlign: 'right' }}>
													{item.delivery_sch_qty}
												</Text>
											</View>
										</View>

										{item.dispOfferOpt == 'Y' && item.diffStatus == 'N' ? (
											<View style={{ flexDirection: 'row', justifyContent: 'space-between', marginVertical: 10 }}>
												<View></View>
												{item.stageInspectionStatus == 'N' ? (
													<TouchableOpacity
														onPress={() => this.getRemainingScheduleQty(item, 0)}
														style={{ borderRadius: 5, backgroundColor: '#418bca' }}
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
															Offer Request
														</Text>
													</TouchableOpacity>
												) : (
													<View style={{ flexDirection: 'row' }}>
														<TouchableOpacity
															onPress={() => this.getRemainingScheduleQty(item, 0)}
															style={{ borderRadius: 5, backgroundColor: '#418bca' }}
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
																Offer Request
															</Text>
														</TouchableOpacity>
														<TouchableOpacity
															onPress={() => this.getRemainingScheduleQty(item, 1)}
															style={{ borderRadius: 5, backgroundColor: '#418bca', marginLeft: 10 }}
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
																Stage Inspection
															</Text>
														</TouchableOpacity>
													</View>
												)}
											</View>
										) : null}
									</View>
								)}
							/>
						) : (
							<View style={{ flex: 1, justifyContent: 'center' }}>
								<Text style={{ fontFamily: 'GoogleSans-Medium', fontSize: 15 }}>No Data Found</Text>
							</View>
						)}

						<Modal
							transparent={true}
							visible={this.state.modalVisible1}
							onRequestClose={() => {
								this.setState({ modalVisible1: false });
							}}
						>
							<View
								onPress={() => this.setState({ modalVisible1: false })}
								style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#00000080' }}
							>
								<View style={{ width: '80%', backgroundColor: '#ffffff', padding: 15, borderRadius: 10 }}>
									<Text
										style={{ textAlign: 'center', color: '#ff7f00', fontFamily: 'GoogleSans-Medium', fontSize: 18 }}
									>
										Please Update and Confirm
									</Text>

									<View style={{ marginTop: 15 }}>
										<View style={{}}>
											<Text style={{ color: '#000000', fontFamily: 'GoogleSans-Medium', fontSize: 15 }}>
												Site Offer Quantity :{' '}
											</Text>
										</View>

										<View style={{}}>
											<TextInput
												style={{ marginTop: 5, borderWidth: 1, borderColor: '#418bca', padding: 5 }}
												onChangeText={siteofferQty => this.setState({ siteofferQty })}
												value={this.state.siteofferQty}
												//underlineColorAndroid='#ff7f00'
												keyboardType="numeric"
											/>
											{this.state.type == 'PDI' && this.state.isHeadSchedule == 'N' ? (
												<Text style={{ color: '#000000' }}>
													Schedule Remaining Quantity: {this.state.remainingSchQty}
												</Text>
											) : null}
											<Text style={{ color: '#000000' }}>
												Total Material Schedule Remaining Quantity: {this.state.blnsQty}
											</Text>
										</View>
									</View>

									<View style={{ marginTop: 15 }}>
										<View style={{}}>
											<Text style={{ color: '#000000', fontFamily: 'GoogleSans-Medium', fontSize: 15 }}>
												Start Serial No :{' '}
											</Text>
										</View>
										<View style={{}}>
											<TextInput
												style={{ marginTop: 5, borderWidth: 1, borderColor: '#418bca', padding: 5 }}
												onChangeText={packStartSrno => this.setState({ packStartSrno })}
												value={this.state.packStartSrno}
												underlineColorAndroid="transparent"
											/>
										</View>
									</View>

									<View style={{ marginTop: 15 }}>
										<View style={{}}>
											<Text style={{ color: '#000000', fontFamily: 'GoogleSans-Medium', fontSize: 15 }}>
												End Serial No :{' '}
											</Text>
										</View>
										<View style={{}}>
											<TextInput
												style={{ marginTop: 5, borderWidth: 1, borderColor: '#418bca', padding: 5 }}
												onChangeText={packEndSrno => this.setState({ packEndSrno })}
												value={this.state.packEndSrno}
												underlineColorAndroid="transparent"
											/>
										</View>
									</View>

									<View style={{ flexDirection: 'row', marginTop: 15, justifyContent: 'space-between' }}>
										<Text style={{ color: '#000000', fontFamily: 'GoogleSans-Medium', fontSize: 15 }}>
											Readiness Date :{' '}
										</Text>
										<TouchableOpacity
											onPress={() => {
												this.setState({ isDatePickerVisible: true });
											}}
											style={{ flexDirection: 'row', borderWidth: 1, borderColor: '#418bca', padding: 5 }}
										>
											<Icon name="calendar" size={20} color="black" />
											{this.state.Date == null ? (
												<Text style={{ color: '#d3d3d3', paddingLeft: 5 }}>DD-MM-YYYY</Text>
											) : (
												<Text style={{ color: '#000000', paddingLeft: 5 }}>{this.state.Date}</Text>
											)}
										</TouchableOpacity>
									</View>
									<DateTimePicker
										minimumDate={new Date()}
										isVisible={this.state.isDatePickerVisible}
										onConfirm={this._handleDatePicked.bind(this)}
										onCancel={() => {
											this.setState({ isDatePickerVisible: false });
										}}
										mode="date"
									/>

									<View
										style={{
											borderWidth: 0,
											borderRadius: 5,
											marginVertical: 10,
											padding: 10,
											backgroundColor: '#FEC1A5'
										}}
									>
										<View style={{ alignItems: 'center' }}>
											<Text
												style={{
													fontSize: 15,
													fontFamily: 'GoogleSans-Medium',
													paddingTop: 10,
													color: 'black',
													textAlign: 'center'
												}}
											>
												Click to Upload Packing List
											</Text>
											<TouchableOpacity
												onPress={() => this.onCamera()}
												style={{ padding: 10, borderRadius: 5, backgroundColor: 'brown', marginVertical: 10 }}
											>
												<Icon name="camera" size={25} color="white" />
											</TouchableOpacity>
										</View>

										<View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
											{this.state.image.map(item => (
												<Icon name="file-text" size={30} color="#141F25" />
											))}
										</View>
									</View>

									<View style={{ flexDirection: 'row', justifyContent: 'space-between', marginVertical: 20 }}>
										<TouchableOpacity
											disabled={this.state.disabled}
											onPress={() => this.onSubmitOffer()}
											style={{ borderRadius: 5, backgroundColor: '#3CB043', width: 100, alignItems: 'center' }}
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
											onPress={() => this.setState({ modalVisible1: false, remainingSchQty: null })}
											style={{ borderRadius: 5, backgroundColor: 'red', width: 100, alignItems: 'center' }}
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

									<TouchableOpacity
										onPress={() => this.setState({ modalVisible1: false })}
										style={{ position: 'absolute', top: 0, right: 5 }}
									>
										<Icon name="x" size={25} color="black" />
									</TouchableOpacity>
								</View>
							</View>
						</Modal>

						<Modal
							//animationType="slide"
							transparent={true}
							visible={this.state.ModalVisible}
							onRequestClose={() => {
								this.setState({ ModalVisible: false });
							}}
						>
							<View
								onPress={() => this.setState({ ModalVisible: false })}
								style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#00000080' }}
							>
								<View style={{ width: 300, backgroundColor: '#ffffff', padding: 10, borderRadius: 10 }}>
									<Text
										style={{ fontSize: 18, fontFamily: 'GoogleSans-Medium', textAlign: 'center', color: '#ff7f00' }}
									>
										Offer Request
									</Text>
									<TouchableOpacity
										onPress={() => {
											this.setState({ withPackingList: !this.state.withPackingList });
										}}
										style={{ flexDirection: 'row', marginTop: 15 }}
									>
										<CheckBox
											value={this.state.withPackingList}
											onValueChange={() => this.setState({ withPackingList: !this.state.withPackingList })}
										/>
										<Text style={{ marginTop: 5, color: '#000000' }}>With Packing</Text>
									</TouchableOpacity>

									{this.state.withPackingList == true ? (
										<View>
											<View style={{ flexDirection: 'row', marginTop: 20 }}>
												<Text
													style={{
														color: 'black',
														textAlign: 'center',
														width: '40%',
														fontFamily: 'GoogleSans-Medium',
														paddingTop: 10
													}}
												>
													Start Serial No. :
												</Text>

												<TextInput
													style={{ width: '60%' }}
													onChangeText={packStartSrno => this.setState({ packStartSrno })}
													value={this.state.packStartSrno}
													underlineColorAndroid="#ff7f00"
												/>
											</View>

											<View style={{ flexDirection: 'row', marginTop: 20 }}>
												<Text
													style={{
														color: 'black',
														textAlign: 'center',
														width: '40%',
														fontFamily: 'GoogleSans-Medium',
														paddingTop: 10
													}}
												>
													End Serial No. :
												</Text>

												<TextInput
													style={{ width: '60%' }}
													onChangeText={packEndSrno => this.setState({ packEndSrno })}
													value={this.state.packEndSrno}
													underlineColorAndroid="#ff7f00"
												/>
											</View>
										</View>
									) : null}

									<TouchableOpacity
										onPress={() => this.onSubmitOffer()}
										style={{ borderRadius: 5, backgroundColor: '#418bca', marginTop: 15 }}
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
											Submit
										</Text>
									</TouchableOpacity>

									<TouchableOpacity
										onPress={() => this.setState({ ModalVisible: false })}
										style={{ position: 'absolute', top: 0, right: 5 }}
									>
										<Icon name="x" size={22} color="black" />
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
	cardStyle: {
		margin: 15,
		borderRadius: 5,
		elevation: 8,
		backgroundColor: '#ffffff',
		padding: 15,
		borderLeftWidth: 5
	}
});
