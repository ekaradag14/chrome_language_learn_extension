const constants = require('../constants.js');
export const removeElement = (query: string, document) => {
	return document.querySelector(query).remove();
};
export const randomNumberInRange = (min: number, max: number) =>
	Math.floor(Math.random() * (max - min)) + min;

export const hasUnwantedChars: RegExp = /[+\d().{}\[\]!~`@#&$%^*_–|:;“‘<>,?]/;

export const getRandomArbitrary = (min: number, max: number) => {
	return Math.floor(Math.random() * (max - min) + min);
};
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
