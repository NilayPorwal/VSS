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
	BackHandler
} from 'react-native';

export default class BecStandards extends Component {
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
		BackHandler.addEventListener('hardwareBackPress', this.props.navigation.goBack);
	}

	render() {
		return (
			<ImageBackground source={require('../Images/background.png')} style={{ width: '100%', height: '100%' }}>
				<ScrollView>
					<View style={styles.container}>
						<View style={{ borderWidth: 1, margin: 15 }}>
							<Text style={{ color: 'black', fontFamily: 'GoogleSans-Medium', paddingLeft: 15, paddingTop: 15 }}>
								BEC STANDARDS FOR
							</Text>
							<View style={styles.detailsView}>
								<View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
									<View>
										<Text style={{ color: 'black', fontFamily: 'GoogleSans-Medium' }}>Category</Text>
										<Text style={{ color: 'black' }}>Cable</Text>
									</View>

									<View>
										<Text style={{ color: 'black', fontFamily: 'GoogleSans-Medium' }}>Unit</Text>
										<Text style={{ color: 'black' }}>MM</Text>
									</View>
								</View>

								<View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 }}>
									<View>
										<Text style={{ color: 'black', fontFamily: 'GoogleSans-Medium' }}>Sub Category </Text>
										<Text style={{ color: 'black' }}>3 sq MM</Text>
									</View>
								</View>
							</View>

							<View style={{ borderWidth: 1, margin: 15 }}>
								<View style={styles.tableHeader}>
									<Text style={[styles.tableHeaderText, { width: '20%' }]}>S.No.</Text>
									<Text style={[styles.tableHeaderText, { width: '80%' }]}>Standards</Text>
								</View>

								<View style={styles.tableContent}>
									<Text style={[styles.tableContentText, { width: '20%' }]}>1</Text>
									<Text style={[styles.tableContentText, { width: '80%' }]}>Standard 1</Text>
								</View>

								<View style={styles.tableContent}>
									<Text style={[styles.tableContentText, { width: '20%' }]}>2</Text>
									<Text style={[styles.tableContentText, { width: '80%' }]}>Standard 2</Text>
								</View>

								<View style={styles.tableContent}>
									<Text style={[styles.tableContentText, { width: '20%' }]}>3</Text>
									<Text style={[styles.tableContentText, { width: '80%' }]}>Standard 3</Text>
								</View>
							</View>

							<View style={{ alignItems: 'center' }}>
								<TouchableOpacity style={styles.button}>
									<Text onPress={() => this.props.navigation.goBack()} style={styles.buttonText}>
										BACK
									</Text>
								</TouchableOpacity>
							</View>
						</View>
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
		color: '#141F25',
		borderRightColor: 'lightgrey',
		textAlign: 'center',
		borderRightWidth: 1,
		fontSize: 12
	},
	button: {
		borderRadius: 5,
		backgroundColor: '#ff7f00',
		marginVertical: 20
	},

	buttonText: {
		fontSize: 15,
		color: 'black',
		fontFamily: 'GoogleSans-Medium',
		paddingHorizontal: 25,
		paddingVertical: 10
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
