const constants = require('../constants.js');
export const removeElement = (query: string, document) => {
	return document.querySelector(query).remove();
};
export const randomNumberInRange = (
	min: number,
	max: number,
	integer?: boolean
) => {
	let randomNo = Math.random() * (max - min);
	if (integer) randomNo = Math.floor(randomNo);
	return randomNo + min;
};

export const hasUnwantedChars: RegExp = /[+\d().{}\[\]!~`@#&$/%^*_–|:;"“‘<>,?]/;

export const disintegrateSentence = (sentence: string) => {
	let words = sentence.split(' ');
	const possibleIndexes = findSuitableWords(words);
	if (!possibleIndexes.length) {
		return false;
	}
	const cutPoint = randomArrayElement(possibleIndexes);
	const entrance = words.slice(0, cutPoint).join(' ');
	const inputText = words[cutPoint];
	const remainingText = words.slice(cutPoint + 1, words.length).join(' ');
	return { entrance, inputText, remainingText };
};
export const findSuitableWords = (words: string[]) => {
	let suitableWordIndexes: number[] = [];
	let currentElementIndex = 0;
	while (
		suitableWordIndexes.length <
			constants.algorithmConstants.furthestWordIndexLimit &&
		currentElementIndex < words.length
	) {
		if (
			words[currentElementIndex].length > 2 &&
			!hasUnwantedChars.test(words[currentElementIndex])
		) {
			suitableWordIndexes.push(currentElementIndex);
		}
		currentElementIndex++;
	}
	return suitableWordIndexes;
};

export const randomArrayElement = (array: any[]) => {
	return array[Math.floor(Math.random() * array.length)];
};
export const makeId = (length: number) => {
	var result = '';
	var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
	var charactersLength = characters.length;
	for (var i = 0; i < length; i++) {
		result += characters.charAt(Math.floor(Math.random() * charactersLength));
	}
	return result;
};

export const isInViewport = (
	el: HTMLUnknownElement,
	document: Document,
	window: Window
) => {
	var rect = el.getBoundingClientRect();
	return (
		rect.top >= 0 &&
		rect.left >= 0 &&
		rect.bottom <=
			(window.innerHeight ||
				document.documentElement.clientHeight) /* or $(window).height() */ &&
		rect.right <=
			(window.innerWidth ||
				document.documentElement.clientWidth) /* or $(window).width() */
	);
};

export const getChangeableTags = (): string[] => [
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
