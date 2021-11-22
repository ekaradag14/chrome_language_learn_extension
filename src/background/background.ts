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

		try {
			reqData = await textAPIS.translateTextAPI({
				language: msg.language,
				text: msg.text,
				userTranslation: msg.userTranslation,
				source: msg.source,
			});
			if (reqData.status === 200) {
				reqData = (await reqData.json()).data;
				port.postMessage(reqData);
			} else {
				port.postMessage({ clear: true });
			}
		} catch (error) {
			console.log(error);
			return;
		}

		chrome.storage.local.get(['translationUsages', 'userSettings'], (res) => {
			if (res.translationUsages) {
				let newUsage = [
					...res.translationUsages.filter((el) => el === new Date().getDate()),
					new Date().getDate(),
				];
				chrome.storage.local.set({
					translationUsages: newUsage,
				});
				if (
					newUsage.length >=
					constants.USER_LIMITS.free.dailyUsageLimit[res.userSettings.frequency]
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
		});
	});
});
