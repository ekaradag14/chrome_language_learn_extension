const constants = require('../../constants.js');

export const generalErrorHandler = (alertDispatch, err) => {
	let errorCase;

	if (
		err.code === 'auth/user-not-found' ||
		err.code === 'auth/wrong-password'
	) {
		errorCase = alertDispatch(constants.errorMessages.WRONG_CREDENTIALS);
	} else if (err.code === 2002 || err.code === 2001 || err.code === 2000) {
		errorCase = alertDispatch({
			isOpen: true,
			message: err.error,
			severity: 'warning',
		});
	} else if (err.custom) {
		errorCase = alertDispatch({
			isOpen: true,
			message: err.message,
			severity: 'error',
		});
	} else {
		errorCase = alertDispatch(constants.errorMessages.SOMETHING_WRONG);
	}
	return errorCase;
};
