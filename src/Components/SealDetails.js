import React, { Component } from 'react';
import {
	Platform,
	StyleSheet,
	Text,
	View,
	Image,
	TouchableOpacity,
	Alert,
	KeyboardAvoidingView,
	ScrollView,
	ActivityIndicator,
	ImageBackground,
	BackHandler,
	ActionSheetIOS,
	Picker,
	TextInput,
	FlatList,
	Modal,
	Dimensions,
	Linking,
	CheckBox
} from 'react-native';
import APIManager from './Managers/APIManager';
import Icon from 'react-native-vector-icons/Feather';
var SQLite = require('react-native-sqlite-storage');
var db = SQLite.openDatabase({ name: 'test.db', Location: 'default' });
import Loader from 'react-native-modal-loader';
import RNFetchBlob from 'react-native-fetch-blob';
import { Base64 } from 'js-base64';

const packageType = [];
const sealType = [];
export default class SealDetails extends Component {
	constructor(props) {
		super(props);
		this.state = {
			isRefreshing: false,
			sealDetails: [],
			packageDetails: [],
			sealData: [],
			sealModalVisible: false,
			pdfLink: null,
			sealItems: [],
			sealStartNo: null,
			sealEndNo: null,
			sealTypeName: '----Select Seal Type----',
			sealTypeAiId: null,
			packageNo: null,
			packageTypeAiId: null,
			packageTypeName: '----Select Package Type----',
			matSeriallDetails: null,
			sealNo: null,
			sealDetail: null,
			formVisible: true,
			itemConsumeModel: true,
			check: 0,
			isloading: false,
			siteOfferDetails: this.props.navigation.state.params.siteOfferDetails
			//vendorDetails:this.props.navigation.state.params.vendorDetails,
		};
		//alert(JSON.stringify(this.props.navigation.state.params.siteOfferDetails))
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
		this.getSealTypeList();
		this.getPackageTypeList();
		this.getSealDetails();
		BackHandler.addEventListener('hardwareBackPress', this.props.navigation.goBack);
	}

	getSealTypeList() {
		APIManager.getSealTypeList(responseJson => {
			//alert(JSON.stringify(responseJson));
			if (responseJson.status == 'SUCCESS') {
				this.setState({ sealDetails: responseJson.data });
				for (let i = 0; i < responseJson.data.length; i++) {
					sealType.push(responseJson.data[i].sealType);
				}
			}
		});
	}

	getPackageTypeList() {
		APIManager.getPackageTypeList(
			responseJson => {
				//alert(JSON.stringify(responseJson));
				if (responseJson.status == 'SUCCESS') {
					this.setState({ packageDetails: responseJson.data });
					for (let i = 0; i < responseJson.data.length; i++) {
						packageType.push(responseJson.data[i].packageType);
					}
				}
			},
			error => {
				this.setState({ isRefreshing: false });
				console.log(JSON.stringify(error));
			}
		);
	}

	// onSubmit(){
	//   this.setState({sealData:[...this.state.sealData, {
	//           sealTypeName:this.state.sealTypeName,
	//           sealTypeAiId:this.state.sealTypeAiId,
	// 	packageNo:this.state.packageNo,
	// 	packageTypeAiId:this.state.packageTypeAiId,
	// 	matSeriallDetails:this.state.matSeriallDetails,
	// 	sealNo:this.state.sealNo,
	// 	sealDetail:this.state.sealDetail,

	//   }] }, ()=>alert(JSON.stringify(this.state.sealData)))

	// }

	onSave() {
		this.setState({ isRefreshing: true });
		db.transaction(tx => {
			//tx.executeSql('DROP TABLE sealDetails');
			tx.executeSql(
				'CREATE TABLE IF NOT EXISTS sealDetails (id integer primary key,nominationAiId integer, sealTypeName text, sealTypeAiId integer, packageNo integer, packageTypeAiId integer, matSeriallDetails integer , sealNo integer, sealDetail integer, sealStartNo integer, sealEndNo integer )'
			);
			tx.executeSql(
				'INSERT INTO sealDetails (nominationAiId, sealTypeName , sealTypeAiId , packageNo , packageTypeAiId , matSeriallDetails  , sealNo , sealDetail, sealStartNo, sealEndNo ) VALUES (?, ?, ?, ?,?,?,?, ?, ?, ?)',
				[
					this.state.siteOfferDetails.nominationAiId,
					this.state.sealTypeName,
					this.state.sealTypeAiId,
					this.state.packageNo,
					this.state.packageTypeAiId,
					this.state.matSeriallDetails,
					this.state.sealNo,
					this.state.sealDetail,
					this.state.sealStartNo,
					this.state.sealEndNo
				]
			);
			this.setState(
				{
					sealTypeName: null,
					sealTypeAiId: null,
					packageNo: null,
					packageTypeAiId: null,
					matSeriallDetails: null,
					sealNo: null,
					sealDetail: null,
					sealStartNo: null,
					sealEndNo: null,
					formVisible: false,
					sealModalVisible: false
				},
				() => this.getSealDetails()
			);
		});
	}

	getSealDetails() {
		this.setState({ sealData: [] });
		db.transaction(tx => {
			tx.executeSql(
				'SELECT * FROM sealDetails ORDER BY id desc',
				[],
				(tx, results) => {
					var len = results.rows.length;
					for (let i = 0; i < len; i++) {
						let row = results.rows.item(i);
						if (row.nominationAiId == this.state.siteOfferDetails.nominationAiId) {
							this.setState({
								sealData: [
									...this.state.sealData,
									{
										nominationAiId: row.nominationAiId,
										sealTypeName: row.sealTypeName,
										sealTypeAiId: row.sealTypeAiId,
										packageNo: row.packageNo,
										packageTypeAiId: row.packageTypeAiId,
										matSeriallDetails: row.matSeriallDetails,
										sealNo: row.sealNo,
										sealDetail: row.sealDetail,
										sealStartNo: row.sealStartNo,
										sealEndNo: row.sealEndNo
									}
								],
								formVisible: false,
								isRefreshing: false
							});
						}
					}
				},
				function (error) {
					//alert(JSON.stringify(error));
					this.setState({ isRefreshing: false });
				}
			);
		});
	}

	onFinalSubmit() {
		let array = this.state.sealData;
		//alert(array.length)
		for (var i = 0; i < array.length; i++) {
			let Details = {
				sealTypeAiId: array[i].sealTypeAiId,
				sealTypeName: array[i].sealTypeName,
				sealStartNo: array[i].sealStartNo,
				sealEndNo: array[i].sealEndNo,
				packageNo: array[i].packageNo,
				packageTypeAiId: array[i].packageTypeAiId,
				matSerialDetails: array[i].matSeriallDetails,
				numberOfSeals: array[i].sealNo,
				sealDetails: array[i].sealDetail,
				woAiId: this.state.siteOfferDetails.vendorWoAiId,
				siteOfferAiId: this.state.siteOfferDetails.inspectionSiteAiId,
				inspectorAiId: this.state.siteOfferDetails.inspectorAiId
			};
			this.state.sealItems.push(Details);
			//alert(JSON.stringify(Details));
		}
	}

	upLoad() {
		this.setState({ isRefreshing: true });
		let Details = this.state.sealItems;
		APIManager.uploadSealDetails(
			Details,
			this.props.navigation.state.params.from,
			responseJson => {
				//	alert(JSON.stringify(responseJson));
				if (responseJson.status == 'SUCCESS') {
					this.uploadTestStatus();
					// const array = [...this.state.sealData]
					//    const index = this.state.itemIndex
					//    array.splice(i, 1);
					//     this.setState({isRefreshing:false})
				} else {
					alert('Please Try Again');
					this.setState({ isRefreshing: false });
				}
			},
			error => {
				this.setState({ isRefreshing: false });
				console.log(JSON.stringify(error));
			}
		);
	}

	onSubmit() {
		this.onFinalSubmit();
		Alert.alert(
			'Are you sure ?',
			'you want to Submit seal details',
			[
				{ text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
				{ text: 'OK', onPress: () => this.upLoad() }
			],
			{ cancelable: true }
		);
		return true;
	}

	uploadTestStatus() {
		this.setState({ isloading: true });
		const Details = {
			inspectionSiteAiId: this.state.siteOfferDetails.inspectionSiteAiId,
			siteInspectionStatus: '1',
			siteInspectionStatusRemarks: '1',
			siteInspectionStage: '1',
			siteInspectionForm9: ''
		};

		//alert(JSON.stringify(Details));
		APIManager.uploadTestStatus(
			Details,
			this.props.navigation.state.params.from,
			responseJson => {
				console.log(JSON.stringify(responseJson));
				if (responseJson.status == 'SUCCESS') {
					this.setState({ isloading: false, itemConsumeModel: false, pdfLink: responseJson.data.file }, () => {
						this.downloadPDF();
					});
				} else {
					this.setState({ isloading: false });
				}
			},
			error => {
				this.setState({ isloading: false });
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
		const dirs = RNFetchBlob.fs.dirs;

		const { config, fs } = RNFetchBlob;
		let PictureDir = fs.dirs.PictureDir;

		RNFetchBlob.config({
			fileCache: true,
			addAndroidDownloads: {
				notification: true,
				title: 'VSS Form 9 ',
				description: 'An PDF file.',
				mediaScannable: true,
				useDownloadManager: true,
				mime: 'application/pdf',
				path: PictureDir + '/Form9.pdf'
			}
		})
			.fetch('GET', APIManager.host + res, { Authorization: Basic })
			.then(resp => {
				if (Platform.OS == 'ios') {
					Linking.openURL(APIManager.host + res).catch(err => console.error('An error occurred', err));
				} else {
					Alert.alert('Form 9 PDF Downloaded Successfuly');
				}

				this.props.navigation.push('HomeScreen');
				this.setState({ isRefreshing: false, isRefreshing2: false });
				db.transaction(tx => {
					tx.executeSql('DROP TABLE sealDetails');
				});
			})
			.catch(error => {
				if (Platform.OS == 'ios') {
					Linking.openURL(res).catch(err => console.error('An error occurred', err));
				} else {
					Alert.alert('Form 9 PDF Downloaded Successfuly');
				}
				this.props.navigation.push('HomeScreen');
				this.setState({ isRefreshing: false, isRefreshing2: false });
				db.transaction(tx => {
					tx.executeSql('DROP TABLE sealDetails');
				});
			});
	}

	packageType() {
		ActionSheetIOS.showActionSheetWithOptions(
			{
				options: packageType
			},
			buttonIndex => {
				this.setState({
					packageTypeAiId: this.state.packageDetails[buttonIndex].packageTypeAiId,
					packageTypeName: this.state.packageDetails[buttonIndex].packageType
				});
			}
		);
	}

	sealType() {
		ActionSheetIOS.showActionSheetWithOptions(
			{
				options: sealType
			},
			buttonIndex => {
				this.setState({ sealTypeAiId: buttonIndex, sealTypeName: this.state.sealDetails[buttonIndex].sealType });
			}
		);
	}

	render() {
		var { height, width } = Dimensions.get('window');

		const pickerItems = this.state.sealDetails.map((item, key) => {
			return <Picker.Item label={item.sealType} value={item.sealType} key={key} />;
		});
		pickerItems.unshift(<Picker.Item key="" label="----Select Seal Type----" value="" />);

		const packageItems = this.state.packageDetails.map((item, key) => {
			return <Picker.Item label={item.packageType} value={item.packageTypeAiId} key={key} />;
		});
		packageItems.unshift(<packageItems.Item key="" label="----Select Package Type----" value="" />);

		return (
			<ImageBackground source={require('../Images/background.png')} style={{ width: '100%', height: '100%' }}>
				<ScrollView>
					<KeyboardAvoidingView style={{ flex: 1 }} behavior="padding" enabled>
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
									Seal Details
								</Text>
							</View>
						</View>

						{this.state.sealData.length > 0 ? (
							<FlatList
								data={this.state.sealData}
								keyExtractor={item => item.index}
								renderItem={({ item, index }) => (
									<View style={{ margin: 15, borderRadius: 5, elevation: 8, backgroundColor: '#ffffff', padding: 15 }}>
										<View style={{ flexDirection: 'row' }}>
											<View style={{ width: '50%' }}>
												<Text style={{ color: '#000000', fontFamily: 'GoogleSans-Medium', fontSize: 15 }}>
													Package No. :
												</Text>
												<Text style={{ color: '#000000', fontSize: 13 }}>{item.packageNo}</Text>
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
													Package Type
												</Text>
												<Text style={{ color: '#000000', fontSize: 13, textAlign: 'right' }}>
													{item.packageTypeAiId}
												</Text>
											</View>
										</View>

										<View style={{ flexDirection: 'row', marginTop: 10 }}>
											<View style={{ width: '50%' }}>
												<Text style={{ color: '#000000', fontFamily: 'GoogleSans-Medium', fontSize: 15 }}>
													Material Serial Details/Package
												</Text>
												<Text style={{ color: '#000000', fontSize: 13 }}>{item.matSeriallDetails}</Text>
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
													Seal Type
												</Text>
												<Text style={{ color: '#000000', fontSize: 13, textAlign: 'right' }}>{item.sealTypeName}</Text>
											</View>
										</View>

										<View style={{ flexDirection: 'row', marginTop: 10 }}>
											<View style={{ width: '50%' }}>
												<Text style={{ color: '#000000', fontFamily: 'GoogleSans-Medium', fontSize: 15 }}>
													No of Seals
												</Text>
												<Text style={{ color: '#000000', fontSize: 13 }}>{item.sealNo}</Text>
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
													Seal Details
												</Text>
												<Text style={{ color: '#000000', fontSize: 13, textAlign: 'right' }}>{item.sealDetail}</Text>
											</View>
										</View>

										<View style={{ flexDirection: 'row', marginTop: 10 }}>
											<View style={{ width: '50%' }}>
												<Text style={{ color: '#000000', fontFamily: 'GoogleSans-Medium', fontSize: 15 }}>
													Seal Start No
												</Text>
												<Text style={{ color: '#000000', fontSize: 13 }}>{item.sealStartNo}</Text>
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
													Seal End No
												</Text>
												<Text style={{ color: '#000000', fontSize: 13, textAlign: 'right' }}>{item.sealEndNo}</Text>
											</View>
										</View>
									</View>
								)}
							/>
						) : null}

						{this.state.formVisible == true ? (
							<View style={{ borderRadius: 5, backgroundColor: '#ffffff', padding: 15, elevation: 8, margin: 15 }}>
								<View style={{ flexDirection: 'row', marginTop: 10 }}>
									<Text
										style={{
											color: 'black',
											textAlign: 'center',
											width: '40%',
											fontFamily: 'GoogleSans-Medium',
											paddingTop: 10
										}}
									>
										Package No. :
									</Text>

									<TextInput
										style={{ width: '60%', borderBottomWidth: 1, borderColor: '#ff7f00', padding: 10 }}
										onChangeText={packageNo => this.setState({ packageNo })}
										value={this.state.packageNo}
										underlineColorAndroid="transparent"
									/>
								</View>

								{Platform.OS === 'ios' ? (
									<TouchableOpacity
										style={{ height: 40, padding: 10, borderWidth: 1, borderColor: '#ff7f00', marginTop: 15 }}
										onPress={() => {
											this.packageType();
										}}
									>
										<Text>{this.state.packageTypeName}</Text>
									</TouchableOpacity>
								) : (
									<View style={{ borderWidth: 1, borderColor: '#ff7f00', marginTop: 20 }}>
										<Picker
											selectedValue={this.state.packageTypeAiId}
											style={{ height: 40, width: '100%' }}
											mode="dropdown"
											onValueChange={(itemValue, itemIndex) => this.setState({ packageTypeAiId: itemValue })}
										>
											{packageItems}
										</Picker>
									</View>
								)}

								<View style={{ flexDirection: 'row', marginTop: 15 }}>
									<Text
										style={{
											color: 'black',
											textAlign: 'center',
											width: '40%',
											fontFamily: 'GoogleSans-Medium',
											paddingTop: 10
										}}
									>
										Material Serial Details/Package :
									</Text>

									<TextInput
										style={{ width: '60%', borderBottomWidth: 1, borderColor: '#ff7f00', padding: 10 }}
										onChangeText={matSeriallDetails => this.setState({ matSeriallDetails })}
										value={this.state.matSeriallDetails}
										underlineColorAndroid="transparent"
									/>
								</View>

								{Platform.OS === 'ios' ? (
									<TouchableOpacity
										style={{ height: 40, padding: 10, borderWidth: 1, borderColor: '#ff7f00', marginTop: 15 }}
										onPress={() => {
											this.sealType();
										}}
									>
										<Text>{this.state.sealTypeName}</Text>
									</TouchableOpacity>
								) : (
									<View style={{ borderWidth: 1, borderColor: '#ff7f00', marginTop: 20 }}>
										<Picker
											selectedValue={this.state.sealTypeName}
											style={{ height: 40, width: '100%' }}
											mode="dropdown"
											onValueChange={(itemValue, itemIndex) =>
												this.setState({ sealTypeAiId: itemIndex, sealTypeName: itemValue })
											}
										>
											{pickerItems}
										</Picker>
									</View>
								)}

								<View style={{ flexDirection: 'row', marginTop: 15 }}>
									<Text
										style={{
											color: 'black',
											textAlign: 'center',
											width: '40%',
											fontFamily: 'GoogleSans-Medium',
											paddingTop: 10
										}}
									>
										No of Seals :
									</Text>

									<TextInput
										style={{ width: '60%', borderBottomWidth: 1, borderColor: '#ff7f00', padding: 10 }}
										onChangeText={sealNo => this.setState({ sealNo })}
										value={this.state.sealNo}
										underlineColorAndroid="transparent"
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
										Seal Start No. :
									</Text>

									<TextInput
										style={{ width: '60%', borderBottomWidth: 1, borderColor: '#ff7f00', padding: 10 }}
										onChangeText={sealStartNo => this.setState({ sealStartNo })}
										value={this.state.sealStartNo}
										underlineColorAndroid="transparent"
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
										Seal End No. :
									</Text>

									<TextInput
										style={{ width: '60%', borderBottomWidth: 1, borderColor: '#ff7f00', padding: 10 }}
										onChangeText={sealEndNo => this.setState({ sealEndNo })}
										value={this.state.sealEndNo}
										underlineColorAndroid="transparent"
									/>
								</View>

								<View style={{ flexDirection: 'row', marginTop: 15 }}>
									<Text
										style={{
											color: 'black',
											textAlign: 'center',
											width: '40%',
											fontFamily: 'GoogleSans-Medium',
											paddingTop: 10
										}}
									>
										Seal Details :
									</Text>

									<TextInput
										style={{ width: '60%', borderBottomWidth: 1, borderColor: '#ff7f00', padding: 10 }}
										onChangeText={sealDetail => this.setState({ sealDetail })}
										value={this.state.sealDetail}
										underlineColorAndroid="transparent"
									/>
								</View>

								<View style={{ marginTop: 10, alignItems: 'center' }}>
									<TouchableOpacity onPress={() => this.onSave()} style={styles.button}>
										<Text style={styles.buttonText}>SAVE</Text>
									</TouchableOpacity>
								</View>
							</View>
						) : null}

						<View style={{ flexDirection: 'row' }}>
							<View style={{ alignItems: 'center', width: '50%' }}>
								{this.state.sealData.length > 0 ? (
									<TouchableOpacity
										onPress={() => this.setState({ sealModalVisible: true })}
										style={{
											borderRadius: 5,
											backgroundColor: '#418bca',
											marginVertical: 20,
											paddingVertical: 10,
											paddingHorizontal: 20
										}}
									>
										<Text style={styles.buttonText}>Add More</Text>
									</TouchableOpacity>
								) : null}
							</View>

							<View style={{ alignItems: 'center', width: '50%' }}>
								{this.state.sealData.length > 0 ? (
									<TouchableOpacity
										onPress={() => this.onSubmit()}
										style={{
											borderRadius: 5,
											backgroundColor: '#418bca',
											marginVertical: 20,
											paddingVertical: 10,
											paddingHorizontal: 20
										}}
									>
										<Text style={styles.buttonText}>Submit</Text>
									</TouchableOpacity>
								) : null}
							</View>
						</View>

						<Modal
							transparent={true}
							visible={this.state.sealModalVisible}
							onRequestClose={() => {
								this.setState({ sealModalVisible: false });
							}}
						>
							<View
								onPress={() => this.setState({ sealModalVisible: false })}
								style={{ flex: 1, alignItems: 'center', backgroundColor: '#00000080' }}
							>
								{this.state.isRefreshing == false ? (
									<ScrollView showsVerticalScrollIndicator={false}>
										<View
											style={{
												width: width * 0.9,
												backgroundColor: '#ffffff',
												borderRadius: 10,
												padding: 15,
												marginTop: 20
											}}
										>
											<Text
												style={{
													fontSize: 20,
													fontFamily: 'GoogleSans-Medium',
													marginTop: 10,
													color: '#ff7f00',
													textAlign: 'center'
												}}
											>
												Seal Details
											</Text>

											<View style={{ flexDirection: 'row', marginTop: 10 }}>
												<Text
													style={{
														color: 'black',
														textAlign: 'center',
														width: '40%',
														fontFamily: 'GoogleSans-Medium',
														paddingTop: 10
													}}
												>
													Package No. :
												</Text>

												<TextInput
													style={{ width: '60%', borderBottomWidth: 1, borderColor: '#ff7f00', padding: 10 }}
													onChangeText={packageNo => this.setState({ packageNo })}
													value={this.state.packageNo}
													underlineColorAndroid="transparent"
												/>
											</View>

											{Platform.OS === 'ios' ? (
												<TouchableOpacity
													style={{ height: 40, padding: 10, borderWidth: 1, borderColor: '#ff7f00', marginTop: 15 }}
													onPress={() => {
														this.packageType();
													}}
												>
													<Text>{this.state.packageTypeName}</Text>
												</TouchableOpacity>
											) : (
												<View style={{ borderWidth: 1, borderColor: '#ff7f00', marginTop: 20 }}>
													<Picker
														selectedValue={this.state.packageTypeAiId}
														style={{ height: 40, width: '100%' }}
														mode="dropdown"
														onValueChange={(itemValue, itemIndex) => this.setState({ packageTypeAiId: itemValue })}
													>
														{packageItems}
													</Picker>
												</View>
											)}

											<View style={{ flexDirection: 'row', marginTop: 15 }}>
												<Text
													style={{
														color: 'black',
														textAlign: 'center',
														width: '40%',
														fontFamily: 'GoogleSans-Medium',
														paddingTop: 10
													}}
												>
													Material Serial Details/Package :
												</Text>

												<TextInput
													style={{ width: '60%', borderBottomWidth: 1, borderColor: '#ff7f00', padding: 10 }}
													onChangeText={matSeriallDetails => this.setState({ matSeriallDetails })}
													value={this.state.matSeriallDetails}
													underlineColorAndroid="transparent"
												/>
											</View>

											{Platform.OS === 'ios' ? (
												<TouchableOpacity
													style={{ height: 40, padding: 10, borderWidth: 1, borderColor: '#ff7f00', marginTop: 15 }}
													onPress={() => {
														this.sealType();
													}}
												>
													<Text>{this.state.sealTypeName}</Text>
												</TouchableOpacity>
											) : (
												<View style={{ borderWidth: 1, borderColor: '#ff7f00', marginTop: 20 }}>
													<Picker
														selectedValue={this.state.sealTypeName}
														style={{ height: 40, width: '100%' }}
														mode="dropdown"
														onValueChange={(itemValue, itemIndex) =>
															this.setState({ sealTypeAiId: itemIndex, sealTypeName: itemValue })
														}
													>
														{pickerItems}
													</Picker>
												</View>
											)}

											<View style={{ flexDirection: 'row', marginTop: 15 }}>
												<Text
													style={{
														color: 'black',
														textAlign: 'center',
														width: '40%',
														fontFamily: 'GoogleSans-Medium',
														paddingTop: 10
													}}
												>
													No of Seals :
												</Text>

												<TextInput
													style={{ width: '60%', borderBottomWidth: 1, borderColor: '#ff7f00', padding: 10 }}
													onChangeText={sealNo => this.setState({ sealNo })}
													value={this.state.sealNo}
													underlineColorAndroid="transparent"
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
													Seal Start No. :
												</Text>

												<TextInput
													style={{ width: '60%', borderBottomWidth: 1, borderColor: '#ff7f00', padding: 10 }}
													onChangeText={sealStartNo => this.setState({ sealStartNo })}
													value={this.state.sealStartNo}
													underlineColorAndroid="transparent"
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
													Seal End No. :
												</Text>

												<TextInput
													style={{ width: '60%', borderBottomWidth: 1, borderColor: '#ff7f00', padding: 10 }}
													onChangeText={sealEndNo => this.setState({ sealEndNo })}
													value={this.state.sealEndNo}
													underlineColorAndroid="transparent"
												/>
											</View>

											<View style={{ flexDirection: 'row', marginTop: 15 }}>
												<Text
													style={{
														color: 'black',
														textAlign: 'center',
														width: '40%',
														fontFamily: 'GoogleSans-Medium',
														paddingTop: 10
													}}
												>
													Seal Details :
												</Text>

												<TextInput
													style={{ width: '60%', borderBottomWidth: 1, borderColor: '#ff7f00', padding: 10 }}
													onChangeText={sealDetail => this.setState({ sealDetail })}
													value={this.state.sealDetail}
													underlineColorAndroid="transparent"
												/>
											</View>

											<View style={{ marginTop: 10, alignItems: 'center' }}>
												<TouchableOpacity onPress={() => this.onSave()} style={styles.button}>
													<Text style={styles.buttonText}>SAVE</Text>
												</TouchableOpacity>
											</View>

											<TouchableOpacity
												onPress={() => this.setState({ sealModalVisible: false })}
												style={{ position: 'absolute', top: 0, right: 5 }}
											>
												<Icon name="x" size={25} color="black" />
											</TouchableOpacity>
										</View>
									</ScrollView>
								) : (
									<View style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}>
										<ActivityIndicator size="large" color="orange" />
										<Text style={{ color: '#ffffff', fontSize: 12 }}>Please Wait, Form-9 is Generating </Text>
									</View>
								)}
							</View>
						</Modal>

						<Modal
							//animationType="slide"
							transparent={true}
							visible={this.state.itemConsumeModel}
							onRequestClose={() => {
								this.setState({ itemConsumeModel: false });
							}}
						>
							<View
								onPress={() => this.setState({ itemConsumeModel: false })}
								style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#00000080' }}
							>
								<View
									style={{
										width: '80%',
										backgroundColor: '#ffffff',
										padding: 15,
										borderRadius: 10,
										justifyContent: 'center'
									}}
								>
									<Text style={{ color: '#000000', fontSize: 18 }}>Do you want to add seal details ?</Text>

									<View style={{ flexDirection: 'row' }}>
										<CheckBox
											value={this.state.check == 0 ? true : false}
											onValueChange={() => this.setState({ check: 0 })}
										/>
										<Text>Yes</Text>
									</View>
									<View style={{ flexDirection: 'row' }}>
										<CheckBox
											value={this.state.check == 1 ? true : false}
											onValueChange={() => this.setState({ check: 1 })}
										/>
										<Text>No</Text>
									</View>
									{this.state.isloading == true ? (
										<ActivityIndicator size="large" color="orange" />
									) : (
										<TouchableOpacity
											onPress={() =>
												this.state.check == 0 ? this.setState({ itemConsumeModel: false }) : this.uploadTestStatus()
											}
											style={{ borderRadius: 5, backgroundColor: '#ff7f00', marginTop: 15 }}
										>
											<Text style={{ fontSize: 15, color: '#ffffff', paddingVertical: 12, textAlign: 'center' }}>
												Submit
											</Text>
										</TouchableOpacity>
									)}
								</View>
							</View>
						</Modal>
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
		padding: 10,
		fontFamily: 'GoogleSans-Medium',
		color: '#ffffff',
		textAlign: 'center',
		borderRightColor: 'lightgrey',
		borderRightWidth: 1
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
		marginVertical: 20,
		paddingVertical: 10,
		paddingHorizontal: 20
	},
	buttonText: {
		fontSize: 18,
		color: '#ffffff',
		fontFamily: 'GoogleSans-Medium'
	}
});
