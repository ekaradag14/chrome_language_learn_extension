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
	const disableSite = () => {
		chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
			var tab = tabs[0];
			var url = new URL(tab.url);
			var domain = url.hostname;
			chrome.storage.local.get(['bannedSites'], (res) => {
				if (res.bannedSites) {
					if (!res.bannedSites.includes(domain)) {
						chrome.storage.local.set({
							bannedSites: [...res.bannedSites, domain],
						});
					}
				} else {
					chrome.storage.local.set({
						bannedSites: [domain],
					});
				}
			});
		});
	};
	return (
		<Grid>
			<Button onClick={disableSite} color="primary" variant="contained">
				Disable
			</Button>
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
