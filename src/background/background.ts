import * as textAPIS from '../lib/endpoints/text';

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
		console.log(msg);
		let reqData;
		chrome.action.setBadgeText({ text: 'load' });
		try {
			reqData = await textAPIS.translateTextAPI(msg.text);
			reqData = (await reqData.json()).data;
		} catch (error) {
			console.error(error);

			return;
		}
		// if (msg.joke == 'Knock knock')
		console.log(reqData);
		port.postMessage({ text: reqData.translatedPrompts.es });
		chrome.action.setBadgeText({ text: '' });
	});
});
