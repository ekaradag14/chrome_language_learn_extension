const handleMessages = async (msg, sender, sendResponse) => {
	if (msg.greeting === 'hello') {
		console.log('hello', msg);
		chrome.action.setBadgeText({ text: 'load' });
		let reqData;
		try {
			reqData = await fetch(
				`http://localhost:5001/shopgrid-0/us-central1/api/translate`,
				{
					method: 'POST',
					body: JSON.stringify({ text: 'Selam' }),
				}
			);
			reqData = (await reqData.json()).data;
		} catch (error) {
			console.error(error);
			chrome.action.setBadgeText({ text: '' });
			return;
		}

		console.log('reqData', reqData);
		chrome.storage.local.get(['latestExecutions'], (res) => {
			if (res.latestExecutions && reqData.data) {
				chrome.storage.local.set({
					latestExecutions: [reqData.data, ...res.latestExecutions.slice(0, 4)],
				});
			}
		});

		if (msg.greeting == 'hello') {
			console.log('message sent');
			sendResponse(reqData);
		}
		chrome.action.setBadgeText({ text: '' });
	}
	return true;
};

chrome.runtime.onMessage.addListener(handleMessages);

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
			reqData = await fetch(
				`http://localhost:5001/shopgrid-0/us-central1/api/translate`,
				{
					method: 'POST',
					body: JSON.stringify({ text: 'Selam' }),
				}
			);
			reqData = (await reqData.json()).data;
		} catch (error) {
			console.error(error);
			chrome.action.setBadgeText({ text: '' });
			return;
		}
		// if (msg.joke == 'Knock knock')
		port.postMessage({ joke: reqData.translatedPrompts.en });
		console.log('hey');
	});
});
