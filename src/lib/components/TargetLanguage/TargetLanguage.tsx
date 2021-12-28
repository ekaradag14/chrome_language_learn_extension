import React, { FunctionComponent, useState } from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import './TargetLanguage.css';
import {
	UserSettingsProps,
	LanguageOptionProps,
	LanguageType,
} from '../../modals';
import {
	Grid,
	Modal,
	Checkbox,
	Box,
	Typography,
	CircularProgress,
} from '@mui/material';
export type TargetLanguageProps = {
	value: UserSettingsProps;
	languageIsChangeable: boolean;
	ignoreSpecialCharacters: boolean;
	isUserPremium: boolean;
	setValue;
	languages: LanguageType[];
};
const TargetLanguage: FunctionComponent<TargetLanguageProps> = ({
	value,
	setValue,
	languageIsChangeable,
	isUserPremium,
	ignoreSpecialCharacters,
	languages,
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
				options={languages}
				getOptionLabel={(option) => option.title}
				value={value.targetLanguages || []}
				loading={!languages.length}
				disabled={!languageIsChangeable || !languages.length}
				getOptionDisabled={(option) =>
					!isUserPremium &&
					value.targetLanguages &&
					value.targetLanguages.length > 0
				}
				filterSelectedOptions
				onChange={(event: any, newValue: LanguageOptionProps[], reason) => {
					setValue((pS) => ({ ...pS, targetLanguages: newValue }));
				}}
				renderInput={(params) => (
					<TextField
						{...params}
						variant="outlined"
						label="Practice Languages"
						InputProps={{
							...params.InputProps,
							endAdornment: (
								<React.Fragment>
									{!languages.length ? (
										<CircularProgress color="inherit" size={20} />
									) : null}
									{params.InputProps.endAdornment}
								</React.Fragment>
							),
						}}
					/>
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

export default TargetLanguage;
