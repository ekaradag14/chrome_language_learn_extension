// import getHeaders from './axiosCommonHeaders';

import constants from '../../constants';

export type SignupPayload = {
	email: string;
	password: string;
};
export const signUpUserAPI = async (userCreds: SignupPayload) => {
	// let headers;
	// try {
	// 	headers = await getHeaders();
	// } catch (error) {
	// 	//TODO NO HEADERS MEANS NO AUTH
	// 	return;
	// }

	return fetch(`${constants.backendBaseURL.DEV}/signup`, {
		method: 'POST',
		// headers,
		body: JSON.stringify(userCreds),
	});
};

export const saveSettingsAPI = async (settings) => {
	return fetch(`${constants.backendBaseURL.DEV}/save-settings`, {
		method: 'POST',
		body: JSON.stringify({ settings, uid: '3JJDuaMHUDZdMpsfra4nAY0xg0b2' }),
	});
};

export const addBannedSiteAPI = async (bannedSite: { url: string }) => {
	return fetch(`${constants.backendBaseURL.DEV}/add-banned-site`, {
		method: 'POST',
		body: JSON.stringify({
			...bannedSite,
			uid: '3JJDuaMHUDZdMpsfra4nAY0xg0b2',
		}),
	});
};
export const removeBannedSiteAPI = async (bannedSite) => {
	return fetch(`${constants.backendBaseURL.DEV}/remove-banned-site`, {
		method: 'POST',
		body: JSON.stringify({
			bannedSite,
			uid: '3JJDuaMHUDZdMpsfra4nAY0xg0b2',
		}),
	});
};
