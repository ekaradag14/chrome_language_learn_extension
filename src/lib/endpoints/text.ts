// import getHeaders from './axiosCommonHeaders';
import * as modals from '../modals';
import constants from '../../constants';
import * as getHeaders from './getHeaders';
export const translateTextAPI = async (translationPayload: {
	text: string;
	language: string;
	userTranslation: string;
	source: string;
}) => {
	let headers;
	try {
		headers = await getHeaders.default();
	} catch (error) {
		console.log('error', error);
		return;
	}

	return fetch(`${constants.backendBaseURL.DEV}/translate`, {
		method: 'POST',
		headers,
		body: JSON.stringify(translationPayload),
	});
};
