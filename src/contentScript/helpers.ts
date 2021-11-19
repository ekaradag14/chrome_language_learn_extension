export const removeElement = (query: string, document) => {
	return document.querySelector(query).remove();
};
export const randomNumberInRange = (min: number, max: number) =>
	Math.floor(Math.random() * (max - min)) + min;

export const hasUnwantedChars: RegExp = /[+\d().{}\[\]!~`@#&$%^*_–|:;“‘<>,?]/;

export const getRandomArbitrary = (min: number, max: number) => {
	return Math.floor(Math.random() * (max - min) + min);
};
