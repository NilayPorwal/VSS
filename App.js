import React, { Component } from 'react';
import { Alert, BackHandler, Text } from 'react-native';
import { RootStack } from './src/Components/Navigation';
import JailMonkey from 'jail-monkey';

export default class App extends Component {
	constructor(props) {
		super(props);
	}

	componentDidMount() {
		if (!__DEV__) {
			console.log = () => {};
		}
		if (JailMonkey.isJailBroken()) {
			Alert.alert('', 'This app does not support rooted devices', [
				{
					text: 'Ok',
					onPress: () => {
						BackHandler.exitApp();
						return true;
					}
				}
			]);
		}
	}

	render() {
		console.disableYellowBox = true;
		Text.defaultProps = Text.defaultProps || {};
		Text.defaultProps.allowFontScaling = false;
		Text.defaultProps.adjustsFontSizeToFit = true;
		return !JailMonkey.isJailBroken() ? <RootStack /> : null;
	}
}
