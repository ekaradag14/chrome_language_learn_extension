import React, { FunctionComponent, useState } from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import './TargetLanguage.css';

export type LanguageOption = {
	title: string;
};
const TargetLanguage: FunctionComponent<{}> = () => {
	const [options, setOptions] = useState<LanguageOption[]>(top100Films);
	const [value, setValue] = useState<LanguageOption[] | null>();

	return (
		<Autocomplete
			multiple
			limitTags={1}
			id="tags-standard"
			options={options}
			getOptionLabel={(option) => option.title}
			value={value}
			getOptionDisabled={(option) => option.title === 'No Value'}
			filterSelectedOptions
			onChange={(event: any, newValue: LanguageOption[]) => {
				if (newValue?.length === 2) {
					setOptions([...newValue, { title: 'No Value' }]);
				}
				setValue(newValue);
			}}
			renderInput={(params) => (
				<TextField {...params} variant="standard" label="Target Language" />
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
