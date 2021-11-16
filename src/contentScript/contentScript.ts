// TODO: content script
import './contentScript.css';
const changeableTags: string[] = [
	'h1',
	'h2',
	'h3',
	'h4',
	'p',
	'em',
	'b',
	'span',
	'strong',
	'li',
];
import InputField from './InputField';
let isBanned = false;
import { UserSettingsProps } from '../lib/modals';

const hasNumber: RegExp = /\d/;
const getRandomArbitrary = (min: number, max: number) => {
	return Math.floor(Math.random() * (max - min) + min);
};
chrome.storage.local.get(['bannedSites', 'userSettings'], (res) => {
	if (res.bannedSites) {
		res.bannedSites.forEach((el) => {
			if (el.includes(document.domain)) {
				isBanned = true;
			}
		});

		if (
			true ||
			(!isBanned &&
				res.userSettings.frequency !== 0 &&
				res.userSettings.targetLanguages.length &&
				getRandomArbitrary(0, 10) % 2 === 0)
		) {
			createTagsForUser(res.userSettings);
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
const createTagsForUser = (userSettings: UserSettingsProps) => {
	let chosenItem;
	let targetLanguage =
		userSettings.targetLanguages[
			randomNumberInRange(0, userSettings.targetLanguages.length)
		].code;
	const tagTypeToBeChanged =
		changeableTags[Math.floor(Math.random() * changeableTags.length)];
	const tags = document.getElementsByTagName(tagTypeToBeChanged);
	for (const item of tags) {
		if (
			!item?.firstElementChild &&
			!!chosenItem.closest('a') &&
			!!chosenItem.closest('button')
		) {
			//Check if element has no element children and no a tag or button tag as parent (Since our div causes click event on them)
			chosenItem = item;

			break;
		}
	}
	chosenItem = document.querySelector('#siteSub');
	if (!chosenItem) {
		return;
	}
	let translateText = chosenItem?.textContent?.trim();
	let inputText, remainingText, words;

	//Add Input field and highlight the text
	if (translateText) {
		words = translateText.split(' ');
		inputText = words[1]; //First word is generally a special name
		console.log('inputText', inputText);
		if (hasNumber.test(inputText)) return;
		remainingText = words.splice(2, words.length).join(' ');
		console.log('words', words);

		const inputDiv = document.createElement('div');
		inputDiv.innerHTML = InputField(targetLanguage);
		chosenItem.innerHTML = `${words[0]} <span style='background-color: #aef4ff7a;border-radius: 5px;' > ${inputText}</span> ${remainingText}`;
		chosenItem.parentElement.insertBefore(inputDiv, chosenItem);
	}

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
			if (value.length === 0) {
				return;
			}
			// document.querySelector('.extra-chrome-gift').remove();
			document.querySelector('.ern-ext-translate-button').className +=
				' clicked';

			//create a port to send messages throughout the application
			var port = chrome.runtime.connect({
				name: 'knockknock',
			});

			//Send a message from the port
			port.postMessage({
				joke: 'Knock knock',
				text: inputText,
				userTranslation: value,
				language: targetLanguage,
				source: document.URL,
			});
			//Handle any response that might come on this port
			port.onMessage.addListener(function (msg) {
				changeContent(msg);
			});
		},
		false
	);

	const changeContent = (translationResult: {
		userTranslation: string;
		translatedText: string;
		successfulTranslation: string;
	}) => {
		let highlightColor = '#eb7272ba';
		let className = ' failed-translation ';
		let wrongInput = `<em style='background-color: #ddd7d7;'>  ${translationResult.userTranslation}</em>`;

		if (translationResult.successfulTranslation) {
			highlightColor = '#a1eb3f8c';
			wrongInput = '';
			className = ' successful-translation';
			translationResult.translatedText = translationResult.userTranslation;
		}
		let button = document.querySelector('.ern-ext-translate-button');

		button.classList.remove('clicked');
		button.className += className;

		setTimeout(() => {
			chosenItem.innerHTML =
				words[0] +
				'<span style="background-color: ' +
				highlightColor +
				'; border-radius:2px;">' +
				translationResult.translatedText +
				'</span>' +
				wrongInput +
				' ' +
				remainingText;
			removeElement('.extra-chrome-gift');
		}, 700);
	};
};

const removeElement = (query) => {
	return document.querySelector(query).remove();
};
const randomNumberInRange = (min, max) =>
	Math.floor(Math.random() * (max - min)) + min;

// const createTagsForUserPositionly = (userSettings: UserSettingsProps) => {
// 	let chosenItem;
// 	let targetLanguage =
// 		userSettings.targetLanguages[
// 			randomNumberInRange(0, userSettings.targetLanguages.length)
// 		].code;
// 	const tagTypeToBeChanged =
// 		changeableTags[Math.floor(Math.random() * changeableTags.length)];
// 	const tags = document.getElementsByTagName(tagTypeToBeChanged);
// 	for (const item of tags) {
// 		if (!item?.firstElementChild) {
// 			chosenItem = item;
// 			break;
// 		}
// 	}
// 	chosenItem = document.querySelector('.LC20lb');
// 	if (!chosenItem) {
// 		return;
// 	}

// 	let translateText = chosenItem?.textContent?.trim();
// 	let inputText, remainingText;
// 	console.log(chosenItem.getBoundingClientRect());
// 	//Add Input field and highlight the text
// 	if (translateText) {
// 		console.log('translateText', translateText.match(singleWordRegex));
// 		inputText = translateText.match(singleWordRegex)[0];

// 		remainingText = translateText.replace(singleWordRegex, '');
// 		const inputDiv = document.createElement('div');
// 		inputDiv.innerHTML = InputField(
// 			targetLanguage,
// 			chosenItem.getBoundingClientRect().x,
// 			chosenItem.getBoundingClientRect().y
// 		);
// 		chosenItem.innerHTML = ` <span style='background-color: #aef4ff7a;border-radius: 5px;' >${inputText}</span>${remainingText}`;
// 		document.body.appendChild(inputDiv);

// 		// chosenItem.parentElement.insertBefore(inputDiv, chosenItem);
// 	}

// 	//Create Translate Button Functionality
// 	// let translateButton = document.querySelector(
// 	// 	'.ern-ext-translate-button'
// 	// ) as HTMLElement;
// 	// translateButton.addEventListener(...);

// 	// const changeContent = (...)
// };
