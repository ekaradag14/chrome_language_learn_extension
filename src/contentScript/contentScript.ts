// TODO: content script
import './contentScript.css';
const changeableTags: string[] = ['h1', 'h2', 'h3', 'h4', 'p', 'em', 'b'];
import InputField from './InputField';

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
let translateText = chosenItem.textContent;
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
	function (e) {
		e.preventDefault();
		let elem = document.querySelector('.ern-ext-input') as HTMLInputElement;
		let value = elem.value;
		// document.querySelector('.extra-chrome-gift').remove();
		document.querySelector('.ern-ext-translate-button').className += ' clicked';

		setTimeout(() => {
			document
				.querySelector('.ern-ext-translate-button')
				.classList.remove('clicked');
			setTimeout(() => {
				chosenItem.innerHTML =
					'<em style="background-color: yellow">' + value + '</em>';
			}, 500);
		}, 1000);
	},
	false
);
