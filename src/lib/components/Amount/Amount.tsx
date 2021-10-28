import React, { FunctionComponent } from 'react';
import { Grid } from '@mui/material';
import Slider from '@mui/material/Slider';
import { styled } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import InfoIcon from '@mui/icons-material/Info';
import Tooltip, { TooltipProps, tooltipClasses } from '@mui/material/Tooltip';
import { UserSettingsProps } from '../../modals';
import './Amount.css';
function valuetext(value: number) {
	return `${value}°C`;
}
export type AmountProps = {
	value: UserSettingsProps;
	setValue;
};
const Amount: FunctionComponent<AmountProps> = ({ value, setValue }) => {
	return (
		<Grid id="amount-container" style={{ marginBottom: 10 }}>
			<div style={{ display: 'flex', flexDirection: 'row' }}>
				<p style={{ fontSize: 16, color: 'gray' }}>Amount</p>
				<CustomWidthTooltip
					placement="top"
					title="How many exercises do you want to do in a day?"
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
					aria-label="Amount"
					defaultValue={1}
					getAriaValueText={valuetext}
					valueLabelDisplay="auto"
					step={1}
					marks
					value={value.amount}
					onChange={(e, n) =>
						setValue((pS: UserSettingsProps) => ({ ...pS, amount: n }))
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
export default Amount;
