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
import APIManager from '../Managers/APIManager';
import { Base64 } from 'js-base64';
import Loader from 'react-native-modal-loader';
import Icon from 'react-native-vector-icons/Feather';

global.RequestSiteOffer;
export default class RequestSiteOffer extends Component {
	constructor(props) {
		super(props);
		this.state = {
			vendorInfo: {},
			woDetails: [],
			vndId: '',
			isRefreshing: true,
			error: false
		};
		global.RequestSiteOffer = this;
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
		// APIManager.getCredentials();
		this.getVendorId();

		BackHandler.addEventListener('hardwareBackPress', this.props.navigation.goBack);
	}

	async getVendorId() {
		await AsyncStorage.getItem('InspId').then(value =>
			this.setState({ vndId: value }, () => {
				this.getOfferDetails();
			})
		);
	}

	getOfferDetails() {
		APIManager.getOfferDetails(
			this.state.vndId,
			responseJson => {
				alert(JSON.stringify(responseJson));
				if (responseJson.status == 'SUCCESS') {
					this.setState({ woDetails: responseJson.data, isRefreshing: false });
				}
			},
			error => {
				this.setState({ isRefreshing: false });
				console.log(JSON.stringify(error));
			},
			error => {
				this.setState({ isRefreshing: false, error: true });
				console.log(JSON.stringify(error));
			}
		);
	}

	redirectTo(item) {
		this.props.navigation.navigate('GenerateSiteOffer', {
			woDetails: item
		});
	}

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
									List of Submitted Offer
								</Text>
							</View>
						</View>

						{this.state.woDetails.length > 0 ? (
							<FlatList
								data={this.state.woDetails}
								keyExtractor={item => item.index}
								renderItem={({ item, index }) => (
									<View
										style={[
											styles.cardStyle,
											{ borderLeftColor: item.siteOfferUploadStatus == 'I' ? '#61B865' : '#E63E3A' }
										]}
									>
										<View style={{ flexDirection: 'row' }}>
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

										<View style={{ flexDirection: 'row', marginTop: 10 }}>
											<View style={{ width: '50%' }}>
												<Text style={{ color: '#000000', fontFamily: 'GoogleSans-Medium', fontSize: 15 }}>
													Material Category
												</Text>
												<Text style={{ color: '#000000', fontSize: 13 }}>{item.materialName}</Text>
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
													Material Subcategory
												</Text>
												<Text style={{ color: '#000000', fontSize: 13, textAlign: 'right' }}>
													{item.materialscName}
												</Text>
											</View>
										</View>

										{item.siteOfferUploadStatus == 'I' ? (
											<View style={{ flexDirection: 'row', justifyContent: 'space-between', marginVertical: 10 }}>
												<View></View>
												<TouchableOpacity
													onPress={() => this.redirectTo(item)}
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
														Request Site Schedule
													</Text>
												</TouchableOpacity>
											</View>
										) : null}

										{item.siteOfferUploadStatus == 'N' ? (
											<View style={{ flexDirection: 'row', justifyContent: 'space-between', marginVertical: 10 }}>
												<View></View>
												<TouchableOpacity
													onPress={() => this.redirectTo(item)}
													style={{ borderRadius: 5, backgroundColor: '#ff7f00' }}
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
														Upload Site Offer
													</Text>
												</TouchableOpacity>
											</View>
										) : null}
									</View>
								)}
							/>
						) : (
							<View style={{ justifyContent: 'center', height: 100 }}>
								<Text style={{ fontFamily: 'GoogleSans-Medium', fontSize: 15 }}>No Data Found</Text>
							</View>
						)}
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
