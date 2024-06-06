import React from 'react';
import { View, BackHandler } from 'react-native';
//import { Calculator } from 'react-native-calculator'

export default class CalculatorScreen extends React.Component {
	componentDidMount() {
		BackHandler.addEventListener('hardwareBackPress', this.props.navigation.goBack);
	}

	render() {
		return <View style={{ flex: 1 }}></View>;
	}
}
