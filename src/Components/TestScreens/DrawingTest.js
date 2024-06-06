import React, { Component } from 'react';
import {
	Platform,
	StyleSheet,
	Text,
	View,
	Image,
	TouchableOpacity,
	BackHandler,
	ScrollView,
	Modal,
	TextInput,
	TouchableWithoutFeedback,
	KeyboardAvoidingView,
	ImageBackground
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import ImagePicker from 'react-native-image-picker';
import APIManager from '../Managers/APIManager';
import { Base64 } from 'js-base64';

export default class DrawingTest extends Component {
	constructor(props) {
		super(props);
		this.state = {
			testModalVisible: false,
			observation: '',
			image: '',
			imageData: '',
			status: '',
			siteOfferDetails: this.props.navigation.state.params.siteOfferDetails,
			materialSrNo: this.props.navigation.state.params.materialSrNo
		};
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
		BackHandler.addEventListener('hardwareBackPress', this.props.navigation.goBack);
	}

	onPassTest() {
		this.setState({ status: 'Pass' }, () => {
			this.uploadDrawing();
		});
	}
	onFailTest() {
		this.setState({ status: 'Fail' }, () => {
			this.uploadDrawing();
		});
	}

	onCamera() {
		var options = {
			title: 'Select Avatar',
			quality: 0.3,
			storageOptions: {
				path: 'images'
			}
		};
		ImagePicker.showImagePicker(options, response => {
			console.log('Response = ', response);

			if (response.didCancel) {
				console.log('User cancelled image picker');
			} else if (response.error) {
				console.log('ImagePicker Error: ', response.error);
			} else {
				let source = response.uri;

				// You can also display the image using data:
				//let source = 'data:image/jpeg;base64,' + response.data ;

				this.setState({
					image: source,
					imageData: response.data
				});
			}
		});
	}

	uploadDrawing() {
		const credentials = APIManager.Sso_Id + ':' + APIManager.Api_Key;
		const hash = Base64.encode(credentials);
		const Basic = 'Basic ' + hash;
		//alert(credentials)
		let Details = [
			{
				siteOfferId: this.state.siteOfferDetails.siteOfferUnqId,
				testObservation: this.state.observation,
				testPhoto: this.state.imageData,
				testStatus: this.state.status
			}
		];
		//alert(Details)
		fetch(APIManager.host + 'v1/inspector/inspection/approve/drawing', {
			method: 'POST',
			headers: {
				//'Secret-key':'$2a$10$JrrNkhWRIFF1CUJehK0Zu.X4kItDuY8YFDqCMm7HapJRGymupaMxS',
				Authorization: Basic,
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(Details)
		})
			.then(response => response.json())
			.then(responseJson => {
				alert(JSON.stringify(responseJson));
			})
			.catch(error => {
				alert(JSON.stringify(error));
			});
	}

	render() {
		return (
			<ImageBackground source={require('../../Images/background.png')} style={{ width: '100%', height: '100%' }}>
				<ScrollView>
					<View style={styles.container}>
						<Text style={{ fontSize: 20, fontFamily: 'GoogleSans-Medium', marginTop: 25, color: 'black' }}>
							Test As Per Approved Drawing
						</Text>

						<View style={{ borderWidth: 1, margin: 15, padding: 15, backgroundColor: 'black', width: '90%' }}>
							<View style={{ flexDirection: 'row' }}>
								<Text style={{ color: 'white', fontFamily: 'GoogleSans-Medium', width: '50%' }}>SITE OFFER ID</Text>
								<Text style={{ color: 'white', flex: 1, flexWrap: 'wrap', textAlign: 'right', width: '50%' }}>
									{this.state.siteOfferDetails.siteOfferUnqId}
								</Text>
							</View>

							<View style={{ flexDirection: 'row', marginTop: 20 }}>
								<Text style={{ color: 'white', fontFamily: 'GoogleSans-Medium', width: '50%' }}>Materials Name</Text>
								<Text style={{ color: 'white', flex: 1, flexWrap: 'wrap', textAlign: 'right', width: '50%' }}>
									{this.state.siteOfferDetails.materialName}
								</Text>
							</View>

							<View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 }}>
								<Text style={{ color: 'white', fontFamily: 'GoogleSans-Medium' }}>Materials Serial No.</Text>
								<Text style={{ color: 'white' }}>{this.state.materialSrNo}</Text>
							</View>
						</View>

						<View
							style={{
								borderWidth: 1,
								marginLeft: 15,
								marginRight: 15,
								padding: 15,
								alignItems: 'center',
								backgroundColor: 'orange',
								width: '90%'
							}}
						>
							<TouchableOpacity style={{ padding: 10, borderWidth: 1, borderRadius: 5, backgroundColor: 'brown' }}>
								<Icon name="file-text" size={30} color="white" />
							</TouchableOpacity>
							<Text style={{ fontSize: 15, fontFamily: 'GoogleSans-Medium', paddingTop: 10, color: 'black' }}>
								Click to Download Approved Drawing
							</Text>
						</View>

						<View style={{ width: '100%', padding: 15 }}>
							<Text
								style={{
									fontSize: 18,
									fontFamily: 'GoogleSans-Medium',
									paddingTop: 10,
									color: 'black',
									textAlign: 'center'
								}}
							>
								OBSERVATIONS
							</Text>
							<TextInput
								style={[styles.textInput, { height: 100, backgroundColor: '#ffffff' }]}
								onChangeText={observation => this.setState({ observation })}
								value={this.state.observation}
								multiline={true}
								placeholder="My Observations Are"
								//underlineColorAndroid='orange'
							/>
						</View>

						<View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '90%', marginBottom: 50 }}>
							<TouchableOpacity onPress={() => this.onPassTest()} style={styles.acceptButton}>
								<Text style={styles.buttonText}>PASS</Text>
							</TouchableOpacity>

							<TouchableOpacity onPress={() => this.onFailTest()} style={styles.rejectButton}>
								<Text style={styles.buttonText}>FAIL</Text>
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
		backgroundColor: '#33a0ff',
		borderBottomColor: 'lightgrey',
		borderBottomWidth: 1
	},
	tableHeaderText: {
		padding: 10,
		fontFamily: 'GoogleSans-Medium',
		color: 'black',
		textAlign: 'center',
		borderRightColor: 'lightgrey',
		borderRightWidth: 1
	},
	tableContent: {
		flexDirection: 'row',
		backgroundColor: '#f9cda0',
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
	linkText: {
		paddingTop: 10,
		paddingBottom: 10,
		color: '#1b6379',
		textAlign: 'center',
		textDecorationLine: 'underline',
		width: '40%'
	},
	button: {
		borderWidth: 1,
		borderRadius: 5,
		backgroundColor: 'green',
		borderColor: 'red'
	},
	buttonText: {
		fontSize: 18,
		color: '#ffffff',
		fontFamily: 'GoogleSans-Medium',
		paddingVertical: 10,
		paddingHorizontal: 25
	},
	text: {
		color: 'black',
		fontSize: 15,
		fontFamily: 'GoogleSans-Medium'
	},
	textInput: {
		borderWidth: 1
	},
	acceptButton: {
		borderRadius: 5,
		backgroundColor: '#3CB043',
		marginTop: 20
	},

	rejectButton: {
		borderRadius: 5,
		backgroundColor: '#fb0102',
		marginTop: 20
	}
});
