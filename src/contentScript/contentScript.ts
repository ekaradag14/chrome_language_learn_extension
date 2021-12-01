// TODO: content script
import './contentScript.css';
const allChangeableTags: string[] = [
	'yt-formatted-string', // String tag used for texts in youtube
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

let createTagsCallTime = 0;
import InputField from './InputField';
let isBanned: boolean = false;

// import { UserSettingsProps } from '../lib/modals';
//helpers
import * as helpers from './helpers';
const constants = require('../constants.js');
export type TranslationResultProps = {
	clear?: boolean;
	userTranslation: string;
	translatedText: string;
	successfulTranslation: boolean;
};
chrome.storage.local.get(
	['bannedSites', 'userSettings', 'dailyLimitReached'],
	(res) => {
		if (res.bannedSites) {
			res.bannedSites.forEach((el: string[]) => {
				if (el.includes(document.domain)) {
					isBanned = true;
				}
			});

			if (
				!isBanned &&
				!res.dailyLimitReached &&
				res.userSettings.targetLanguages
				// helpers.getRandomArbitrary(0, 10) % 2 === 0)
			) {
				let targetLanguage =
					res.userSettings.targetLanguages[
						helpers.randomNumberInRange(
							0,
							res.userSettings.targetLanguages.length
						)
					].code;
				createTagsForUser(targetLanguage, allChangeableTags);
			}
		}
	}
);

const createTagsForUser = (
	targetLanguage: string,
	changeableTags: string[]
) => {
	if (createTagsCallTime >= constants.algorithmConstants.maxTagTryCallTimes)
		return;
	createTagsCallTime = createTagsCallTime + 1;
	let chosenItem;
	const tagTypeToBeChanged: string = helpers.randomArrayElement(changeableTags);

	console.log(createTagsCallTime, 'th Try, Choosen tag is', tagTypeToBeChanged);
	//Get all elements of selected type
	const tags = document.querySelectorAll(tagTypeToBeChanged);

	let validItems: Element[] = [];

	//Filter for usable tags
	for (const item of tags) {
		if (checkIfElementIsValid(item)) validItems.push(item);
		if (validItems.length >= constants.algorithmConstants.numberOfValidTagItems)
			break;
	}

	console.log('validItems', validItems);

	//If we have no suitable items restart without using this tag
	if (!validItems.length) {
		reSearchWithoutTag(changeableTags, tagTypeToBeChanged, targetLanguage);
		return;
	}

	//Filter for elements containing suitable content

	if (!validItems.length) {
		reSearchWithoutTag(changeableTags, tagTypeToBeChanged, targetLanguage);
		return;
	}

	chosenItem = helpers.randomArrayElement(validItems);
	//Manual override point
	// chosenItem = document.querySelector('.mt-md-3');

	let translateText: string = chosenItem.innerText.trim();
	let disintegrated = helpers.disintegrateSentence(translateText);
	if (!disintegrated) {
		return;
	}
	const { entrance, inputText, remainingText } = disintegrated;

	console.log('all is good', chosenItem, translateText);

	const inputDiv: HTMLDivElement = document.createElement('div');
	inputDiv.innerHTML = InputField(targetLanguage);
	chosenItem.innerHTML = `${entrance} <span style='background-color: #aef4ff7a;border-radius: 5px;' > ${inputText}</span> ${remainingText}`;
	chosenItem.classList += ' learnip-chosen-item-23';
	chosenItem.parentElement.insertBefore(inputDiv, chosenItem);

	//Get the translate button

	//Create Translate Button Functionality
	createTranslateButtonFunctionality(
		inputText,
		targetLanguage,
		entrance,
		remainingText
	);
};
const changeContent = (
	translationResult: TranslationResultProps,
	entrance: string,
	inputText: string,
	remainingText: string
) => {
	let chosenItem = document.querySelector('.learnip-chosen-item-23');
	let translateButton: HTMLButtonElement = document.querySelector(
		'#learnip-translate-button-23'
	);
	if (translationResult.clear) {
		helpers.removeElement('#learnip-container-div-23', document);
		chosenItem.innerHTML = `${entrance} ${inputText} ${remainingText}`;
		return;
	}
	let highlightColor = '#eb7272ba';
	let className = ' learnip-failed-translation-23 ';
	let wrongInput = `<em id='learnip-wrong-input-23'>  ${translationResult.userTranslation}</em>`;

	if (translationResult.successfulTranslation) {
		highlightColor = '#a1eb3f8c';
		wrongInput = '';
		className = ' learnip-successful-translation-23';
		translationResult.translatedText = translationResult.userTranslation;
	}

	translateButton.classList.remove('learnip-clicked-state-23');
	translateButton.className += className;
	console.log('hello');
	setTimeout(() => {
		console.log('hello2');
		chosenItem.innerHTML = `${entrance} <span style="background-color: ${highlightColor};border-radius:2px;">${translationResult.translatedText}</span> ${wrongInput} ${remainingText}`;
		document.querySelector('#learnip-container-div-23').className +=
			' opacity-zero';
		setTimeout(() => {
			helpers.removeElement('#learnip-container-div-23', document);
		}, 600);
	}, 1000);
};
const createTranslateButtonFunctionality = (
	inputText: string,
	targetLanguage: string,
	entrance: string,
	remainingText: string
) => {
	let translateButton: HTMLButtonElement = document.querySelector(
		'#learnip-translate-button-23'
	);
	let textInput: HTMLInputElement = document.querySelector('#learnip-input-23');
	translateButton.addEventListener(
		'click',
		async function (e) {
			e.preventDefault();
			let value = textInput.value;
			if (value.length === 0) {
				return;
			}
			// document.querySelector('#learnip-container-div-23').remove();
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
				changeContent(translationResult, entrance, inputText, remainingText);
			});
		},
		false
	);
};
const checkIfElementIsValid = (item) => {
	let isValid = false;
	const computedStyles = window.getComputedStyle(item);
	if (
		!!item &&
		!item.children.length && // It has only text
		!item.closest('a') && // Is not in <a></a> tag
		!item.closest('button') && // Is not in a button tag
		item?.innerText?.trim().length >
			constants.algorithmConstants.minSentenceLength &&
		!(
			item?.innerText?.trim().split(' ').length <
			constants.algorithmConstants.minWordCount
		) && //Second word is chosen, so at least 2 words are required
		computedStyles.position !== 'absolute' &&
		computedStyles.display !== 'none' &&
		computedStyles.visibility !== 'hidden'
		//TODO check for color if transparent
	) {
		isValid = true;
	}
	return isValid;
};

const reSearchWithoutTag = (
	changeableTags: string[],
	tagTypeToBeChanged: string,
	targetLanguage: string
) => {
	const possibleTags = changeableTags.filter((el) => el !== tagTypeToBeChanged);
	return createTagsForUser(targetLanguage, possibleTags);
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

// 	let translateText = chosenItem?.innerText?.trim();
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
// 	// 	'#learnip-translate-button-23'
// 	// ) as HTMLElement;
// 	// translateButton.addEventListener(...);

// 	// const changeContent = (...)
// };
