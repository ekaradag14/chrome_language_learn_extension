import * as textAPIS from '../lib/endpoints/text';
const constants = require('../constants.js');
// var port = chrome.tabs.connect({ name: 'knockknock' });
// port.postMessage({ joke: 'Knock knock' });
// port.onMessage.addListener(function (msg) {
// 	if (msg.question === "Who's there?") port.postMessage({ answer: 'Madame' });
// 	else if (msg.question === 'Madame who?')
// 		port.postMessage({ answer: 'Madame... Bovary' });
// });

//Add a listener for any port messages
chrome.runtime.onConnect.addListener(function (port) {
	port.onMessage.addListener(async function (msg) {
		let reqData;
		let itsTooLate = false;
		try {
			setTimeout(() => {
				if (!reqData) {
					port.postMessage({ clear: true });
					itsTooLate = true; // This is just used here for convenience (for adding a usage to user usages)
				}
			}, 20000);

			//Send the user payload for translation
			reqData = await textAPIS.translateTextAPI({
				language: msg.language,
				text: msg.text,
				source: msg.source,
			});

			//Check for successful translation and timeout error (Don't wait the user too much)
			if (reqData.status === 200 && !itsTooLate) {
				reqData = (await reqData.json()).data;
				//If the translatedText is the same with the source (Special namaes,etc. don't get translated) Clear the translation
				//TODO: Inform user why it was cleared
				if (reqData.translatedText === msg.text) {
					port.postMessage({
						clear: true,
						userTranslation: msg.userTranslation,
					}); //User translation is added so that it will know which element to remove
					itsTooLate = true; // This is just used here for convenience (for not adding a usage to user usages)
				} else {
					chrome.storage.local.get(['currentTranslations'], (res) => {
						if (res.currentTranslations) {
							let newCurrentTranslations = res.currentTranslations.filter(
								(el) => Date.now() - el.createdAt < 864000
							);
							newCurrentTranslations.push({
								...reqData,
								createdAt: Date.now(),
								clear: false,
							});
							chrome.storage.local.set({
								currentTranslations: newCurrentTranslations,
							});
						} else {
							chrome.storage.local.set({
								currentTranslations: [
									{
										...reqData,
										createdAt: Date.now(),
										clear: false,
									},
								],
							});
						}
					});
					port.postMessage(reqData);
				}
			} else {
				console.log('Background reqData error', reqData);
				port.postMessage({ clear: true, userTranslation: msg.userTranslation });
				itsTooLate = true;
				return;
			}
		} catch (error) {
			console.log(error);
			return;
		}
		if (!itsTooLate) {
			chrome.storage.local.get(
				['translationUsages', 'userSettings', 'successfulTranslations'],
				(res) => {
					if (reqData.successfulTranslation) {
						if (res.successfulTranslations) {
							let translationsOfToday = res.successfulTranslations.filter(
								(el) => el === new Date().getDate()
							);
							chrome.storage.local.set({
								successfulTranslations: [
									...translationsOfToday,
									new Date().getDate(),
								],
							});
						} else {
							chrome.storage.local.set({
								successfulTranslations: [new Date().getDate()],
							});
						}
					}

					if (res.translationUsages) {
						let usagesOfToday = res.translationUsages.filter(
							(el) => el === new Date().getDate()
						);
						let newUsage = [...usagesOfToday, new Date().getDate()];
						chrome.storage.local.set({
							translationUsages: newUsage,
						});
						if (
							newUsage.length >= constants.USER_LIMITS.free.dailyUsageLimit[2]
						) {
							chrome.storage.local.set({
								dailyLimitReached: true,
							});
						} else {
							chrome.storage.local.set({
								dailyLimitReached: false,
							});
						}
					} else {
						chrome.storage.local.set({
							translationUsages: [new Date().getDate()],
						});
					}
				}
			);
		}
	});
});

//TODO: Create a generic function for adding stuff into local storage
// const setToLocalStorage: { keyName: string; values: string[] }[] = (items) => {
// 	let keys: string[] = items.map((el) => el.keyName);
// 	items.forEach((el) => {
// 		chrome.storage.local.get(keys, (res) => {
// 			keys.forEach(el => {
// 				if (res[el]) {

// 				}
// 			})
// 		});
// 	});
// };
