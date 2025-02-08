import React, { Component } from 'react';
import {
	Platform,
	StyleSheet,
	Text,
	View,
	Image,
	TouchableOpacity,
	Modal,
	ScrollView,
	ActivityIndicator,
	ImageBackground,
	BackHandler,
	Alert
} from 'react-native';
import APIManager from './Managers/APIManager';
import Icon from 'react-native-vector-icons/FontAwesome';
import Icon1 from 'react-native-vector-icons/Feather';
import RNFS from 'react-native-fs';
import DocumentPicker from 'react-native-document-picker';
import { setData } from '../helper';

export default class ActiveSiteOffers extends Component {
	constructor(props) {
		super(props);
		this.state = {
			isRefreshing: true,
			siteOffers: [],
			vendorDetails: this.props.navigation.state.params.vendorDetails,
			modalVisible: false,
			modal1Visible: false,
			image: []
		};
		//console.log(JSON.stringify(this.props.navigation.state.params.vendorDetails));
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
		if (this.state.vendorDetails.isInspectorIntiate == '1') {
			this.setState({ modalVisible: true });
		}
		this.getSiteOffers();

		BackHandler.addEventListener('hardwareBackPress', this.props.navigation.goBack);
	}

	onBack() {
		this.setState({ modalVisible: false });
		this.props.navigation.goBack();
		return true;
	}

	getSiteOffers() {
		APIManager.getSiteOffersList(
			this.state.vendorDetails.inspectorAiId,
			this.state.vendorDetails.vendorAiId,
			this.state.vendorDetails.nominationAiId,
			this.props.navigation.state.params.from,
			responseJson => {
				console.log(JSON.stringify(responseJson));
				this.setState({ siteOffers: responseJson.data, isRefreshing: false });
			},
			error => {
				console.log(error);
			}
		);
	}

	reDirectTo(item) {
		this._storeVendorData(item);

		this.props.navigation.push('SamplingMaterial', {
			insId: item.inspectorAiId,
			vndrId: item.vendorAiId,
			woId: item.vendorWoAiId,
			matId: item.materialAiId,
			matscId: item.materialSubcategoryAiId,
			pdiId: item.pdiOfferAiId,
			vendorAddress: item.vendorWorksAddress,
			vendorDetails: this.state.vendorDetails,
			from: this.props.navigation.state.params.from
		});
	}

	_storeVendorData(item) {
		setData('insId', item.inspectorAiId.toString());
		setData('vndrId', item.vendorAiId.toString());
		setData('woId', item.vendorWoAiId.toString());
		setData('matId', item.materialAiId.toString());
		setData('matscId', item.materialSubcategoryAiId.toString());
	}

	withDrawalPress() {
		let Details = {
			nominationAiId: this.state.vendorDetails.nominationAiId,
			inspectionSiteOfferAiId: this.state.vendorDetails.inspectionSiteAiId,
			pdiofferAiId: this.state.vendorDetails.pdiOfferAiId,
			inspetionCnfrmOfferAiId: 0
		};

		console.log(JSON.stringify(this.state.image));

		APIManager.onWithDrawal(
			Details,
			this.state.image,
			this.props.navigation.state.params.from,
			responseJson => {
				console.log(JSON.stringify(responseJson));
				if (responseJson.status == 'SUCCESS') {
					Alert.alert('Success', responseJson.message);
					this.setState({ modal1Visible: false });
					this.props.navigation.pop(2);
				} else {
					Alert.alert('Failed', responseJson.message);
				}
			},
			error => {
				console.log(error);
				alert(error.message);
			}
		);
	}

	async onDocPress() {
		if (this.state.image.length > 2) {
			Alert.alert('Only three document allowed');
			return;
		}
		try {
			const res = await DocumentPicker.pick({
				type: [DocumentPicker.types.pdf, DocumentPicker.types.images]
			});
			console.log('Response = ', res);
			// const imgData = {
			// 	withDrawalDocPath: res.uri,
			// 	ext: res.type.split('/')[1]
			// };
			// this.setState({ image: [...this.state.image, imgData] });
			RNFS.readFile(res.uri, 'base64').then(result => {
				console.log(result);
				const imgData = {
					withDrawalDocPath: result,
					extn: res.type.split('/')[1]
				};
				this.setState({ image: [...this.state.image, imgData] });
			});
		} catch (err) {
			if (DocumentPicker.isCancel(err)) {
				// User cancelled the picker, exit any dialogs or menus and move on
			} else {
				throw err;
			}
		}
	}

	removeDoc(index) {
		Alert.alert(
			'Hold on!',
			'Do you want to remove this document ?',
			[
				{ text: 'No', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
				{
					text: 'Yes',
					onPress: () => {
						const docs = this.state.image;
						docs.splice(index, 1);
						this.setState({ image: docs });
					}
				}
			],
			{ cancelable: true }
		);
	}

	render() {
		return (
			<ImageBackground source={require('../Images/background.png')} style={{ width: '100%', height: '100%' }}>
				<ScrollView>
					<View style={styles.container}>
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
									Active Offers
								</Text>
							</View>
						</View>

						{this.state.siteOffers != null ? (
							<View>
								{this.state.isRefreshing == false ? (
									<View style={{ borderWidth: 1, margin: 15 }}>
										<View style={styles.tableHeader}>
											<View style={{ width: '36%', borderRightColor: 'lightgrey', borderRightWidth: 1 }}>
												<Text style={[styles.tableHeaderText]}>Work Order No.</Text>
											</View>

											<View style={{ width: '34%', borderRightColor: 'lightgrey', borderRightWidth: 1 }}>
												<Text style={[styles.tableHeaderText]}>Offer ID </Text>
											</View>

											<View style={{ width: '30%', borderRightColor: 'lightgrey', borderRightWidth: 1 }}>
												<Text style={[styles.tableHeaderText]}>Details</Text>
											</View>
										</View>

										{this.state.siteOffers.map((item, key) => (
											<View style={styles.tableContent}>
												<View style={{ width: '36%', borderRightColor: 'lightgrey', borderRightWidth: 1 }}>
													<Text style={[styles.tableContentText]}>{item.woNumber}</Text>
												</View>

												<View style={{ width: '34%', borderRightColor: 'lightgrey', borderRightWidth: 1 }}>
													<Text style={[styles.tableContentText]}>{item.pdiOfferUnqId}</Text>
												</View>

												<View style={{ width: '30%', borderRightColor: 'lightgrey', borderRightWidth: 1 }}>
													<Text
														style={{
															paddingTop: 10,
															paddingBottom: 10,
															color: '#1b6379',
															textAlign: 'center',
															textDecorationLine: 'underline',
															fontFamily: 'GoogleSans-Medium'
														}}
														onPress={() => this.reDirectTo(item)}
													>
														View
													</Text>
												</View>
											</View>
										))}
									</View>
								) : (
									<View style={{ justifyContent: 'center' }}>
										<ActivityIndicator size="large" color="orange" />
									</View>
								)}
							</View>
						) : (
							<View style={{ justifyContent: 'center', height: 100 }}>
								<Text style={{ fontFamily: 'GoogleSans-Medium', fontSize: 15 }}>No Site Offer Found</Text>
							</View>
						)}
						<View style={{ flexDirection: 'row' }}>
							<TouchableOpacity style={styles.button}>
								<Text onPress={() => this.props.navigation.push('HomeScreen')} style={styles.buttonText}>
									BACK
								</Text>
							</TouchableOpacity>
							<TouchableOpacity style={styles.button} onPress={() => this.setState({ modal1Visible: true })}>
								<Text style={styles.buttonText}>Withdrawal</Text>
							</TouchableOpacity>
						</View>
					</View>
				</ScrollView>

				<Modal transparent={true} visible={this.state.modalVisible}>
					<View style={{ flex: 1, alignItems: 'center', backgroundColor: '#00000080', justifyContent: 'center' }}>
						<View style={{ borderRadius: 5, backgroundColor: '#ffffff', padding: 15, width: '85%' }}>
							<Text style={{ color: 'red', fontSize: 15, textAlign: 'center', padding: 5 }}>
								Inspection for this site has been already initiated by another inspector
							</Text>
							{
								//<Text style={{color:'#000', fontSize:15, textAlign:"center", padding:5}}>Do you still want to initiate the inspection ?</Text>
							}
							<View style={{ alignItems: 'center', flexDirection: 'row', justifyContent: 'center' }}>
								{
									// <TouchableOpacity onPress={()=>this.setState({modalVisible:false})} style={styles.button}>
									//    <Text style = {styles.buttonText}>Yes</Text>
									// </TouchableOpacity>
								}
								{
									<TouchableOpacity onPress={() => this.onBack()} style={styles.button}>
										<Text style={styles.buttonText}>OK</Text>
									</TouchableOpacity>
								}
							</View>
						</View>
					</View>
				</Modal>

				<Modal transparent={true} visible={this.state.modal1Visible}>
					<View style={{ flex: 1, alignItems: 'center', backgroundColor: '#00000080', justifyContent: 'center' }}>
						<View style={{ borderRadius: 5, backgroundColor: '#ffffff', padding: 15, width: '85%' }}>
							<View
								style={{
									borderWidth: 0,
									borderRadius: 5,
									marginHorizontal: 15,
									padding: 10,
									backgroundColor: '#FEC1A5',
									width: '90%'
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
										Upload Observation Documents (PDF/Image)
									</Text>
									<View style={{ flexDirection: 'row' }}>
										{/* <TouchableOpacity
											onPress={() => this.onCamera()}
											style={{ padding: 10, borderRadius: 5, backgroundColor: 'brown', marginVertical: 10 }}
										>
											<Icon name="camera" size={20} color="white" />
										</TouchableOpacity> */}
										<TouchableOpacity
											onPress={() => this.onDocPress()}
											style={{
												padding: 10,
												borderRadius: 5,
												backgroundColor: 'brown',
												marginVertical: 10,
												marginLeft: 10
											}}
										>
											<Icon name="image" size={20} color="white" />
										</TouchableOpacity>
									</View>
								</View>

								<View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
									{this.state.image.map((item, index) => (
										<TouchableOpacity key={index} onPress={() => this.removeDoc(index)} style={{ paddingLeft: 5 }}>
											<Icon name="file-text" size={30} color="#141F25" />
										</TouchableOpacity>
									))}
								</View>
								<TouchableOpacity onPress={() => this.withDrawalPress()} style={styles.button}>
									<Text style={styles.buttonText}>SUBMIT</Text>
								</TouchableOpacity>
							</View>
							<TouchableOpacity
								onPress={() => this.setState({ modal1Visible: false })}
								style={{ position: 'absolute', top: 0, right: 5 }}
							>
								<Icon1 name="x" size={22} color="black" />
							</TouchableOpacity>
						</View>
					</View>
				</Modal>
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
		padding: 10,
		fontFamily: 'GoogleSans-Medium',
		color: '#ffffff',
		textAlign: 'center'
	},
	tableContent: {
		flexDirection: 'row',
		borderBottomColor: 'lightgrey',
		borderBottomWidth: 1,
		backgroundColor: '#ffffff'
	},
	tableContentText: {
		color: 'black',
		borderRightColor: 'lightgrey',
		textAlign: 'center',
		borderRightWidth: 1,
		fontSize: 12,
		paddingVertical: 10,
		paddingHorizontal: 5
	},
	button: {
		borderRadius: 5,
		backgroundColor: '#ff7f00',
		margin: 20,
		paddingVertical: 10,
		paddingHorizontal: 20
	},
	buttonText: {
		fontSize: 18,
		color: '#ffffff',
		fontFamily: 'GoogleSans-Medium',
		alignSelf: 'center'
	}
});
