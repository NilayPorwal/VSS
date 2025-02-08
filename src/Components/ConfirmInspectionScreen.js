import React, { Component } from 'react';
import {
	Platform,
	StyleSheet,
	Text,
	View,
	TextInput,
	Image,
	TouchableOpacity,
	Alert,
	BackHandler,
	Modal,
	TouchableWithoutFeedback,
	ImageBackground,
	ActionSheetIOS,
	ActivityIndicator,
	ScrollView,
	FlatList,
	Picker,
	KeyboardAvoidingView,
	ToastAndroid
} from 'react-native';
import APIManager from './Managers/APIManager';
import { Base64 } from 'js-base64';
import Loader from 'react-native-modal-loader';
import DateTimePicker from 'react-native-modal-datetime-picker';
import Icon from 'react-native-vector-icons/FontAwesome';
var dateFormat = require('dateformat');

global.ConfirmInspectionScreen;
export default class ConfirmInspectionScreen extends Component {
	constructor(props) {
		super(props);
		this.state = {
			vendorInfo: this.props.navigation.state.params.vendorInfo,
			isDatePickerVisible: false,
			isTimePickerVisible: false,
			location: null,
			Date: null,
			Time: null,
			travelMode: '---Select Mode of Travel---',
			mode: 0,
			vndId: '',
			isRefreshing: false
		};
		global.ConfirmInspectionScreen = this;
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
		BackHandler.addEventListener('hardwareBackPress', this.props.navigation.goBack);
	}

	_handleDatePicked = date => {
		let now = date;
		let Date = dateFormat(now, 'dd-mm-yyyy');
		this.setState({ isDatePickerVisible: false, Date: Date });
	};

	_handleTimePicked = time => {
		let now = time;
		let Time = dateFormat(now, 'h:MM TT');

		this.setState({ isTimePickerVisible: false, Time: Time });
	};

	onSubmit() {
		if (this.state.Date == null || this.state.Time == null || this.state.mode === 0 || this.state.location == null) {
			alert('Kindly Fill All the Details');
		} else {
			this.setState({ isRefreshing: true });
			const Details = {
				nominationAiId: this.state.vendorInfo.nominationAiId,
				pdiOfferAiId: this.state.vendorInfo.pdiOfferAiId,
				inspectionDate: this.state.Date,
				arrivalTime: this.state.Time,
				pickUpLocation: this.state.location,
				travelMode: this.state.travelMode
			};
			//  alert( JSON.stringify(Details) )
			APIManager.onConfirmInsp(
				Details,
				this.props.navigation.state.params.from,
				responseJson => {
					this.setState({ isRefreshing: false });
					if (responseJson.status == 'SUCCESS') {
						Alert.alert('Successfuly Update', responseJson.message);
						this.props.navigation.state.params.onGoBack();
						this.props.navigation.goBack();
						return true;
					} else {
						//ToastAndroid.show('Please Try Again !', ToastAndroid.CENTER);
						Alert.alert('Failed', responseJson.message);
					}
					//this.setState({offerDetails:responseJson.data})
				},
				err => {
					this.setState({ isRefreshing: false });
					Alert.alert('Failed to Update', err.message);
				}
			);
		}
	}

	onSelectTravelMode(itemValue) {
		if (itemValue == 5) {
			this.setState({ travelMode: 'Other', mode: itemValue });
		} else if (itemValue == 4) {
			this.setState({ travelMode: 'Flight', mode: itemValue });
		} else if (itemValue == 3) {
			this.setState({ travelMode: 'Train', mode: itemValue });
		} else if (itemValue == 2) {
			this.setState({ travelMode: 'Bus', mode: itemValue });
		} else if (itemValue == 1) {
			this.setState({ travelMode: 'Car', mode: itemValue });
		} else {
			this.setState({ travelMode: '---Select Mode of Travel---', mode: itemValue });
		}
	}

	render() {
		return (
			<ImageBackground source={require('../Images/background.png')} style={{ width: '100%', height: '100%' }}>
				<ScrollView>
					<KeyboardAvoidingView style={styles.container} behavior="padding" enabled>
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
									Confirmation of Inspection
								</Text>
							</View>
						</View>

						<View style={styles.detailsView}>
							<View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
								<View style={{ width: '50%' }}>
									<Text style={{ color: 'black', fontFamily: 'GoogleSans-Medium' }}>Work Order No.</Text>
									<Text style={{ color: 'black', flex: 1, flexWrap: 'wrap' }}>{this.state.vendorInfo.woNumber}</Text>
								</View>

								<View style={{ width: '50%' }}>
									<Text style={{ color: 'black', fontFamily: 'GoogleSans-Medium', textAlign: 'right' }}>
										Work Order Id
									</Text>
									<Text style={{ color: 'black', textAlign: 'right', flex: 1, flexWrap: 'wrap' }}>
										{this.state.vendorInfo.woCustomUnqId}
									</Text>
								</View>
							</View>

							<View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 15 }}>
								<View style={{ width: '50%' }}>
									<Text style={{ color: 'black', fontFamily: 'GoogleSans-Medium' }}>Work Address </Text>
									<Text style={{ color: 'black', flex: 1, flexWrap: 'wrap' }}>
										{this.state.vendorInfo.vendorWorksAddress}
									</Text>
								</View>

								<View style={{ width: '50%' }}>
									<Text style={{ color: 'black', fontFamily: 'GoogleSans-Medium', textAlign: 'right' }}>
										Work Order Date
									</Text>
									<Text style={{ color: 'black', textAlign: 'right', flex: 1, flexWrap: 'wrap' }}>
										{this.state.vendorInfo.woDate}
									</Text>
								</View>
							</View>

							<View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 15 }}>
								<View style={{ width: '50%' }}>
									<Text style={{ color: 'black', fontFamily: 'GoogleSans-Medium' }}>Offer Id </Text>
									<Text style={{ color: 'black', flex: 1, flexWrap: 'wrap' }}>
										{this.state.vendorInfo.pdiOfferUnqId}
									</Text>
								</View>

								<View style={{ width: '50%' }}>
									<Text style={{ color: 'black', fontFamily: 'GoogleSans-Medium', textAlign: 'right' }}>
										Material Category
									</Text>
									<Text style={{ color: 'black', textAlign: 'right', flex: 1, flexWrap: 'wrap' }}>
										{this.state.vendorInfo.materialName}
									</Text>
								</View>
							</View>

							<View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 15 }}>
								<View style={{ width: '50%' }}>
									<Text style={{ color: 'black', fontFamily: 'GoogleSans-Medium' }}>Material SubCategory</Text>
									<Text style={{ color: 'black', flex: 1, flexWrap: 'wrap' }}>
										{this.state.vendorInfo.materialScName}
									</Text>
								</View>

								<View style={{ width: '50%' }}>
									<Text style={{ color: 'black', fontFamily: 'GoogleSans-Medium', textAlign: 'right' }}>
										Total Quantity
									</Text>
									<Text style={{ color: 'black', textAlign: 'right', flex: 1, flexWrap: 'wrap' }}>
										{this.state.vendorInfo.materialQty}
									</Text>
								</View>
							</View>

							<View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 15 }}>
								<View style={{ width: '50%' }}>
									<Text style={{ color: 'black', fontFamily: 'GoogleSans-Medium' }}>Schedule Quantity</Text>
									<Text style={{ color: 'black', flex: 1, flexWrap: 'wrap' }}>{this.state.vendorInfo.dispatchQty}</Text>
								</View>

								<View style={{ width: '50%' }}></View>
							</View>
						</View>

						<View
							style={{ marginHorizontal: 10, borderRadius: 5, elevation: 8, backgroundColor: '#ffffff', padding: 15 }}
						>
							<View style={{ flexDirection: 'row' }}>
								<View style={{ width: '65%' }}>
									<Text style={{ color: '#418bca', fontFamily: 'GoogleSans-Medium' }}>Proposed Date of Inspection</Text>
								</View>

								<View style={{ width: '35%' }}>
									<TouchableOpacity
										onPress={() => {
											this.setState({ isDatePickerVisible: true });
										}}
										style={{ flexDirection: 'row' }}
									>
										<Icon name="calendar" size={20} color="black" />
										<Text style={{ color: '#000000', paddingLeft: 5 }}>{this.state.Date}</Text>
									</TouchableOpacity>
									<DateTimePicker
										minimumDate={new Date()}
										isVisible={this.state.isDatePickerVisible}
										onConfirm={this._handleDatePicked.bind(this)}
										onCancel={() => {
											this.setState({ isDatePickerVisible: false });
										}}
										mode="date"
									/>
								</View>
							</View>

							<View style={{ flexDirection: 'row', marginTop: 10 }}>
								<View style={{ width: '65%' }}>
									<Text style={{ color: '#418bca', fontFamily: 'GoogleSans-Medium' }}>Time of Arival</Text>
								</View>

								<View style={{ width: '35%' }}>
									<TouchableOpacity
										onPress={() => {
											this.setState({ isTimePickerVisible: true });
										}}
										style={{ flexDirection: 'row' }}
									>
										<Icon name="clock-o" size={20} color="black" />
										<Text style={{ color: '#000000', paddingLeft: 5 }}>{this.state.Time}</Text>
									</TouchableOpacity>
									<DateTimePicker
										isVisible={this.state.isTimePickerVisible}
										onConfirm={this._handleTimePicked.bind(this)}
										onCancel={() => {
											this.setState({ isTimePickerVisible: false });
										}}
										mode="time"
										datePickerModeAndroid="spinner"
										is24Hour={false}
									/>
								</View>
							</View>

							<View style={{ marginTop: 10, borderWidth: 1, borderColor: '#418bca' }}>
								<TextInput
									style={{ width: '100%', padding: 10 }}
									onChangeText={location => this.setState({ location })}
									value={this.state.location}
									placeholder="Pick Up Location"
									underlineColorAndroid="transparent"
									selectTextOnFocus={true}
								/>
							</View>

							{Platform.OS === 'ios' ? (
								<TouchableOpacity
									style={{ height: 40, padding: 10, borderWidth: 1, borderColor: '#418bca', marginTop: 10 }}
									onPress={() => {
										ActionSheetIOS.showActionSheetWithOptions(
											{
												options: ['---Select Mode of Travel---', 'Car', 'Bus', 'Train', 'Flight', 'other']
											},
											buttonIndex => {
												if (buttonIndex === 0) {
													this.onSelectTravelMode(0);
												} else if (buttonIndex === 1) {
													this.onSelectTravelMode(1);
												} else if (buttonIndex === 2) {
													this.onSelectTravelMode(2);
												} else if (buttonIndex === 3) {
													this.onSelectTravelMode(3);
												} else if (buttonIndex === 4) {
													this.onSelectTravelMode(4);
												} else if (buttonIndex === 5) {
													this.onSelectTravelMode(5);
												}
											}
										);
									}}
								>
									<Text>{this.state.travelMode}</Text>
								</TouchableOpacity>
							) : (
								<View style={{ borderWidth: 1, borderColor: '#418bca', marginTop: 10 }}>
									<Picker
										selectedValue={this.state.mode}
										style={{ height: 40, width: '100%' }}
										mode="dropdown"
										onValueChange={(itemValue, itemIndex) => this.onSelectTravelMode(itemValue)}
									>
										<Picker.Item label="---Select Mode of Travel---" value={0} />
										<Picker.Item label="Car" value={1} />
										<Picker.Item label="Bus" value={2} />
										<Picker.Item label="Train" value={3} />
										<Picker.Item label="Flight" value={4} />
										<Picker.Item label="Other" value={5} />
									</Picker>
								</View>
							)}

							{this.state.mode == 5 ? (
								<View style={{ marginTop: 10, borderWidth: 1, borderColor: '#418bca' }}>
									<TextInput
										style={{ width: '100%', padding: 10 }}
										onChangeText={travelMode => this.setState({ travelMode })}
										value={this.state.travelMode == 'Other' ? null : this.state.travelMode}
										placeholder="Please specify mode of Travel"
										underlineColorAndroid="transparent"
										selectTextOnFocus={true}
									/>
								</View>
							) : null}

							<View style={{ marginVertical: 10 }}>
								<TouchableOpacity
									onPress={() => this.onSubmit()}
									style={{ borderRadius: 5, backgroundColor: '#418bca' }}
								>
									<Text
										style={{
											fontSize: 15,
											color: '#ffffff',
											fontFamily: 'GoogleSans-Medium',
											paddingVertical: 15,
											textAlign: 'center',
											elevation: 5
										}}
									>
										SUBMIT
									</Text>
								</TouchableOpacity>
							</View>
						</View>
					</KeyboardAvoidingView>
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
		margin: 10,
		padding: 15,
		backgroundColor: '#FEC1A5',
		elevation: 8,
		borderColor: 'transparent'
	}
});
