import React, { FunctionComponent, useState, useContext } from 'react';
import ReactDOM from 'react-dom';
import { Grid } from '@mui/material';
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

const constants = require('../constants.js');
const noAuthRoutes = [constants.routes.LOGIN, constants.routes.SIGNUP];
const App: FunctionComponent<{}> = () => {
	const [theme, setTheme] = useState<typeof lightTheme>(lightTheme);
	const [currentView, setCurrentView] = useState(constants.routes.HOMEPAGE);
	const views = {
		[constants.routes.HOMEPAGE]: <Homepage />,
		[constants.routes.SETTINGS]: <Settings />,
		[constants.routes.CONTACT]: <Contact />,
		[constants.routes.LOGIN]: <Login setCurrentView={setCurrentView} />,
		[constants.routes.SIGNUP]: <Signup setCurrentView={setCurrentView} />,
	};

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
						style={{
							width: '100%',
							padding: '20px 15px',

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
