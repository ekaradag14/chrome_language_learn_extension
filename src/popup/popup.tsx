import React, { FunctionComponent, useState } from 'react';
import ReactDOM from 'react-dom';
import { Grid } from '@mui/material';
import Card from '@mui/material/Card';

import { ThemeProvider } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';

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

const constants = require('../constants.js');

const App: FunctionComponent<{}> = () => {
	const [theme, setTheme] = useState<typeof lightTheme>(lightTheme);
	const [isSnackbarOpen, setIsSnackbarOpen] = useState(false);
	const [currentView, setCurrentView] = useState(constants.routes.HOMEPAGE);

	return (
		<ThemeProvider theme={theme}>
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
					{currentView === constants.routes.HOMEPAGE && <Homepage />}
					{currentView === constants.routes.SETTINGS && <Settings />}
				</Card>
				<button onClick={() => setIsSnackbarOpen(true)}>XXX</button>
				<Footer setCurrentView={setCurrentView} />
			</Grid>
			<Snackbar open={isSnackbarOpen} setOpen={setIsSnackbarOpen} />
		</ThemeProvider>
	);
};

const root = document.createElement('div');
document.body.appendChild(root);
ReactDOM.render(<App />, root);
