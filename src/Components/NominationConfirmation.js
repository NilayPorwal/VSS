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
	ScrollView,
	FlatList
} from 'react-native';
import APIManager from './Managers/APIManager';
import { Base64 } from 'js-base64';
import Loader from 'react-native-modal-loader';
import Icon from 'react-native-vector-icons/FontAwesome';

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
			error: false
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
		await AsyncStorage.getItem('InspId').then(value =>
			this.setState({ inspId: value }, () => {
				this.getNominationInfo();
				this.getNominationInfoComp();
			})
		);
	}

	getNominationInfo() {
		APIManager.getNominationInfo(
			this.state.inspId,
			1,
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
		this.props.navigation.push('ConfirmInspectionScreen', {
			vendorInfo: item,
			onGoBack: () => {
				this.getInspId();
			}
		});
	}

	render() {
		return (
			<ImageBackground source={require('../Images/background.png')} style={{ width: '100%', height: '100%' }}>
				<Loader loading={this.state.isRefreshing} color="#40a7ab" />
				<View style={{ flexDirection: 'row' }}>
					<TouchableOpacity onPress={() => this.props.navigation.goBack()}>
						<Icon name="chevron-left" size={20} color="#000000" style={{ margin: 15 }} />
					</TouchableOpacity>
					<Text
						style={{ fontSize: 15, fontFamily: 'GoogleSans-Medium', color: 'black', paddingTop: 15, paddingLeft: 10 }}
					>
						Nomination Confirmation to Vendor
					</Text>
				</View>

				<ScrollView>
					<View style={styles.container}>
						<Loader loading={this.state.isRefreshing} color="#40a7ab" />

						{this.state.vendorInfo.length > 0 ? (
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
														this.redirectTo(item);
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
						) : (
							<View style={{ justifyContent: 'center', height: 100 }}>
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
