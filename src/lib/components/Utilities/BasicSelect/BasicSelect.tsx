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
	variant?;
	key?: number;
};

const BasicSelect: FunctionComponent<BasicSelectProps> = ({
	label,
	options,
	variant = 'outlined',
	selectValue,
	setSelectValue,
	key = 0,
}) => {
	const handleChange = (event: SelectChangeEvent) => {
		setSelectValue(event.target.value as string);
	};

	return (
		<Box key={key} style={{ width: '100%' }}>
			<FormControl variant={variant} fullWidth>
				<InputLabel id="demo-simple-select-label">{label}</InputLabel>
				<Select
					labelId="demo-simple-select-label"
					value={selectValue}
					label={label || null}
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
