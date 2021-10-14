// TODO: content script
import './contentScript.css';
const changeableTags: string[] = ['h1', 'h2', 'h3', 'h4', 'p', 'em', 'b'];
import InputField from './InputField';

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

const tagTypeToBeChanged =
	changeableTags[Math.floor(Math.random() * changeableTags.length)];
const tags = document.getElementsByTagName(tagTypeToBeChanged);
const getRandomArbitrary = (min: number, max: number) => {
	return Math.random() * (max - min) + min;
};

const randomElementIndex: number = getRandomArbitrary(0, tags.length);
let chosenItem = tags.item(randomElementIndex) as HTMLElement;
chosenItem = document.querySelector('#firstHeading');
// chosenItem.style['background-color'] = 'yellow';
let translateText = chosenItem?.textContent;
if (translateText) {
	chosenItem.innerHTML = `${InputField} <em style="background-color: yellow">${chosenItem.innerHTML}</em> `;
}

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
		document.querySelector('.ern-ext-translate-button').className += ' clicked';

		//create a port to send messages throughout the application
		var port = chrome.runtime.connect({
			name: 'knockknock',
		});
		//Send a message from the port
		port.postMessage({ joke: 'Knock knock' });
		//Handle any response that might come on this port
		port.onMessage.addListener(function (msg) {
			console.log('helu');

			changeContent(msg.joke);
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
			'<em style="background-color: yellow">' + value + '</em>';
	}, 500);
};

// Add a listener for any port that can be opened in the application
chrome.runtime.onConnect.addListener(function (port) {
	console.assert(port.name === 'knockknock');
	//Handle any message that can come
	port.onMessage.addListener(function (msg) {
		if (msg.joke === 'Knock knock')
			port.postMessage({ question: "Who's there?" });
	});
});
