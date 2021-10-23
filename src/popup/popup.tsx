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

const constants = require('../constants.js');

const views = {
	[constants.routes.HOMEPAGE]: <Homepage />,
	[constants.routes.SETTINGS]: <Settings />,
	[constants.routes.CONTACT]: <Contact />,
};

const App: FunctionComponent<{}> = () => {
	const [theme, setTheme] = useState<typeof lightTheme>(lightTheme);
	const [currentView, setCurrentView] = useState(constants.routes.HOMEPAGE);

	return (
		<ThemeProvider theme={theme}>
			<GeneralContextProvider>
				<Grid container id="pop-up-container">
					<Header
						currentView={currentView}
						setCurrentView={setCurrentView}
						setTheme={setTheme}
					/>
					<Card
						variant="outlined"
						style={{
							width: '100%',
							padding: 15,
							paddingBottom: 40,
							display: 'flex',
							flexDirection: 'column',
						}}
					>
						{views[currentView]}
					</Card>
					<Footer setCurrentView={setCurrentView} />
				</Grid>
			</GeneralContextProvider>
		</ThemeProvider>
	);
};

const root = document.createElement('div');
document.body.appendChild(root);
ReactDOM.render(<App />, root);
