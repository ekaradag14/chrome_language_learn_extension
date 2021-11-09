import React, { FunctionComponent, useState } from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import './TargetLanguage.css';
import { UserSettingsProps, LanguageOptionProps } from '../../modals';

export type TargetLanguageProps = {
	value: UserSettingsProps;
	setValue;
};
const TargetLanguage: FunctionComponent<TargetLanguageProps> = ({
	value,
	setValue,
}) => {
	const [options, setOptions] =
		useState<LanguageOptionProps[]>(supportedLanguages);

	return (
		<Autocomplete
			multiple
			limitTags={1}
			id="tags-standard"
			options={options}
			getOptionLabel={(option) => option.title}
			value={value.targetLanguages}
			getOptionDisabled={(option) => value.targetLanguages.length > 0}
			filterSelectedOptions
			onChange={(event: any, newValue: LanguageOptionProps[], reason) => {
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
const supportedLanguages: LanguageOptionProps[] = [
	{ title: 'English', code: 'en' },
	{ title: 'Spanish', code: 'es' },
	{ title: 'German', code: 'de' },
	{ title: 'Russian', code: 'ru' },
	{ title: 'French', code: 'fr' },
	{ title: 'Italian', code: 'it' },
];
export default TargetLanguage;
