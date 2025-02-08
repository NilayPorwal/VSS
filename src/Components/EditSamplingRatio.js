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
	ImageBackground,
	BackHandler,
	TextInput,
	FlatList,
	Modal
} from 'react-native';
import APIManager from './Managers/APIManager';
import Icon from 'react-native-vector-icons/FontAwesome';
import Loader from 'react-native-modal-loader';
import Feather from 'react-native-vector-icons/Feather';

export default class EditSamplingRatio extends Component {
	constructor(props) {
		super(props);
		this.state = {
			startNo: null,
			endNo: null,
			sampleTaken: null,
			defectQty: '0',
			noPoles: '0',
			isLoading: false,
			sealData: ['0'],
			samplingData: [],
			samplingDataNew: [],
			matId: this.props.navigation.state.params.matId,
			matscId: this.props.navigation.state.params.matscId,
			pdiId: this.props.navigation.state.params.pdiId,
			index: null,
			modalVisible: false
		};
		global.EditSamplingRatio = this;
		// alert(JSON.stringify(this.props.navigation.state.params.siteOfferDetails))
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
		this.getSamplingList();
		BackHandler.addEventListener('hardwareBackPress', this.props.navigation.goBack);
	}

	handleBackPress() {
		this.props.navigation.state.params.onGoBack();
		this.props.navigation.goBack();
		return true;
	}

	getSamplingList() {
		this.setState({ isLoading: true });

		const data = {
			matAiId: this.state.matId,
			matscAiId: this.state.matscId,
			pdiOfferAiId: this.state.pdiId
		};

		console.log(JSON.stringify(data));
		APIManager.getSamplingList(
			data,
			this.props.navigation.state.params.from,
			responseJson => {
				//console.log(JSON.stringify(responseJson));
				this.setState({ isLoading: false });

				if (responseJson.status == 'SUCCESS') {
					this.setState({ samplingData: responseJson.data });
				}
			},
			error => {
				this.setState({ isLoading: false });
				console.log(JSON.stringify(error));
				// alert("Failed to update, Plesae try again")
			}
		);
	}

	onSave() {
		if (this.state.startNo == null || this.state.endNo == null || this.state.sampleTaken == null) {
			return;
		}
		if (this.state.startNo > this.state.endNo) {
			return Alert.alert('Wait', 'Incorrect Quantity End No.');
		}

		if (
			this.state.samplingDataNew.length > 0 &&
			this.state.samplingDataNew[this.state.samplingDataNew.length - 1].qtyEndNo > this.state.startNo
		) {
			return Alert.alert('Wait', 'Quantity Start No. should be greater then');
		}

		if (this.state.sampleTaken > this.state.endNo - this.state.startNo) {
			return Alert.alert('Wait', 'Incorrect Sample');
		}

		for (let i = 0; i < this.state.samplingData.length; i++) {
			if (
				(this.state.startNo == this.state.samplingData[i].qtyEndNo ||
					this.state.startNo < this.state.samplingData[i].qtyEndNo) &&
				(this.state.startNo == this.state.samplingData[i].qtyStartNo ||
					this.state.startNo > this.state.samplingData[i].qtyStartNo)
			) {
				return Alert.alert('Wait', 'Incorrect Quantity Start No.');
			}
		}

		for (let j = 0; j < this.state.samplingDataNew.length; j++) {
			if (
				(this.state.startNo == this.state.samplingDataNew[j].qtyEndNo ||
					this.state.startNo < this.state.samplingDataNew[j].qtyEndNo) &&
				(this.state.startNo == this.state.samplingDataNew[j].qtyStartNo ||
					this.state.startNo > this.state.samplingDataNew[j].qtyStartNo)
			) {
				return Alert.alert('Wait', 'Incorrect Quantity Start No.');
			}
		}

		const data = {
			samplingAiId: 0,
			materialAiId: this.state.matId,
			materialSubcategoryAiId: this.state.matscId,
			qtyStartNo: this.state.startNo,
			qtyEndNo: this.state.endNo,
			qtySample: this.state.sampleTaken,
			qtyPermitDefect: this.state.defectQty,
			qtyPoles: this.state.noPoles,
			pdiOfferAiId: this.state.pdiId
		};
		//alert(JSON.stringify(data))
		this.setState({
			modalVisible: false,
			samplingDataNew: [...this.state.samplingDataNew, data],
			startNo: null,
			endNo: null,
			sampleTaken: null,
			defectQty: '0',
			noPoles: '0'
		});
	}

	onSaveSample() {
		this.setState({ error: true, isLoading: true });

		APIManager.onSaveSample(
			this.state.samplingDataNew,
			this.props.navigation.state.params.from,
			responseJson => {
				this.setState({ isLoading: false });
				//Alert.alert("Res", JSON.stringify(responseJson))

				if (responseJson.status == 'SUCCESS') {
					Alert.alert('SAVED', 'Data saved successfully');
					this.setState({ samplingDataNew: [] });
					this.getSamplingList();
				} else {
					Alert.alert('FAILED', responseJson.message);
				}
			},
			error => {
				this.setState({ isLoading: false });

				console.log(JSON.stringify(error));
				// alert("Failed to update, Plesae try again")
			}
		);
	}

	onQtyChange(value, index) {
		let { samplingData } = this.state;
		samplingData[index].qtySample = value;
		global.EditSamplingRatio.setState({ index: index, samplingData: samplingData });
	}

	onUpdateSampleQty(index) {
		if (
			this.state.samplingData[index].qtySample > this.state.samplingData[index].qtyEndNo ||
			this.state.samplingData[index].qtySample < this.state.samplingData[index].qtyStartNo
		) {
			return Alert.alert('Wait', 'Incorrect Sample Qty');
		}

		this.setState({ isLoading: true });
		const data = [this.state.samplingData[index]];

		APIManager.onSaveSample(
			data,
			responseJson => {
				this.setState({ isLoading: false });
				if (responseJson.status == 'SUCCESS') {
					Alert.alert('SAVED', 'Data saved successfully');
					this.setState({ index: null });
					Alert.alert('SAVED', 'Data saved successfully', [{ text: 'OK', onPress: () => this.handleBackPress() }], {
						cancelable: false
					});
				} else {
					Alert.alert('FAILED', 'Failed to save data, please try again');
				}
			},
			error => {
				this.setState({ isLoading: false });

				console.log(JSON.stringify(error));
				// alert("Failed to update, Plesae try again")
			}
		);
	}

	render() {
		return (
			<ImageBackground source={require('../Images/background.png')} style={{ width: '100%', height: '100%' }}>
				<ScrollView>
					<KeyboardAvoidingView style={{ flex: 1 }} behavior="padding" enabled>
						<Loader loading={this.state.isLoading} color="#40a7ab" />

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
									Edit Sampling Ratio
								</Text>
							</View>
						</View>

						<Text
							style={{
								fontSize: 18,
								fontFamily: 'GoogleSans-Medium',
								color: 'black',
								paddingTop: 15,
								textAlign: 'center'
							}}
						>
							Existing Sampling List
						</Text>

						{this.state.samplingData.length > 0 ? (
							<FlatList
								data={this.state.samplingData}
								keyExtractor={item => item.index}
								extraData={this.state}
								renderItem={({ item, index }) => (
									<View style={[{ backgroundColor: '#FEC1A5' }, styles.detailsView]}>
										<View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
											<View style={{ width: '50%' }}>
												<Text style={{ color: 'black', fontFamily: 'GoogleSans-Medium' }}>Quantity Start No.</Text>
												<Text style={{ color: 'black', flex: 1, flexWrap: 'wrap' }}>{item.qtyStartNo}</Text>
											</View>

											<View style={{ width: '50%' }}>
												<Text style={{ color: 'black', fontFamily: 'GoogleSans-Medium', textAlign: 'right' }}>
													Quantity End No.
												</Text>
												<Text style={{ color: 'black', textAlign: 'right', flex: 1, flexWrap: 'wrap' }}>
													{item.qtyEndNo}
												</Text>
											</View>
										</View>

										<View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 15 }}>
											<View style={{ width: '50%' }}>
												<Text style={{ color: 'black', fontFamily: 'GoogleSans-Medium' }}>Qunatity Sample</Text>
												<TextInput
													style={{
														width: '70%',
														backgroundColor: '#ffffff',
														padding: 5,
														borderRadius: 5,
														marginTop: 3
													}}
													onChangeText={value => this.onQtyChange(value, index)}
													value={this.state.samplingData[index].qtySample.toString()}
													underlineColorAndroid="transparent"
													keyboardType="numeric"
												/>
											</View>

											<View style={{ width: '50%' }}>
												<Text style={{ color: 'black', fontFamily: 'GoogleSans-Medium', textAlign: 'right' }}>
													Quantity Permit Defect
												</Text>
												<Text style={{ color: 'black', textAlign: 'right', flex: 1, flexWrap: 'wrap' }}>
													{item.qtyPermitDefect}
												</Text>
											</View>
										</View>

										<View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 15 }}>
											<View style={{ width: '60%' }}>
												<Text style={{ color: 'black', fontFamily: 'GoogleSans-Medium' }}>
													No of Poles for transverse strength test
												</Text>
												<Text style={{ color: 'black' }}>{item.qtyPoles}</Text>
											</View>

											{this.state.index == index ? (
												<View style={{ width: '40%', alignItems: 'flex-end' }}>
													<TouchableOpacity onPress={() => this.onUpdateSampleQty(index)} style={styles.button}>
														<Text style={styles.buttonText}>Update</Text>
													</TouchableOpacity>
												</View>
											) : null}
										</View>
									</View>
								)}
							/>
						) : null}

						<Text
							style={{
								fontSize: 18,
								fontFamily: 'GoogleSans-Medium',
								color: 'black',
								paddingTop: 15,
								textAlign: 'center'
							}}
						>
							Add New Sampling
						</Text>

						{this.state.samplingDataNew.length > 0 ? (
							<FlatList
								data={this.state.samplingDataNew}
								keyExtractor={item => item.index}
								renderItem={({ item, index }) => (
									<View style={[{ backgroundColor: '#ffffff' }, styles.detailsView]}>
										<View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
											<View style={{ width: '50%' }}>
												<Text style={{ color: 'black', fontFamily: 'GoogleSans-Medium' }}>Quantity Start No.</Text>
												<Text style={{ color: 'black', flex: 1, flexWrap: 'wrap' }}>{item.qtyStartNo}</Text>
											</View>

											<View style={{ width: '50%' }}>
												<Text style={{ color: 'black', fontFamily: 'GoogleSans-Medium', textAlign: 'right' }}>
													Quantity End No.
												</Text>
												<Text style={{ color: 'black', textAlign: 'right', flex: 1, flexWrap: 'wrap' }}>
													{item.qtyEndNo}
												</Text>
											</View>
										</View>

										<View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 15 }}>
											<View style={{ width: '50%' }}>
												<Text style={{ color: 'black', fontFamily: 'GoogleSans-Medium' }}>Sample To Be Taken</Text>
												<Text style={{ color: 'black', flex: 1, flexWrap: 'wrap' }}>{item.qtySample}</Text>
											</View>

											<View style={{ width: '50%' }}>
												<Text style={{ color: 'black', fontFamily: 'GoogleSans-Medium', textAlign: 'right' }}>
													Permissible Defect Qty.
												</Text>
												<Text style={{ color: 'black', textAlign: 'right', flex: 1, flexWrap: 'wrap' }}>
													{item.qtyPermitDefect}
												</Text>
											</View>
										</View>

										<View style={{ marginTop: 15 }}>
											<Text style={{ color: 'black', fontFamily: 'GoogleSans-Medium' }}>
												No of Poles for transverse strength test
											</Text>
											<Text style={{ color: 'black', flex: 1, flexWrap: 'wrap' }}>{item.qtyPoles}</Text>
										</View>
									</View>
								)}
							/>
						) : null}

						{this.state.samplingDataNew.length == 0 ? (
							<View style={{ borderRadius: 5, backgroundColor: '#ffffff', padding: 15, elevation: 8, margin: 15 }}>
								<View style={{ flexDirection: 'row', marginTop: 10 }}>
									<Text style={{ color: 'black', width: '60%', fontFamily: 'GoogleSans-Medium', paddingTop: 10 }}>
										Quantity Start No. :
									</Text>
									<TextInput
										style={{ width: '40%', borderBottomWidth: 1, borderColor: '#ff7f00', padding: 5 }}
										onChangeText={startNo => this.setState({ startNo })}
										value={this.state.startNo}
										underlineColorAndroid="transparent"
										keyboardType="numeric"
									/>
								</View>

								<View style={{ flexDirection: 'row', marginTop: 15 }}>
									<Text style={{ color: 'black', width: '60%', fontFamily: 'GoogleSans-Medium', paddingTop: 10 }}>
										Quantity End No. :
									</Text>
									<TextInput
										style={{ width: '40%', borderBottomWidth: 1, borderColor: '#ff7f00', padding: 5 }}
										onChangeText={endNo => this.setState({ endNo })}
										value={this.state.endNo}
										underlineColorAndroid="transparent"
										keyboardType="numeric"
									/>
								</View>

								<View style={{ flexDirection: 'row', marginTop: 15 }}>
									<Text style={{ color: 'black', width: '60%', fontFamily: 'GoogleSans-Medium', paddingTop: 10 }}>
										Sample To Be Taken :
									</Text>

									<TextInput
										style={{ width: '40%', borderBottomWidth: 1, borderColor: '#ff7f00', padding: 5 }}
										onChangeText={sampleTaken => this.setState({ sampleTaken })}
										value={this.state.sampleTaken}
										underlineColorAndroid="transparent"
										keyboardType="numeric"
									/>
								</View>

								<View style={{ flexDirection: 'row', marginTop: 20 }}>
									<Text style={{ color: 'black', width: '60%', fontFamily: 'GoogleSans-Medium', paddingTop: 10 }}>
										Permissible Defect Qty. :
									</Text>

									<TextInput
										style={{ width: '40%', borderBottomWidth: 1, borderColor: '#ff7f00', padding: 5 }}
										onChangeText={defectQty => this.setState({ defectQty })}
										value={this.state.defectQty}
										underlineColorAndroid="transparent"
										keyboardType="numeric"
									/>
								</View>

								<View style={{ flexDirection: 'row', marginTop: 20 }}>
									<Text style={{ color: 'black', width: '60%', fontFamily: 'GoogleSans-Medium', paddingTop: 10 }}>
										No of Poles for transverse strength test :
									</Text>

									<TextInput
										style={{ width: '40%', borderBottomWidth: 1, borderColor: '#ff7f00', padding: 5 }}
										onChangeText={noPoles => this.setState({ noPoles })}
										value={this.state.noPoles}
										underlineColorAndroid="transparent"
										keyboardType="numeric"
									/>
								</View>

								<View style={{ marginTop: 10, alignItems: 'center' }}>
									<TouchableOpacity onPress={() => this.onSave()} style={styles.button}>
										<Text style={styles.buttonText}>SAVE</Text>
									</TouchableOpacity>
								</View>
							</View>
						) : null}

						{this.state.samplingDataNew.length > 0 ? (
							<View style={{ flexDirection: 'row' }}>
								<View style={{ alignItems: 'center', width: '50%' }}>
									<TouchableOpacity
										onPress={() => this.setState({ modalVisible: true })}
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
								</View>

								<View style={{ alignItems: 'center', width: '50%' }}>
									<TouchableOpacity
										onPress={() => this.onSaveSample()}
										style={{
											borderRadius: 5,
											backgroundColor: '#418bca',
											marginVertical: 20,
											paddingVertical: 10,
											paddingHorizontal: 20
										}}
									>
										<Text style={styles.buttonText}>Save Sample</Text>
									</TouchableOpacity>
								</View>
							</View>
						) : null}
					</KeyboardAvoidingView>
				</ScrollView>

				<Modal
					transparent={true}
					visible={this.state.modalVisible}
					onRequestClose={() => {
						this.setState({ modalVisible: false });
					}}
				>
					<View style={{ flex: 1, alignItems: 'center', backgroundColor: '#00000080', justifyContent: 'center' }}>
						<View style={{ borderRadius: 5, backgroundColor: '#ffffff', padding: 15, margin: 15 }}>
							<View style={{ flexDirection: 'row', marginTop: 10 }}>
								<Text style={{ color: 'black', width: '60%', fontFamily: 'GoogleSans-Medium', paddingTop: 10 }}>
									Quantity Start No. :
								</Text>
								<TextInput
									style={{ width: '40%', borderBottomWidth: 1, borderColor: '#ff7f00', padding: 5 }}
									onChangeText={startNo => this.setState({ startNo })}
									value={this.state.startNo}
									underlineColorAndroid="transparent"
									keyboardType="numeric"
								/>
							</View>

							<View style={{ flexDirection: 'row', marginTop: 15 }}>
								<Text style={{ color: 'black', width: '60%', fontFamily: 'GoogleSans-Medium', paddingTop: 10 }}>
									Quantity End No. :
								</Text>
								<TextInput
									style={{ width: '40%', borderBottomWidth: 1, borderColor: '#ff7f00', padding: 5 }}
									onChangeText={endNo => this.setState({ endNo })}
									value={this.state.endNo}
									underlineColorAndroid="transparent"
									keyboardType="numeric"
								/>
							</View>

							<View style={{ flexDirection: 'row', marginTop: 15 }}>
								<Text style={{ color: 'black', width: '60%', fontFamily: 'GoogleSans-Medium', paddingTop: 10 }}>
									Sample To Be Taken :
								</Text>

								<TextInput
									style={{ width: '40%', borderBottomWidth: 1, borderColor: '#ff7f00', padding: 5 }}
									onChangeText={sampleTaken => this.setState({ sampleTaken })}
									value={this.state.sampleTaken}
									underlineColorAndroid="transparent"
									keyboardType="numeric"
								/>
							</View>

							<View style={{ flexDirection: 'row', marginTop: 20 }}>
								<Text style={{ color: 'black', width: '60%', fontFamily: 'GoogleSans-Medium', paddingTop: 10 }}>
									Permissible Defect Qty. :
								</Text>

								<TextInput
									style={{ width: '40%', borderBottomWidth: 1, borderColor: '#ff7f00', padding: 5 }}
									onChangeText={defectQty => this.setState({ defectQty })}
									value={this.state.defectQty}
									underlineColorAndroid="transparent"
									keyboardType="numeric"
								/>
							</View>

							<View style={{ flexDirection: 'row', marginTop: 20 }}>
								<Text style={{ color: 'black', width: '60%', fontFamily: 'GoogleSans-Medium', paddingTop: 10 }}>
									No of Poles for transverse strength test :
								</Text>

								<TextInput
									style={{ width: '40%', borderBottomWidth: 1, borderColor: '#ff7f00', padding: 5 }}
									onChangeText={noPoles => this.setState({ noPoles })}
									value={this.state.noPoles}
									underlineColorAndroid="transparent"
									keyboardType="numeric"
								/>
							</View>

							<View style={{ marginTop: 10, alignItems: 'center' }}>
								<TouchableOpacity onPress={() => this.onSave()} style={styles.button}>
									<Text style={styles.buttonText}>SAVE</Text>
								</TouchableOpacity>
							</View>

							<TouchableOpacity
								onPress={() => this.setState({ modalVisible: false })}
								style={{ position: 'absolute', top: 0, right: 5 }}
							>
								<Feather name="x" size={25} color="black" />
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
	},
	detailsView: {
		borderWidth: 1,
		margin: 10,
		padding: 15,
		elevation: 8,
		borderColor: 'transparent'
	}
});
