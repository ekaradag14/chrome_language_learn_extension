// import getHeaders from './axiosCommonHeaders';
import * as modals from '../modals';
import constants from '../../constants';

export const sendContactMessageAPI = async (
	contactMessage: modals.ContactUsMessage
) => {
	// let headers;
	// try {
	// 	headers = await getHeaders();
	// } catch (error) {
	// 	//TODO NO HEADERS MEANS NO AUTH
	// 	return;
	// }

	return fetch(`${constants.backendBaseURL.DEV}/contact-us`, {
		method: 'POST',
		// headers,
		body: JSON.stringify({ ...contactMessage, uid: 'ksubdfkus' }),
	});
};
