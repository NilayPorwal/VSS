import React, { Component } from 'react';
import {
	Platform,
	StyleSheet,
	Text,
	View,
	Linking,
	Image,
	TouchableOpacity,
	ToastAndroid,
	Dimensions,
	BackHandler,
	ImageBackground,
	KeyboardAvoidingView,
	ScrollView,
	TextInput,
	Alert,
	Modal,
	TouchableWithoutFeedback,
	AsyncStorage,
	ActivityIndicator,
	CheckBox,
	WebView
} from 'react-native';
import LocalStorageManager from './Managers/LocalStorageManager';
import APIManager from './Managers/APIManager';
import { Base64 } from 'js-base64';
import Loader from 'react-native-modal-loader';
import Icon from 'react-native-vector-icons/Feather';

const { height, width } = Dimensions.get('window');

const circleData = [
	{
		circle: 'Bhratapur Circle',
		data: [
			{ Designation: 'ZCE (BZ) Bharatpur(Except Bharatpur City)', TN: '5644-236080' },
			{ Designation: 'TA to ZCE (BZ) Bharatpur', TN: '5644-236080' },
			{ Designation: 'SE (O&M) Bharatpur Except Bharatpur City)', TN: '5644-236282' },
			{ Designation: 'TA to SE Bharatpur', TN: '5644-236870' },
			{ Designation: 'XEN (O&M) Bharatpur(Except Bharatpur City)', TN: '5644-225533' },
			{ Designation: 'AEN (A-I) Bharatpur(Except Bharatpur City) ', TN: '5644-228204' }
		]
	},

	{
		circle: 'Alwar Circle',
		data: [
			{ Designation: 'SE (O&M) Alwar', TN: '144-2701960' },
			{ Designation: 'TA to SE Alwar', TN: '-' },
			{ Designation: 'XEN (CD) Alwar', TN: '144-2701450' },
			{ Designation: 'AEN (A-I) Alwar', TN: '144-2700707' },
			{ Designation: 'AEN (A-II) Alwar', TN: '144-2342973' },
			{ Designation: 'AEN (A-III) Alwar', TN: '144-2338532' }
		]
	},

	{
		circle: 'Jhalawar Circle',
		data: [
			{ Designation: 'SE (O&M) Jhalawar', TN: '7432-230030' },
			{ Designation: 'TA to SE', TN: '7432-230030' },
			{ Designation: 'XEN-I (O&M) Jhalawar', TN: '7432-230452' },
			{ Designation: 'AEN (U) Jhalawar', TN: '7432-232319' },
			{ Designation: 'AEN (U) Jhalrapatan', TN: '7432-240016' },
			{ Designation: 'AEN (O&M) Bakni', TN: '7432-245624' }
		]
	},

	{
		circle: 'Baran Circle',
		data: [
			{ Designation: 'SE (O&M) Baran', TN: '07453-237120' },
			{ Designation: 'TA To SE Baran', TN: '-' },
			{ Designation: 'XEN (CD) Baran', TN: '07453-237046' },
			{ Designation: 'AEN (O&M A-I) Baran', TN: '07453-230027' },
			{ Designation: 'AEN (O&M A-II) Baran', TN: '07453-211456' },
			{ Designation: 'AEN (O&M) Anta', TN: '07457-244240' }
		]
	},

	{
		circle: 'Bundi Circle',
		data: [
			{ Designation: 'SE (O&M)Bundi', TN: '0747-2445424' },
			{ Designation: 'TA to SE', TN: '0747-2445424' },
			{ Designation: 'XEN (D-I) Bundi', TN: '0747-2443770' },
			{ Designation: 'AEN (A-I) Bundi', TN: '0747-2447933' },
			{ Designation: 'AEN (A-II) Bundi', TN: '0747-2457645' },
			{ Designation: 'AEN (O&M)Taleda', TN: '0747-2438508' }
		]
	},

	{
		circle: 'Dausa Circle',
		data: [
			{ Designation: 'SE (O&M) Dausa', TN: '1427-231123' },
			{ Designation: 'XEN - TA to SE Dausa', TN: '-' },
			{ Designation: 'XEN (O&M) Dausa', TN: '1427-230101' },
			{ Designation: 'AEN (A.I) Dausa', TN: '1427-230050' },
			{ Designation: 'AEN (A.II) Dausa', TN: '1427-230409' },
			{ Designation: 'AEN (O&M) N.Rajawatan', TN: '1431-260110' }
		]
	},

	{
		circle: 'Dholpur Circle',
		data: [
			{ Designation: 'SE (O&M)Dholpur', TN: '05642-220024' },
			{ Designation: 'TA to SE', TN: '05642-220010' },
			{ Designation: 'Feeder Manager', TN: '-' },
			{ Designation: 'XEN (CD) Dholpur', TN: '05642-220850' },
			{ Designation: 'AEN (A-I) Dhoplur', TN: '05642-220641' },
			{ Designation: 'AEN (A-II) Dhoplur', TN: '05642-224808' }
		]
	},

	{
		circle: 'Kota Circle',
		data: [
			{ Designation: 'Zonal CE, Kota', TN: '0744-2320156' },
			{ Designation: 'TA to ZCE Kota', TN: '0744-2320156' },
			{ Designation: 'SE (O&M), Kota', TN: '744-2324192' },
			{ Designation: 'TA to SE', TN: '744-2323638' },
			{ Designation: 'XEN (CD-I)', TN: '744-2423050' },
			{ Designation: 'AEN (A-I) Kota', TN: '744-2476304' }
		]
	},

	{
		circle: 'Sawai Madhopur Circle',
		data: [
			{ Designation: 'SE (O&M) SWM', TN: '7462-220563' },
			{ Designation: 'TA To SE Sawaimadhopur', TN: '7462-220563' },
			{ Designation: 'XEN (O&M)SWM', TN: '7462-220352' },
			{ Designation: 'AEN (A-I) Sawaimadhopur', TN: '7462-234135' },
			{ Designation: 'AEN (A-II) Sawaimadhopur', TN: '7462-220428' },
			{ Designation: 'AEN (O&M) Bonli', TN: '7466-247235' }
		]
	},

	{
		circle: 'Karauli Circle',
		data: [
			{ Designation: 'SE (O&M) Karauli', TN: '7464-220014' },
			{ Designation: 'TA to SE', TN: '-' },
			{ Designation: 'XEN (O&M) Karauli', TN: '7469-224346' },
			{ Designation: 'AEN (O&M) Karauli', TN: '7464-220049' },
			{ Designation: 'AEN (O&M) Shri Mahveer Ji', TN: '7469-224346' },
			{ Designation: 'AEN (O&M) Sapotra', TN: '7465-250156' }
		]
	}
];

export default class CircleDetails extends Component {
	constructor(props) {
		super(props);
		this.state = {};
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
		BackHandler.addEventListener('hardwareBackPress', this.props.navigation.goBack);
	}

	renderWeightRow(datum) {
		return (
			<View style={{ alignSelf: 'stretch', flexDirection: 'row' }}>
				<View
					style={{
						flex: 1,
						alignSelf: 'stretch',
						alignItems: 'center',
						borderBottomWidth: 1,
						borderRightWidth: 1,
						borderLeftWidth: 1,
						paddingVertical: 10,
						backgroundColor: '#ffffff'
					}}
				>
					<Text style={{ color: '#000000', textAlign: 'center' }}>{datum.Designation}</Text>
				</View>
				<View
					style={{
						flex: 1,
						alignSelf: 'stretch',
						alignItems: 'center',
						borderBottomWidth: 1,
						borderRightWidth: 1,
						paddingVertical: 10,
						backgroundColor: '#ffffff'
					}}
				>
					<Text style={{ color: '#000000' }}>{datum.TN}</Text>
				</View>
			</View>
		);
	}

	render() {
		return (
			<View style={styles.container}>
				<ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1, padding: 15 }}>
					<View style={{ flexDirection: 'row' }}>
						<TouchableOpacity onPress={() => this.props.navigation.goBack()}>
							<Icon name="chevron-left" size={20} color="#000000" style={{}} />
						</TouchableOpacity>
						<View style={{ width: '80%' }}>
							<Text style={{ fontSize: 18, fontFamily: 'GoogleSans-Medium', color: '#FF9966', textAlign: 'center' }}>
								{this.props.navigation.state.params.title}
							</Text>
						</View>
					</View>

					<View style={{ alignSelf: 'stretch', flexDirection: 'row', marginTop: 20 }}>
						<View
							style={{
								flex: 1,
								alignSelf: 'stretch',
								alignItems: 'center',
								borderWidth: 1,
								paddingVertical: 10,
								backgroundColor: '#FF9966'
							}}
						>
							<Text style={{ fontFamily: 'GoogleSans-Medium', color: '#000000', textAlign: 'center' }}>
								Designation and Name of Office
							</Text>
						</View>
						<View
							style={{
								flex: 1,
								alignSelf: 'stretch',
								alignItems: 'center',
								borderRightWidth: 1,
								borderBottomWidth: 1,
								borderTopWidth: 1,
								paddingVertical: 10,
								backgroundColor: '#FF9966'
							}}
						>
							<Text style={{ fontFamily: 'GoogleSans-Medium', color: '#000000' }}>Telephone Number</Text>
						</View>
					</View>

					<View style={{ flex: 1, alignItems: 'center' }}>
						{circleData[this.props.navigation.state.params.index].data.map((datum, key) => {
							return this.renderWeightRow(datum);
						})}
					</View>
				</ScrollView>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1
	}
});
