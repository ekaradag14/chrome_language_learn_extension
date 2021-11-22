import React, { FunctionComponent, useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { Divider, Grid } from '@mui/material';
import Card from '@mui/material/Card';
import IconButton from '@mui/material/IconButton';

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

	const [userSettings, setUserSettings] = useState<UserSettingsProps>({
		frequency: 1,
		amount: 1,
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
		[constants.routes.LOGIN]: <Login setCurrentView={setCurrentView} />,
		[constants.routes.SIGNUP]: <Signup setCurrentView={setCurrentView} />,
	};
	useEffect(() => {
		chrome.storage.local.get(
			['userSettings', 'lastLanguageChange', 'isPremium'],
			async (res) => {
				if (res.userSettings) {
					setUserSettings(res.userSettings);
				} else {
					setCurrentView(constants.routes.LOGIN);
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
									marginTop: 'auto',
									paddingBottom: 7,
									textAlign: 'center',
								}}
							>
								<Divider style={{ marginBottom: 7 }} />
								<em style={{ color: 'gray' }}>
									Discover more about Learnip from{' '}
									<a
										target="__blank"
										href="https://www.learnip.co"
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
			</GeneralContextProvider>
		</ThemeProvider>
	);
};

const root = document.createElement('div');
document.body.appendChild(root);
ReactDOM.render(<App />, root);
