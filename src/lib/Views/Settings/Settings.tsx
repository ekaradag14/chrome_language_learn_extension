import React, { FunctionComponent, useState } from 'react';
import { Grid } from '@mui/material';
import Button from '@mui/material/Button';
import './Settings.css';

const Settings: FunctionComponent<{}> = () => {
	return (
		<Grid>
			<Button color="primary" variant="contained">
				Disable
			</Button>
		</Grid>
	);
};

export default Settings;
