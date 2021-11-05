// TODO: content script
import './contentScript.css';
const changeableTags: string[] = ['h1', 'h2', 'h3', 'h4', 'p', 'em', 'b'];
import InputField from './InputField';
let isBanned = false;

const singleWordRegex: RegExp = /^([\w]+)/g;
type FirebaseResp = {
	basePrompt: string;
	id: string;
	translatedPrompts: {
		de: string;
		en: string;
		es: string;
		fr: string;
		tr: string;
	};
};

chrome.storage.local.get(['bannedSites'], (res) => {
	if (res.bannedSites) {
		res.bannedSites.forEach((el) => {
			if (el.includes(document.domain)) {
				isBanned = true;
				console.log('isBanned', isBanned);
			}
		});
		if (!isBanned) {
			createTagsForUser();
			console.log('hello');
		}
	}
});

// Add a listener for any port that can be opened in the application
chrome.runtime.onConnect.addListener(function (port) {
	port.onMessage.addListener(function (msg) {
		if (msg.joke === 'Knock knock')
			port.postMessage({ question: "Who's there?" });
	});
});
const createTagsForUser = () => {
	const tagTypeToBeChanged =
		changeableTags[Math.floor(Math.random() * changeableTags.length)];
	const tags = document.getElementsByTagName(tagTypeToBeChanged);
	const getRandomArbitrary = (min: number, max: number) => {
		return Math.random() * (max - min) + min;
	};

	const randomElementIndex: number = getRandomArbitrary(0, tags.length);
	let chosenItem = tags.item(randomElementIndex) as HTMLElement;
	chosenItem = document.querySelector('.code-block__label');
	console.log(chosenItem);
	// chosenItem.style['background-color'] = 'yellow';
	let translateText = chosenItem?.textContent?.trim();
	let inputText, remainingText;
	if (translateText) {
		inputText = translateText.match(singleWordRegex)[0];
		remainingText = translateText.replace(singleWordRegex, '');
		const inputDiv = document.createElement('div');
		inputDiv.innerHTML = InputField;
		chosenItem.innerHTML = ` <span style='	background-color: #ddf5f8;
	border-radius: 5px;' >${inputText}</span>${remainingText}`;
		chosenItem.parentElement.insertBefore(inputDiv, chosenItem);
	}

	// console.log(translateText.replace(singleWordRegex, ''));
	//Create Clear Button Functionality
	let clearButton = document.querySelector(
		'.ern-ext-clear-button'
	) as HTMLElement;
	clearButton.addEventListener(
		'click',
		function (e) {
			e.preventDefault();
			document.querySelector('.extra-chrome-gift').remove();
		},
		false
	);

	//Create Translate Button Functionality
	let translateButton = document.querySelector(
		'.ern-ext-translate-button'
	) as HTMLElement;
	translateButton.addEventListener(
		'click',
		async function (e) {
			e.preventDefault();
			let elem = document.querySelector('.ern-ext-input') as HTMLInputElement;
			let value = elem.value;
			// document.querySelector('.extra-chrome-gift').remove();
			document.querySelector('.ern-ext-translate-button').className +=
				' clicked';

			//create a port to send messages throughout the application
			var port = chrome.runtime.connect({
				name: 'knockknock',
			});
			//Send a message from the port
			port.postMessage({ joke: 'Knock knock', text: inputText });
			//Handle any response that might come on this port
			port.onMessage.addListener(function (msg) {
				console.log('helu', msg);
				console.log(msg);
				changeContent(msg.text);
			});
		},
		false
	);

	const changeContent = (value) => {
		document
			.querySelector('.ern-ext-translate-button')
			.classList.remove('clicked');
		setTimeout(() => {
			chosenItem.innerHTML =
				'<p><em style="background-color: #DDF5F8; border-radius:5px;">' +
				value +
				'</em>' +
				remainingText +
				'</p>';
		}, 500);
	};
};
