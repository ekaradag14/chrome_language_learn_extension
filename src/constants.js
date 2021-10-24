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
	},
};
