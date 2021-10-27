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

export const loginUserAPI = async (userCreds: SignupPayload) => {
	// let headers;
	// try {
	// 	headers = await getHeaders();
	// } catch (error) {
	// 	//TODO NO HEADERS MEANS NO AUTH
	// 	return;
	// }

	return fetch(`${constants.backendBaseURL.DEV}/login`, {
		method: 'POST',
		// headers,
		body: JSON.stringify(userCreds),
	});
};
