import React, { FunctionComponent, useState } from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';

import './BasicSelect.css';

export type BasicSelectProps = {
	label: string;
	selectValue: string;
	setSelectValue: React.Dispatch<React.SetStateAction<string>>;
	options: { value: string; label: string }[];
};

const BasicSelect: FunctionComponent<BasicSelectProps> = ({
	label,
	options,
	selectValue,
	setSelectValue,
}) => {
	const handleChange = (event: SelectChangeEvent) => {
		setSelectValue(event.target.value as string);
	};
	console.log('options', options);
	return (
		<Box>
			<FormControl fullWidth>
				<InputLabel id="demo-simple-select-label">{label}</InputLabel>
				<Select
					labelId="demo-simple-select-label"
					value={selectValue}
					label={label}
					onChange={handleChange}
				>
					{options.map((el, index) => (
						<MenuItem key={index} value={el.value}>
							{el.label}
						</MenuItem>
					))}
				</Select>
			</FormControl>
		</Box>
	);
};

export default BasicSelect;
