import React, { FunctionComponent, useState } from 'react';
import { Card, Divider, Grid } from '@mui/material';
import Button from '@mui/material/Button';
import { addBannedSiteAPI, removeBannedSiteAPI } from '../../endpoints/user';
import { Table } from '../../components/Utilities/Table';
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
	const removeDisable = async (url = 'console.firebase.google.com') => {
		chrome.storage.local.get(['bannedSites'], async (res) => {
			if (res.bannedSites) {
				let newBannedSites = res.bannedSites.filter((el) => el !== url);
				chrome.storage.local.set({
					bannedSites: newBannedSites,
				});
			}
		});
		try {
			await removeBannedSiteAPI(url);
		} catch (err) {
			console.error(err);
		}
	};

	const disableSite = () => {
		chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
			var tab = tabs[0];
			var url = new URL(tab.url);
			var domain = url.hostname;
			let resp;
			chrome.storage.local.get(['bannedSites'], async (res) => {
				if (res.bannedSites) {
					if (!res.bannedSites.includes(domain)) {
						chrome.storage.local.set({
							bannedSites: [...res.bannedSites, domain],
						});
						try {
							resp = await addBannedSiteAPI({ url: domain });
						} catch (err) {
							console.error(err);
						}
						console.log(resp);
					}
				} else {
					chrome.storage.local.set({
						bannedSites: [domain],
					});
					try {
						resp = await addBannedSiteAPI({ url: domain });
					} catch (err) {
						console.error(err);
					}
					console.log(resp);
				}
			});
		});
	};
	const SettingsCard: FunctionComponent<{
		title: string;
		body: string;
		buttonText: string;
		action;
	}> = ({ title, body, buttonText, action }) => (
		<Card
			style={{
				padding: 10,
				display: 'flex',
				flexDirection: 'column',
				margin: '10px 0',
				backgroundColor: '#f1eeee',
			}}
		>
			<h2 style={{ margin: 0, color: 'gray' }}>{title}</h2>
			<Divider style={{ margin: '10px 0' }} />
			<p style={{ margin: 0, color: 'gray' }}>{body}</p>
			<Button onClick={action} style={{ marginLeft: 'auto', padding: 0 }}>
				{buttonText}
			</Button>
		</Card>
	);
	const settingsArray = [
		{
			title: 'Disable Page',
			body: 'Do not run extension on this page',
			buttonText: 'Disable',
			action: disableSite,
		},
		{
			title: 'Disable Site',
			body: 'Do not run extension on this site',
			buttonText: 'Disable',
			action: disableSite,
		},
		{
			title: 'Sync Settings',
			body: 'Sync all my settings from the server.',
			buttonText: 'Sync',
			action: disableSite,
		},
	];
	return (
		<div
			style={{
				display: 'flex',
				flexDirection: 'column',
				justifyContent: 'center',
			}}
		>
			{settingsArray.map((el) => (
				<SettingsCard key={el.title} {...el} />
			))}
			{/* <Button
				style={{ margin: ' 10px auto' }}
				onClick={disableSite}
				color="primary"
				variant="contained"
			>
				Disable Page
			</Button>
			<Button
				style={{ margin: ' 10px auto' }}
				onClick={() => removeDisable()}
				color="primary"
				variant="contained"
			>
				Disable Site
			</Button>
			<Button
				style={{ margin: ' 10px auto' }}
				color="primary"
				variant="contained"
			>
				Sync Settings
			</Button> */}
			{chrome.storage.local.get(['bannedSites'], (res) => {
				console.log(res);
				if (res.bannedSites) {
					<>
						<Table data={res.bannedSites} />
						<p>sdugh</p>
					</>;
				}
			})}
		</div>
	);
};

export default Settings;
