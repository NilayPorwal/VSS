import RNSecureStorage, { ACCESSIBLE } from 'rn-secure-storage';

export const setData = async (key, value) => {
	await RNSecureStorage.setItem(key, value, {
		accessible: ACCESSIBLE.WHEN_UNLOCKED
	})
		.then(res => {
			console.log(res);
		})
		.catch(err => {
			console.log(err);
		});
};

export const getData = async key => {
	try {
		const value = await RNSecureStorage.getItem(key);
		if (value != null) {
			return value;
		}
	} catch (e) {
		console.log(e);
	}
};

export const removeData = async key => {
	await RNSecureStorage.removeItem(key)
		.then(res => {
			console.log(res);
		})
		.catch(err => {
			console.log(err);
		});
};

export const clear = async () => {
	await RNSecureStorage.clear()
		.then(res => {
			console.log(res);
		})
		.catch(err => {
			console.log(err);
		});
};
