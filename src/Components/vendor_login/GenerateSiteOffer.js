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
	ScrollView,
	FlatList,
	TextInput
} from 'react-native';
import APIManager from '../Managers/APIManager';
import Loader from 'react-native-modal-loader';
import Icon from 'react-native-vector-icons/FontAwesome';

global.GenerateSiteOffer;
export default class GenerateSiteOffer extends Component {
	constructor(props) {
		super(props);
		this.state = {
			vendorInfo: {},
			woDetails: this.props.navigation.state.params.woDetails,
			vndId: '',
			totalPackageNo: null,
			qtyPerPackage: null,
			packStartNo: null,
			matStartNo: null,
			isRefreshing: false,
			error: false
		};
		global.GenerateSiteOffer = this;
		alert(JSON.stringify(this.props.navigation.state.params.woDetails));
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
		//this.getVendorId();

		BackHandler.addEventListener('hardwareBackPress', this.props.navigation.goBack);
	}

	async getVendorId() {
		await getData('InspId').then(value =>
			this.setState({ vndId: value }, () => {
				this.getVendorInfo();
				this.getWorkOrderDetails();
			})
		);
	}

	getVendorInfo() {
		APIManager.getVendorInfo(
			this.state.vndId,
			responseJson => {
				// alert(JSON.stringify(responseJson));
				if (responseJson.status == 'SUCCESS') {
					this.setState({ vendorInfo: responseJson.data.vendorInformation });
				} else {
					this.setState({ error: true, isRefreshing: false });
				}
			},
			error => {
				this.setState({ isRefreshing: false, error: true });
				console.log(JSON.stringify(error));
			}
		);
	}

	getWorkOrderDetails() {
		APIManager.getWorkOrderDetails(
			this.state.vndId,
			responseJson => {
				//alert(JSON.stringify(responseJson));
				if (responseJson.status == 'SUCCESS') {
					this.setState({ woDetails: responseJson.data, isRefreshing: false });
				}
			},
			error => {
				this.setState({ isRefreshing: false });
				console.log(JSON.stringify(error));
			}
		);
	}

	redirectTo(item) {
		this.props.navigation.push('OfferToBeSubmitted', {
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
									REQUEST SITE OFFER
								</Text>
							</View>
						</View>

						<View style={styles.detailsView}>
							<View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
								<View style={{ width: '50%' }}>
									<Text style={{ color: 'black', fontFamily: 'GoogleSans-Medium' }}>Work Order No.</Text>
									<Text style={{ color: 'black', flex: 1, flexWrap: 'wrap' }}>{this.state.woDetails.woNumber}</Text>
								</View>

								<View style={{ width: '50%' }}>
									<Text style={{ color: 'black', fontFamily: 'GoogleSans-Medium', textAlign: 'right' }}>
										Tender No.
									</Text>
									<Text style={{ color: 'black', textAlign: 'right', flex: 1, flexWrap: 'wrap' }}>
										{this.state.woDetails.tenderNumber}
									</Text>
								</View>
							</View>

							<View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 }}>
								<View style={{ width: '50%' }}>
									<Text style={{ color: 'black', fontFamily: 'GoogleSans-Medium' }}>Inspector Name </Text>
									<Text style={{ color: 'black', flex: 1, flexWrap: 'wrap' }}>
										{this.state.woDetails.inspectorName}
									</Text>
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
									<Text style={{ color: 'black', fontFamily: 'GoogleSans-Medium' }}>Material Subcategory </Text>
									<Text style={{ color: 'black', flex: 1, flexWrap: 'wrap' }}>
										{this.state.woDetails.materialscName}
									</Text>
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

							<View style={{ flexDirection: 'row', marginTop: 10 }}>
								<View style={{ width: '50%' }}>
									<Text style={{ color: '#000000', fontFamily: 'GoogleSans-Medium', fontSize: 15 }}>
										Supply Quantity
									</Text>
									<Text style={{ color: '#000000', fontSize: 13 }}>{this.state.woDetails.deliverySchQty}</Text>
								</View>

								<View style={{ width: '50%' }}>
									<Text style={{ color: '#000000', fontFamily: 'GoogleSans-Medium', fontSize: 15, textAlign: 'right' }}>
										Offer Quantity
									</Text>
									<Text style={{ color: '#000000', fontSize: 13, textAlign: 'right' }}>
										{this.state.woDetails.offerQty}
									</Text>
								</View>
							</View>
						</View>

						<View style={{ margin: 15, borderRadius: 5, elevation: 8, backgroundColor: '#ffffff', padding: 15 }}>
							<View style={{ backgroundColor: '#eeeeee', padding: 10 }}>
								<Text style={{ color: '#000000', fontFamily: 'GoogleSans-Medium', fontSize: 15 }}>Packing List</Text>
							</View>

							<View style={{ flexDirection: 'row', marginTop: 10 }}>
								<View style={{ width: '50%' }}>
									<Text style={{ color: '#000000', fontFamily: 'GoogleSans-Medium', paddingTop: 5 }}>
										Total Package No.
									</Text>
								</View>

								<View style={{ width: '50%' }}>
									<TextInput
										style={{}}
										onChangeText={totalPackageNo => this.setState({ totalPackageNo })}
										value={this.state.totalPackageNo}
										placeholder=""
										underlineColorAndroid="#418bca"
										selectTextOnFocus={true}
									/>
								</View>
							</View>

							<View style={{ flexDirection: 'row', marginTop: 10 }}>
								<View style={{ width: '50%' }}>
									<Text style={{ color: '#000000', fontFamily: 'GoogleSans-Medium', paddingTop: 5 }}>
										Quantity Per Package
									</Text>
								</View>

								<View style={{ width: '50%' }}>
									<TextInput
										style={{}}
										onChangeText={qtyPerPackage => this.setState({ qtyPerPackage })}
										value={this.state.qtyPerPackage}
										placeholder=""
										underlineColorAndroid="#418bca"
										selectTextOnFocus={true}
									/>
								</View>
							</View>

							<View style={{ backgroundColor: '#eeeeee', padding: 10, marginTop: 10 }}>
								<Text style={{ color: '#000000', fontFamily: 'GoogleSans-Medium', fontSize: 15 }}>
									Package Wise Details
								</Text>
							</View>

							<View style={{ flexDirection: 'row', marginTop: 10 }}>
								<View style={{ width: '50%' }}>
									<Text style={{ color: '#000000', fontFamily: 'GoogleSans-Medium', paddingTop: 5 }}>
										Package Start Serial No.
									</Text>
								</View>

								<View style={{ width: '50%' }}>
									<TextInput
										style={{ width: '100%' }}
										onChangeText={packStartNo => this.setState({ packStartNo })}
										value={this.state.packStartNo}
										placeholder=""
										underlineColorAndroid="#418bca"
										selectTextOnFocus={true}
									/>
								</View>
							</View>

							<View style={{ flexDirection: 'row', marginTop: 10 }}>
								<View style={{ width: '50%' }}>
									<Text style={{ color: '#000000', fontFamily: 'GoogleSans-Medium', paddingTop: 5 }}>
										Material Start Serial No.
									</Text>
								</View>

								<View style={{ width: '50%' }}>
									<TextInput
										style={{ width: '100%' }}
										onChangeText={matStartNo => this.setState({ matStartNo })}
										value={this.state.matStartNo}
										placeholder=""
										underlineColorAndroid="#418bca"
										selectTextOnFocus={true}
									/>
								</View>
							</View>

							<TouchableOpacity
								onPress={() => this.createPDF()}
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
									Generate Site Offer
								</Text>
							</TouchableOpacity>
						</View>
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
	}
});
