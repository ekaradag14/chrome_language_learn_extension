const getHeaders = () => {
	return new Promise((resolve) => {
		chrome.storage.local.get(['userCredentials'], (res) => {
			console.log(res);
			if (res.userCredentials.uid) {
				resolve({
					uid: res.userCredentials.uid,
				});
			}
		});
	});
};

export default getHeaders;
