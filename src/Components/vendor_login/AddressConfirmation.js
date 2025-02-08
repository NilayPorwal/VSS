import React, { Component } from 'react';
import {
	Image,
	ImageBackground,
	TouchableOpacity,
	Dimensions,
	Platform,
	FlatList,
	TextInput,
	PermissionsAndroid,
	StyleSheet,
	Text,
	View,
	BackHandler,
	Modal,
	Picker,
	ActionSheetIOS
} from 'react-native';
import { StackNavigator } from 'react-navigation';
import APIManager from '../Managers/APIManager';
import geolib from 'geolib';
import Icon from 'react-native-vector-icons/Feather';
import { getData } from '../../helper';

let stateNameList = [];
let cityNameList = [];
export class AddressConfirmation extends React.Component {
	// hide navigation backgroud
	static navigationOptions = { header: null };

	constructor(props) {
		super(props);
		this.state = {
			addressInfo: [],
			stateList: [],
			cityList: [],
			ModalVisible: false,
			area: null,
			pincode: null,
			stateCode: null,
			cityCode: null,
			worksAddressId: null,
			stateName: null,
			cityName: null
		};
		global.AddressConfirmation = this;
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
		this.vendorAddressList();
		//this.getGeometry()
		this.getStateList();
		BackHandler.addEventListener('hardwareBackPress', this.props.navigation.goBack);
	}

	vendorAddressList() {
		APIManager.vendorAddressList(
			responseJson => {
				console.log(JSON.stringify(responseJson));
				if (responseJson.status == 'SUCCESS') {
					this.setState({ addressInfo: responseJson.data, isRefreshing: false });
				} else {
					this.setState({ error: true, isRefreshing: false });
				}
			},
			error => {
				this.setState({ isRefreshing: false });
				console.log(JSON.stringify(error));
				// alert("Failed to update, Plesae try again")
			}
		);
	}

	getGeometry(address, success, failure) {
		fetch(
			'https://maps.googleapis.com/maps/api/geocode/json?address=' +
				address +
				'&key=AIzaSyCrsfCq7GRSpXXuvhxOnwu36u2wKdwqOos'
		)
			.then(response => response.json())
			.then(responseJson => {
				// alert('ADDRESS GEOCODE is BACK!! => ' + JSON.stringify(responseJson.results[0].geometry.location));
				try {
					success(responseJson.results[0].geometry.location);
				} catch (error) {
					failure(error);
				}
			})
			.catch(error => failure(error));
	}

	async onEditPress(item) {
		// await  this.getCityList(item.workAddressState)
		await global.AddressConfirmation.setState(
			{
				area: item.vendorWorkAddress,
				pincode: item.workAddressPinCode,
				stateCode: item.workAddressState,
				cityCode: item.workAddressCity,
				worksAddressId: item.worksAddressId
			},
			() => {
				this.getCityList(item.workAddressState);
			}
		);

		for (let i = 0; i < this.state.stateList.length; i++) {
			if (item.workAddressState == this.state.stateList[i].stateAiId) {
				global.AddressConfirmation.setState({ stateName: this.state.stateList[i].stateName }, () => {
					global.AddressConfirmation.setState({ ModalVisible: true });
				});
			}
		}

		// for(let i=0; i<this.state.cityList.length; i++){
		//    if(item.workAddressCity == this.state.cityList[i].distAiId){
		//             global.AddressConfirmation.setState({cityName:this.state.cityList[i].distName})
		//         }
		// }
	}

	getCityList(stateCode) {
		cityNameList = [];
		APIManager.getCityList(
			stateCode,
			responseJson => {
				console.log(JSON.stringify(responseJson));
				if (responseJson.status == 'SUCCESS') {
					this.setState({ cityList: responseJson.data });
					for (let i = 0; i < responseJson.data.length; i++) {
						cityNameList.push(responseJson.data[i].distName);
					}

					for (let j = 0; j < responseJson.data.length; j++) {
						//console.log(this.state.cityCode + " == " + responseJson.data[j].distAiId)
						if (this.state.cityCode == responseJson.data[j].distAiId) {
							global.AddressConfirmation.setState({ cityName: responseJson.data[j].distName }, () => {
								global.AddressConfirmation.setState({ ModalVisible: true });
							});
						}
					}
				} else {
					this.setState({ error: true, isRefreshing: false });
				}
			},
			error => {
				console.log(JSON.stringify(error));
				// alert("Failed to update, Plesae try again")
			}
		);
	}

	getStateList() {
		APIManager.getStateList(
			responseJson => {
				console.log(JSON.stringify(responseJson));
				if (responseJson.status == 'SUCCESS') {
					this.setState({ stateList: responseJson.data });
					for (let i = 0; i < responseJson.data.length; i++) {
						stateNameList.push(responseJson.data[i].stateName);
					}
				} else {
					this.setState({ error: true, isRefreshing: false });
				}
			},
			error => {
				console.log(JSON.stringify(error));
				// alert("Failed to update, Plesae try again")
			}
		);
	}

	onSaveWorkAddress() {
		this.getGeometry(this.state.area, response => {
			//alert(JSON.stringify(response))

			const insertData = [
				{
					worksAddressId: this.state.worksAddressId,
					vendorWorkAddress: this.state.area,
					vendorWorkAddressStateStatus: this.state.stateCode == 30 ? 'N' : 'Y',
					vendorId: APIManager.Map_Id,
					workAddressState: this.state.stateCode,
					workAddressCity: this.state.cityCode,
					workAddressLat: response.lat,
					workAddressLong: response.lng,
					workAddressPinCode: this.state.pincode
				}
			];

			APIManager.onSaveWorkAddress(
				insertData,
				responseJson => {
					//  alert(JSON.stringify(responseJson));
					if (responseJson.status == 'SUCCESS') {
						this.setState({ ModalVisible: false }, () => this.vendorAddressList());
					} else {
						Alert.alert('Failed to update', 'Plesae try again');
					}
				},
				error => {
					alert('Failed to update, Plesae try again');
				}
			);
		});
	}

	stateList() {
		ActionSheetIOS.showActionSheetWithOptions(
			{
				options: ['Cancel', ...stateNameList],
				cancelButtonIndex: 0
			},
			buttonIndex => {
				if (buttonIndex != 0) {
					this.setState(
						{
							stateCode: this.state.stateList[buttonIndex - 1].stateAiId,
							stateName: this.state.stateList[buttonIndex - 1].stateName
						},
						() => {
							this.getCityList(this.state.stateCode);
						}
					);
				}
			}
		);
	}

	cityList() {
		ActionSheetIOS.showActionSheetWithOptions(
			{
				options: ['Cancel', ...cityNameList],
				cancelButtonIndex: 0
			},
			buttonIndex => {
				if (buttonIndex != 0) {
					this.setState({
						cityCode: this.state.cityList[buttonIndex - 1].distAiId,
						cityName: this.state.cityList[buttonIndex - 1].distName
					});
				}
			}
		);
	}

	render() {
		const state = this.state.stateList.map((item, key) => {
			return <Picker.Item label={item.stateName} value={item.stateAiId} key={key} />;
		});

		const city = this.state.cityList.map((item, key) => {
			return <Picker.Item label={item.distName} value={item.distAiId} key={key} />;
		});

		return (
			<ImageBackground source={require('../../Images/background.png')} style={{ width: '100%', height: '100%' }}>
				<View style={styles.mainContainer}>
					<View style={{ width: '100%', flexDirection: 'row' }}>
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
								Work Address
							</Text>
						</View>
					</View>

					{this.state.addressInfo.length > 0 ? (
						<FlatList
							data={this.state.addressInfo}
							keyExtractor={item => item.index}
							renderItem={({ item, index }) => (
								<View style={{ margin: 15, borderRadius: 5, elevation: 8, backgroundColor: '#ffffff', padding: 15 }}>
									<View style={{ flexDirection: 'row' }}>
										<View style={{ width: '70%' }}>
											<Text style={{ color: '#000000', fontFamily: 'GoogleSans-Medium', fontSize: 15 }}>Address :</Text>
											<Text style={{ color: '#000000', fontSize: 13 }}>{item.vendorWorkAddress}</Text>
										</View>

										<View style={{ width: '30%', alignItems: 'flex-end', justifyContent: 'center' }}>
											<TouchableOpacity onPress={() => this.onEditPress(item)}>
												<Icon name="edit" size={25} color="#418bca" />
											</TouchableOpacity>
										</View>
									</View>
								</View>
							)}
						/>
					) : (
						<Text style={{ fontFamily: 'GoogleSans-Medium', textAlign: 'center', marginTop: 20, fontSize: 20 }}>
							No data found
						</Text>
					)}

					<Modal
						//animationType="slide"
						transparent={true}
						visible={this.state.ModalVisible}
						onRequestClose={() => {
							this.setState({ ModalVisible: false });
						}}
					>
						<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#00000080' }}>
							<View style={{ width: '80%', backgroundColor: '#ffffff', borderRadius: 10, padding: 15 }}>
								<View style={{ marginTop: 10 }}>
									<Text
										style={{ color: '#000000', fontSize: 15, fontFamily: 'GoogleSans-Medium', textAlign: 'center' }}
									>
										Edit Address
									</Text>

									<Text style={{ color: '#808080', fontSize: 15 }}>Area</Text>
									<TextInput
										style={{ borderBottomWidth: Platform.OS === 'ios' ? 1 : 0, paddingVertical: 10 }}
										onChangeText={area => global.AddressConfirmation.setState({ area })}
										value={global.AddressConfirmation.state.area}
										multiline={true}
										underlineColorAndroid="orange"
									/>

									<Text style={{ color: '#808080' }}>Pincode</Text>
									<TextInput
										style={{ borderBottomWidth: Platform.OS === 'ios' ? 1 : 0, paddingVertical: 10 }}
										onChangeText={pincode => global.AddressConfirmation.setState({ pincode })}
										value={global.AddressConfirmation.state.pincode}
										underlineColorAndroid="orange"
									/>

									<Text style={{ color: '#808080' }}>State</Text>
									<View style={{ backgroundColor: '#d3d3d3' }}>
										{Platform.OS === 'ios' ? (
											<TouchableOpacity style={{}} onPress={() => this.stateList()}>
												<Text style={{ color: '#000000', padding: 10, fontSize: 15 }}>{this.state.stateName}</Text>
											</TouchableOpacity>
										) : (
											<Picker
												selectedValue={this.state.stateCode}
												style={{ height: 40, width: '100%' }}
												mode="dropdown"
												onValueChange={itemValue =>
													this.setState({ stateCode: itemValue }, () => this.getCityList(this.state.stateCode))
												}
											>
												{state}
											</Picker>
										)}
									</View>

									<Text style={{ color: '#808080', marginTop: 5 }}>District</Text>
									<View style={{ backgroundColor: '#d3d3d3' }}>
										{Platform.OS === 'ios' ? (
											<TouchableOpacity style={{}} onPress={() => this.cityList()}>
												<Text style={{ color: '#000000', padding: 10, fontSize: 15 }}>{this.state.cityName}</Text>
											</TouchableOpacity>
										) : (
											<Picker
												selectedValue={this.state.cityCode}
												style={{ height: 40, width: '100%' }}
												mode="dropdown"
												onValueChange={itemValue => this.setState({ cityCode: itemValue })}
											>
												{city}
											</Picker>
										)}
									</View>

									<TouchableOpacity
										onPress={() => this.onSaveWorkAddress()}
										style={{ borderRadius: 5, backgroundColor: '#418bca', marginTop: 15 }}
									>
										<Text style={{ fontSize: 15, color: '#ffffff', paddingVertical: 12, textAlign: 'center' }}>
											Save
										</Text>
									</TouchableOpacity>

									<TouchableOpacity
										onPress={() => this.setState({ ModalVisible: false })}
										style={{ borderRadius: 5, backgroundColor: '#418bca', marginTop: 15 }}
									>
										<Text style={{ fontSize: 15, color: '#ffffff', paddingVertical: 12, textAlign: 'center' }}>
											Cancel
										</Text>
									</TouchableOpacity>
								</View>

								<TouchableOpacity
									onPress={() => this.setState({ ModalVisible: false })}
									style={{ position: 'absolute', top: 0, right: 5 }}
								>
									<Icon name="x" size={20} color="black" />
								</TouchableOpacity>
							</View>
						</View>
					</Modal>
				</View>
			</ImageBackground>
		);
	}
}

// Styles
const styles = StyleSheet.create({
	// Containers
	mainContainer: {
		flex: 1
		// alignItems: 'center',
		// justifyContent: 'center',
	}
});
