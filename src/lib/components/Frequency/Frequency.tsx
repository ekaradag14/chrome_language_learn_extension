import React, { FunctionComponent } from 'react';
import { Grid } from '@mui/material';
import Slider from '@mui/material/Slider';
import { styled } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import InfoIcon from '@mui/icons-material/Info';
import Tooltip, { TooltipProps, tooltipClasses } from '@mui/material/Tooltip';
import './Frequency.css';

function valuetext(value: number) {
	return `${value}°C`;
}
export type FrequencyProps = {
	value: number;
	isUserPremium: boolean;
	setValue;
};
const Frequency: FunctionComponent<FrequencyProps> = ({
	value,
	setValue,
	isUserPremium,
}) => {
	const marks = isUserPremium
		? [{ value: 0 }, { value: 1 }, { value: 2 }, { value: 3 }, { value: 4 }]
		: [{ value: 0 }, { value: 1 }, { value: 2 }];
	return (
		<Grid id="frequency-container">
			<Slider
				aria-label="Frequency"
				defaultValue={1}
				getAriaValueText={valuetext}
				valueLabelDisplay="auto"
				step={null}
				marks={marks}
				value={value}
				onChange={(e, n) => setValue(n)}
				min={0}
				max={4}
			/>

			<div className={`no-droplets ${value === 0 ? 'shown' : ''}`}>
				<em>You will not see any droplets</em>
			</div>
		</Grid>
	);
};
const CustomWidthTooltip = styled(({ className, ...props }: TooltipProps) => (
	<Tooltip {...props} classes={{ popper: className }} />
))({
	[`& .${tooltipClasses.tooltip}`]: {
		maxWidth: 150,
	},
});
export default Frequency;
