// import getHeaders from './axiosCommonHeaders';
import * as modals from '../modals';
import constants from '../../constants';
import * as getHeaders from './getHeaders';
export const sendContactMessageAPI = async (
	contactMessage: modals.ContactUsMessage
) => {
	let headers;
	try {
		headers = await getHeaders.default();
	} catch (error) {
		console.log('error', error);
		return;
	}
	return fetch(`${constants.backendBaseURL.DEV}/contact-us`, {
		method: 'POST',
		headers,
		body: JSON.stringify({ ...contactMessage }),
	});
};
