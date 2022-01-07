import InputField from './InputFields/InputField';
import TranslationInputField from './InputFields/TranslationInputField';

import * as helpers from './helpers';
import { ConfigType, TranslationResultProps } from '../lib/modals';
import './contentScript.css';
import './multipleChoiceStyles.css';
const developmentMode = true;
const constants = require('../constants.js');
const allChangeableTags = ['h4'] || helpers.getChangeableTags();

let createTagsCallTime = 0;
let isBanned: boolean = false;
let droplets: string[] = [];
let chosenWords: string[] = [];
let frequency = 0;
let wordSearchConfig: ConfigType = constants.algorithmConstants;
let dropletTypeClassNumber = '23';

window.addEventListener('load', function () {
	//Start the process when page load completes to not cause performance issues on user
	chrome.storage.local.get(
		['bannedSites', 'userSettings', 'dailyLimitReached', 'config'],
		(res) => {
			//Get the config for word search and randomness
			if (res.config) {
				wordSearchConfig = developmentMode
					? constants.algorithmConstants
					: res.config.config;
				developmentMode && console.log('config', wordSearchConfig);
			}
			//Check if this site is banned
			if (res.bannedSites) {
				res.bannedSites.forEach((el: string[]) => {
					if (el.includes(document.domain)) {
						isBanned = true;
					}
				});
				let randomShow =
					Math.random() <
					(res.userSettings.frequency * wordSearchConfig.baseFrequencySeed) /
						10;
				const willItBeShown =
					(!isBanned &&
						!res.dailyLimitReached &&
						res.userSettings.targetLanguages &&
						randomShow) ||
					developmentMode;

				developmentMode &&
					console.log('willItBeShown', willItBeShown, 'randomShow', randomShow);
				if (willItBeShown) {
					frequency = res.userSettings.frequency || 1;
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

const createDropletsForUser = (
	targetLanguage: string,
	changeableTags: string[]
) => {
	if (createTagsCallTime >= wordSearchConfig.maxTagTryCallTimes) return;
	createTagsCallTime = createTagsCallTime + 1;

	const tagTypeToBeChanged: string = helpers.randomArrayElement(changeableTags);

	let validItems = findValidItems(tagTypeToBeChanged, changeableTags);

	if (!validItems.length) {
		reSearchWithoutTag(changeableTags, tagTypeToBeChanged, targetLanguage);
		return;
	}

	let pageDroplets = [];

	let dropletsPerPage = Math.max(
		Math.min(
			Math.floor(
				helpers.randomNumberInRange(
					wordSearchConfig.frequencyLowLimit,
					wordSearchConfig.frequencyHightLimit,
					true
				) * frequency
			),
			3
		),
		1
	);

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

			//Disintegrate sentence for translation and recreation
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
	pageDroplets.forEach((el, index) => {
		const inputDiv: HTMLDivElement = document.createElement('div');
		if ('multiple-choice') {
			inputDiv.innerHTML = TranslationInputField(
				el.targetLanguage,
				el.dropletClassName
			);
			dropletTypeClassNumber = '22';
		} else {
			inputDiv.innerHTML = InputField(el.targetLanguage, el.dropletClassName);
		}

		let inputElement = inputDiv.children[0].children[0] as HTMLElement;

		//When user scrolls into a droplet in viewport, they glow
		document.addEventListener(
			'scroll',
			() => checkAndGlow(inputElement), //Pass the input element for glow effect
			{
				passive: true,
			}
		);

		//Create the port and translation message
		var port = chrome.runtime.connect({
			name: 'translationChannel',
		});
		const fireTranslation = () => {
			port.postMessage({
				text: el.inputText,
				language: el.targetLanguage,
				source: document.URL,
			});

			// TODO: DISCONNECT PORT WHEN IT IS NOT USED ANYMORE
		};
		if (!'multiple-choice') {
			const translationListenerInput = () => {
				fireTranslation();
				inputElement.removeEventListener('input', translationListenerInput);
			};
			inputElement.addEventListener('input', translationListenerInput);
		}

		el.item.innerHTML = `${el.entrance} <span style='background-color: #aef4ff7a;border-radius: 5px;' > ${el.inputText}</span> ${el.remainingText}`;
		el.item.classList += ` learnip-chosen-item-${dropletTypeClassNumber} ${el.dropletClassName}-text`;
		el.item.parentElement.insertBefore(inputDiv, el.item);
		developmentMode && console.log('item', el.item);

		if ('multiple-choice') {
			let containerDiv: HTMLDivElement = document.querySelector(
				`.${el.dropletClassName}#learnip-container-div-${dropletTypeClassNumber}`
			);

			const translationListenerMultipleChoice = () => {
				fireTranslation();
				containerDiv.removeEventListener(
					'mouseover',
					translationListenerMultipleChoice
				);
			};

			const clickOnChoice = (e) => {
				let lastClicked: HTMLButtonElement | null = document.querySelector(
					`.learnip-choice-${dropletTypeClassNumber}.clicked`
				);
				const countryImage = document.querySelector(
					`#learnip-country-img-${dropletTypeClassNumber}`
				);
				countryImage?.remove();
				lastClicked?.classList.remove('clicked');
				e.target.classList += ' clicked';
			};

			let choiceButtons: HTMLCollection = document.querySelectorAll(
				`.learnip-choice-${dropletTypeClassNumber}`
			);
			for (let button of choiceButtons) {
				button.addEventListener('click', clickOnChoice);
			}

			containerDiv.addEventListener(
				'mouseover',
				translationListenerMultipleChoice
			);
		}

		// Create Translate Button Functionality For Each Droplet
		const translateButtonProps: [
			dropletClassName: string,
			inputText: string,
			targetLanguage: string,
			entrance: string,
			remainingText: string
		] = [
			el.dropletClassName,
			el.inputText,
			el.targetLanguage,
			el.entrance,
			el.remainingText,
		];
		console.log('index9', index);
		if ('multiple-choice') {
			createMultipleChoiceHoverFunctionality(...translateButtonProps);
		} else {
			createTranslateButtonFunctionality(...translateButtonProps);
		}
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
		`.${dropletClassName}  #learnip-translate-button-${dropletTypeClassNumber}`
	);

	let textInput: HTMLInputElement = document.querySelector(
		`.${dropletClassName}  #learnip-input-${dropletTypeClassNumber}`
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
			translateButton.className += ` learnip-clicked-state-${dropletTypeClassNumber}`;
			textInput.className += ` learnip-disabled-input-${dropletTypeClassNumber}`;
			textInput.disabled = true;
			//create a port to send messages throughout the application

			//Send a message from the port
			let timePassed = 0;
			let translationResult;
			let inter = setInterval(() => {
				if (timePassed > 10) {
					clearInterval(inter);
				}

				let storageTranslationCallback = (res) => {
					if (res.currentTranslations) {
						let response = res.currentTranslations.filter(
							(el) => el.basePrompt === inputText
						);
						if (response.length) {
							translationResult = response[0];
						}
					}
				};

				chrome.storage.local.get(
					['currentTranslations'],
					storageTranslationCallback
				);

				if (translationResult) {
					changeContent(
						dropletClassName,
						translationResult,
						entrance,
						inputText,
						remainingText,
						value
					);
					clearInterval(inter);
				}

				timePassed += 1;
			}, 500);
			//Handle any response that might come on this port
		},
		false
	);
};

const createMultipleChoiceHoverFunctionality = (
	dropletClassName: string,
	inputText: string,
	targetLanguage: string,
	entrance: string,
	remainingText: string
) => {
	let containerDiv: HTMLButtonElement = document.querySelector(
		`.${dropletClassName}#learnip-container-div-${dropletTypeClassNumber}`
	);
	// console.log(
	// 	'containerDiv',
	// 	containerDiv,
	// 	'dropletClassName',
	// 	dropletClassName,
	// 	'dropletTypeClassNumber',
	// 	dropletTypeClassNumber
	// );
	const makeTranslation = (e) => {
		console.log('hello');

		containerDiv.className += ` learnip-fetch-choices-${dropletTypeClassNumber}`;

		//Send a message from the port
		let timePassed = 0;
		let translationResult;
		let inter = setInterval(() => {
			if (timePassed > 20) {
				clearInterval(inter);
			}

			let storageTranslationCallback = (res) => {
				developmentMode && console.log('storage check');
				if (res.currentTranslations) {
					let response = res.currentTranslations.filter(
						(el) => el.basePrompt === inputText
					);

					if (response.length) {
						translationResult = response[0];
					}
				}
			};

			chrome.storage.local.get(
				['currentTranslations'],
				storageTranslationCallback
			);

			if (translationResult) {
				developmentMode && console.log('translation found', translationResult);
				containerDiv.classList.remove(
					`learnip-fetch-choices-${dropletTypeClassNumber}`
				);

				let userOptions = document.querySelectorAll('.learnip-choice-22');
				let possibleOptions = Object.keys(translationResult.options);
				userOptions[
					helpers.randomNumberInRange(0, userOptions.length, true)
				].innerHTML = translationResult.compareText;

				for (let userOption of userOptions) {
					if (!userOption.innerHTML) {
						const fillElement = () => {
							let languageKey = helpers.randomArrayElement(possibleOptions);
							const isOptionValid =
								translationResult.options[languageKey] !== undefined &&
								translationResult.options[languageKey] !==
									translationResult.basePrompt;
							if (isOptionValid) {
								userOption.innerHTML = translationResult.options[languageKey];
								delete translationResult.options[languageKey];
							}
						};
						while (!userOption.innerHTML) {
							fillElement();
						}
					}
				}

				containerDiv.className += ` learnip-with-choices-${dropletTypeClassNumber}`;

				let translateButton: HTMLButtonElement = document.querySelector(
					`#learnip-translate-button-${dropletTypeClassNumber}`
				);
				translateButton.addEventListener('click', () => {
					let selectedButton: HTMLButtonElement = document.querySelector(
						`.clicked.learnip-choice-${dropletTypeClassNumber} `
					);
					changeContent(
						dropletClassName,
						translationResult,
						entrance,
						inputText,
						remainingText,
						selectedButton.innerText.toLowerCase()
					);
				});

				clearInterval(inter);
			}

			timePassed += 1;
		}, 500);
		containerDiv.removeEventListener('mouseover', makeTranslation, false);
		//TODO: Handle case if translation result is not found
		//Handle any response that might come on this port
	};
	containerDiv.addEventListener('mouseover', makeTranslation, false);
};
const changeContent = (
	dropletClassName: string,
	translationResult: TranslationResultProps,
	entrance: string,
	inputText: string,
	remainingText: string,
	userTranslation: string
) => {
	let chosenItem = document.querySelector(
		`.${dropletClassName}-text.learnip-chosen-item-${dropletTypeClassNumber}`
	);
	if (translationResult.clear) {
		helpers.removeElement(
			`#learnip-container-div-${dropletTypeClassNumber}.${dropletClassName}`,
			document
		);
		chosenItem.innerHTML = `${entrance} ${inputText} ${remainingText}`;
		return;
	}

	let translateButton: HTMLButtonElement = document.querySelector(
		`.${dropletClassName}  #learnip-translate-button-${dropletTypeClassNumber}`
	);

	let highlightColor: string,
		className: string,
		wrongInput: string = '';

	const isTranslationSuccessful =
		translationResult.compareText === userTranslation.toLowerCase();

	//Check if the translation was successful
	if (isTranslationSuccessful) {
		highlightColor = '#a1eb3f8c';
		className = ` learnip-successful-translation-${dropletTypeClassNumber}`;
		translationResult.translatedText = userTranslation;
	} else {
		highlightColor = '#eb7272ba';
		className = ` learnip-failed-translation-${dropletTypeClassNumber} `;
		wrongInput = `<em id='learnip-wrong-input-${dropletTypeClassNumber}'>  ${userTranslation}</em>`;
	}

	var usagePort = chrome.runtime.connect({
		name: 'translationChannel',
	});

	usagePort.postMessage({
		type: 'usagePort',
		isTranslationSuccessful,
	});

	usagePort.disconnect();

	translateButton.classList.remove(
		`learnip-clicked-state-${dropletTypeClassNumber}`
	);
	translateButton.className += className;

	setTimeout(() => {
		chosenItem.innerHTML = `${entrance} <span style="background-color: ${highlightColor};border-radius:2px;">${translationResult.translatedText}</span> ${wrongInput} ${remainingText}`;
		document.querySelector(
			`.${dropletClassName}#learnip-container-div-${dropletTypeClassNumber}`
		).className += ' opacity-zero';

		setTimeout(() => {
			helpers.removeElement(
				`#learnip-container-div-${dropletTypeClassNumber}.${dropletClassName}`,
				document
			);
		}, 600);
	}, 1000);
};

//#region HELPERS
const checkIfElementIsValid = (item: HTMLElement) => {
	let isValid = false;
	const computedStyles = window.getComputedStyle(item);
	if (
		!!item &&
		!item.children.length && // It has only text
		!item.closest('a') && // Is not in <a></a> tag (a tags or buttons cause clicks)
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

//#endregion

//#region Position Based
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
//#endregion
export const checkAndGlow = (element: HTMLElement) => {
	if (helpers.isInViewport(element, document, window)) {
		element.classList.add(`learnip-glow-${dropletTypeClassNumber}`);
		// @ts-ignore: Unreachable code error
		document.removeEventListener('scroll', checkAndGlow, {
			passive: true,
		});
	}
};
