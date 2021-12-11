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
let droplets: string[] = [];
let chosenWords: string[] = [];
let frequency = 0;
// import { UserSettingsProps } from '../lib/modals';
//helpers
import * as helpers from './helpers';
import { ConfigType, TranslationResultProps } from '../lib/modals';
const constants = require('../constants.js');
let wordSearchConfig: ConfigType = constants.algorithmConstants;

window.addEventListener('load', function () {
	//Start the process when page load completes to not cause performance issues on user
	chrome.storage.local.get(
		['bannedSites', 'userSettings', 'dailyLimitReached', 'config'],
		(res) => {
			//Get the config for word search and randomness
			if (res.config) {
				wordSearchConfig = res.config.config;
				console.log('config', wordSearchConfig);
			}
			//Check if this site is banned
			if (res.bannedSites) {
				res.bannedSites.forEach((el: string[]) => {
					if (el.includes(document.domain)) {
						isBanned = true;
					}
				});

				if (
					!isBanned &&
					!res.dailyLimitReached &&
					res.userSettings.targetLanguages &&
					Math.random() <
						(res.userSettings.frequency * wordSearchConfig.baseFrequencySeed) /
							10
				) {
					frequency = res.userSettings.frequency;
					let targetLanguage =
						res.userSettings.targetLanguages[
							helpers.randomNumberInRange(
								0,
								res.userSettings.targetLanguages.length,
								true
							)
						].code;
					createDropletsForUser(targetLanguage, allChangeableTags);
				}
			}
		}
	);
});
var port = chrome.runtime.connect({
	name: 'translationChannel',
});

const createDropletsForUser = (
	targetLanguage: string,
	changeableTags: string[]
) => {
	if (createTagsCallTime >= wordSearchConfig.maxTagTryCallTimes) return;
	createTagsCallTime = createTagsCallTime + 1;
	let chosenItem;

	const tagTypeToBeChanged: string = helpers.randomArrayElement(changeableTags);

	let validItems = findValidItems(tagTypeToBeChanged, changeableTags);

	if (!validItems.length) {
		reSearchWithoutTag(changeableTags, tagTypeToBeChanged, targetLanguage);
		return;
	}

	// chosenItem = helpers.randomArrayElement(validItems);
	let pageDroplets = [];

	//Manual override point
	// chosenItem = document.querySelector('.mt-md-3');
	let dropletsPerPage = Math.max(
		Math.min(
			Math.floor(
				helpers.randomNumberInRange(
					wordSearchConfig.frequencyLowLimit,
					wordSearchConfig.frequencyHightLimit
				) * frequency
			),
			3
		),
		1
	);
	console.log('Chance passed', dropletsPerPage);
	validItems.forEach((validItem, index) => {
		if (index < dropletsPerPage) {
			let el: any = {
				targetLanguage,
				translateText: '',
				dropletClassName: '',
				inputText: '',
				entrance: '',
				remainingText: '',
			};
			el.translateText = validItem.innerText.trim();
			let disintegrated = helpers.disintegrateSentence(el.translateText);
			if (!disintegrated) {
				el = false;
			} else {
				el.inputText = disintegrated.inputText;
				el.dropletClassName = `${helpers.makeId(
					3
				)}${helpers.randomNumberInRange(2000, 5000, true)}`;
				el.item = validItem;
				el.entrance = disintegrated.entrance;
				el.remainingText = disintegrated.remainingText;
				//Check if the same word is chosen before or the same class created
				if (
					droplets.includes(el.dropletClassName) ||
					chosenWords.includes(el.inputText) ||
					helpers.hasUnwantedChars.test(el.inputText)
				) {
					el = false;
				} else {
					droplets.push(el.dropletClassName);
					chosenWords.push(el.inputText);
				}
			}
			if (el) pageDroplets.push(el);
		}
	});

	pageDroplets.forEach((el) => {
		console.log(el);
		const inputDiv: HTMLDivElement = document.createElement('div');
		inputDiv.innerHTML = InputField(el.targetLanguage, el.dropletClassName);

		el.item.innerHTML = `${el.entrance} <span style='background-color: #aef4ff7a;border-radius: 5px;' > ${el.inputText}</span> ${el.remainingText}`;
		el.item.classList += ` learnip-chosen-item-23 ${el.dropletClassName}-text`;
		el.item.parentElement.insertBefore(inputDiv, el.item);

		// Create Translate Button Functionality For Each Droplet
		createTranslateButtonFunctionality(
			el.dropletClassName,
			el.inputText,
			el.targetLanguage,
			el.entrance,
			el.remainingText
		);
	});
};

const createTranslateButtonFunctionality = (
	dropletClassName: string,
	inputText: string,
	targetLanguage: string,
	entrance: string,
	remainingText: string
) => {
	let translateButton: HTMLButtonElement = document.querySelector(
		`.${dropletClassName}  #learnip-translate-button-23`
	);

	let textInput: HTMLInputElement = document.querySelector(
		`.${dropletClassName}  #learnip-input-23`
	);

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
				if (translationResult.userTranslation === value) {
					// So that concurrent translation are not mixed (Assuming translations are not the same, could be improved)

					changeContent(
						dropletClassName,
						translationResult,
						entrance,
						inputText,
						remainingText
					);
				}
			});
		},
		false
	);
};
const changeContent = (
	dropletClassName: string,
	translationResult: TranslationResultProps,
	entrance: string,
	inputText: string,
	remainingText: string
) => {
	let chosenItem = document.querySelector(
		`.${dropletClassName}-text.learnip-chosen-item-23`
	);
	if (translationResult.clear) {
		helpers.removeElement(
			`#learnip-container-div-23.${dropletClassName}`,
			document
		);
		chosenItem.innerHTML = `${entrance} ${inputText} ${remainingText}`;
		return;
	}

	let translateButton: HTMLButtonElement = document.querySelector(
		`.${dropletClassName}  #learnip-translate-button-23`
	);

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
	setTimeout(() => {
		chosenItem.innerHTML = `${entrance} <span style="background-color: ${highlightColor};border-radius:2px;">${translationResult.translatedText}</span> ${wrongInput} ${remainingText}`;
		document.querySelector(
			`.${dropletClassName}#learnip-container-div-23`
		).className += ' opacity-zero';

		setTimeout(() => {
			helpers.removeElement(
				`#learnip-container-div-23.${dropletClassName}`,
				document
			);
		}, 600);
	}, 1000);
};
const checkIfElementIsValid = (item: HTMLElement) => {
	let isValid = false;
	const computedStyles = window.getComputedStyle(item);
	if (
		!!item &&
		!item.children.length && // It has only text
		!item.closest('a') && // Is not in <a></a> tag
		!item.closest('button') && // Is not in a button tag
		computedStyles.cursor !== 'pointer' &&
		item?.innerText?.trim().length > wordSearchConfig.minSentenceLength &&
		!(
			item?.innerText?.trim().split(' ').length < wordSearchConfig.minWordCount
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
	return createDropletsForUser(targetLanguage, possibleTags);
};
const findValidItems = (
	tagTypeToBeChanged: string,
	changeableTags: string[]
) => {
	const tags = document.querySelectorAll(tagTypeToBeChanged);
	let validItems: HTMLElement[] = [];

	//Filter for usable tags
	for (const item of tags) {
		if (checkIfElementIsValid(item as HTMLElement))
			validItems.push(item as HTMLElement);
		if (validItems.length >= wordSearchConfig.numberOfValidTagItems) break;
	}

	return validItems;
};

// const createDropletsForUserPositionly = (userSettings: UserSettingsProps) => {
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
