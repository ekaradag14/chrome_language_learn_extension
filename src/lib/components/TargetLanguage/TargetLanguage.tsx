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
	const [options, setOptions] = useState<LanguageOption[]>(top100Films);

	return (
		<Autocomplete
			multiple
			limitTags={1}
			id="tags-standard"
			options={options}
			getOptionLabel={(option) => option.title}
			value={value.targetLanguages}
			getOptionDisabled={(option) => option.title === 'No Value'}
			filterSelectedOptions
			onChange={(event: any, newValue: LanguageOption[]) => {
				if (newValue?.length === 2) {
					setOptions([...newValue, { title: 'No Value' }]);
				}
				setValue((pS) => ({ ...pS, targetLanguages: newValue }));
			}}
			renderInput={(params) => (
				<TextField {...params} variant="outlined" label="Target Language" />
			)}
		/>
	);
};
const top100Films: LanguageOption[] = [
	{ title: 'English' },
	{ title: 'Spanish' },
	{ title: 'Russian' },
	{ title: 'Turkish' },
];
export default TargetLanguage;
