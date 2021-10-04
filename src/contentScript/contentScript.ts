// TODO: content script
const changeableTags: string[] = ['a', 'p', 'em', 'b'];
import InputField from './InputField';
const tagTypeToBeChanged =
	changeableTags[Math.floor(Math.random() * changeableTags.length)];
const tags = document.getElementsByTagName(tagTypeToBeChanged);
const getRandomArbitrary = (min: number, max: number) => {
	return Math.random() * (max - min) + min;
};

const randomElementIndex: number = getRandomArbitrary(0, tags.length);
const chosenItem = tags.item(randomElementIndex) as HTMLElement;

chosenItem.style['background-color'] = 'yellow';
// chosenItem.textContent = 'Selam Baba';
chosenItem.innerHTML = `${InputField} ${chosenItem.innerHTML} `;

//Create Clear Button Functionality
let button = document.querySelector('#anan-but-x') as HTMLElement;
button.addEventListener(
	'click',
	function () {
		let div = document.querySelector('#extra-chrome-gift') as HTMLElement;
		div.style['display'] = 'none';
	},
	false
);

console.log(tagTypeToBeChanged, chosenItem);
