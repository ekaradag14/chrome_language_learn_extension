module.exports = {
	routes: {
		SETTINGS: '/settings',
		HOMEPAGE: '/homepage',
		CONTACT: '/contact',
		LOGIN: '/login',
		SIGNUP: '/signup',
	},
	alertMessages: {
		UNAUTHORIZED: {
			isOpen: true,
			message:
				'You are unauthorized, please login again to terminate your process.',
			severity: 'error',
		},
		SUCCESSFUL_SAVE: {
			isOpen: true,
			message: `Successfully saved!`,
			severity: 'success',
		},
		SUCCESSFUL_DELETE: {
			isOpen: true,
			message: 'Item deleted successfully.',
			severity: 'success',
		},
		SUCCESSFUL_CONTACT_US: {
			isOpen: true,
			message: 'We received your message and will get back to you ASAP!',
			severity: 'success',
		},
		UNFILLED_FIELDS: {
			isOpen: true,
			message: 'Please fill all required fields.',
			severity: 'warning',
		},

		SUCCESSFUL_SETTINGS_CHANGE: {
			isOpen: true,
			message: 'Settings saved successfully.',
			severity: 'success',
		},
		BAD_EMAIL: {
			isOpen: true,
			message: 'Please enter a valid email.',
			severity: 'warning',
		},
		MISSING_LANGUAGE: {
			isOpen: true,
			message: 'Please choose a target language.',
			severity: 'warning',
		},
	},
	backendBaseURL: {
		DEV: 'http://localhost:5001/shopgrid-0/us-central1/api',
		DEV_1:
			'https://us-central1-chrome-language-learn-ext.cloudfunctions.net/api',
	},
	firebaseConfig: {
		apiKey: 'AIzaSyAfyWCKjq5t8ZO7oEM8T_A20qs3ZDrBrZE',
		authDomain: 'chrome-language-learn-ext.firebaseapp.com',
		projectId: 'chrome-language-learn-ext',
		storageBucket: 'chrome-language-learn-ext.appspot.com',
		messagingSenderId: '159546725443',
		appId: '1:159546725443:web:7c8a0c47a293f8b54870f6',
	},
	errorMessages: {
		WRONG_CREDENTIALS: {
			isOpen: true,
			message: 'Incorrect password or email.',
			severity: 'error',
		},
		BAD_REQUEST: {
			isOpen: true,
			message: 'Please use valid information.',
			severity: 'error',
		},
		SOMETHING_WRONG: {
			isOpen: true,
			message: 'Something is wrong, please try again.',
			severity: 'warning',
		},
	},
	USER_LIMITS: {
		free: {
			dailyUsageLimit: [0, 15, 30, 60, 120],
		},
	},
	algorithmConstants: {
		numberOfValidTagItems: 3,
		maxTagTryCallTimes: 3,
		minWordLength: 2,
		minWordCount: 2,
		minSentenceLength: 5,
		furthestWordIndexLimit: 4,
	},
};
