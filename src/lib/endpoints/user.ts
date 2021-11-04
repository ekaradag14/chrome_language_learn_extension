// import getHeaders from './axiosCommonHeaders';

import constants from '../../constants';
import * as getHeaders from './getHeaders';
export type SignupPayload = {
	email: string;
	password: string;
};
export const signUpUserAPI = async (userCreds: SignupPayload) => {
	return fetch(`${constants.backendBaseURL.DEV}/signup`, {
		method: 'POST',
		body: JSON.stringify(userCreds),
	});
};

export const saveSettingsAPI = async (settings) => {
	let headers;
	try {
		headers = await getHeaders.default();
	} catch (error) {
		console.log('error', error);
		return;
	}

	return fetch(`${constants.backendBaseURL.DEV}/save-settings`, {
		method: 'POST',
		headers,
		body: JSON.stringify({ settings, uid: '3JJDuaMHUDZdMpsfra4nAY0xg0b2' }),
	});
};

export const addBannedSiteAPI = async (bannedSite: { url: string }) => {
	let headers;
	try {
		headers = await getHeaders.default();
	} catch (error) {
		console.log('error', error);
		return;
	}
	return fetch(`${constants.backendBaseURL.DEV}/add-banned-site`, {
		method: 'POST',
		headers,
		body: JSON.stringify({
			...bannedSite,
		}),
	});
};
export const removeBannedSiteAPI = async (payload) => {
	let headers;
	try {
		headers = await getHeaders.default();
	} catch (error) {
		console.log('error', error);
		return;
	}
	return fetch(`${constants.backendBaseURL.DEV}/remove-banned-site`, {
		method: 'POST',
		headers,
		body: JSON.stringify({
			...payload,
			uid: '3JJDuaMHUDZdMpsfra4nAY0xg0b2',
		}),
	});
};
