import React, { FunctionComponent, useState } from 'react';
import { Grid } from '@mui/material';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { BasicSelect } from '../../components/Utilities/BasicSelect';
import './Settings.css';

const Settings: FunctionComponent<{}> = () => {
	const [open, setOpen] = React.useState(false);
	const [timeAmount, setTimeAmount] = useState('2');
	const [timeType, setTimeType] = useState('hours');
	const handleClickOpen = () => {
		setOpen(true);
	};

	const handleClose = () => {
		setOpen(false);
	};
	return (
		<Grid>
			<Button onClick={() => setOpen(true)} color="primary" variant="contained">
				Disable
			</Button>
			<Dialog open={open} onClose={handleClose}>
				<DialogTitle style={{ paddingBottom: 0, paddingLeft: 15 }}>
					Disable
				</DialogTitle>
				<DialogContent id="dialog-content">
					<DialogContentText style={{ padding: '0 10px 10px 10px' }}>
						When will you be back?
					</DialogContentText>
					<Grid
						container
						justifyContent="space-around"
						style={{ width: '100%', paddingLeft: 5 }}
					>
						<Grid item xs={4}>
							<BasicSelect
								selectValue={timeAmount}
								setSelectValue={setTimeAmount}
								options={options}
								label={null}
								variant="standard"
							/>
						</Grid>

						<Grid item xs={6}>
							<BasicSelect
								selectValue={timeType}
								setSelectValue={setTimeType}
								options={options2}
								label={null}
								variant="standard"
							/>
						</Grid>
					</Grid>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleClose}>Save</Button>
				</DialogActions>
			</Dialog>
		</Grid>
	);
};

export default Settings;

const options = [
	{ value: '1', label: '1' },
	{ value: '2', label: '2' },
	{ value: '3', label: '3' },
	{ value: '4', label: '4' },
	{ value: '5', label: '5' },
	{ value: '6', label: '6' },
	{ value: '7', label: '7' },
];

const options2 = [
	{ value: 'hours', label: 'Hours' },
	{ value: 'days', label: 'Days' },
	{ value: 'weeks', label: 'Weeks' },
];
