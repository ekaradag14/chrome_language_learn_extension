import React, { FunctionComponent, useState } from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import './TargetLanguage.css';
import { UserSettingsProps, LanguageOptionProps } from '../../modals';
import { Grid, Modal, Checkbox, Box, Typography } from '@mui/material';
export type TargetLanguageProps = {
	value: UserSettingsProps;
	languageIsChangeable: boolean;
	ignoreSpecialCharacters: boolean;
	isUserPremium: boolean;
	setValue;
};
const TargetLanguage: FunctionComponent<TargetLanguageProps> = ({
	value,
	setValue,
	languageIsChangeable,
	isUserPremium,
	ignoreSpecialCharacters,
}) => {
	const handleCheckChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setValue((pS) => ({
			...pS,
			ignoreSpecialCharacters: event.target.checked,
		}));
	};
	return (
		<>
			<Autocomplete
				multiple
				limitTags={1}
				id="tags-standard"
				options={supportedLanguages}
				getOptionLabel={(option) => option.title}
				value={value.targetLanguages}
				disabled={!languageIsChangeable}
				getOptionDisabled={(option) =>
					!isUserPremium && value.targetLanguages.length > 0
				}
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
					<TextField {...params} variant="outlined" label="Target Languages" />
				)}
			/>
			<Grid
				container
				justifyContent="center"
				display="flex"
				flexDirection="row"
			>
				<Grid item sm={1}>
					<Checkbox
						inputProps={{ 'aria-label': 'Checkbox demo' }}
						style={{ padding: 5 }}
						disabled={!languageIsChangeable}
						checked={ignoreSpecialCharacters}
						onChange={handleCheckChange}
						sx={{ '& .MuiSvgIcon-root': { fontSize: 21 } }}
					/>
				</Grid>
				<Grid item sm={9} margin="auto 0">
					<em style={{ color: 'gray' }}>Ignore Special Characters</em>
				</Grid>
			</Grid>
		</>
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
