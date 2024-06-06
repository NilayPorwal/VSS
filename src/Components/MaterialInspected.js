import React, { Component } from 'react';
import {
	Platform,
	StyleSheet,
	Text,
	View,
	Image,
	TouchableOpacity,
	TouchableWithoutFeedback,
	KeyboardAvoidingView,
	ActionSheetIOS,
	ScrollView,
	ImageBackground,
	FlatList,
	BackHandler,
	Alert,
	Picker,
	Dimensions,
	Modal,
	TextInput,
	ActivityIndicator,
	Loader,
	ToastAndroid,
	CheckBox
} from 'react-native';
import APIManager from './Managers/APIManager';
import Icon from 'react-native-vector-icons/Feather';
import RNFetchBlob from 'react-native-fetch-blob';
import { Base64 } from 'js-base64';
import DocumentPicker from 'react-native-document-picker';
import ImagePicker from 'react-native-image-picker';
import { getData, removeData } from '../helper';
var RNFS = require('react-native-fs');

global.MaterialInspected;

const unitName = [];

export default class MaterialInspected extends Component {
	constructor(props) {
		super(props);
		this.state = {
			newMatSeries: [],
			matSeries: [],
			page: 0,
			serialNo: '',
			ModalVisible: false,
			test: [],
			addSrNo: false,
			isLoading: false,
			isLoading2: false,
			isRefreshing: false,
			isRefreshing2: false,
			isRefreshing3: false,
			isRefreshing4: false,
			matSeries2: [],
			siteInspectionStatus: null,
			siteOfferDetails: this.props.navigation.state.params.siteOfferDetails,
			matSrNo: '',
			testCount: 0,
			sealModalVisible: false,
			sealStartNo: null,
			sealEndNo: null,
			sealTypeName: null,
			sealTypeAiId: null,
			sealDetails: [],
			packageNo: null,
			packageTypeAiId: null,
			matSeriallDetails: null,
			sealNo: null,
			sealDetail: null,
			packageDetails: [],
			itemConsumeModel: false,
			itemConsumeType: '0',
			itemConsumeQty: null,
			unitList: [],
			unitName: '---Select Unit---',
			unitShortName: null,
			unitAiId: null,
			isConsume: false,
			check: 0,
			image: [],
			imageData: null,
			itemConsumeModel1: false,
			itemConsumeUnit: null,
			itemConsumeModel1: null,
			isObservb: 0
		};
		// alert(JSON.stringify(this.props.navigation.state.params.siteOfferDetails))
		global.MaterialInspected = this;
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
		this.getPackageTypeList();
		this.getMaterialSeries();
		this.getSealTypeList();
		this.getUnitList();
		BackHandler.addEventListener('hardwareBackPress', global.MaterialInspected.handleAndroidBackButton);
	}

	componentWillUnmount() {
		BackHandler.removeEventListener('hardwareBackPress', global.MaterialInspected.handleAndroidBackButton);
	}

	_count() {
		let series = this.state.matSeries;
		for (var i = 0; i < series.length; i++) {
			if (series[i].itemInspectionStatus == '2' || series[i].itemInspectionStatus == '3') {
				this.setState({ testCount: i + 1 });
			}
		}
	}

	handleAndroidBackButton() {
		Alert.alert(
			'Are you sure ?',
			'you wants to go back ',
			[
				{ text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
				{ text: 'OK', onPress: () => global.MaterialInspected.props.navigation.goBack() }
			],
			{ cancelable: true }
		);
		return true;
	}

	addRecords = page => {
		const newRecords = [];
		for (var i = page * 3, j = i + 3; i < j && i < this.state.matSeries.length; i++) {
			newRecords.push(this.state.matSeries[i]);
		}
		this.setState({
			newMatSeries: [...newRecords]
		});
	};

	onNextClick() {
		if (this.state.page != Math.round(this.state.matSeries.length / 3)) {
			this.setState(
				{
					page: this.state.page + 1
				},
				() => {
					this.addRecords(this.state.page);
				}
			);
		}
	}

	onPrevClick() {
		if (this.state.page != 0)
			this.setState(
				{
					page: this.state.page - 1
				},
				() => {
					this.addRecords(this.state.page);
				}
			);
	}

	getMaterialSeries() {
		const Details = JSON.stringify({
			vendorAiId: this.state.siteOfferDetails.vendorAiId,
			woAiId: this.state.siteOfferDetails.vendorWoAiId,
			materialAiId: this.state.siteOfferDetails.materialAiId,
			materialSubcategoryAiId: this.state.siteOfferDetails.materialSubcategoryAiId
		});
		//alert(this.state.siteOfferDetails.inspectionSiteAiId)
		APIManager.getMaterialSeries(
			Details,
			this.state.siteOfferDetails.inspectionSiteAiId,
			responseJson => {
				//alert(JSON.stringify(responseJson));
				if (responseJson.status == 'SUCCESS') {
					this.setState({ matSeries: responseJson.data, page: 0 }, () => {
						this._count();
					});
				}
			},
			error => {
				console.log(error);
			}
		);
	}

	onSubmitSrNo() {
		if (this.state.serialNo !== '') {
			this.setState({ isLoading: true });
			const Details = JSON.stringify({
				vendorAiId: this.state.siteOfferDetails.vendorAiId,
				woAiId: this.state.siteOfferDetails.vendorWoAiId,
				materialAiId: this.state.siteOfferDetails.materialAiId,
				materialSubcategoryAiId: this.state.siteOfferDetails.materialSubcategoryAiId,
				materialSrNo: this.state.serialNo,
				itemInspectionStatus: '0',
				inspectionRemarks: ''
			});

			APIManager.addMaterialSeries(
				Details,
				this.state.siteOfferDetails.inspectionSiteAiId,
				responseJson => {
					//alert(JSON.stringify(responseJson));
					if (responseJson.status == 'SUCCESS') {
						this.getMaterialSeries();
						this.setState({ serialNo: '', ModalVisible: false, isLoading: false });
					} else {
						this.setState({ isLoading: false });
						alert('Please try to add serial number again');
					}
				},
				error => {
					console.log(error);
				}
			);
		} else {
			alert('Please add serial number');
		}
	}

	onAddMatSrNo() {
		if (this.state.matSeries.length < this.state.siteOfferDetails.samplingItemCount) {
			this.setState({ ModalVisible: true });
		} else if (this.state.siteOfferDetails.samplingItemCount == null) {
			Alert.alert('Wait', 'maximum sampling count is ' + 0);
		} else {
			Alert.alert('Wait', 'maximum sampling count is ' + this.state.siteOfferDetails.samplingItemCount);
		}
	}

	onStartInsp(item) {
		const Details = JSON.stringify({
			inspectionMatAiId: item.inspectionMatAiId,
			itemInspectionStatus: '1',
			inspectionRemarks: 'xxxxxx'
		});
		//alert(Details)
		APIManager.updateMatInspStatus(
			Details,
			responseJson => {
				//  alert(JSON.stringify(responseJson));
				if (responseJson.status == 'SUCCESS') {
					this.onStart(item);
					this.setState({ isLoading2: false });
				} else {
					this.setState({ isLoading: false, isLoading2: false });
					alert('Please try again');
				}
			},
			error => {
				console.log(error);
			}
		);
	}

	onStart = item => {
		this.props.navigation.push('Inspection', {
			// onGoBack: () => this._comingBack(),
			onBack: () => this.getMaterialSeries(),
			siteOfferDetails: this.state.siteOfferDetails,
			materialDetails: item
		});
	};

	_comingBack() {
		let count = parseInt(this.state.testCount);
		let addCount = count + 1;
		this.setState({ testCount: addCount }, () => {
			this.setCount();
		});
	}

	async setCount() {
		await this.getMaterialSeries();
		await getData('count', this.state.testCount.toString());
	}

	uploadTestStatus() {
		const Details = {
			inspectionSiteAiId: this.state.siteOfferDetails.inspectionSiteAiId,
			siteInspectionStatus: this.state.siteInspectionStatus,
			siteInspectionStatusRemarks: '1',
			siteInspectionStage: '1',
			siteInspectionForm9: ''
		};

		//alert(JSON.stringify(Details));
		APIManager.uploadTestStatus(
			Details,
			responseJson => {
				// alert(JSON.stringify(responseJson));
				if (responseJson.status == 'SUCCESS') {
					this.removeVendorData();
					if (this.state.siteInspectionStatus == 1) {
						this.setState({ pdfLink: responseJson.data.file }, () => {
							this.downloadPDF();
						});
					} else {
						this.props.navigation.push('HomeScreen');
					}
				} else {
					this.setState({ isRefreshing: false });
				}
			},
			error => {
				console.log(error);
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
			.then(res => {
				alert('Form 9 PDF Downloaded Successfuly');
				this.props.navigation.push('HomeScreen');
				this.setState({ isRefreshing: false, isRefreshing2: false });
			})
			.catch(error => {
				alert('Form 9 PDF Downloaded Successfuly');
				this.props.navigation.push('HomeScreen');
				this.setState({ isRefreshing: false, isRefreshing2: false });
			});
	}

	onPassTest() {
		this.setState({ siteInspectionStatus: 1 }, () => {
			this.uploadTestStatus();
		});
	}

	onPassConfirmation() {
		Alert.alert(
			'Are you sure ?',
			'You Wants To Pass The Material ',
			[
				{ text: 'No', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
				{ text: 'Yes', onPress: () => this.onPassTest() }
			],
			{ cancelable: true }
		);
		return true;
	}

	onFailTest() {
		this.setState({ siteInspectionStatus: 2, isRefreshing2: true }, () => {
			this.UploadDocument(2);
		});
	}

	onFailConfirmation() {
		if (this.state.image.length == 0) {
			return Alert.alert('Document Required');
		}
		Alert.alert(
			'Are you sure ?',
			'You Wants To Fail The Material ',
			[
				{ text: 'No', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
				{ text: 'Yes', onPress: () => this.onFailTest() }
			],
			{ cancelable: true }
		);
		return true;
	}

	UploadDocument(status) {
		const Details = {
			nominationAiId: this.state.siteOfferDetails.nominationAiId,
			inspectionSiteAiId: this.state.siteOfferDetails.inspectionSiteAiId,
			inspectionReportDocPath: this.state.image[0].imageData,
			inspectionStage: status,
			extn: this.state.image[0].type
		};
		//alert(Details)
		APIManager.UploadDocument(
			Details,
			responseJson => {
				console.log(JSON.stringify(responseJson));
				if (responseJson.status == 'SUCCESS') {
					if (status == 1) {
						this.setState({
							isLoading: false,
							itemConsumeModel: false,
							itemConsumeQty: null,
							itemConsumeUnit: null,
							itemRemQty: null
						});
						this.props.navigation.push('SealDetails', { siteOfferDetails: this.state.siteOfferDetails });
					} else {
						this.uploadTestStatus();
					}
				} else {
					this.setState({ isLoading: false, isLoading2: false });
					Alert.alert('Failed to upload document');
				}
			},
			error => {
				console.log(error);
				this.setState({ isLoading: false });
				Alert.alert('Failed to upload document');
			}
		);
	}

	async removeVendorData() {
		await removeData('insId');
		await removeData('vndrId');
		await removeData('woId');
		await removeData('matId');
		await removeData('matscId');
		await removeData('count');
	}

	onFinalSubmit() {
		this.setState({ isRefreshing: true });
		let Details = {
			sealTypeAiId: this.state.sealTypeAiId,
			sealTypeName: this.state.sealTypeName,
			sealStartNo: this.state.sealDetail,
			sealEndNo: '0',
			packageNo: this.state.packageNo,
			packageTypeAiId: this.state.packageTypeAiId,
			matSerialDetails: this.state.matSeriallDetails,
			numberOfSeals: this.state.sealNo,
			sealDetails: this.state.sealDetail,
			woAiId: this.state.siteOfferDetails.vendorWoAiId,
			siteOfferAiId: this.state.siteOfferDetails.inspectionSiteAiId,
			inspectorAiId: this.state.siteOfferDetails.inspectorAiId
		};

		//alert(JSON.stringify(Details));
		APIManager.uploadSealDetails(
			Details,
			responseJson => {
				//	alert(JSON.stringify(responseJson));
				if (responseJson.status == 'SUCCESS') {
					this.onPassTest();
				} else {
					//alert("Please Try Again")
					this.setState({ isRefreshing: false });
				}
			},
			error => {
				console.log(error);
			}
		);
	}

	deleteRecord(item) {
		Alert.alert(
			'Are you sure ?',
			'You wants to delete this record ',
			[
				{ text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
				{ text: 'OK', onPress: () => this.deleteMaterialSeries(item) }
			],
			{ cancelable: true }
		);
		return true;
	}

	deleteMaterialSeries(item) {
		APIManager.deleteMaterialSeries(item.inspectionMatAiId, responseJson => {
			// alert(JSON.stringify(responseJson));
			if (responseJson.status == 'SUCCESS') {
				// this.setState({matSeries:responseJson.data, page: 0},()=>{this._count()} )
				this.getMaterialSeries();
				ToastAndroid.show('Record Deleted Successfuly !', ToastAndroid.CENTER);
			} else {
				ToastAndroid.show('Please Try Again!', ToastAndroid.CENTER);
			}
		});
	}

	getSealTypeList() {
		APIManager.getSealTypeList(responseJson => {
			//alert(JSON.stringify(responseJson));
			if (responseJson.status == 'SUCCESS') {
				this.setState({ sealDetails: responseJson.data });
			}
		});
	}

	getPackageTypeList() {
		APIManager.getPackageTypeList(
			responseJson => {
				//alert(JSON.stringify(responseJson));
				if (responseJson.status == 'SUCCESS') {
					this.setState({ packageDetails: responseJson.data });
				}
			},
			error => {
				console.log(error);
			}
		);
	}

	checkForDispech() {
		//alert(this.state.siteOfferDetails.inspectionSiteAiId )
		// APIManager.checkForDispech(this.state.siteOfferDetails.inspectionSiteAiId,
		//(responseJson)=> {
		//console.log(JSON.stringify(responseJson));
		//if(responseJson.status == 'SUCCESS'){
		//this.setState({sealModalVisible:true})
		//this.setState({itemConsumeModel:true})
		// this.props.navigation.push('SealDetails', {siteOfferDetails:this.state.siteOfferDetails})
		//}
		// 	 else{
		// 	 	Alert.alert('Please Add ACOS Details')
		// 	 }
		//   })
		this.setState({ itemConsumeModel: true });
	}

	itemConsumeType() {
		ActionSheetIOS.showActionSheetWithOptions(
			{
				options: ['Completely', 'Partially']
			},
			buttonIndex => {
				if (buttonIndex == 0) {
					this.setState({ itemConsumeType: '0' });
				} else {
					this.setState({ itemConsumeType: '1' });
				}
			}
		);
	}

	getUnitList() {
		APIManager.getUnitList(
			this.state.siteOfferDetails.nominationAiId,
			responseJson => {
				//alert(JSON.stringify(responseJson));
				if (responseJson.status == 'SUCCESS') {
					this.setState({
						unitList: responseJson.data,
						unitShortName: responseJson.data[0].unitShortName,
						unitAiId: responseJson.data[0].unitAiId
					});
					for (let i = 0; i < responseJson.data.length; i++) {
						unitName.push(responseJson.data[i].unitName);
					}
				}
			},
			error => {
				console.log(error);
			}
		);
	}

	unitNameList() {
		ActionSheetIOS.showActionSheetWithOptions(
			{
				options: unitName
			},
			buttonIndex => {
				this.setState({
					unitShortName: this.state.unitList[buttonIndex].unitShortName,
					unitName: this.state.unitList[buttonIndex].unitName,
					unitAiId: this.state.unitList[buttonIndex].unitAiId
				});
			}
		);
	}

	isItemConsumed(type) {
		this.setState({ isLoading: true, isObservb: type });
		APIManager.isItemConsumed(
			this.state.siteOfferDetails.nominationAiId,
			responseJson => {
				console.log(JSON.stringify(responseJson));
				if (responseJson.status == 'SUCCESS') {
					this.setState({ isLoading: false });
					this.props.navigation.push('SealDetails', { siteOfferDetails: this.state.siteOfferDetails });
				} else {
					this.isItemConsumed1();
					// 	if(this.state.image.length == 0){
					// 		return Alert.alert("Document Required")
					//     }
					//    this.setState({itemConsumeModel:true})
				}
			},
			error => {
				this.setState({ isLoading: false });
				console.log(error);
			}
		);
	}

	isItemConsumed1() {
		APIManager.isItemConsumed1(
			this.state.siteOfferDetails.nominationAiId,
			responseJson => {
				console.log(JSON.stringify(responseJson));
				if (responseJson.status == 'SUCCESS') {
					this.setState({ isLoading: false });
					this.props.navigation.push('SealDetails', { siteOfferDetails: this.state.siteOfferDetails });
				} else {
					this.setState({ isLoading: false });
					if (this.state.image.length == 0) {
						return Alert.alert('Document Required');
					}
					this.setState({ itemConsumeModel: true });
				}
			},
			error => {
				this.setState({ isLoading: false });
				console.log(error);
			}
		);
	}

	onSubmitItemConsumes() {
		if (this.state.itemConsumeQty == null || this.state.itemConsumeUnit == null || this.state.itemRemQty == null) {
			return Alert.alert('Warning', 'Please fill Quantity details');
		}
		if (
			this.state.itemConsumeQty.trim() == '' ||
			this.state.itemConsumeUnit.trim() == '' ||
			this.state.itemRemQty.trim() == ''
		) {
			return Alert.alert('Warning', 'Please fill Quantity details');
		}
		if (this.state.itemRemQty.trim() > this.state.siteOfferDetails.offerQty) {
			return Alert.alert('Warning', 'Remaining quantity can not be more then Offer Quantity');
		}

		this.setState({ isLoading: true });
		let Details = {
			qtyConsumedAiId: '0',
			nominationAiId: this.state.siteOfferDetails.nominationAiId,
			inspectionSiteAiId: this.state.siteOfferDetails.inspectionSiteAiId,
			inspactMatAiId: '0',
			consumedQuantity: parseInt(this.state.itemConsumeQty),
			consumedUnit: this.state.itemConsumeUnit,
			remaingQty: parseInt(this.state.itemRemQty),
			isObservb: this.state.isObservb
		};

		console.log(JSON.stringify(Details));
		APIManager.onSubmitItemConsumes(
			Details,
			responseJson => {
				console.log(JSON.stringify(responseJson));
				if (responseJson.status == 'SUCCESS') {
					//  this.setState({itemConsumeModel:false, itemConsumeQty:null})
					//  this.props.navigation.push('SealDetails', {siteOfferDetails:this.state.siteOfferDetails})
					this.UploadDocument(1);
				} else {
					alert('Please Try Again');
					this.setState({ isLoading: false });
				}
			},
			error => {
				this.setState({ isLoading: false });
				console.log(error);
				Alert.alert('Failed to Update', 'Please Try Again');
			}
		);
	}

	//   onSubmitItemConsumes(){
	//   	if(this.state.itemConsumeType == "1"){

	//   	if(this.state.itemConsumeQty != null && this.state.unitShortName != null){
	//        let Details = {
	// 		    "nomnAiId":this.state.siteOfferDetails.nominationAiId,
	// 			"inspectionSiteAiId":this.state.siteOfferDetails.inspectionSiteAiId,
	// 			"consumedQuantity":this.state.itemConsumeQty,
	// 			"unitName":this.state.unitShortName,
	// 			"unitAiId":this.state.unitAiId,
	// 			"inspactMatAiId":"0",
	//             "consume":"P"
	//       }

	//  		//alert(JSON.stringify(Details));
	// 	 APIManager.onSubmitItemConsumes(Details,
	//         (responseJson)=> {
	// 			//alert(JSON.stringify(responseJson));
	// 		 if(responseJson.status == 'SUCCESS'){
	// 		 	 this.setState({itemConsumeModel:false, itemConsumeQty:null})
	// 		   //  this.props.navigation.push('SealDetails', {siteOfferDetails:this.state.siteOfferDetails})
	// 		   this.UploadDocument(1)
	// 		 }
	//           else{
	// 			 alert("Please Try Again")
	// 			  this.setState({isRefreshing:false})
	// 		  }
	//        }, (error)=>{
	//        	 console.log(error)
	//        })
	//     }
	//     else{
	//     	Alert.alert("Please fill Quantity details")
	//     }
	//    }
	//    else{
	//    	 let Details = {
	// 		    "nomnAiId":this.state.siteOfferDetails.nominationAiId,
	// 			"inspectionSiteAiId":this.state.siteOfferDetails.inspectionSiteAiId,
	// 			"consumedQuantity":null,
	// 			"unitName":null,
	// 			"unitAiId":null,
	// 			"inspactMatAiId":"0",
	//             "consume":"C"
	//       }

	//  		//alert(JSON.stringify(Details));
	// 	APIManager.onSubmitItemConsumes(Details,
	//         (responseJson)=> {
	// 			//alert(JSON.stringify(responseJson));
	// 		 if(responseJson.status == 'SUCCESS'){
	// 		 	 this.setState({itemConsumeModel:false, itemConsumeQty:null, unitShortName:null })
	// 		//	this.props.navigation.push('SealDetails', {siteOfferDetails:this.state.siteOfferDetails})
	// 			this.UploadDocument(1)
	// 		 }
	//           else{
	// 			 alert("Please Try Again")
	// 			  this.setState({isRefreshing:false})
	// 		  }
	//        }, (error)=>{
	//        	 console.log(error)
	//        })

	//    }

	//  }

	onUnitChange(value, index) {
		if (this.state.unitList.length > 0) {
			//alert(this.state.unitList[index].unitAiId)
			this.setState({
				unitShortName: value,
				unitName: this.state.unitList[index].unitName,
				unitAiId: this.state.unitList[index].unitAiId
			});
		}
	}

	onContinue() {
		if (this.state.check == 0) {
			this.setState({ isConsume: true });
		} else {
			let Details = {
				nomnAiId: this.state.siteOfferDetails.nominationAiId,
				inspectionSiteAiId: this.state.siteOfferDetails.inspectionSiteAiId,
				consumedQuantity: null,
				unitName: null,
				unitAiId: null,
				inspactMatAiId: '0',
				consume: 'N'
			};

			//alert(JSON.stringify(Details));
			APIManager.onSubmitItemConsumes(
				Details,
				responseJson => {
					//alert(JSON.stringify(responseJson));
					if (responseJson.status == 'SUCCESS') {
						this.setState({ itemConsumeModel: false, itemConsumeQty: null, unitShortName: null });
						this.setState({ itemConsumeModel: false, isConsume: false });
						this.UploadDocument(1);
						//this.props.navigation.push('SealDetails', {siteOfferDetails:this.state.siteOfferDetails})
					} else {
						alert('Please Try Again');
						this.setState({ isRefreshing: false });
					}
				},
				error => {
					console.log(error);
				}
			);
		}
	}

	async onDocPress() {
		if (this.state.image.length > 0) {
			Alert.alert('Only one document allowed');
			return;
		}
		try {
			const res = await DocumentPicker.pick({
				type: [DocumentPicker.types.pdf, DocumentPicker.types.images]
			});
			console.log('Response = ', res);
			RNFS.readFile(res.uri, 'base64').then(result => {
				console.log(result);
				const imgData = {
					imageData: result,
					type: res.type.split('/')[1]
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

	async onCamera() {
		if (this.state.image.length > 0) {
			Alert.alert('Only one document allowed');
			return;
		}
		var options = {
			title: 'Select Avatar',
			quality: 0.3,
			storageOptions: {
				path: 'images'
			}
		};
		ImagePicker.launchCamera(options, response => {
			console.log('Response = ', response);
			//alert(JSON.stringify(response))
			if (response.didCancel) {
				console.log('User cancelled image picker');
			} else if (response.error) {
				console.log('ImagePicker Error: ', response.error);
			} else {
				let source = response.uri;
				// let type = response.type.slice(6, 10)
				const imgData = {
					imageData: response.data,
					type: 'jpeg'
				};
				this.setState({ image: [...this.state.image, imgData] });
			}
		});
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
		var { height, width } = Dimensions.get('window');

		const pickerItems = this.state.sealDetails.map((item, key) => {
			return <Picker.Item label={item.sealType} value={item.sealType} key={key} />;
		});
		pickerItems.unshift(<Picker.Item key="" label="----Select Seal Type----" value="" />);

		const packageItems = this.state.packageDetails.map((item, key) => {
			return <Picker.Item label={item.packageType} value={item.packageTypeAiId} key={key} />;
		});
		packageItems.unshift(<packageItems.Item key="" label="----Select Package Type----" value="" />);

		const unitList = this.state.unitList.map((item, key) => {
			return <Picker.Item label={item.unitName} value={item.unitShortName} key={key} />;
		});

		return (
			<ImageBackground source={require('../Images/background.png')} style={{ width: '100%', height: '100%' }}>
				<View style={{ flexDirection: 'row' }}>
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
							MATERIAL TO BE INSPECTED
						</Text>
					</View>
				</View>

				<ScrollView showsVerticalScrollIndicator={false}>
					<View style={styles.container}>
						<View style={{ borderWidth: 1, margin: 15, padding: 15, backgroundColor: '#141F25', elevation: 8 }}>
							<View style={{ flexDirection: 'row' }}>
								<Text style={{ color: 'white', fontFamily: 'GoogleSans-Medium', width: '50%' }}>SITE OFFER ID</Text>
								<Text style={{ color: 'white', width: '50%', textAlign: 'right', flex: 1, flexWrap: 'wrap' }}>
									{this.state.siteOfferDetails.siteOfferUnqId}
								</Text>
							</View>

							<View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 }}>
								<Text style={{ color: 'white', fontFamily: 'GoogleSans-Medium', width: '50%' }}>
									Inspected Materials
								</Text>
								<Text style={{ color: 'white', width: '50%', textAlign: 'right' }}>
									{this.state.testCount}/
									{this.state.siteOfferDetails.samplingItemCount != null
										? this.state.siteOfferDetails.samplingItemCount
										: 0}
								</Text>
							</View>
						</View>

						<Text style={{ color: 'black', fontFamily: 'GoogleSans-Medium', marginLeft: 15, marginTop: 10 }}>
							Material Details
						</Text>
						<View style={styles.detailsView}>
							<View style={{ flexDirection: 'row' }}>
								<View style={{ width: '60%' }}>
									<Text style={{ color: 'black', fontFamily: 'GoogleSans-Medium' }}>Category</Text>
									<Text style={{ color: 'black', flex: 1, flexWrap: 'wrap' }}>
										{this.state.siteOfferDetails.materialName}
									</Text>
								</View>

								<View style={{ width: '40%' }}>
									<Text style={{ color: 'black', fontFamily: 'GoogleSans-Medium', textAlign: 'right' }}>Unit</Text>
									<Text style={{ color: 'black', textAlign: 'right', flex: 1, flexWrap: 'wrap' }}>
										{this.state.siteOfferDetails.deliverySchUnit}
									</Text>
								</View>
							</View>

							<View style={{ marginTop: 20 }}>
								<Text style={{ color: 'black', fontFamily: 'GoogleSans-Medium' }}>Sub Category </Text>
								<Text style={{ color: 'black' }}>{this.state.siteOfferDetails.materialScName}</Text>
							</View>
						</View>

						{this.state.matSeries != '' ? (
							<View style={{ borderWidth: 1, margin: 15 }}>
								<View style={styles.tableHeader}>
									<View style={{ width: '20%', borderRightColor: 'lightgrey', borderRightWidth: 1 }}>
										<Text style={[styles.tableHeaderText]}>S.No.</Text>
									</View>

									<View style={{ width: '30%', borderRightColor: 'lightgrey', borderRightWidth: 1 }}>
										<Text style={[styles.tableHeaderText]}>Material Serial No.</Text>
									</View>

									<View style={{ width: '30%', borderRightColor: 'lightgrey', borderRightWidth: 1 }}>
										<Text style={[styles.tableHeaderText]}>Inspection Status</Text>
									</View>

									<View style={{ width: '20%', borderRightColor: 'lightgrey', borderRightWidth: 1 }}>
										<Text style={[styles.tableHeaderText]}>Action</Text>
									</View>
								</View>

								<FlatList
									data={this.state.matSeries}
									keyExtractor={item => item.sno}
									renderItem={({ item, index }) => (
										<View style={styles.tableContent}>
											<View style={{ borderRightColor: 'lightgrey', borderRightWidth: 1, padding: 10, width: '20%' }}>
												<Text style={[styles.tableContentText]}>{index + 1}</Text>
											</View>
											<View style={{ borderRightColor: 'lightgrey', borderRightWidth: 1, padding: 10, width: '30%' }}>
												<Text style={[styles.tableContentText]}>{item.materialSrNo}</Text>
											</View>
											{item.itemInspectionStatus == 2 || item.itemInspectionStatus == 3 ? (
												<View style={{ width: '30%' }}>
													<Text style={styles.linkText}>Completed</Text>
												</View>
											) : null}
											{item.itemInspectionStatus == 0 ? (
												<View style={{ width: '30%' }}>
													<TouchableOpacity
														onPress={() => this.setState({ isLoading2: true }, () => this.onStartInsp(item))}
													>
														{this.state.isLoading2 == false ? (
															<Text style={styles.linkText}>Start</Text>
														) : (
															<ActivityIndicator size="small" color="#000000" />
														)}
													</TouchableOpacity>
												</View>
											) : null}
											{item.itemInspectionStatus == 1 ? (
												<TouchableOpacity
													onPress={() => this.setState({ isLoading2: true }, () => this.onStartInsp(item))}
													style={{ width: '30%' }}
												>
													{this.state.isLoading2 == false ? (
														<Text style={styles.linkText}>InProcess</Text>
													) : (
														<ActivityIndicator size="small" color="#000000" />
													)}
												</TouchableOpacity>
											) : null}
											<View
												style={{
													width: '20%',
													alignItems: 'center',
													justifyContent: 'center',
													borderLeftWidth: 1,
													borderLeftColor: 'lightgrey'
												}}
											>
												{item.itemInspectionStatus == 0 ? (
													<TouchableOpacity onPress={() => this.deleteRecord(item)}>
														<Icon name="trash-2" size={20} color="black" />
													</TouchableOpacity>
												) : (
													<Text style={{ color: '#000000' }}>NA</Text>
												)}
											</View>
										</View>
									)}
								/>
							</View>
						) : null}

						<View style={{ alignItems: 'center', marginVertical: 20 }}>
							<TouchableOpacity
								onPress={() => this.onAddMatSrNo()}
								style={{ backgroundColor: '#ff7f00', padding: 10, borderRadius: 5 }}
							>
								<Text style={{ color: 'black', fontSize: 15, fontFamily: 'GoogleSans-Medium' }}>
									Add Material Serial No. to test
								</Text>
							</TouchableOpacity>
						</View>
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
									Click to Scan and Upload Observation Documents (PDF/Image)
								</Text>
								<View style={{ flexDirection: 'row' }}>
									<TouchableOpacity
										onPress={() => this.onCamera()}
										style={{ padding: 10, borderRadius: 5, backgroundColor: 'brown', marginVertical: 10 }}
									>
										<Icon name="camera" size={20} color="white" />
									</TouchableOpacity>
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
						</View>

						{this.state.isLoading == false ? (
							<View>
								<View style={{ flexDirection: 'row', margin: 15 }}>
									<TouchableOpacity
										disabled={this.state.testCount != this.state.matSeries.length ? true : false}
										onPress={() => this.isItemConsumed(0)}
										style={styles.acceptButton}
									>
										<Text style={styles.buttonText}>Pass Material</Text>
									</TouchableOpacity>

									<TouchableOpacity
										disabled={this.state.testCount != this.state.matSeries.length ? true : false}
										onPress={() => this.onFailConfirmation()}
										style={styles.rejectButton}
									>
										{this.state.isRefreshing2 == false ? (
											<Text style={styles.buttonText}>Fail Material</Text>
										) : (
											<ActivityIndicator size="small" color="#ffffff" />
										)}
									</TouchableOpacity>
								</View>

								<TouchableOpacity
									disabled={this.state.testCount != this.state.matSeries.length ? true : false}
									onPress={() => this.isItemConsumed(1)}
									style={styles.obsButton}
								>
									{this.state.isRefreshing2 == false ? (
										<Text style={styles.buttonText}>Observation</Text>
									) : (
										<ActivityIndicator size="small" color="#ffffff" />
									)}
								</TouchableOpacity>
							</View>
						) : (
							<ActivityIndicator size="small" color="#ff7f00" />
						)}

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
								<View
									style={{
										width: '70%',
										backgroundColor: '#ffffff',
										padding: 10,
										borderRadius: 10,
										justifyContent: 'center'
									}}
								>
									{this.state.isLoading == false ? (
										<View style={{ marginTop: 10, width: '90%' }}>
											<Text style={styles.text}>Enter Serial Number</Text>
											<TextInput
												onChangeText={serialNo => this.setState({ serialNo })}
												value={this.state.serialNo}
												underlineColorAndroid="orange"
											/>

											<TouchableOpacity onPress={() => this.onSubmitSrNo()} style={styles.otpButton}>
												<Text style={{ fontSize: 15, color: '#ffffff', paddingVertical: 12, textAlign: 'center' }}>
													SUBMIT
												</Text>
											</TouchableOpacity>
										</View>
									) : (
										<View style={{ justifyContent: 'center', alignItems: 'center' }}>
											<ActivityIndicator size="large" color="orange" />
										</View>
									)}

									<TouchableOpacity
										onPress={() => this.setState({ ModalVisible: false })}
										style={{ position: 'absolute', top: 0, right: 5 }}
									>
										<Icon name="x" size={22} color="black" />
									</TouchableOpacity>
								</View>
							</View>
						</Modal>

						<Modal
							//animationType="slide"
							transparent={true}
							visible={this.state.itemConsumeModel}
							onRequestClose={() => {
								this.setState({ itemConsumeModel: false, isConsume: false });
							}}
						>
							<View
								onPress={() => this.setState({ itemConsumeModel: false, isConsume: false })}
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
									<View style={{ marginTop: 20 }}>
										<Text style={{ color: '#000000' }}>Consumed Quantity</Text>
										<View style={{ borderWidth: 1, borderColor: '#ff7f00' }}>
											<TextInput
												onChangeText={itemConsumeQty => this.setState({ itemConsumeQty })}
												value={this.state.itemConsumeQty}
												style={{ height: 40 }}
												keyboardType="numeric"
											/>
										</View>
									</View>

									<View style={{ marginTop: 20 }}>
										<Text style={{ color: '#000000' }}>Consumed Unit</Text>
										<View style={{ borderWidth: 1, borderColor: '#ff7f00' }}>
											<TextInput
												onChangeText={itemConsumeUnit => this.setState({ itemConsumeUnit })}
												value={this.state.itemConsumeUnit}
												style={{ height: 40 }}
											/>
										</View>
									</View>

									<View style={{ marginTop: 20 }}>
										<Text style={{ color: '#000000' }}>Remaining Quantity</Text>
										<View style={{ borderWidth: 1, borderColor: '#ff7f00' }}>
											<TextInput
												onChangeText={itemRemQty => this.setState({ itemRemQty })}
												value={this.state.itemRemQty}
												style={{ height: 40 }}
												keyboardType="numeric"
											/>
										</View>
									</View>

									{this.state.isLoading == false ? (
										<TouchableOpacity onPress={() => this.onSubmitItemConsumes()} style={styles.otpButton}>
											<Text style={{ fontSize: 15, color: '#ffffff', paddingVertical: 12, textAlign: 'center' }}>
												SUBMIT
											</Text>
										</TouchableOpacity>
									) : (
										<ActivityIndicator size="small" color="#ff7f00" />
									)}

									<TouchableOpacity
										onPress={() => this.setState({ itemConsumeModel: false, isConsume: false })}
										style={{ position: 'absolute', top: 0, right: 5 }}
									>
										<Icon name="x" size={22} color="black" />
									</TouchableOpacity>
								</View>
							</View>
						</Modal>

						<Modal
							//animationType="slide"
							transparent={true}
							visible={this.state.itemConsumeModel1}
							onRequestClose={() => {
								this.setState({ itemConsumeModel: false, isConsume: false });
							}}
						>
							<View
								onPress={() => this.setState({ itemConsumeModel: false, isConsume: false })}
								style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#00000080' }}
							>
								{this.state.isConsume ? (
									<View
										style={{
											width: '80%',
											backgroundColor: '#ffffff',
											padding: 15,
											borderRadius: 10,
											justifyContent: 'center'
										}}
									>
										{Platform.OS === 'ios' ? (
											<View>
												<Text style={{ color: '#000000', fontFamily: 'GoogleSans-Medium', fontSize: 15 }}>
													Item Consumes
												</Text>
												<TouchableOpacity
													style={{ height: 40, padding: 10, borderWidth: 1, borderColor: '#ff7f00', marginTop: 15 }}
													onPress={() => {
														this.itemConsumeType();
													}}
												>
													{this.state.itemConsumeType === '0' ? <Text>Completely</Text> : <Text>Partially</Text>}
												</TouchableOpacity>
											</View>
										) : (
											<View style={{ marginTop: 20 }}>
												<Text style={{ color: '#000000', fontFamily: 'GoogleSans-Medium', fontSize: 15 }}>
													Item Consumes
												</Text>
												<View style={{ borderWidth: 1, borderColor: '#ff7f00', marginTop: 10 }}>
													<Picker
														selectedValue={this.state.itemConsumeType}
														style={{ height: 40, width: '100%' }}
														mode="dropdown"
														onValueChange={(itemValue, itemIndex) => this.setState({ itemConsumeType: itemValue })}
													>
														<Picker.Item label="Completely" value="0" />
														<Picker.Item label="Partially" value="1" />
													</Picker>
												</View>
											</View>
										)}

										{this.state.itemConsumeType === '1' ? (
											<View style={{ marginTop: 20 }}>
												<Text style={{ color: '#000000' }}>Quantity</Text>
												<View style={{ borderWidth: 1, borderColor: '#ff7f00' }}>
													<TextInput
														onChangeText={itemConsumeQty => this.setState({ itemConsumeQty })}
														value={this.state.itemConsumeQty}
														style={{ height: 40 }}
													/>
												</View>

												{Platform.OS === 'ios' ? (
													<View>
														<TouchableOpacity
															style={{ height: 40, padding: 10, borderWidth: 1, borderColor: '#ff7f00', marginTop: 15 }}
															onPress={() => {
																this.unitNameList();
															}}
														>
															<Text>{this.state.unitName}</Text>
														</TouchableOpacity>
													</View>
												) : (
													<View style={{ borderWidth: 1, borderColor: '#ff7f00', marginTop: 20 }}>
														<Picker
															selectedValue={this.state.unitShortName}
															style={{ height: 40, width: '100%' }}
															mode="dropdown"
															onValueChange={(itemValue, itemIndex) => this.onUnitChange(itemValue, itemIndex)}
														>
															{unitList}
														</Picker>
													</View>
												)}
											</View>
										) : null}

										<TouchableOpacity onPress={() => this.onSubmitItemConsumes()} style={styles.otpButton}>
											<Text style={{ fontSize: 15, color: '#ffffff', paddingVertical: 12, textAlign: 'center' }}>
												SUBMIT
											</Text>
										</TouchableOpacity>

										<TouchableOpacity
											onPress={() => this.setState({ itemConsumeModel: false, isConsume: false })}
											style={{ position: 'absolute', top: 0, right: 5 }}
										>
											<Icon name="x" size={22} color="black" />
										</TouchableOpacity>
									</View>
								) : (
									<View
										style={{
											width: '80%',
											backgroundColor: '#ffffff',
											padding: 15,
											borderRadius: 10,
											justifyContent: 'center'
										}}
									>
										<Text style={{ color: '#000000', fontSize: 20 }}>Is Material Consumed ?</Text>

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
										<TouchableOpacity onPress={() => this.onContinue()} style={styles.otpButton}>
											<Text style={{ fontSize: 15, color: '#ffffff', paddingVertical: 12, textAlign: 'center' }}>
												Continue
											</Text>
										</TouchableOpacity>
									</View>
								)}
							</View>
						</Modal>

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
									<ScrollView>
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
													style={{ width: '60%' }}
													onChangeText={packageNo => this.setState({ packageNo })}
													value={this.state.packageNo}
													underlineColorAndroid="#ff7f00"
												/>
											</View>

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
													style={{ width: '60%' }}
													onChangeText={matSeriallDetails => this.setState({ matSeriallDetails })}
													value={this.state.matSeriallDetails}
													underlineColorAndroid="#ff7f00"
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
													No of Seals :
												</Text>

												<TextInput
													style={{ width: '60%' }}
													onChangeText={sealNo => this.setState({ sealNo })}
													value={this.state.sealNo}
													underlineColorAndroid="#ff7f00"
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
													style={{ width: '60%' }}
													onChangeText={sealDetail => this.setState({ sealDetail })}
													value={this.state.sealDetail}
													underlineColorAndroid="#ff7f00"
												/>
											</View>

											<View style={{ marginTop: 10, alignItems: 'center' }}>
												<TouchableOpacity onPress={() => this.onFinalSubmit()} style={styles.button}>
													<Text style={styles.buttonText}>SUBMIT</Text>
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
					</View>
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
		textAlign: 'center'
	},
	tableContent: {
		flexDirection: 'row',
		backgroundColor: '#ffffff',
		borderBottomColor: 'lightgrey',
		borderBottomWidth: 1
	},
	tableContentText: {
		color: '#141F25',
		textAlign: 'center',
		fontSize: 14
	},
	linkText: {
		paddingTop: 10,
		paddingBottom: 10,
		color: '#1b6379',
		textAlign: 'center',
		textDecorationLine: 'underline',
		fontFamily: 'GoogleSans-Medium'
	},
	button: {
		borderRadius: 5,
		backgroundColor: '#3CB043',
		marginTop: 20,
		paddingHorizontal: 15,
		paddingVertical: 10,
		marginBottom: 50,
		elevation: 8
	},
	buttonText: {
		fontSize: 15,
		color: '#ffffff',
		fontFamily: 'GoogleSans-Medium',
		textAlign: 'center'
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
	acceptButton: {
		borderRadius: 5,
		backgroundColor: '#3CB043',
		width: '40%',
		margin: 10,
		padding: 12
	},

	rejectButton: {
		borderRadius: 5,
		backgroundColor: '#fb0102',
		width: '40%',
		margin: 10,
		padding: 12
	},
	obsButton: {
		borderRadius: 5,
		backgroundColor: '#ff7f00',
		width: '40%',
		margin: 10,
		padding: 12,
		alignSelf: 'center'
	}
});
