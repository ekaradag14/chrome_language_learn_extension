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
	// let headers;
	// try {
	// 	headers = await getHeaders();
	// } catch (error) {
	// 	//TODO NO HEADERS MEANS NO AUTH
	// 	return;
	// }

	return fetch(`${constants.backendBaseURL.DEV}/save-settings`, {
		method: 'POST',
		// headers,
		body: JSON.stringify({ settings, uid: '3JJDuaMHUDZdMpsfra4nAY0xg0b2' }),
	});
};
