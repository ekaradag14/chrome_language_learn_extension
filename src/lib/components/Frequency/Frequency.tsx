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
			<div style={{ padding: 0, paddingLeft: 10, marginTop: -10 }}>
				<Slider
					aria-label="Frequency"
					defaultValue={1}
					getAriaValueText={valuetext}
					valueLabelDisplay="auto"
					step={1}
					marks
					value={value.frequency}
					onChange={(e, n) =>
						setValue((pS: UserSettingsProps) => ({ ...pS, frequency: n }))
					}
					min={1}
					max={5}
				/>
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
