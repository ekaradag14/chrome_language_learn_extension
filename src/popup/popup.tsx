import React, { FunctionComponent, useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { ButtonBase, Divider, Grid } from '@mui/material';
import { Card, Button } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import { Dialog } from '../lib/components/Dialog';
//Context
import { ThemeProvider } from '@mui/material/styles';
import GeneralContextProvider from '../context/general';

//Themes
import lightTheme from '../lightTheme';
import darkTheme from '../darkTheme';

import './popup.css';

//Internal Components

import { Header } from '../lib/components/Header';
import { Footer } from '../lib/components/Footer';
import { Snackbar } from '../lib/components/Utilities/Snackbar';

//Views
import { Settings } from '../lib/Views/Settings';
import { Homepage } from '../lib/Views/Homepage';
import { Contact } from '../lib/Views/Contact';
import { Login } from '../lib/Views/Login';
import { Signup } from '../lib/Views/Signup';
import { UserSettingsProps } from '../lib/modals';
const constants = require('../constants.js');
const noAuthRoutes = [constants.routes.LOGIN, constants.routes.SIGNUP];
const App: FunctionComponent<{}> = () => {
	const [theme, setTheme] = useState<typeof lightTheme>(lightTheme);
	const [currentView, setCurrentView] = useState(constants.routes.HOMEPAGE);
	const [languageIsChangeable, setLanguageIsChangeable] =
		useState<boolean>(true);
	const [isUserPremium, setIsUserPremium] = useState<boolean>(false);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [userSettings, setUserSettings] = useState<UserSettingsProps>({
		targetLanguages: [],
		ignoreSpecialCharacters: false,
	});

	const views = {
		[constants.routes.HOMEPAGE]: (
			<Homepage
				isUserPremium={isUserPremium}
				setLanguageIsChangeable={setLanguageIsChangeable}
				languageIsChangeable={languageIsChangeable}
				userSettings={userSettings}
				setUserSettings={setUserSettings}
			/>
		),
		[constants.routes.SETTINGS]: <Settings />,
		[constants.routes.CONTACT]: <Contact />,
		[constants.routes.LOGIN]: (
			<Login
				setUserSettings={setUserSettings}
				setCurrentView={setCurrentView}
				setLanguageIsChangeable={setLanguageIsChangeable}
			/>
		),
		[constants.routes.SIGNUP]: <Signup setCurrentView={setCurrentView} />,
	};
	const logoutHandler = () => {
		chrome.storage.local.clear(function () {
			var error = chrome.runtime.lastError;
			if (!error) {
				setCurrentView(constants.routes.LOGIN);
			}
		});
		chrome.storage.local.set({ hasSignedInBefore: true });
		setIsModalOpen(false);
		setCurrentView(constants.routes.LOGIN);
	};
	useEffect(() => {
		chrome.storage.local.get(
			[
				'userSettings',
				'lastLanguageChange',
				'isPremium',
				'userCredentials',
				'hasSignedInBefore',
			],
			async (res) => {
				if (
					!res.userCredentials ||
					(res.userCredentials && !res.userCredentials.uid)
				) {
					if (res.hasSignedInBefore) {
						setCurrentView(constants.routes.LOGIN);
					} else {
						setCurrentView(constants.routes.SIGNUP);
					}
					return;
				}
				if (res.userSettings) {
					setUserSettings(res.userSettings);
				}
				if (res.isPremium) setIsUserPremium(res.isPremium);
				if (res.lastLanguageChange) {
					setLanguageIsChangeable(
						Math.floor(Date.now() / 1000) - parseInt(res.lastLanguageChange) >
							86400 || res.isPremium === true
					);
				}
			}
		);
	}, []);
	return (
		<ThemeProvider theme={theme}>
			<GeneralContextProvider>
				<Grid container id="pop-up-container">
					{!noAuthRoutes.includes(currentView) && (
						<Header
							currentView={currentView}
							setCurrentView={setCurrentView}
							logoutAction={() => setIsModalOpen(true)}
							setTheme={setTheme}
						/>
					)}
					<Card
						variant="outlined"
						className="main-card"
						style={{
							width: '100%',
							padding: '5px 15px',
							scrollbarWidth: 'none',
							display: 'flex',
							flexDirection: 'column',
							height: '100%',
							overflowY: 'scroll',
						}}
					>
						{noAuthRoutes.includes(currentView) && (
							<img
								src="icon.png"
								style={{ width: 50, height: 50, margin: 'auto' }}
							/>
						)}
						{views[currentView]}
						{currentView === constants.routes.HOMEPAGE && (
							<div
								style={{
									marginTop: '20px',
									paddingBottom: 7,
									textAlign: 'center',
								}}
							>
								<Divider style={{ marginBottom: 7 }} />
								<em style={{ color: 'gray' }}>
									Discover more about Learnip from{' '}
									<a
										target="__blank"
										href="https://learnip.co"
										style={{ textDecoration: 'none', color: 'green' }}
									>
										<b style={{ cursor: 'pointer' }}>here.</b>
									</a>{' '}
									We have much to come!
								</em>
							</div>
						)}
					</Card>
					{!noAuthRoutes.includes(currentView) && (
						<Footer setCurrentView={setCurrentView} />
					)}
				</Grid>
				<Dialog
					open={isModalOpen}
					setOpen={setIsModalOpen}
					title={null}
					children={
						<div
							style={{
								display: 'flex',
								flexDirection: 'column',
							}}
						>
							<p style={{ fontSize: 14, color: 'gray', padding: 10 }}>
								Do you want to log out?
							</p>
						</div>
					}
					actionChildren={
						<Button
							color="primary"
							onClick={logoutHandler}
							variant="contained"
							style={{ maxWidth: '60%', margin: 'auto' }}
						>
							Ok
						</Button>
					}
				/>
			</GeneralContextProvider>
		</ThemeProvider>
	);
};

const root = document.createElement('div');
document.body.appendChild(root);
ReactDOM.render(<App />, root);
