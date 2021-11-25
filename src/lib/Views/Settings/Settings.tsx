import React, {
	FunctionComponent,
	useState,
	useEffect,
	useContext,
} from 'react';
import { Card, Divider, Grid } from '@mui/material';
import Button from '@mui/material/Button';
import { addBannedSiteAPI, removeBannedSiteAPI } from '../../endpoints/user';
import { Table } from '../../components/Utilities/Table';
import { GeneralContext } from '../../../context/general';
import './Settings.css';
const constants = require('../../../constants.js');

const Settings: FunctionComponent<{}> = () => {
	const [open, setOpen] = React.useState(false);
	const [bannedSites, setBannedSites] = useState<string[]>([]);
	const { alertDispatch } = useContext(GeneralContext);
	const handleClickOpen = () => {
		setOpen(true);
	};

	const handleClose = () => {
		setOpen(false);
	};
	const removeDisable = async (urls: string[]) => {
		chrome.storage.local.get(['bannedSites'], async (res) => {
			if (res.bannedSites) {
				//Create a new array with selected elements removed
				let newBannedSites = res.bannedSites.filter((el) => !urls.includes(el));
				chrome.storage.local.set({
					bannedSites: newBannedSites,
				});
				try {
					await removeBannedSiteAPI({ sites: urls });
					setBannedSites(newBannedSites);
					alertDispatch(constants.alertMessages.SUCCESSFUL_DISABLE_REMOVE);
				} catch (err) {
					alertDispatch(constants.errorMessages.SOMETHING_WRONG);
					return;
				}
			}
		});
	};

	const disableDomain = (type: 'page' | 'site') => {
		chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
			var tab = tabs[0];
			var url = new URL(tab.url);
			var domain = type === 'site' ? url.hostname : tab.url;
			domain.replace('https://', '');
			let resp;
			chrome.storage.local.get(['bannedSites'], async (res) => {
				if (res.bannedSites) {
					// Has user used site banning before
					if (!res.bannedSites.includes(domain)) {
						// Is this page already blocked
						chrome.storage.local.set({
							bannedSites: [...res.bannedSites, domain],
						});
						try {
							resp = await addBannedSiteAPI({ url: domain });
							setBannedSites((pS) => [...pS, domain]);
							setTimeout(() => {
								alertDispatch(constants.alertMessages.SUCCESSFUL_SITE_DISABLE);
							}, 400);
						} catch (err) {
							alertDispatch(constants.errorMessages.SOMETHING_WRONG);
							return;
						}
					}
				} else {
					chrome.storage.local.set({
						// This is the first time user using it
						bannedSites: [domain], // TODO: add an empty array on signup to remove this check
					});
					try {
						resp = await addBannedSiteAPI({ url: domain });
						setBannedSites([domain]);
						setTimeout(() => {
							alertDispatch(constants.alertMessages.SUCCESSFUL_SITE_DISABLE);
						}, 400);
					} catch (err) {
						alertDispatch(constants.errorMessages.SOMETHING_WRONG);
						return;
					}
				}
			});
		});
	};
	useEffect(() => {
		chrome.storage.local.get(['bannedSites'], (res) => {
			if (res.bannedSites) {
				setBannedSites(res.bannedSites);
			}
		});
	}, []);
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
			<Button
				onClick={action}
				style={{ marginLeft: 'auto', padding: 0, marginTop: 10 }}
			>
				{buttonText}
			</Button>
		</Card>
	);
	const settingsArray = [
		// {
		// 	title: 'Disable Page',
		// 	body: 'Do not run extension on this page. ',
		// 	buttonText: 'Disable',
		// 	action: () => disableDomain('page'),
		// },
		{
			title: 'Disable Site',
			body: 'Do not run extension on this site. ',
			buttonText: 'Disable',
			action: () => disableDomain('site'),
		},
		// {
		// 	title: 'Sync Settings',
		// 	body: 'Sync all my settings from the server.',
		// 	buttonText: 'Sync',
		// 	action: disableDomain,
		// },
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
			{bannedSites.length !== 0 && (
				<Table
					deleteAction={(sites) => removeDisable(sites)}
					data={bannedSites}
				/>
			)}
		</div>
	);
};

export default Settings;
