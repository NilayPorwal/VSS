import React, { Component } from 'react';
import {
	Platform,
	StyleSheet,
	Text,
	View,
	Image,
	TouchableOpacity,
	ScrollView,
	ImageBackground,
	Modal,
	ToastAndroid,
	BackHandler,
	TouchableWithoutFeedback,
	Picker,
	ActivityIndicator,
	TextInput
} from 'react-native';
import APIManager from './Managers/APIManager';
import Loader from 'react-native-modal-loader';
import RNFetchBlob from 'react-native-fetch-blob';
import { Base64 } from 'js-base64';

export default class SiteOffersDetails extends Component {
	constructor(props) {
		super(props);
		this.state = {
			isRefreshing: true,
			isLoading: false,
			vendorId: this.props.navigation.state.params.vndrId,
			inspId: this.props.navigation.state.params.insId,
			woId: this.props.navigation.state.params.woId,
			matId: this.props.navigation.state.params.matId,
			matscId: this.props.navigation.state.params.matscId,
			pdiId: this.props.navigation.state.params.pdiId,
			vendorDetails: this.props.navigation.state.params.vendorDetails,
			error: false,
			testModalFail: false,
			reason: 'other',
			remark: '',
			siteOfferDetails: {},
			siteOfferStatus: null,
			pdfLink: null
		};
		// alert(JSON.stringify(this.props.navigation.state.params.vendorDetails))
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
		this.getSiteOfferDetails();
		BackHandler.addEventListener('hardwareBackPress', this.props.navigation.goBack);
	}

	getSiteOfferDetails() {
		//alert(JSON.stringify( this.state.pdiId));
		APIManager.getSiteOfferDetails(
			this.state.inspId,
			this.state.vendorId,
			this.state.woId,
			this.state.matId,
			this.state.matscId,
			this.state.pdiId,
			responseJson => {
				//alert(JSON.stringify(responseJson));
				if (responseJson.status == 'SUCCESS') {
					// alert(JSON.stringify(responseJson));
					this.setState({ siteOfferDetails: responseJson.data, isRefreshing: false });
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

	reDirectTo() {
		this.props.navigation.push('SamplingMaterial', {
			siteOfferDetails: this.state.siteOfferDetails
		});
	}

	onAccept() {
		this.setState({ siteOfferStatus: 1, isLoading: true }, () => {
			this.uploadStatus();
		});
	}

	onReject() {
		this.setState({ siteOfferStatus: 2 }, () => {
			this.uploadStatus();
		});
	}

	uploadStatus() {
		const Details = {
			inspectionSiteAiId: this.state.siteOfferDetails.inspectionSiteAiId,
			siteOfferStatus: this.state.siteOfferStatus,
			siteOfferStatusRemarks: this.state.remark
		};

		APIManager.uploadStatus(
			Details,
			responseJson => {
				if (responseJson.status == 'SUCCESS') {
					// alert(JSON.stringify(responseJson));
					if (this.state.siteOfferStatus == 1) {
						this.setState({ isLoading: false });
						this.reDirectTo();
					} else {
						this.setState({ testModalFail: false }, () => {
							this.props.navigation.push('HomeScreen');
						});
					}
				} else {
					this.setState({ isRefreshing: false, error: true });
					alert('Please Try Again');
				}
			},
			error => {
				this.setState({ isRefreshing: false, error: true });
				console.log(JSON.stringify(error));
			}
		);
	}

	getSiteOfferPDF() {
		this.setState({ isRefreshing: true }, () => {
			setTimeout(() => {
				if (this.state.isRefreshing == true) {
					this.setState({ isRefreshing: false });
					ToastAndroid.showWithGravity('SiteOffer Not Found', ToastAndroid.LONG, ToastAndroid.CENTER);
				}
			}, 8000);
		});
		APIManager.getSiteOfferPDF(
			this.state.siteOfferDetails.inspectionSiteAiId,
			responseJson => {
				//alert(JSON.stringify(responseJson));
				if (responseJson.status == 'SUCCESS') {
					this.setState({ pdfLink: responseJson.data.file }, () => {
						this.downloadPDF();
					});
				} else {
					this.setState({ isRefreshing: false });
					ToastAndroid.showWithGravity('SiteOffer Not Found', ToastAndroid.LONG, ToastAndroid.CENTER);
				}
			},
			error => {
				this.setState({ isRefreshing: false, error: true });
				console.log(JSON.stringify(error));
			}
		);
	}

	downloadPDF() {
		const credentials = APIManager.Sso_Id + ':' + APIManager.Api_Key;
		const hash = Base64.encode(credentials);
		const Basic = 'Basic ' + hash;
		const link = this.state.pdfLink.slice(8);
		const res = link.replace(/\\/g, '/');

		const { config, fs } = RNFetchBlob;
		let PictureDir = fs.dirs.PictureDir;
		RNFetchBlob.config({
			fileCache: true,
			addAndroidDownloads: {
				notification: true,
				title: 'Site Offer',
				description: 'An PDF file.',
				mediaScannable: true,
				useDownloadManager: true,
				mime: 'application/pdf',
				path: PictureDir + '/site-offer.pdf'
			}
		})
			.fetch('GET', APIManager.host + res, { Authorization: Basic })
			.then(res => {
				ToastAndroid.showWithGravity('SiteOffer Downloaded Successfuly !', ToastAndroid.LONG, ToastAndroid.CENTER);
				this.setState({ isRefreshing: false });
			})
			.catch(error => {
				ToastAndroid.showWithGravity('SiteOffer Downloaded Successfuly !', ToastAndroid.LONG, ToastAndroid.CENTER);
				this.setState({ isRefreshing: false });
				//alert(JSON.stringify(error));
			});
	}

	render() {
		return (
			<ImageBackground source={require('../Images/background.png')} style={{ width: '100%', height: '100%' }}>
				<ScrollView>
					<View style={styles.container}>
						<Text
							style={{
								fontSize: 20,
								fontFamily: 'GoogleSans-Medium',
								marginTop: 20,
								color: 'black',
								textAlign: 'center'
							}}
						>
							SITE OFFER DETAILS
						</Text>
						<Loader loading={this.state.isRefreshing} color="#40a7ab" />

						{this.state.error == false ? (
							<View>
								<Text style={{ color: 'black', fontFamily: 'GoogleSans-Medium', marginLeft: 15, marginTop: 15 }}>
									Work Information
								</Text>

								<View style={styles.detailsView}>
									<View style={{ flexDirection: 'row' }}>
										<View style={{ width: '50%' }}>
											<Text style={{ color: 'black', fontFamily: 'GoogleSans-Medium' }}>Tender No.</Text>
											<Text style={{ color: 'black', flex: 1, flexWrap: 'wrap' }}>
												{this.state.siteOfferDetails.tenderNumber}
											</Text>
										</View>

										<View style={{ width: '50%' }}>
											<Text style={{ color: 'black', fontFamily: 'GoogleSans-Medium', textAlign: 'right' }}>
												Work Order No.
											</Text>
											<Text style={{ color: 'black', textAlign: 'right', flex: 1, flexWrap: 'wrap' }}>
												{this.state.siteOfferDetails.woNumber}
											</Text>
										</View>
									</View>

									<View style={{ flexDirection: 'row', marginTop: 20 }}>
										<View style={{ width: '50%' }}>
											<Text style={{ color: 'black', fontFamily: 'GoogleSans-Medium' }}>Work Order ID </Text>
											<Text style={{ color: 'black', flex: 1, flexWrap: 'wrap' }}>
												{this.state.siteOfferDetails.woCustomUnqId}
											</Text>
										</View>

										<View style={{ width: '50%' }}>
											<Text style={{ color: 'black', fontFamily: 'GoogleSans-Medium', textAlign: 'right' }}>
												Site Offer ID
											</Text>
											<Text style={{ color: 'black', textAlign: 'right', flex: 1, flexWrap: 'wrap' }}>
												{this.state.siteOfferDetails.siteOfferUnqId}
											</Text>
										</View>
									</View>
								</View>

								<Text
									style={{
										color: 'black',
										fontFamily: 'GoogleSans-Medium',
										marginLeft: 15,
										marginTop: 15,
										textAlign: 'left'
									}}
								>
									Material Details
								</Text>

								<View style={styles.detailsView}>
									<View style={{ flexDirection: 'row' }}>
										<View style={{ width: '50%' }}>
											<Text style={{ color: 'black', fontFamily: 'GoogleSans-Medium' }}>Category</Text>
											<Text style={{ color: 'black', flex: 1, flexWrap: 'wrap' }}>
												{this.state.siteOfferDetails.materialName}
											</Text>
										</View>

										<View style={{ width: '50%', alignItems: 'flex-end' }}>
											<Text style={{ color: 'black', fontFamily: 'GoogleSans-Medium' }}>Unit</Text>
											<Text style={{ color: 'black', flex: 1, flexWrap: 'wrap' }}>
												{this.state.siteOfferDetails.deliverySchUnit}
											</Text>
										</View>
									</View>

									<View style={{ flexDirection: 'row', marginTop: 20 }}>
										<View style={{ width: '50%' }}>
											<Text style={{ color: 'black', fontFamily: 'GoogleSans-Medium' }}>Sub Category </Text>
											<Text style={{ color: 'black', flex: 1, flexWrap: 'wrap' }}>
												{this.state.siteOfferDetails.materialScName}
											</Text>
										</View>

										<TouchableOpacity onPress={() => this.getSiteOfferPDF()} style={{ width: '50%' }}>
											<Text
												style={{
													color: '#1b6379',
													textDecorationLine: 'underline',
													fontFamily: 'GoogleSans-Medium',
													fontSize: 15,
													textAlign: 'right'
												}}
											>
												Download Site Offer
											</Text>
										</TouchableOpacity>
									</View>

									<View style={{ borderWidth: 1, marginTop: 20 }}>
										<View style={styles.tableHeader}>
											<Text style={[styles.tableHeaderText, { width: '40%' }]}>Offers As Per</Text>
											<Text style={[styles.tableHeaderText, { width: '30%' }]}>DATE </Text>
											<Text style={[styles.tableHeaderText, { width: '30%' }]}>Quantity</Text>
										</View>

										<View style={styles.tableContent}>
											<Text style={[styles.tableContentText, { width: '40%' }]}>W.O.Schedule</Text>
											<Text style={[styles.tableContentText, { width: '30%' }]}>
												{this.state.siteOfferDetails.deliverySchDate}
											</Text>
											<Text style={[styles.tableContentText, { width: '30%' }]}>
												{this.state.siteOfferDetails.deliverySchQty}
											</Text>
										</View>

										<View style={styles.tableContent}>
											<Text style={[styles.tableContentText, { width: '40%' }]}>PDI (Offer)</Text>
											<Text style={[styles.tableContentText, { width: '30%' }]}>
												{this.state.siteOfferDetails.offerSupplyDat}
											</Text>
											<Text style={[styles.tableContentText, { width: '30%' }]}>
												{this.state.siteOfferDetails.offerQty}
											</Text>
										</View>

										<View style={styles.tableContent}>
											<Text style={[styles.tableContentText, { width: '40%' }]}>Site Offer</Text>
											<Text style={[styles.tableContentText, { width: '30%' }]}>
												{this.state.siteOfferDetails.siteOfferDate}
											</Text>
											<Text style={[styles.tableContentText, { width: '30%' }]}>
												{this.state.siteOfferDetails.inspectionSiteOfferQty}
											</Text>
										</View>
									</View>
								</View>

								{this.state.vendorDetails.siteOfferStatus == 0 ? (
									<View
										style={{
											flexDirection: 'row',
											justifyContent: 'space-between',
											alignItems: 'center',
											width: '90%',
											marginBottom: 50,
											marginTop: 20,
											marginLeft: 15
										}}
									>
										<TouchableOpacity onPress={() => this.onAccept()} style={styles.acceptButton}>
											{this.state.isLoading == false ? (
												<Text style={styles.buttonText}>ACCEPT</Text>
											) : (
												<ActivityIndicator size="small" color="#ffffff" />
											)}
										</TouchableOpacity>

										<TouchableOpacity
											onPress={() => this.setState({ testModalFail: true })}
											style={styles.rejectButton}
										>
											<Text style={styles.buttonText}>REJECT</Text>
										</TouchableOpacity>
									</View>
								) : (
									<View style={{ alignItems: 'center', marginVertical: 20 }}>
										<TouchableOpacity onPress={() => this.reDirectTo()} style={styles.acceptButton}>
											<Text style={styles.buttonText}>Continue</Text>
										</TouchableOpacity>
									</View>
								)}
							</View>
						) : (
							<View style={{ flex: 1, alignItems: 'center', marginTop: 100 }}>
								<Text style={{ fontFamily: 'GoogleSans-Medium', fontSize: 20 }}>No Details Found</Text>
							</View>
						)}
					</View>

					<Modal
						transparent={true}
						visible={this.state.testModalFail}
						onRequestClose={() => {
							this.setState({ testModalFail: false });
						}}
					>
						<TouchableOpacity
							onPress={() => this.setState({ testModalFail: false })}
							style={{ flex: 1, justifyContent: 'flex-end', alignItems: 'center', backgroundColor: '#00000080' }}
						>
							<TouchableWithoutFeedback>
								<View
									style={{
										width: 300,
										height: 270,
										backgroundColor: '#ffffff',
										borderRadius: 10,
										marginBottom: 20,
										padding: 15,
										justifyContent: 'center'
									}}
								>
									<Text
										style={{ fontSize: 15, fontFamily: 'GoogleSans-Medium', color: '#000000', textAlign: 'center' }}
									>
										REJECTION REASON
									</Text>

									<View style={{ width: '100%', paddingHorizontal: 10, marginTop: 15 }}>
										<TextInput
											style={{ height: 130, borderWidth: 1 }}
											onChangeText={remark => this.setState({ remark })}
											value={this.state.remark}
											multiline={true}
											//underlineColorAndroid='orange'
										/>
									</View>

									<View style={{ alignItems: 'center' }}>
										<TouchableOpacity
											onPress={() => this.onReject()}
											style={{
												borderRadius: 5,
												backgroundColor: '#3CB043',
												margin: 10,
												paddingHorizontal: 15,
												paddingVertical: 10
											}}
										>
											<Text style={styles.buttonText}>SUBMIT</Text>
										</TouchableOpacity>
									</View>
								</View>
							</TouchableWithoutFeedback>
						</TouchableOpacity>
					</Modal>
				</ScrollView>
			</ImageBackground>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1
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
		padding: 10,
		color: 'black',
		borderRightColor: 'lightgrey',
		textAlign: 'center',
		borderRightWidth: 1,
		fontSize: 12
	},
	acceptButton: {
		borderRadius: 5,
		backgroundColor: '#3CB043',
		width: '30%',
		paddingVertical: 10,
		alignItems: 'center'
	},
	rejectButton: {
		borderRadius: 5,
		backgroundColor: '#FF2300',
		width: '30%',
		paddingVertical: 10,
		alignItems: 'center'
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
