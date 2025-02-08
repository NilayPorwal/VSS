import React from 'react';
import { Base64 } from 'js-base64';
import { getData } from '../../helper';

export default class APIManager {
	/** API Host URL for login */
	//static host = 'https://vendormitra.com/vss-api/';
	//static host = 'http://vendormitra.com:8080/vss-api/';
	//static host = 'https://jvvnl1.ugoerp.com/vss-api/';
	static host = 'https://jvvnlvendor.ugoerp.com/vss-api/'; //LIVE URL
	// static host = 'http://137.116.54.31:8080/vss-api/';
	// static host = 'http://192.168.1.22:8081/vss-api/'
	//static host = 'http://3.108.75.42:8080/vss-api/';

	//static host = 'http://192.168.43.123:8081/vss-api/'
	//static host = 'http://192.168.1.48:8080/vss-api/'
	//  static host = 'http://192.168.1.201:8080/vss-api/'

	static Sso_Id;

	static Api_Key;

	static User_Id;

	static Map_Id;

	static isDev = false;

	/** API credentials  */

	static getCredentials() {
		getData('ssoId').then(value => {
			if (value != null) {
				APIManager.Sso_Id = value.toString();
			}
		});
		getData('apiSeceretKey').then(value => {
			if (value != null) {
				APIManager.Api_Key = value.toString();
			}
		});
		getData('userId').then(value => {
			if (value != null) {
				APIManager.User_Id = value.toString();
			}
		});

		getData('InspId').then(value => {
			if (value != null) {
				APIManager.Map_Id = value.toString();
			}
		});
	}

	static getAPI() {
		getData('api').then(value => {
			if (value != null) {
				APIManager.host = value;
			}
		});
	}

	static getApiKey(success) {
		try {
			getData('apiSeceretKey').then(value => {
				success(value);
				APIManager.getApiKey = value;
			});
		} catch (error) {
			console.log(error);
		}
	}

	/** API credentials  */
	//static credentials = 'rajatjn10@gmail.com:Abcd1234@'
	// static credentials = 'nilay@skyras.in:Abcd1234@'
	// static credentials = 'ins@vendormitra.com'+':'+'j74XdYZt0O6EFNnekSP3EsEVc3Lr2pVA'

	static credentials = APIManager.Sso_Id + ':' + APIManager.Api_Key;
	static hash = Base64.encode(APIManager.credentials);
	static Basic = 'Basic ' + APIManager.hash;

	/**
	 * Sign In API
	 */
	static signin(username, password, success, failure) {
		//alert( APIManager.host + 'public/ssomobile/login?username='+ username + '&password='+ password)

		fetch(APIManager.host + 'public/ssomobile/login?username=' + username + '&password=' + password, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			}
		})
			.then(response => response.json())

			.then(responseJson => {
				//alert(JSON.stringify(responseJson));
				try {
					console.log(JSON.stringify(responseJson));
					success(responseJson);
				} catch (error) {
					failure(error);
				}
			})
			.catch(error => {
				failure(error);
				console.log(JSON.stringify(error));
				//alert(JSON.stringify(error));
			});
	}

	/**
	 * OTP GENERATOR API
	 */

	static getOTP(mobile, success, failure) {
		fetch(APIManager.host + 'public/sso/otp/generator?title=LOGIN_OTP_MSG_MOBILE&type=m&receiver=' + mobile, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			}
		})
			.then(response => response.json())
			.then(responseJson => {
				try {
					// alert(JSON.stringify(responseJson));
					success(responseJson);
				} catch (error) {
					failure(error);
				}
			})
			.catch(error => {
				failure(error);
			});
	}

	/**
	 * OTP VALIDATION API
	 */
	static validateOTP(otp, mh, success, failure) {
		fetch(APIManager.host + 'public/sso/otp/validation?otpValue=' + otp + '&hash=' + mh, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			}
		})
			.then(response => response.json())
			.then(responseJson => {
				try {
					// alert(JSON.stringify(responseJson));
					success(responseJson);
				} catch (error) {
					failure(error);
				}
			})
			.catch(error => {
				failure(error);
			});
	}

	/**
	 * Get Vendor Information
	 */
	static getVendorDetails(item, success, failure) {
		// alert(APIManager.host + 'v1/inspector/vendor/information/get?vendorId=' + item)
		fetch(APIManager.host + 'v1/inspector/vendor/information/get?vendorId=' + item, {
			method: 'GET',
			headers: {
				Authorization: APIManager.Basic,
				'Content-Type': 'application/json'
			}
		})
			.then(response => response.json())
			.then(responseJson => {
				try {
					// alert(JSON.stringify(responseJson));
					success(responseJson);
				} catch (error) {
					failure(error);
				}
			})
			.catch(error => {
				failure(error);
			});
	}

	/**
	 * Get list of vendors
	 */

	static getVendorList(inspId, from = '', success, failure) {
		const credentials = APIManager.Sso_Id + ':' + APIManager.Api_Key;
		const hash = Base64.encode(credentials);
		const Basic = 'Basic ' + hash;
		//alert(APIManager.host + 'v1/inspector/vendor/list?inspectorId='+ inspId)
		fetch(APIManager.host + 'v1/inspector/' + from + '/vendor/list?inspectorId=' + inspId + '&status=0', {
			method: 'POST',
			headers: {
				Authorization: Basic,
				'Content-Type': 'application/json'
			}
		})
			.then(response => response.json())
			.then(responseJson => {
				try {
					// alert(JSON.stringify(responseJson));
					success(responseJson);
				} catch (error) {
					failure(error);
				}
			})
			.catch(error => {
				//alert(JSON.stringify(error));
				failure(error);
			});
	}

	/**
	 * Get list of active site offers
	 */

	static getSiteOffersList(inspId, vendrId, nomId, from = '', success, failure) {
		const credentials = APIManager.Sso_Id + ':' + APIManager.Api_Key;
		const hash = Base64.encode(credentials);
		const Basic = 'Basic ' + hash;
		//alert(APIManager.host + 'v1/inspection/nomini/inpector?insId='+inspId+'&vndrId='+vendrId+'&nomId='+nomId)
		fetch(
			APIManager.host +
				'v1/inspection/' +
				from +
				'/nomini/inpector?insId=' +
				inspId +
				'&vndrId=' +
				vendrId +
				'&nomId=' +
				nomId,
			{
				method: 'POST',
				headers: {
					Authorization: Basic,
					'Content-Type': 'application/json'
				}
			}
		)
			.then(response => response.json())
			.then(responseJson => {
				try {
					// alert(JSON.stringify(responseJson));
					success(responseJson);
				} catch (error) {
					failure(error);
				}
			})
			.catch(error => {
				failure(error);
				//alert(JSON.stringify(error));
			});
	}

	/**
	 * Get  site offers details
	 */

	static getSiteOfferDetails(inspId, vendrId, woId, matId, matscId, pdiId, from = '', success, failure) {
		const credentials = APIManager.Sso_Id + ':' + APIManager.Api_Key;
		const hash = Base64.encode(credentials);
		const Basic = 'Basic ' + hash;
		// alert(APIManager.host + 'v1/inspection/detaills?insId='+inspId+'&vndrId='+vendrId+'&woId='+woId+'&matId='+matId+'&matscId='+matscId+'&pdiId='+pdiId)
		fetch(
			APIManager.host +
				'v1/inspection/' +
				from +
				'/detaills?insId=' +
				inspId +
				'&vndrId=' +
				vendrId +
				'&woId=' +
				woId +
				'&matId=' +
				matId +
				'&matscId=' +
				matscId +
				'&pdiId=' +
				pdiId,
			{
				method: 'POST',
				headers: {
					Authorization: Basic,
					'Content-Type': 'application/json'
				}
			}
		)
			.then(response => response.json())
			.then(responseJson => {
				try {
					success(responseJson);
				} catch (error) {
					failure(error);
				}
			})
			.catch(error => {
				failure(error);
			});
	}

	/**
	 * Get  material series
	 */

	static getMaterialSeries(Details, siteId, from = '', success, failure) {
		const credentials = APIManager.Sso_Id + ':' + APIManager.Api_Key;
		const hash = Base64.encode(credentials);
		const Basic = 'Basic ' + hash;

		fetch(APIManager.host + 'v1/material/' + from + 'srno/list?siteId=' + siteId, {
			method: 'POST',
			headers: {
				loggedInUserId: APIManager.User_Id,
				Authorization: Basic,
				'Content-Type': 'application/json'
			},
			body: Details
		})
			.then(response => response.json())
			.then(responseJson => {
				try {
					//alert(JSON.stringify(responseJson));
					success(responseJson);
				} catch (error) {
					failure(error);
				}
			})
			.catch(error => {
				failure(error);
			});
	}

	/**
	 * Add material series
	 */

	static addMaterialSeries(Details, siteId, success, failure) {
		const credentials = APIManager.Sso_Id + ':' + APIManager.Api_Key;
		const hash = Base64.encode(credentials);
		const Basic = 'Basic ' + hash;

		fetch(APIManager.host + 'v1/material/srno/add?siteId=' + siteId, {
			method: 'POST',
			headers: {
				loggedInUserId: APIManager.User_Id,
				Authorization: Basic,
				'Content-Type': 'application/json'
			},
			body: Details
		})
			.then(response => response.json())
			.then(responseJson => {
				console.log(JSON.stringify(responseJson));
				try {
					//alert(JSON.stringify(responseJson));
					success(responseJson);
				} catch (error) {
					failure(error);
				}
			})
			.catch(error => {
				failure(error);
			});
	}

	/**
	 * Delete material series
	 */

	static deleteMaterialSeries(insMatId, from = '', success, failure) {
		const credentials = APIManager.Sso_Id + ':' + APIManager.Api_Key;
		const hash = Base64.encode(credentials);
		const Basic = 'Basic ' + hash;

		fetch(APIManager.host + 'v1/material/' + from + '/srno/delete?insMatId=' + insMatId, {
			method: 'POST',
			headers: {
				loggedInUserId: APIManager.User_Id,
				Authorization: Basic,
				'Content-Type': 'application/json'
			}
		})
			.then(response => response.json())
			.then(responseJson => {
				try {
					//alert(JSON.stringify(responseJson));
					success(responseJson);
				} catch (error) {
					failure(error);
				}
			})
			.catch(error => {
				failure(error);
			});
	}

	/**
	 * On Start Inspection
	 */

	static updateMatInspStatus(Details, from = '', success, failure) {
		const credentials = APIManager.Sso_Id + ':' + APIManager.Api_Key;
		const hash = Base64.encode(credentials);
		const Basic = 'Basic ' + hash;

		fetch(APIManager.host + 'v1/material/' + from + '/status/update', {
			method: 'POST',
			headers: {
				loggedInUserId: APIManager.User_Id,
				Authorization: Basic,
				'Content-Type': 'application/json'
			},
			body: Details
		})
			.then(response => response.json())
			.then(responseJson => {
				try {
					//alert(JSON.stringify(responseJson));
					success(responseJson);
				} catch (error) {
					failure(error);
				}
			})
			.catch(error => {
				failure(error);
			});
	}

	/**
	 * Upload  Acceptance test details
	 */

	static uploadAcceptanceTest(Details, from = '', success, failure) {
		const credentials = APIManager.Sso_Id + ':' + APIManager.Api_Key;
		const hash = Base64.encode(credentials);
		const Basic = 'Basic ' + hash;
		//alert(APIManager.User_Id)
		fetch(APIManager.host + 'v1/inspector/inspection/' + from + '/acceptance/test', {
			method: 'POST',
			headers: {
				loggedInUserId: APIManager.User_Id,
				Authorization: Basic,
				'Content-Type': 'application/json'
			},
			body: Details
		})
			.then(response => response.json())
			.then(responseJson => {
				try {
					//alert(JSON.stringify(responseJson));
					success(responseJson);
				} catch (error) {
					failure(error);
				}
			})
			.catch(error => {
				failure(error);
				//alert(JSON.stringify(error));
			});
	}

	/**
	 * Upload  Drawing  test details
	 */

	static uploadDrawing(success, failure) {
		const credentials = APIManager.Sso_Id + ':' + APIManager.Api_Key;
		const hash = Base64.encode(credentials);
		const Basic = 'Basic ' + hash;

		fetch(APIManager.host + 'v1/inspector/inspection/approve/drawing', {
			method: 'POST',
			headers: {
				loggedInUserId: APIManager.User_Id,
				Authorization: Basic,
				'Content-Type': 'application/json'
			}
		})
			.then(response => response.json())
			.then(responseJson => {
				try {
					//alert(JSON.stringify(responseJson));
					success(responseJson);
				} catch (error) {
					failure(error);
				}
			})
			.catch(error => {
				failure(error);
				//alert(JSON.stringify(error));
			});
	}

	/**
	 * Upload  Observation  test details
	 */

	static uploadObservations(Details, from = '', success, failure) {
		const credentials = APIManager.Sso_Id + ':' + APIManager.Api_Key;
		const hash = Base64.encode(credentials);
		const Basic = 'Basic ' + hash;

		fetch(APIManager.host + 'v1/inspector/inspection/' + from + '/observation', {
			method: 'POST',
			headers: {
				loggedInUserId: APIManager.User_Id,
				Authorization: Basic,
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(Details)
		})
			.then(response => response.json())
			.then(responseJson => {
				try {
					//alert(JSON.stringify(responseJson));
					success(responseJson);
				} catch (error) {
					failure(error);
				}
			})
			.catch(error => {
				failure(error);
				//alert(JSON.stringify(responseJson));
			});
	}

	/**
	 * get GTP  Test List
	 */

	static getGTPList(matId, matscId, woId, from = '', success, failure) {
		const credentials = APIManager.Sso_Id + ':' + APIManager.Api_Key;
		const hash = Base64.encode(credentials);
		const Basic = 'Basic ' + hash;
		//alert(APIManager.host+'v1/gtp/get/list/bywo?matId='+matId +'&matscId='+matscId+'&woId='+woId)
		fetch(
			APIManager.host + 'v1/gtp/get/list/' + from + '/ofwo?matId=' + matId + '&matscId=' + matscId + '&woId=' + woId,
			{
				method: 'POST',
				headers: {
					loggedInUserId: APIManager.User_Id,
					Authorization: Basic,
					'Content-Type': 'application/json'
				}
			}
		)
			.then(response => response.json())
			.then(responseJson => {
				try {
					//alert(JSON.stringify(responseJson));
					success(responseJson);
				} catch (error) {
					failure(error);
				}
			})
			.catch(error => {
				failure(error);
			});
	}

	/**
	 * add GTP  material Status
	 */

	static addGTPStatus(Details, from = '', success, failure) {
		const credentials = APIManager.Sso_Id + ':' + APIManager.Api_Key;
		const hash = Base64.encode(credentials);
		const Basic = 'Basic ' + hash;
		//alert(APIManager.host+'v1/inspector/inspection/gtp')
		fetch(APIManager.host + 'v1/inspector/inspection/' + from + '/gtp', {
			method: 'POST',
			headers: {
				loggedInUserId: APIManager.User_Id,
				Authorization: Basic,
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(Details)
		})
			.then(response => response.json())
			.then(responseJson => {
				try {
					success(responseJson);
				} catch (error) {
					failure(error);
				}
			})
			.catch(error => {
				failure(error);
			});
	}

	/**
	 *  UpLoad test status  on site offer details screen
	 */

	static uploadStatus(Details, success, failure) {
		const credentials = APIManager.Sso_Id + ':' + APIManager.Api_Key;
		const hash = Base64.encode(credentials);
		const Basic = 'Basic ' + hash;
		//alert( APIManager.host+'v1/vendor/site/offer/stats/update')
		fetch(APIManager.host + 'v1/vendor/site/offer/stats/update', {
			method: 'POST',
			headers: {
				loggedInUserId: APIManager.User_Id,
				Authorization: Basic,
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(Details)
		})
			.then(response => response.json())
			.then(responseJson => {
				try {
					//alert(JSON.stringify(responseJson));
					success(responseJson);
				} catch (error) {
					failure(error);
				}
			})
			.catch(error => {
				failure(error);
			});
	}

	/**
	 *  UpLoad test status on SamplingMaterial Screen and MaterialInspected Screen
	 */

	static uploadTestStatus(Details, from = '', success, failure) {
		const credentials = APIManager.Sso_Id + ':' + APIManager.Api_Key;
		const hash = Base64.encode(credentials);
		const Basic = 'Basic ' + hash;
		//alert(APIManager.host+'v1/vendor/site/offer/inspction/stats/update')
		fetch(APIManager.host + 'v1/vendor/site/offer/' + from + '/inspction/stats/update', {
			method: 'POST',
			headers: {
				loggedInUserId: APIManager.User_Id,
				Authorization: Basic,
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(Details)
		})
			.then(response => response.json())
			.then(responseJson => {
				try {
					//alert(JSON.stringify(responseJson));
					success(responseJson);
				} catch (error) {
					failure(error);
				}
			})
			.catch(error => {
				failure(error);
			});
	}

	/**
	 *  check Test material Status on inspection screen
	 */

	static checkTestStatus(inspMatId, from = '', success, failure) {
		const credentials = APIManager.Sso_Id + ':' + APIManager.Api_Key;
		const hash = Base64.encode(credentials);
		const Basic = 'Basic ' + hash;
		//alert(APIManager.host+'v1/inspector/inspection/gtp')
		fetch(APIManager.host + 'v1/material/insption/' + from + '/test/count?inspectionMatAiId=' + inspMatId, {
			method: 'POST',
			headers: {
				loggedInUserId: APIManager.User_Id,
				Authorization: Basic,
				'Content-Type': 'application/json'
			}
		})
			.then(response => response.json())
			.then(responseJson => {
				try {
					//alert(JSON.stringify(responseJson));
					success(responseJson);
				} catch (error) {
					failure(error);
				}
			})
			.catch(error => {
				failure(error);
			});
	}

	/**
	 *  get Approved DownLoad Link
	 */

	static getDownloadLink(woId, from = '', success, failure) {
		const credentials = APIManager.Sso_Id + ':' + APIManager.Api_Key;
		const hash = Base64.encode(credentials);
		const Basic = 'Basic ' + hash;
		// alert(APIManager.host+'public/sso/download/image?woId='+woId)
		fetch(APIManager.host + 'public/sso/' + from + '/download/image?woId=' + woId, {
			method: 'GET',
			headers: {
				Authorization: Basic
			}
		})
			.then(response => response.json())
			.then(responseJson => {
				try {
					// alert(JSON.stringify(responseJson));
					success(responseJson);
				} catch (error) {
					failure(error);
				}
			})
			.catch(error => {
				failure(error);
				// alert(JSON.stringify(error));
			});
	}

	/**
	 *  get Approved DownLoad Link
	 */

	static getDownloadLink1(status, success, failure) {
		const credentials = APIManager.Sso_Id + ':' + APIManager.Api_Key;
		const hash = Base64.encode(credentials);
		const Basic = 'Basic ' + hash;
		//alert("http://vendormitra.com:8080/"+'public/sso/training/manual/list?status='+status)
		fetch(APIManager.host + 'public/sso/training/manual/list?status=' + status, {
			method: 'POST'
		})
			.then(response => response.json())
			.then(responseJson => {
				try {
					// alert(JSON.stringify(responseJson));
					success(responseJson);
				} catch (error) {
					failure(error);
				}
			})
			.catch(error => {
				failure(error);
				// alert(JSON.stringify(error));
			});
	}

	/**
	 *  UpLoad Lat Long on startInspection screen
	 */

	static uploadLatLong(Details, from = '', success, failure) {
		const credentials = APIManager.Sso_Id + ':' + APIManager.Api_Key;
		const hash = Base64.encode(credentials);
		const Basic = 'Basic ' + hash;

		//alert(APIManager.host+'v1/vendor/site/offer/inspction/stats/update')
		fetch(APIManager.host + 'v1/inspection/' + from + '/start/detail', {
			method: 'POST',
			headers: {
				loggedInUserId: APIManager.User_Id,
				Authorization: Basic,
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(Details)
		})
			.then(response => response.json())
			.then(responseJson => {
				try {
					//alert(JSON.stringify(responseJson));
					success(responseJson);
				} catch (error) {
					failure(error);
				}
			})
			.catch(error => {
				failure(error);
			});
	}

	/**
	 *  get Approved DownLoad Link
	 */

	static getSiteOfferPDF(inspectionSiteAiId, success, failure) {
		const credentials = APIManager.Sso_Id + ':' + APIManager.Api_Key;
		const hash = Base64.encode(credentials);
		const Basic = 'Basic ' + hash;
		// alert(APIManager.host+'public/sso/download/image?woId='+woId)
		fetch(APIManager.host + 'public/sso/download/siteoffer?inptionSiteAiId=' + inspectionSiteAiId, {
			method: 'GET',
			headers: {
				Authorization: Basic
			}
		})
			.then(response => response.json())
			.then(responseJson => {
				try {
					// alert(JSON.stringify(responseJson));
					success(responseJson);
				} catch (error) {
					failure(error);
				}
			})
			.catch(error => {
				failure(error);
				// alert(JSON.stringify(error));
			});
	}

	/**
	 *  UpLoad seal Details on MaterialInspected screen
	 */

	static uploadSealDetails(Details, from = '', success, failure) {
		const credentials = APIManager.Sso_Id + ':' + APIManager.Api_Key;
		const hash = Base64.encode(credentials);
		const Basic = 'Basic ' + hash;

		//alert(APIManager.host+'v1/seal/add')
		fetch(APIManager.host + 'v1/' + from + '/seal/add', {
			method: 'POST',
			headers: {
				loggedInUserId: APIManager.User_Id,
				Authorization: Basic,
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(Details)
		})
			.then(response => response.json())
			.then(responseJson => {
				try {
					//alert(JSON.stringify(responseJson));
					success(responseJson);
				} catch (error) {
					failure(error);
				}
			})
			.catch(error => {
				failure(error);
			});
	}

	/**
	 *  get seal Details on MaterialInspected screen
	 */

	static getSealTypeList(success, failure) {
		const credentials = APIManager.Sso_Id + ':' + APIManager.Api_Key;
		const hash = Base64.encode(credentials);
		const Basic = 'Basic ' + hash;

		//alert(APIManager.host+'v1/seal/add')
		fetch(APIManager.host + 'v1/insption/seal/list', {
			method: 'POST',
			headers: {
				loggedInUserId: APIManager.User_Id,
				Authorization: Basic,
				'Content-Type': 'application/json'
			}
		})
			.then(response => response.json())
			.then(responseJson => {
				try {
					//alert(JSON.stringify(responseJson));
					success(responseJson);
				} catch (error) {
					failure(error);
				}
			})
			.catch(error => {
				failure(error);
			});
	}

	/**
	 *  get package Details on MaterialInspected screen
	 */

	static getPackageTypeList(from = '', success, failure) {
		const credentials = APIManager.Sso_Id + ':' + APIManager.Api_Key;
		const hash = Base64.encode(credentials);
		const Basic = 'Basic ' + hash;

		//alert(APIManager.host+'v1/seal/add')
		fetch(APIManager.host + 'v1/package/type/list', {
			method: 'POST',
			headers: {
				loggedInUserId: APIManager.User_Id,
				Authorization: Basic,
				'Content-Type': 'application/json'
			}
		})
			.then(response => response.json())
			.then(responseJson => {
				try {
					//alert(JSON.stringify(responseJson));
					success(responseJson);
				} catch (error) {
					failure(error);
				}
			})
			.catch(error => {
				failure(error);
			});
	}

	/**
	 *
	 */

	static getVendorInfo(vndId, success, failure) {
		const credentials = APIManager.Sso_Id + ':' + APIManager.Api_Key;
		const hash = Base64.encode(credentials);
		const Basic = 'Basic ' + hash;

		//alert(APIManager.host+'v1/seal/add')
		fetch(APIManager.host + 'v1/vendor/information/get?vendorId=' + vndId, {
			method: 'GET',
			headers: {
				Authorization: Basic,
				'Content-Type': 'application/json'
			}
		})
			.then(response => response.json())
			.then(responseJson => {
				try {
					//alert(JSON.stringify(responseJson));
					success(responseJson);
				} catch (error) {
					failure(error);
				}
			})
			.catch(error => {
				failure(error);
			});
	}

	/**
	 *
	 */

	static getWorkOrderDetails(vndId, type, success, failure) {
		const credentials = APIManager.Sso_Id + ':' + APIManager.Api_Key;
		const hash = Base64.encode(credentials);
		const Basic = 'Basic ' + hash;
		let url;
		if (type == 'PDI') {
			url = 'v1/vendor/workorder/running/details?vendorId=' + vndId + '&state=3';
		} else {
			url = 'v1/material/double/sch/auth/list?mapId=' + vndId + '&flag=VENDOR';
		}
		//alert(APIManager.host+'v1/seal/add')
		fetch(APIManager.host + url, {
			method: 'POST',
			headers: {
				Authorization: Basic,
				'Content-Type': 'application/json'
			}
		})
			.then(response => response.json())
			.then(responseJson => {
				try {
					//alert(JSON.stringify(responseJson));
					success(responseJson);
				} catch (error) {
					failure(error);
				}
			})
			.catch(error => {
				failure(error);
			});
	}

	/**
	 *
	 */

	static getofferDetails(woAiId, materialAiId, materialSubcatAiId, type, success, failure) {
		const credentials = APIManager.Sso_Id + ':' + APIManager.Api_Key;
		const hash = Base64.encode(credentials);
		const Basic = 'Basic ' + hash;
		let url;
		if (type == 'PDI') {
			url = 'v1/material/existing/sch?woId=' + woAiId + '&matId=' + materialAiId + '&matSubCatId=' + materialSubcatAiId;
		} else {
			url =
				'v1/material/existing/double/sch?woId=' +
				woAiId +
				'&matId=' +
				materialAiId +
				'&matSubCatId=' +
				materialSubcatAiId;
		}

		//alert(APIManager.host+url)
		fetch(APIManager.host + url, {
			method: 'POST',
			headers: {
				Authorization: Basic,
				'Content-Type': 'application/json'
			}
		})
			.then(response => response.json())
			.then(responseJson => {
				try {
					//alert(JSON.stringify(responseJson));
					success(responseJson);
				} catch (error) {
					failure(error);
				}
			})
			.catch(error => {
				failure(error);
			});
	}

	/**
	 *
	 */

	static onSubmitOffer(Details, type, from = '', success, failure) {
		const credentials = APIManager.Sso_Id + ':' + APIManager.Api_Key;
		const hash = Base64.encode(credentials);
		const Basic = 'Basic ' + hash;

		let url;
		if (type == 'DDS') {
			url = 'v1/vendor/pdi/offer/of/double/delvery/sch/add';
		} else {
			url = 'v1/vendor/pdi/offer/' + from + '/add';
		}
		//alert(APIManager.host+'v1/seal/add')
		fetch(APIManager.host + url, {
			method: 'POST',
			headers: {
				loggedInUserId: APIManager.User_Id,
				Authorization: Basic,
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(Details)
		})
			.then(response => response.json())
			.then(responseJson => {
				try {
					//alert(JSON.stringify(responseJson));
					success(responseJson);
				} catch (error) {
					failure(error);
				}
			})
			.catch(error => {
				failure(error);
			});
	}

	static updateStageInspection(Details, success, failure) {
		const credentials = APIManager.Sso_Id + ':' + APIManager.Api_Key;
		const hash = Base64.encode(credentials);
		const Basic = 'Basic ' + hash;

		//alert(APIManager.host+'v1/seal/add')
		fetch(
			APIManager.host +
				'v1/vendor/pdi/offer/stage/inspection?userId=' +
				APIManager.User_Id +
				'&pdiOfferAiId=' +
				Details.pdiOfferAiId +
				'&deliverySchAiId=' +
				Details.deliverySchAiId,
			{
				method: 'POST',
				headers: {
					loggedInUserId: APIManager.User_Id,
					Authorization: Basic,
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(Details)
			}
		)
			.then(response => response.json())
			.then(responseJson => {
				try {
					//alert(JSON.stringify(responseJson));
					success(responseJson);
				} catch (error) {
					failure(error);
				}
			})
			.catch(error => {
				failure(error);
			});
	}

	/**
	 *
	 */

	static uploadImages(Details, success, failure) {
		const credentials = APIManager.Sso_Id + ':' + APIManager.Api_Key;
		const hash = Base64.encode(credentials);
		const Basic = 'Basic ' + hash;

		//alert(APIManager.host+'v1/seal/add')
		fetch(APIManager.host + 'v1/vendor/site/offer/add/packing/list/photo/details', {
			method: 'POST',
			headers: {
				loggedInUserId: APIManager.User_Id,
				Authorization: Basic,
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(Details)
		})
			.then(response => response.json())
			.then(responseJson => {
				try {
					success(responseJson);
				} catch (error) {
					failure(error);
				}
			})
			.catch(error => {
				failure(error);
			});
	}

	/**
	 *
	 */

	static getSerialNoDetials(pdiOfferAiId, success, failure) {
		const credentials = APIManager.Sso_Id + ':' + APIManager.Api_Key;
		const hash = Base64.encode(credentials);
		const Basic = 'Basic ' + hash;

		//alert(APIManager.host+'v1/seal/add')
		fetch(APIManager.host + 'v1/vendor/pdi/offer/packing/serial/no/details?pdiOfferAiId=' + pdiOfferAiId, {
			method: 'POST',
			headers: {
				loggedInUserId: APIManager.User_Id,
				Authorization: Basic,
				'Content-Type': 'application/json'
			}
		})
			.then(response => response.json())
			.then(responseJson => {
				try {
					//alert(JSON.stringify(responseJson));
					success(responseJson);
				} catch (error) {
					failure(error);
				}
			})
			.catch(error => {
				failure(error);
			});
	}

	/**
	 *
	 */

	static getRemainingDetails(woAiId, woMatMapAiId, uri, success, failure) {
		const credentials = APIManager.Sso_Id + ':' + APIManager.Api_Key;
		const hash = Base64.encode(credentials);
		const Basic = 'Basic ' + hash;
		//console.log(JSON.stringify(data))
		fetch(APIManager.host + uri + '?woAiId=' + woAiId + '&woMatMapAiId=' + woMatMapAiId, {
			method: 'POST',
			headers: {
				loggedInUserId: APIManager.User_Id,
				Authorization: Basic,
				'Content-Type': 'application/json'
			}
			// body: JSON.stringify(data)
		})
			.then(response => response.json())
			.then(responseJson => {
				try {
					success(responseJson);
				} catch (error) {
					failure(error);
				}
			})
			.catch(error => {
				failure(error);
			});
	}

	static getRemainingScheduleQty(delSchAiId, flag, success, failure) {
		const credentials = APIManager.Sso_Id + ':' + APIManager.Api_Key;
		const hash = Base64.encode(credentials);
		const Basic = 'Basic ' + hash;
		console.log(APIManager.host + 'v1/vendor/workorder/mat/single/sch/remaining/qty?delSchAiId=' + delSchAiId);
		fetch(
			APIManager.host + 'v1/vendor/workorder/mat/single/sch/remaining/qty?delSchAiId=' + delSchAiId + '&flag=' + flag,
			{
				method: 'POST',
				headers: {
					loggedInUserId: APIManager.User_Id,
					Authorization: Basic,
					'Content-Type': 'application/json'
				}
				// body: JSON.stringify(data)
			}
		)
			.then(response => response.json())
			.then(responseJson => {
				try {
					//alert(JSON.stringify(responseJson));
					console.log(JSON.stringify(responseJson));
					success(responseJson);
				} catch (error) {
					failure(error);
				}
			})
			.catch(error => {
				failure(error);
			});
	}

	/**
	 *
	 */

	static getNominationInfo(inspId, status, from = '', success, failure) {
		const credentials = APIManager.Sso_Id + ':' + APIManager.Api_Key;
		const hash = Base64.encode(credentials);
		const Basic = 'Basic ' + hash;

		//alert(APIManager.host+'v1/seal/add')
		fetch(APIManager.host + 'v1/inspector/' + from + '/vendor/list?inspectorId=' + inspId + '&status=' + status, {
			method: 'POST',
			headers: {
				loggedInUserId: APIManager.User_Id,
				Authorization: Basic,
				'Content-Type': 'application/json'
			}
		})
			.then(response => response.json())
			.then(responseJson => {
				try {
					console.log(JSON.stringify(responseJson));
					success(responseJson);
				} catch (error) {
					failure(error);
				}
			})
			.catch(error => {
				failure(error);
			});
	}

	/**
	 *    on Confirm Inspection on ConfirmInspectionScreen
	 */

	static onConfirmInsp(Details, from = '', success, failure) {
		const credentials = APIManager.Sso_Id + ':' + APIManager.Api_Key;
		const hash = Base64.encode(credentials);
		const Basic = 'Basic ' + hash;

		//alert(APIManager.host+'v1/seal/add')
		fetch(APIManager.host + 'v1/inspection/' + from + '/cnfrm/details', {
			method: 'POST',
			headers: {
				loggedInUserId: APIManager.User_Id,
				Authorization: Basic,
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(Details)
		})
			.then(response => response.json())
			.then(responseJson => {
				try {
					success(responseJson);
				} catch (error) {
					failure(error);
				}
			})
			.catch(error => {
				failure(error);
			});
	}

	/**
	 *    on Confirm Inspection on ConfirmInspectionScreen
	 */

	static getInspectorConfirmationDetails(vId, from = '', success, failure) {
		const credentials = APIManager.Sso_Id + ':' + APIManager.Api_Key;
		const hash = Base64.encode(credentials);
		const Basic = 'Basic ' + hash;

		//alert(APIManager.host+'v1/seal/add')
		fetch(APIManager.host + 'v1/vendor/' + from + '/inspection/data?vId=' + vId, {
			method: 'POST',
			headers: {
				loggedInUserId: APIManager.User_Id,
				Authorization: Basic,
				'Content-Type': 'application/json'
			}
		})
			.then(response => response.json())
			.then(responseJson => {
				try {
					//alert(JSON.stringify(responseJson));
					success(responseJson);
				} catch (error) {
					failure(error);
				}
			})
			.catch(error => {
				failure(error);
			});
	}

	/**
	 *    on Confirm By Vendor on InspectorConfirmationScreen
	 */

	static onConfirmByVendor(Details, from = '', success, failure) {
		const credentials = APIManager.Sso_Id + ':' + APIManager.Api_Key;
		const hash = Base64.encode(credentials);
		const Basic = 'Basic ' + hash;

		let endPoint = 'v1/vendorinspection/confrm';
		if (from && from == 'setw') {
			endPoint = 'v1/vendorsetw/inspection/confrm';
		}
		//alert(APIManager.host+'v1/seal/add')
		fetch(APIManager.host + endPoint, {
			method: 'POST',
			headers: {
				loggedInUserId: APIManager.User_Id,
				Authorization: Basic,
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(Details)
		})
			.then(response => response.json())
			.then(responseJson => {
				try {
					//alert(JSON.stringify(responseJson));
					success(responseJson);
				} catch (error) {
					failure(error);
				}
			})
			.catch(error => {
				failure(error);
			});
	}

	/**
	 *    get offer details for request Site offer
	 */

	static getOfferDetails(vId, success, failure) {
		const credentials = APIManager.Sso_Id + ':' + APIManager.Api_Key;
		const hash = Base64.encode(credentials);
		const Basic = 'Basic ' + hash;

		//alert(APIManager.host+'v1/seal/add')
		fetch(APIManager.host + 'v1/vendor/site/offer/get?vId=' + vId, {
			method: 'POST',
			headers: {
				loggedInUserId: APIManager.User_Id,
				Authorization: Basic,
				'Content-Type': 'application/json'
			}
		})
			.then(response => response.json())
			.then(responseJson => {
				try {
					//alert(JSON.stringify(responseJson));
					success(responseJson);
				} catch (error) {
					failure(error);
				}
			})
			.catch(error => {
				failure(error);
			});
	}

	/**
	 *    get offer details for request Site offer
	 */

	static checkForDispech(siteOfferId, success, failure) {
		const credentials = APIManager.Sso_Id + ':' + APIManager.Api_Key;
		const hash = Base64.encode(credentials);
		const Basic = 'Basic ' + hash;

		//alert(APIManager.host+'v1/seal/add')
		fetch(APIManager.host + 'v1/storewo/store/get?siteOfferId=' + siteOfferId, {
			method: 'POST',
			headers: {
				loggedInUserId: APIManager.User_Id,
				Authorization: Basic,
				'Content-Type': 'application/json'
			}
		})
			.then(response => response.json())
			.then(responseJson => {
				try {
					//alert(JSON.stringify(responseJson));
					success(responseJson);
				} catch (error) {
					failure(error);
				}
			})
			.catch(error => {
				failure(error);
			});
	}

	/**
	 *
	 */

	static addOfferQty(Details, from = '', success, failure) {
		const credentials = APIManager.Sso_Id + ':' + APIManager.Api_Key;
		const hash = Base64.encode(credentials);
		const Basic = 'Basic ' + hash;

		//alert(APIManager.host+'v1/seal/add')
		fetch(APIManager.host + 'v1/vendor/site/offer/' + from + '/add', {
			method: 'POST',
			headers: {
				loggedInUserId: APIManager.User_Id,
				Authorization: Basic,
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(Details)
		})
			.then(response => response.json())
			.then(responseJson => {
				try {
					//alert(JSON.stringify(responseJson));
					success(responseJson);
				} catch (error) {
					failure(error);
				}
			})
			.catch(error => {
				failure(error);
			});
	}

	static workorderMatQtyAdd(pdiOfferAiId, offerQty, success, failure) {
		const credentials = APIManager.Sso_Id + ':' + APIManager.Api_Key;
		const hash = Base64.encode(credentials);
		const Basic = 'Basic ' + hash;
		console.log('pdiOfferAiId ' + pdiOfferAiId + 'offerQty ' + offerQty);
		//alert(APIManager.host+'v1/seal/add')
		fetch(APIManager.host + 'v1/vendor/workorder/mat/qty/add?pdiOfferAiId=' + pdiOfferAiId + '&offerQty=' + offerQty, {
			method: 'POST',
			headers: {
				loggedInUserId: APIManager.User_Id,
				Authorization: Basic,
				'Content-Type': 'application/json'
			}
			// body: JSON.stringify(Details)
		})
			.then(response => response.json())
			.then(responseJson => {
				try {
					//alert(JSON.stringify(responseJson));
					success(responseJson);
				} catch (error) {
					failure(error);
				}
			})
			.catch(error => {
				failure(error);
			});
	}

	static feedback(Details, success, failure) {
		//alert(APIManager.host+'v1/seal/add')
		fetch(APIManager.host + 'public/sso/feedback', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				loggedInUserId: 1
			},
			body: JSON.stringify(Details)
		})
			.then(response => response.json())
			.then(responseJson => {
				try {
					//alert(JSON.stringify(responseJson));
					success(responseJson);
				} catch (error) {
					failure(error);
				}
			})
			.catch(error => {
				failure(error);
			});
	}

	static getUnitList(nomAiId, from = '', success, failure) {
		const credentials = APIManager.Sso_Id + ':' + APIManager.Api_Key;
		const hash = Base64.encode(credentials);
		const Basic = 'Basic ' + hash;

		//alert(APIManager.host+'v1/material/unit/test?nomAiId='+nomAiId)
		fetch(APIManager.host + 'v1/material/unit/' + from + '/test?nomAiId=' + nomAiId, {
			method: 'POST',
			headers: {
				loggedInUserId: APIManager.User_Id,
				Authorization: Basic,
				'Content-Type': 'application/json'
			}
		})
			.then(response => response.json())
			.then(responseJson => {
				try {
					//alert(JSON.stringify(responseJson));
					success(responseJson);
				} catch (error) {
					failure(error);
				}
			})
			.catch(error => {
				failure(error);
			});
	}

	//  static  onSubmitItemConsumes(Details, success, failure){
	//     const credentials = APIManager.Sso_Id +':'+ APIManager.Api_Key
	//     const hash =  Base64.encode(credentials)
	//     const Basic = 'Basic ' + hash;

	//   //alert(APIManager.host+'v1/seal/add')
	//     fetch(APIManager.host+'v1/material/consumed',  {
	//         method: 'POST',
	//       headers: {
	//        "loggedInUserId":APIManager.User_Id,
	//        'Authorization':Basic,
	//        'Content-Type': 'application/json',
	//       },
	//        body:  JSON.stringify(Details)
	//       })
	//     .then((response) => response.json())
	//       .then((responseJson)=> {
	//         try {
	//           success(responseJson);
	//         } catch (error) {
	//           failure(error);
	//         }
	//       })
	//       .catch((error)=> {
	//         failure(error)
	//       });
	//    }
	static onSubmitItemConsumes(Details, from = '', success, failure) {
		const credentials = APIManager.Sso_Id + ':' + APIManager.Api_Key;
		const hash = Base64.encode(credentials);
		const Basic = 'Basic ' + hash;

		//alert(APIManager.host+'v1/seal/add')
		fetch(APIManager.host + 'v1/vendor/site/offer/inspection/' + from + '/consumed/details/add', {
			method: 'POST',
			headers: {
				loggedInUserId: APIManager.User_Id,
				Authorization: Basic,
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(Details)
		})
			.then(response => response.json())
			.then(responseJson => {
				try {
					success(responseJson);
				} catch (error) {
					failure(error);
				}
			})
			.catch(error => {
				failure(error);
			});
	}

	static vendorAddressList(success, failure) {
		const credentials = APIManager.Sso_Id + ':' + APIManager.Api_Key;
		const hash = Base64.encode(credentials);
		const Basic = 'Basic ' + hash;

		//alert(APIManager.host+'v1/vendor/workorder/viewaddress?vendorId='+APIManager.User_Id)
		fetch(APIManager.host + 'v1/vendor/workorder/viewaddress?vendorId=' + APIManager.Map_Id, {
			method: 'POST',
			headers: {
				loggedInUserId: APIManager.User_Id,
				Authorization: Basic,
				'Content-Type': 'application/json'
			}
		})
			.then(response => response.json())
			.then(responseJson => {
				console.log(JSON.stringify(responseJson));
				try {
					success(responseJson);
				} catch (error) {
					failure(error);
				}
			})
			.catch(error => {
				failure(error);
			});
	}

	static getStateList(success, failure) {
		const credentials = APIManager.Sso_Id + ':' + APIManager.Api_Key;
		const hash = Base64.encode(credentials);
		const Basic = 'Basic ' + hash;

		//alert(APIManager.host+'v1/vendor/workorder/viewaddress?vendorId='+APIManager.User_Id)
		fetch(APIManager.host + 'v1/state/list', {
			method: 'POST',
			headers: {
				loggedInUserId: APIManager.User_Id,
				Authorization: Basic,
				'Content-Type': 'application/json'
			}
		})
			.then(response => response.json())
			.then(responseJson => {
				console.log(JSON.stringify(responseJson));
				try {
					success(responseJson);
				} catch (error) {
					failure(error);
				}
			})
			.catch(error => {
				failure(error);
			});
	}

	static getCityList(stateCode, success, failure) {
		const credentials = APIManager.Sso_Id + ':' + APIManager.Api_Key;
		const hash = Base64.encode(credentials);
		const Basic = 'Basic ' + hash;

		//alert(APIManager.host+'v1/vendor/workorder/viewaddress?vendorId='+APIManager.User_Id)
		fetch(APIManager.host + 'v1/state/city/list?stateAiId=' + stateCode, {
			method: 'POST',
			headers: {
				loggedInUserId: APIManager.User_Id,
				Authorization: Basic,
				'Content-Type': 'application/json'
			}
		})
			.then(response => response.json())
			.then(responseJson => {
				console.log(JSON.stringify(responseJson));
				try {
					success(responseJson);
				} catch (error) {
					failure(error);
				}
			})
			.catch(error => {
				failure(error);
			});
	}

	static onSaveWorkAddress(insertData, success, failure) {
		const credentials = APIManager.Sso_Id + ':' + APIManager.Api_Key;
		const hash = Base64.encode(credentials);
		const Basic = 'Basic ' + hash;

		//alert(APIManager.host+'v1/vendor/workorder/viewaddress?vendorId='+APIManager.User_Id)
		fetch(APIManager.host + 'v1/vendor/workorder/address', {
			method: 'POST',
			headers: {
				loggedInUserId: APIManager.User_Id,
				Authorization: Basic,
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(insertData)
		})
			.then(response => response.json())
			.then(responseJson => {
				console.log(JSON.stringify(responseJson));
				try {
					success(responseJson);
				} catch (error) {
					failure(error);
				}
			})
			.catch(error => {
				failure(error);
			});
	}

	static onSaveSample(insertData, from = '', success, failure) {
		const credentials = APIManager.Sso_Id + ':' + APIManager.Api_Key;
		const hash = Base64.encode(credentials);
		const Basic = 'Basic ' + hash;

		//alert(APIManager.host+'v1/vendor/workorder/viewaddress?vendorId='+APIManager.User_Id)
		fetch(APIManager.host + 'v1/material/sampling/' + from + '/add', {
			method: 'POST',
			headers: {
				loggedInUserId: APIManager.User_Id,
				Authorization: Basic,
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(insertData)
		})
			.then(response => response.json())
			.then(responseJson => {
				console.log(JSON.stringify(responseJson));
				try {
					success(responseJson);
				} catch (error) {
					failure(error);
				}
			})
			.catch(error => {
				failure(error);
			});
	}

	static getSamplingList(insertData, from = '', success, failure) {
		const credentials = APIManager.Sso_Id + ':' + APIManager.Api_Key;
		const hash = Base64.encode(credentials);
		const Basic = 'Basic ' + hash;

		// alert(
		// 	APIManager.host +
		// 		'v1/material/sampling/' +
		// 		from +
		// 		'/list?matAiId=' +
		// 		insertData.matAiId +
		// 		'&matscAiId=' +
		// 		insertData.matscAiId
		// );
		fetch(
			APIManager.host +
				'v1/material/sampling/' +
				from +
				'/list?matAiId=' +
				insertData.matAiId +
				'&matscAiId=' +
				insertData.matscAiId,
			{
				method: 'POST',
				headers: {
					loggedInUserId: APIManager.User_Id,
					Authorization: Basic,
					'Content-Type': 'application/json'
				}
			}
		)
			.then(response => response.json())
			.then(responseJson => {
				try {
					success(responseJson);
				} catch (error) {
					failure(error);
				}
			})
			.catch(error => {
				failure(error);
			});
	}

	static isItemConsumed(nomAiId, from = '', success, failure) {
		const credentials = APIManager.Sso_Id + ':' + APIManager.Api_Key;
		const hash = Base64.encode(credentials);
		const Basic = 'Basic ' + hash;

		//alert(APIManager.host+'v1/vendor/workorder/viewaddress?vendorId='+APIManager.User_Id)
		fetch(APIManager.host + 'v1/material/get/' + from + '/consumed?nomAiId=' + nomAiId, {
			method: 'POST',
			headers: {
				loggedInUserId: APIManager.User_Id,
				Authorization: Basic,
				'Content-Type': 'application/json'
			}
		})
			.then(response => response.json())
			.then(responseJson => {
				try {
					success(responseJson);
				} catch (error) {
					failure(error);
				}
			})
			.catch(error => {
				failure(error);
			});
	}

	static isItemConsumed1(nomAiId, from = '', success, failure) {
		const credentials = APIManager.Sso_Id + ':' + APIManager.Api_Key;
		const hash = Base64.encode(credentials);
		const Basic = 'Basic ' + hash;

		//console.log(APIManager.host+"v1/vendor/site/offer/inspection/consumed/details?nominationAiId=" + nomAiId)
		fetch(APIManager.host + 'v1/vendor/site/offer/inspection/' + from + '/consumed/details?nominationAiId=' + nomAiId, {
			method: 'POST',
			headers: {
				loggedInUserId: APIManager.User_Id,
				Authorization: Basic,
				'Content-Type': 'application/json'
			}
		})
			.then(response => response.json())
			.then(responseJson => {
				console.log(JSON.stringify(responseJson));
				try {
					success(responseJson);
				} catch (error) {
					failure(error);
				}
			})
			.catch(error => {
				console.log(JSON.stringify(error));
				failure(error);
			});
	}

	static uploadGPTest(data, success, failure) {
		const credentials = APIManager.Sso_Id + ':' + APIManager.Api_Key;
		const hash = Base64.encode(credentials);
		const Basic = 'Basic ' + hash;

		//alert(APIManager.host+'v1/vendor/workorder/viewaddress?vendorId='+APIManager.User_Id)
		fetch(APIManager.host + 'v1/gp/inspector/inspection/details/insert', {
			method: 'POST',
			headers: {
				loggedInUserId: APIManager.User_Id,
				Authorization: Basic,
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(data)
		})
			.then(response => response.json())
			.then(responseJson => {
				try {
					success(responseJson);
				} catch (error) {
					failure(error);
				}
			})
			.catch(error => {
				failure(error);
			});
	}

	static getGPVendorList(inspId, success, failure) {
		const credentials = APIManager.Sso_Id + ':' + APIManager.Api_Key;
		const hash = Base64.encode(credentials);
		const Basic = 'Basic ' + hash;
		//alert(APIManager.host + 'v1/gp/inspector/site/offer/details?inspectorAiId='+ inspId)
		fetch(APIManager.host + 'v1/gp/inspector/site/offer/details?inspectorAiId=' + inspId, {
			method: 'POST',
			headers: {
				Authorization: Basic,
				'Content-Type': 'application/json'
			}
		})
			.then(response => response.json())
			.then(responseJson => {
				//alert(JSON.stringify(responseJson));
				try {
					// alert(JSON.stringify(responseJson));
					success(responseJson);
				} catch (error) {
					failure(error);
				}
			})
			.catch(error => {
				failure(error);
			});
	}

	static getGPNomination(inspId, success, failure) {
		const credentials = APIManager.Sso_Id + ':' + APIManager.Api_Key;
		const hash = Base64.encode(credentials);
		const Basic = 'Basic ' + hash;
		//alert(APIManager.host + 'v1/gp/inspector/nomin/cnfm/get?inspectorId='+ inspId)
		fetch(APIManager.host + 'v1/gp/inspector/nomin/cnfm/get?inspectorId=' + inspId, {
			method: 'POST',
			headers: {
				Authorization: Basic,
				'Content-Type': 'application/json'
			}
		})
			.then(response => response.json())
			.then(responseJson => {
				try {
					success(responseJson);
				} catch (error) {
					failure(error);
				}
			})
			.catch(error => {
				failure(error);
			});
	}

	static onGPConfirmInsp(details, success, failure) {
		const credentials = APIManager.Sso_Id + ':' + APIManager.Api_Key;
		const hash = Base64.encode(credentials);
		const Basic = 'Basic ' + hash;
		//alert(APIManager.host + 'v1/gp/inspector/nomin/cnfm/insert')
		fetch(APIManager.host + 'v1/gp/inspector/nomin/cnfm/insert', {
			method: 'POST',
			headers: {
				loggedInUserId: APIManager.User_Id,
				Authorization: Basic,
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(details)
		})
			.then(response => response.json())
			.then(responseJson => {
				try {
					success(responseJson);
				} catch (error) {
					failure(error);
				}
			})
			.catch(error => {
				failure(error);
			});
	}

	static getGPInspectorConfirmationDetails(vendorId, success, failure) {
		const credentials = APIManager.Sso_Id + ':' + APIManager.Api_Key;
		const hash = Base64.encode(credentials);
		const Basic = 'Basic ' + hash;
		//alert(APIManager.host + 'v1/gp/inspector/nomin/cnfm/insert')
		fetch(APIManager.host + 'v1/gp/inspector/nomini/get/intimate/details?vendorId=' + vendorId, {
			method: 'POST',
			headers: {
				loggedInUserId: APIManager.User_Id,
				Authorization: Basic,
				'Content-Type': 'application/json'
			}
		})
			.then(response => response.json())
			.then(responseJson => {
				try {
					success(responseJson);
				} catch (error) {
					failure(error);
				}
			})
			.catch(error => {
				failure(error);
			});
	}

	static GPVendorConfirmation(details, success, failure) {
		const credentials = APIManager.Sso_Id + ':' + APIManager.Api_Key;
		const hash = Base64.encode(credentials);
		const Basic = 'Basic ' + hash;
		//alert(APIManager.host + 'v1/gp/inspector/nomin/cnfm/insert')
		fetch(APIManager.host + 'v1/gp/inspection/site/offer/insert', {
			method: 'POST',
			headers: {
				loggedInUserId: APIManager.User_Id,
				Authorization: Basic,
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(details)
		})
			.then(response => response.json())
			.then(responseJson => {
				try {
					success(responseJson);
				} catch (error) {
					failure(error);
				}
			})
			.catch(error => {
				failure(error);
			});
	}

	static UploadDocument(details, from = '', success, failure) {
		const credentials = APIManager.Sso_Id + ':' + APIManager.Api_Key;
		const hash = Base64.encode(credentials);
		const Basic = 'Basic ' + hash;
		//alert(APIManager.host + 'v1/gp/inspector/nomin/cnfm/insert')
		fetch(APIManager.host + 'v1/inspector/' + from + '/inspection/final/report/add', {
			method: 'POST',
			headers: {
				loggedInUserId: APIManager.User_Id,
				Authorization: Basic,
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(details)
		})
			.then(response => response.json())
			.then(responseJson => {
				try {
					success(responseJson);
				} catch (error) {
					failure(error);
				}
			})
			.catch(error => {
				failure(error);
			});
	}

	static onWithDrawal(details, data, from = '', success, failure) {
		const credentials = APIManager.Sso_Id + ':' + APIManager.Api_Key;
		const hash = Base64.encode(credentials);
		const Basic = 'Basic ' + hash;
		//alert(APIManager.host + 'v1/gp/inspector/nomin/cnfm/insert')
		console.log(JSON.stringify(details));
		fetch(
			APIManager.host +
				'/v1/inspector/inspection/' +
				from +
				'/withdrawal?nominationAiId=' +
				details.nominationAiId +
				'&inspectionSiteOfferAiId=' +
				details.inspectionSiteOfferAiId +
				'&pdiofferAiId=' +
				details.pdiofferAiId +
				'&inspetionCnfrmOfferAiId=' +
				details.inspetionCnfrmOfferAiId,
			{
				method: 'POST',
				headers: {
					loggedInUserId: APIManager.User_Id,
					Authorization: Basic,
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(data)
			}
		)
			.then(response => response.json())
			.then(responseJson => {
				try {
					success(responseJson);
				} catch (error) {
					failure(error);
				}
			})
			.catch(error => {
				failure(error);
			});
	}
}
