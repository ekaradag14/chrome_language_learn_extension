const constants = require('../../constants.js');

export const generalErrorHandler = (alertDispatch, err) => {
	let errorCase;

	if (
		err.code === 'auth/user-not-found' ||
		err.code === 'auth/wrong-password'
	) {
		errorCase = alertDispatch(constants.errorMessages.WRONG_CREDENTIALS);
	} else if (err.status === 400) {
		console.log(err);
		errorCase = alertDispatch({
			isOpen: true,
			message: err.error,
			severity: 'warning',
		});
	} else {
		errorCase = alertDispatch(constants.errorMessages.SOMETHING_WRONG);
	}
	return errorCase;
};
