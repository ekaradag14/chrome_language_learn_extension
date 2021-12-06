import React, {
	FunctionComponent,
	useState,
	useEffect,
	useContext,
} from 'react';
import { Card, Divider, CircularProgress, Button, Grid } from '@mui/material';

import { addBannedSiteAPI, removeBannedSiteAPI } from '../../endpoints/user';
import { Table } from '../../components/Utilities/Table';
import { GeneralContext } from '../../../context/general';
import { Frequency } from '../../components/Frequency';
import './Settings.css';
import { ReactJSXElement } from '@emotion/react/types/jsx-namespace';
const constants = require('../../../constants.js');
import { UserSettingsProps } from '../../modals';

const Settings: FunctionComponent<{
	userSettings: UserSettingsProps;
	setUserSettings;
}> = ({ userSettings, setUserSettings }) => {
	const [open, setOpen] = React.useState(false);
	const [bannedSites, setBannedSites] = useState<string[]>([]);
	const [isRemovingDisable, setIsRemovingDisable] = useState(false);
	const [isCardLoading, setIsCardLoading] = useState(false);
	const { alertDispatch } = useContext(GeneralContext);
	const [frequency, setFrequency] = useState(userSettings.frequency);
	const handleClickOpen = () => {
		setOpen(true);
	};

	const handleClose = () => {
		setOpen(false);
	};
	const removeDisable = async (urls: string[]) => {
		setIsRemovingDisable(true);
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
					setIsRemovingDisable(false);
					return;
				}
			}
		});
		setTimeout(() => {
			setIsRemovingDisable(false);
		}, 500);
	};

	const disableDomain = (type: 'page' | 'site') => {
		setIsCardLoading(true);
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
							setIsCardLoading(false);
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
						setIsCardLoading(false);
						return;
					}
				}
			});
		});
		setTimeout(() => {
			setIsCardLoading(false);
		}, 500);
	};
	useEffect(() => {
		console.log(userSettings);
		chrome.storage.local.get(['bannedSites'], (res) => {
			if (res.bannedSites) {
				setBannedSites(res.bannedSites);
			}
		});
	}, []);

	const settingsArray = [
		// {
		// 	title: 'Disable Page',
		// 	body: 'Do not run extension on this page. ',
		// 	buttonText: 'Disable',
		// 	action: () => disableDomain('page'),
		// },

		{
			title: 'Disable Site',
			body: (
				<p style={{ margin: 0, color: 'gray' }}>
					Do not run extension on this site.{' '}
				</p>
			),
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
				<SettingsCard isCardLoading={isCardLoading} key={el.title} {...el} />
			))}
			<SettingsCard
				title="Frequency"
				isCardLoading={isCardLoading}
				body={
					<div>
						<p style={{ margin: 0, color: 'gray' }}>
							'How often you want to see a droplet.
						</p>
						<Frequency
							value={frequency}
							isUserPremium={false}
							setValue={setFrequency}
						/>
						<div style={{ width: '80%', margin: 'auto' }}></div>
					</div>
				}
				buttonText="Save"
				action={() => disableDomain('page')}
			/>

			{bannedSites.length !== 0 && (
				<Table
					isDeleting={isRemovingDisable}
					deleteAction={(sites) => removeDisable(sites)}
					data={bannedSites}
				/>
			)}
		</div>
	);
};
const SettingsCard: FunctionComponent<{
	title: string;
	body: ReactJSXElement;
	buttonText: string;
	action;
	isCardLoading: boolean;
}> = ({ title, body, buttonText, action, isCardLoading }) => (
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
		{body}
		{isCardLoading ? (
			<Grid style={{ position: 'relative', height: 40 }}>
				<CircularProgress
					size={30}
					style={{
						zIndex: 2,
						position: 'absolute',
						right: 15,
						bottom: 1,
					}}
				/>
			</Grid>
		) : (
			<Button
				onClick={action}
				style={{ marginLeft: 'auto', padding: 0, marginTop: 10 }}
			>
				{buttonText}
			</Button>
		)}
	</Card>
);
export default Settings;

{
	/* <Button
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
			</Button> */
}
