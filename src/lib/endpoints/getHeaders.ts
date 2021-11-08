const getHeaders = () => {
	return new Promise((resolve) => {
		chrome.storage.local.get(['userCredentials', 'userSettings'], (res) => {
			if (res.userCredentials.uid) {
				resolve({
					uid: res.userCredentials.uid,
					ignorespecialcharacters: res?.userSettings?.ignoreSpecialCharacters,
				});
			}
		});
	});
};

export default getHeaders;
