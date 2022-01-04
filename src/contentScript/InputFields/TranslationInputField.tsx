import React from 'react';
import * as flags from './countryFlags';

const defaultCheck =
	'<svg xmlns="http://www.w3.org/2000/svg" id="check-svg" width="20px" height="20px" viewBox="0 0 17.94 17.94"><defs><style>.cls-1-ch{fill:#d3d3d3;}.cls-2-ch{fill:#fff;}</style></defs><g id="Layer_2" data-name="Layer 2"><g id="Layer_1-2" data-name="Layer 1"><circle class="learnip-cls-1" cx="8.97" cy="8.97" r="8.97"/><g id="Layer_2-2" data-name="Layer 2"><g id="Layer_1-2-2" data-name="Layer 1-2"><path class="cls-2-ch" d="M7.14,10.43,12,5.52c.75-.75,1.44-.87,2-.28s.24,1.32-.32,1.88c-1.79,1.79-3.59,3.59-5.4,5.38a1.28,1.28,0,0,1-2.12,0c-.69-.66-1.36-1.35-2-2C3.58,10,3.42,9.31,4,8.77a1.11,1.11,0,0,1,1.72.11C6.26,9.43,6.64,9.88,7.14,10.43Z"/></g></g></g></g></svg>';
let crossSVG =
	'<svg xmlns="http://www.w3.org/2000/svg" width="140%" height="140%" viewBox="-0.60 -0.2 3.9 3"><g id="Layer_2" data-name="Layer 2"><g id="Layer_1-2" data-name="Layer 1"><path d="M1.34,1.53a.26.26,0,0,1-.18-.09c-.1-.11-.21-.21-.31-.31s-.1-.08-.16,0-.22.22-.33.33a.2.2,0,0,1-.31,0c-.09-.1,0-.21,0-.3S.45.92.45.76.22.5.09.37,0,.17.06.06.27,0,.37.1l.4.38C.9.35,1,.23,1.16.1s.2-.14.31,0,.07.21,0,.31-.2.21-.31.31-.07.11,0,.18.23.22.34.34a.18.18,0,0,1,0,.22A.16.16,0,0,1,1.34,1.53Z"/></g></g></svg>';

const TranslationInputField = (country: string, className: string) => `
<div id="learnip-container-div-22" class="${className}" >
    <button class='learnip-choice-22'>Lorem</button>
    <button class='learnip-choice-22'>Ipsum</button>
    <button class='learnip-choice-22'>Dolor</button>
    <div id='learnip-input-22'> </div> 
    <span id='learnip-country-img-22'>${flags[country]}</span>
    <button id="learnip-translate-button-22">
       ${defaultCheck}
    </button>
</div>
`;

export default TranslationInputField;
