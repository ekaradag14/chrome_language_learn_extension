import React, { FunctionComponent, useState } from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import './TargetLanguage.css';
import { UserSettingsProps } from '../../modals';
export type LanguageOption = {
	title: string;
};
export type TargetLanguageProps = {
	value: UserSettingsProps;
	setValue;
};
const TargetLanguage: FunctionComponent<TargetLanguageProps> = ({
	value,
	setValue,
}) => {
	const [options, setOptions] = useState<LanguageOption[]>(supportedLanguages);

	return (
		<Autocomplete
			multiple
			limitTags={1}
			id="tags-standard"
			options={options}
			getOptionLabel={(option) => option.title}
			value={value.targetLanguages}
			getOptionDisabled={(option) => value.targetLanguages.length > 1}
			filterSelectedOptions
			onChange={(event: any, newValue: LanguageOption[], reason) => {
				// console.log(reason);
				// if (newValue?.length === 2) {
				// 	setOptions([...newValue, { title: 'No Value' }]);
				// } else if (reason === 'removeOption' || reason === 'clear') {
				// 	setOptions((pS) => pS.filter((el) => el.title !== 'No Value'));
				// }
				setValue((pS) => ({ ...pS, targetLanguages: newValue }));
			}}
			renderInput={(params) => (
				<TextField {...params} variant="outlined" label="Target Language" />
			)}
		/>
	);
};
const supportedLanguages: LanguageOption[] = [
	{ title: 'English' },
	{ title: 'Spanish' },
	{ title: 'Russian' },
	{ title: 'Turkish' },
];
export default TargetLanguage;
