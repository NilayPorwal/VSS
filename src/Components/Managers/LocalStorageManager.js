/**
 *  LocalStorageManager.js manages get/set methods from local storage.
 */

import React from 'react';
import { AsyncStorage } from 'react-native';

export default class LocalStorageManager {
	/**
	 * Get value for key
	 */
	static getValueForKey(key, success) {
		try {
			AsyncStorage.getItem(key).then(value => {
				success(value);
			});
		} catch (error) {
			console.log('LocalStorageManager - Unable to retrieve value for key ' + key + '.');
		}
	}

	/**
	 * Set if user logged in
	 */
	static setUserLoggedIn() {
		AsyncStorage.setItem('User_Logged_In', '1');
	}

	/**
	 * Get if user logged in
	 */
	static isUserLoggedIn(success) {
		this.getValueForKey('User_Logged_In', value => {
			if (value === '1') {
				success(true);
			} else {
				success(false);
			}
		});
	}

	/**
	 * Set if user facebook logged in
	 */
	static setUserFacebookLoggedIn() {
		AsyncStorage.setItem('User_Facebook_Logged_In', '1');
	}

	/**
	 * Get if user facebook logged in or not
	 */
	static isUserFacebookLoggedIn(success) {
		this.getValueForKey('User_Facebook_Logged_In', value => {
			if (value === '1') {
				success(true);
			} else {
				success(false);
			}
		});
	}

	/**
	 * Set if user facebook logged in
	 */
	static setUserInstagramLoggedIn() {
		AsyncStorage.setItem('User_Instagram_Logged_In', '1');
	}

	/**
	 * Get if user facebook logged in or not
	 */
	static isUserInstagramLoggedIn(success) {
		this.getValueForKey('User_Instagram_Logged_In', value => {
			if (value === '1') {
				success(true);
			} else {
				success(false);
			}
		});
	}
}
