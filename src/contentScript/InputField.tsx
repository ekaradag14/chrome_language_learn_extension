import React from 'react';
let checkMarkSVG =
	'<svg xmlns="http://www.w3.org/2000/svg" width="90%" height="90%" viewBox="-0.25 -0.4 3.9 3"><g id="Layer_2" data-name="Layer 2"><g id="Layer_1-2" data-name="Layer 1"><path d="M1.06,1.68c.51-.51,1-1,1.48-1.48C2.76,0,3-.06,3.12.11S3.2.51,3,.68C2.48,1.22,2,1.77,1.4,2.31a.39.39,0,0,1-.64,0L.14,1.7c-.16-.17-.2-.35,0-.52a.34.34,0,0,1,.52,0Z"/></g></g></svg>';

let crossSVG =
	'<svg xmlns="http://www.w3.org/2000/svg" width="140%" height="140%" viewBox="-0.60 -0.2 3.9 3"><g id="Layer_2" data-name="Layer 2"><g id="Layer_1-2" data-name="Layer 1"><path d="M1.34,1.53a.26.26,0,0,1-.18-.09c-.1-.11-.21-.21-.31-.31s-.1-.08-.16,0-.22.22-.33.33a.2.2,0,0,1-.31,0c-.09-.1,0-.21,0-.3S.45.92.45.76.22.5.09.37,0,.17.06.06.27,0,.37.1l.4.38C.9.35,1,.23,1.16.1s.2-.14.31,0,.07.21,0,.31-.2.21-.31.31-.07.11,0,.18.23.22.34.34a.18.18,0,0,1,0,.22A.16.16,0,0,1,1.34,1.53Z"/></g></g></svg>';
const InputField = `
<div class="extra-chrome-gift">
  <input class='ern-ext-input' type="text" placeholder="Translate"></input>
  <button class="ern-ext-translate-button">
${checkMarkSVG}
</button>
</div>
`;
export default InputField;
