import React, { FunctionComponent } from 'react';
import { Grid } from '@mui/material';
import Slider from '@mui/material/Slider';
import { styled } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import InfoIcon from '@mui/icons-material/Info';
import Tooltip, { TooltipProps, tooltipClasses } from '@mui/material/Tooltip';
import './Frequency.css';
import { UserSettingsProps } from '../../modals';
function valuetext(value: number) {
	return `${value}°C`;
}
export type FrequencyProps = {
	value: UserSettingsProps;
	setValue;
};
const Frequency: FunctionComponent<FrequencyProps> = ({ value, setValue }) => {
	return (
		<Grid id="frequency-container">
			<div style={{ display: 'flex', flexDirection: 'row' }}>
				<p style={{ fontSize: 16, color: 'gray' }}>Frequency</p>
				<CustomWidthTooltip
					placement="top"
					title="How frequent do you want exercises to be?"
					leaveDelay={200}
					arrow
				>
					<IconButton aria-label="Info">
						<InfoIcon color="primary" />
					</IconButton>
				</CustomWidthTooltip>
			</div>
			<div className="slider-container">
				<Slider
					aria-label="Frequency"
					defaultValue={1}
					getAriaValueText={valuetext}
					valueLabelDisplay="auto"
					step={null}
					marks={[{ value: 0 }, { value: 1 }, { value: 2 }]}
					value={value.frequency}
					onChange={(e, n) =>
						setValue((pS: UserSettingsProps) => ({ ...pS, frequency: n }))
					}
					min={0}
					max={4}
				/>

				<div className={`no-droplets ${value.frequency === 0 ? 'shown' : ''}`}>
					<em>You will not see any droplets</em>
				</div>
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
