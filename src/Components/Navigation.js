import React, { Component } from 'react';
import { StackNavigator } from 'react-navigation';
import InspectionsPerformed from './InspectionsPerformed';
import InspectionsInProcess from './InspectionsInProcess';
import StartInspectionScreen from './StartInspectionScreen';
import ActiveSiteOffers from './ActiveSiteOffers';
import SiteOffersDetails from './SiteOffersDetails';
import SamplingMaterial from './SamplingMaterialScreen';
import AcceptedSiteOffers from './AcceptedSiteOffers';
import MaterialInspected from './MaterialInspected';
import Inspection from './InspectionScreen';
import AcceptanceTest from './TestScreens/AcceptanceTestScreen';
import BecStandards from './BecStandards';
import SamplingList from './SamplingList';
import LogInScreen from './LogInScreen';
import OtpScreen from './OtpScreen';
import GTPTestScreen from './TestScreens/GTPTestScreen';
import DrawingTest from './TestScreens/DrawingTest';
import ObservationsScreen from './TestScreens/ObservationsScreen';
import CalculatorScreen from './Calculator';
import PDIOfferScreen from './vendor_login/PDIOfferScreen';
import OfferToBeSubmitted from './vendor_login/OfferToBeSubmitted';
import ConfirmInspectionScreen from './ConfirmInspectionScreen';
import InspectorConfirmationScreen from './vendor_login/InspectorConfirmationScreen';
import NominationConfirmation from './NominationConfirmation';
import RequestSiteOffer from './vendor_login/RequestSiteOffer';
import GenerateSiteOffer from './vendor_login/GenerateSiteOffer';
import SealDetails from './SealDetails';
import LandingScreen from './LandingScreen';
import AboutUsScreen from './AboutUsScreen';
import ContactUsScreen from './ContactUsScreen';
import CircleDetails from './CircleDetails';
import FeedbackScreen from './FeedbackScreen';
import { SignUpScreen } from './SignUpScreen';
import { SplashScreen } from './SplashScreen';
import { APIScreen } from './Managers/APIScreen';
import PublicUserScreen from './PublicUserScreen';
import ComplaintsScreen from './ComplaintsScreen';
import { AddressConfirmation } from './vendor_login/AddressConfirmation';
import EditSamplingRatio from './EditSamplingRatio';
import GPInspection from './GPInspection';
import GPTestScreen from './GPTestScreen';
import GPVendIntimation from './GPVendIntimation';
import GPConfirmInspectionScreen from './GPConfirmInspectionScreen';
import GPInspectorConfirmationScreen from './vendor_login/GPInspectorConfirmationScreen';
import HomeScreen from './HomeScreen';
import SetwInspection from './SetwInspection';
import MMInspection from './MMInspection';

export const RootStack = StackNavigator({
	SplashScreen: {
		screen: SplashScreen
	},
	LandingScreen: {
		screen: LandingScreen,
		navigationOptions: {
			gesturesEnabled: false
		}
	},

	LogInScreen: {
		screen: LogInScreen
	},
	OtpScreen: {
		screen: OtpScreen,
		navigationOptions: {
			gesturesEnabled: false
		}
	},

	HomeScreen: {
		screen: HomeScreen,
		navigationOptions: {
			gesturesEnabled: false
		}
	},

	MMInspection: {
		screen: MMInspection,
		navigationOptions: {
			gesturesEnabled: false
		}
	},
	SetwInspection: {
		screen: SetwInspection
	},
	Calculator: {
		screen: CalculatorScreen
	},
	InspectionsPerformed: {
		screen: InspectionsPerformed
	},
	InspectionsInProcess: {
		screen: InspectionsInProcess
	},

	ActiveSiteOffers: {
		screen: ActiveSiteOffers
	},
	StartInspectionScreen: {
		screen: StartInspectionScreen
	},
	SiteOffersDetails: {
		screen: SiteOffersDetails
	},
	SamplingMaterial: {
		screen: SamplingMaterial
	},

	AcceptedSiteOffers: {
		screen: AcceptedSiteOffers
	},
	MaterialInspected: {
		screen: MaterialInspected
	},
	Inspection: {
		screen: Inspection
	},
	AcceptanceTest: {
		screen: AcceptanceTest
	},
	BecStandards: {
		screen: BecStandards
	},

	SamplingList: {
		screen: SamplingList
	},
	GTPTestScreen: {
		screen: GTPTestScreen
	},

	DrawingTest: {
		screen: DrawingTest
	},
	ObservationsScreen: {
		screen: ObservationsScreen
	},
	APIScreen: {
		screen: APIScreen
	},
	PDIOfferScreen: {
		screen: PDIOfferScreen
	},
	OfferToBeSubmitted: {
		screen: OfferToBeSubmitted
	},
	NominationConfirmation: {
		screen: NominationConfirmation
	},
	ConfirmInspectionScreen: {
		screen: ConfirmInspectionScreen
	},
	InspectorConfirmationScreen: {
		screen: InspectorConfirmationScreen
	},
	RequestSiteOffer: {
		screen: RequestSiteOffer
	},
	GenerateSiteOffer: {
		screen: GenerateSiteOffer
	},
	SealDetails: {
		screen: SealDetails
	},

	AboutUsScreen: {
		screen: AboutUsScreen
	},
	ContactUsScreen: {
		screen: ContactUsScreen
	},
	CircleDetails: {
		screen: CircleDetails
	},
	FeedbackScreen: {
		screen: FeedbackScreen
	},
	SignUpScreen: {
		screen: SignUpScreen
	},
	PublicUserScreen: {
		screen: PublicUserScreen
	},
	ComplaintsScreen: {
		screen: ComplaintsScreen
	},
	AddressConfirmation: {
		screen: AddressConfirmation
	},
	EditSamplingRatio: {
		screen: EditSamplingRatio
	},
	GPInspection: {
		screen: GPInspection
	},
	GPTestScreen: {
		screen: GPTestScreen
	},
	GPVendIntimation: {
		screen: GPVendIntimation
	},
	GPConfirmInspectionScreen: {
		screen: GPConfirmInspectionScreen
	},
	GPInspectorConfirmationScreen: {
		screen: GPInspectorConfirmationScreen
	}
});
