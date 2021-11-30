// TODO: content script
import './contentScript.css';
const allChangeableTags: string[] = [
	// 'yt-formatted-string', // String tag used for texts in youtube
	// 'h2',
	// 'h1',
	// 'h3',
	// 'h4',
	'p',
	// 'em',
	// 'b',
	// 'span',
	// 'strong',
	// 'li',
];
const numberOfValidTagItems = 3;
const maxTagTryCallTimes = 3;
let createTagsCallTime = 0;
import InputField from './InputField';
let isBanned: boolean = false;
// import { UserSettingsProps } from '../lib/modals';
//helpers
import * as helpers from './helpers';
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
	if (createTagsCallTime >= maxTagTryCallTimes) return;
	createTagsCallTime = createTagsCallTime + 1;
	let chosenItem;
	const tagTypeToBeChanged: string = randomArrayElement(changeableTags);

	console.log(createTagsCallTime, 'th Try, Choosen tag is', tagTypeToBeChanged);
	//Get all elements of selected type
	const tags = document.querySelectorAll(tagTypeToBeChanged);

	let validItems: Element[] = [];

	//Filter for usable tags
	for (const item of tags) {
		if (checkIfElementIsValid(item)) validItems.push(item);
		if (validItems.length >= numberOfValidTagItems) break;
	}

	console.log('validItems', validItems);

	//If we have no suitable items restart without using this tag
	if (!validItems.length) {
		reSearchWithoutTag(changeableTags, tagTypeToBeChanged, targetLanguage);
		return;
	}

	//Filter for elements containing suitable content
	validItems = validItems.filter((el) => checkIfContentValid(el));

	if (!validItems.length) {
		reSearchWithoutTag(changeableTags, tagTypeToBeChanged, targetLanguage);
		return;
	}

	chosenItem = randomArrayElement(validItems);
	//Manual override point
	// chosenItem = document.querySelector('.mt-md-3');

	let translateText: string = chosenItem?.innerText?.trim();
	let inputText: string, remainingText: string, words: string[];

	words = translateText.split(' ');

	inputText = words[1];
	console.log('all is good', chosenItem, translateText);
	remainingText = words.splice(2, words.length).join(' ');

	const inputDiv: HTMLDivElement = document.createElement('div');
	inputDiv.innerHTML = InputField(targetLanguage);
	chosenItem.innerHTML = `${words[0]} <span style='background-color: #aef4ff7a;border-radius: 5px;' > ${inputText}</span> ${remainingText}`;
	chosenItem.parentElement.insertBefore(inputDiv, chosenItem);

	//Get the translate button
	let translateButton: HTMLButtonElement = document.querySelector(
		'#learnip-translate-button-23'
	);
	let textInput: HTMLInputElement = document.querySelector('#learnip-input-23');
	//Create Translate Button Functionality
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
				changeContent(translationResult);
			});
		},
		false
	);

	const changeContent = (translationResult: TranslationResultProps) => {
		if (translationResult.clear) {
			helpers.removeElement('#learnip-container-div-23', document);
			chosenItem.innerHTML = `${words[0]} ${inputText} ${remainingText}`;
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

		setTimeout(() => {
			chosenItem.innerHTML = `${words[0]} <span style="background-color: ${highlightColor};border-radius:2px;">${translationResult.translatedText}</span> ${wrongInput} ${remainingText}`;
			document.querySelector('#learnip-container-div-23').className +=
				' opacity-zero';
			setTimeout(() => {
				helpers.removeElement('#learnip-container-div-23', document);
			}, 600);
		}, 1000);
	};
};

const checkIfElementIsValid = (item) => {
	let isValid = false;
	const computedStyles = window.getComputedStyle(item);
	if (
		!!item &&
		!item.children.length && // It has only text
		!item.closest('a') && // Is not in <a></a> tag
		!item.closest('button') && // Is not in a button tag
		item?.innerText?.trim().length > 2 &&
		!(item?.innerText?.trim().split(' ').length < 2) && //Second word is chosen, so at least 2 words are required
		computedStyles.position !== 'absolute' &&
		computedStyles.display !== 'none' &&
		computedStyles.visibility !== 'hidden'
		//TODO check for color if transparent
	) {
		isValid = true;
	}
	return isValid;
};
const checkIfContentValid: (item: any) => boolean = (item) => {
	//Item is converted to any here because innerText is only valid for elements that are not script or style
	let isValid = true;
	let translateText: string = item?.innerText?.trim();

	let inputText: string, remainingText: string, words: string[];

	words = translateText.split(' ');
	if (
		words.length < 2 || //First word is generally a special name so return if there is only one word
		words[1].length < 3 || //Check if word is something like a, un , ve , etc.
		helpers.hasUnwantedChars.test(words[1]) || //Check if chosen word has any numbers in it
		helpers.hasUnwantedChars.test(words[1])
	) {
		isValid = false;
	}
	return isValid;
};
const randomArrayElement = (array: any[]) => {
	return array[Math.floor(Math.random() * array.length)];
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
