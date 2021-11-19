// TODO: content script
import './contentScript.css';
const changeableTags: string[] = [
	'h2',
	'h1',
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
let isBanned: boolean = false;
import { UserSettingsProps } from '../lib/modals';
//helpers
import * as helpers from './helpers';
export type TranslationResultProps = {
	userTranslation: string;
	translatedText: string;
	successfulTranslation: string;
};
chrome.storage.local.get(['bannedSites', 'userSettings'], (res) => {
	if (res.bannedSites) {
		res.bannedSites.forEach((el: string[]) => {
			if (el.includes(document.domain)) {
				isBanned = true;
			}
		});

		if (
			true ||
			(!isBanned &&
				res.userSettings.frequency !== 0 &&
				res.userSettings.targetLanguages.length &&
				helpers.getRandomArbitrary(0, 10) % 2 === 0)
		) {
			createTagsForUser(res.userSettings);
		}
	}
});

// Add a listener for any port that can be opened in the application
// chrome.runtime.onConnect.addListener(function (port) {
// 	port.onMessage.addListener(function (msg) {
// 		if (msg.joke === 'Knock knock')
// 			port.postMessage({ question: "Who's there?" });
// 	});
// });
const createTagsForUser = (userSettings: UserSettingsProps) => {
	let chosenItem;
	let targetLanguage =
		userSettings.targetLanguages[
			helpers.randomNumberInRange(0, userSettings.targetLanguages.length)
		].code;
	const tagTypeToBeChanged =
		changeableTags[Math.floor(Math.random() * changeableTags.length)];
	const tags = document.getElementsByTagName(tagTypeToBeChanged);
	for (const item of tags) {
		if (
			!!item &&
			!item.children.length &&
			!item.closest('a') &&
			!item.closest('button') &&
			!item.classList.contains('sr-only') &&
			!item.closest('.sr-only') &&
			!(item?.textContent?.trim().split(' ').length < 2) &&
			window.getComputedStyle(item).position !== 'absolute'
		) {
			//Check if element has no element children and no a tag or button tag as parent (Since our div causes click event on them)
			console.log('item found', item);
			chosenItem = item;
			break;
		}
	}
	if (!chosenItem) {
		console.log('no suitable item was found');
	}
	chosenItem = document.querySelector('.tdb-title-text');

	//Check if element is in a correct form
	if (!chosenItem) return;
	let translateText: string = chosenItem?.textContent?.trim();
	if (!translateText) return;
	console.log('all is good', chosenItem, translateText);

	//Add Input field and highlight the text
	let inputText: string, remainingText: string, words: string[];
	words = translateText.split(' ');

	//First word is generally a special name so return if there is only one word
	if (words.length < 2) return;
	inputText = words[1];

	//Check if chosen word has any numbers in it
	if (helpers.hasUnwantedChars.test(inputText)) return;

	remainingText = words.splice(2, words.length).join(' ');

	const inputDiv: HTMLDivElement = document.createElement('div');
	inputDiv.innerHTML = InputField(targetLanguage);
	chosenItem.innerHTML = `${words[0]} <span style='background-color: #aef4ff7a;border-radius: 5px;' > ${inputText}</span> ${remainingText}`;
	chosenItem.parentElement.insertBefore(inputDiv, chosenItem);

	//Get the translate button
	let translateButton: HTMLButtonElement = document.querySelector(
		'.learnip-translate-button-23'
	);
	let textInput: HTMLInputElement = document.querySelector('.learnip-input-23');
	//Create Translate Button Functionality
	translateButton.addEventListener(
		'click',
		async function (e) {
			e.preventDefault();
			let elem: HTMLInputElement = document.querySelector('.learnip-input-23');
			let value = elem.value;
			if (value.length === 0) {
				return;
			}
			// document.querySelector('.learnip-container-div-23').remove();
			translateButton.className += ' learnip-clicked-state-23';
			textInput.className += ' learnip-disabled-input-23';
			textInput.disabled = true;
			//create a port to send messages throughout the application
			var port = chrome.runtime.connect({
				name: 'knockknock',
			});

			//Send a message from the port
			port.postMessage({
				text: inputText,
				userTranslation: value,
				language: targetLanguage,
				source: document.URL,
			});
			//Handle any response that might come on this port
			port.onMessage.addListener(function (
				translationResult: TranslationResultProps
			) {
				changeContent(translationResult);
			});
		},
		false
	);

	const changeContent = (translationResult: TranslationResultProps) => {
		let highlightColor = '#eb7272ba';
		let className = ' learnip-failed-translation-23 ';
		let wrongInput = `<em style='background-color: #ddd7d7;'>  ${translationResult.userTranslation}</em>`;

		if (translationResult.successfulTranslation) {
			highlightColor = '#a1eb3f8c';
			wrongInput = '';
			className = ' learnip-successful-translation-23';
			translationResult.translatedText = translationResult.userTranslation;
		}

		translateButton.classList.remove('learnip-clicked-state-23');
		translateButton.className += className;

		setTimeout(() => {
			chosenItem.innerHTML = `${words[0]} <span style="background-color: ${highlightColor};border-radius:2px;">${translationResult.translatedText}</span> ${wrongInput} ${remainingText}`;
			document.querySelector('.learnip-container-div-23').className +=
				' opacity-zero';
			setTimeout(() => {
				helpers.removeElement('.learnip-container-div-23', document);
			}, 500);
		}, 1000);
	};
};

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
// 	// 	'.learnip-translate-button-23'
// 	// ) as HTMLElement;
// 	// translateButton.addEventListener(...);

// 	// const changeContent = (...)
// };
