import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View, Image, TouchableOpacity, ScrollView, TextInput } from 'react-native';

global.OtpScreen;

export default class OtpScreen extends Component {
	constructor(props) {
		alert(JSON.stringify(this.props.navigation.state.params.data));
		super(props);
		this.state = {
			data: this.props.navigation.state.params.data,
			OTP: ''
		};
		global.OtpScreen = this;
	}

	generateOtp() {
		fetch('http://192.168.1.9:8080/vss-api/public/sso/otp/validation?otpValue=' + this.state.OTP + '&hash=m', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			}
		})
			.then(response => response.json())
			.then(function (responseJson) {
				alert(JSON.stringify(responseJson));
			})
			.catch(function (error) {
				alert(JSON.stringify(error));
			});
	}

	render() {
		return (
			<View style={styles.container}>
				<View style={{ width: '80%' }}>
					<Text style={styles.text}>Enter OTP</Text>
					<TextInput
						style={styles.textInput}
						onChangeText={OTP => this.setState({ OTP })}
						value={this.state.OTP}
						underlineColorAndroid="orange"
					/>
				</View>

				<TouchableOpacity onPress={() => this.generateOtp()} style={styles.button}>
					<Text style={styles.buttonText}>Validate OTP</Text>
				</TouchableOpacity>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: '#F5FCFF'
	},
	button: {
		borderWidth: 1,
		borderRadius: 5,
		backgroundColor: 'orange',
		borderColor: 'red',
		marginTop: 15
	},
	buttonText: {
		fontSize: 15,
		color: 'black',
		fontFamily: 'GoogleSans-Medium',
		paddingTop: 10,
		paddingBottom: 10,
		paddingLeft: 25,
		paddingRight: 25
	},
	text: {
		color: 'black',
		fontSize: 15
	},
	textInput: {}
});
