import React, { FunctionComponent, useState, useContext } from 'react';
import { Grid } from '@mui/material';
import Tooltip from '@mui/material/Tooltip';
import ChatIcon from '@mui/icons-material/Chat';
import IconButton from '@mui/material/IconButton';
import SettingsIcon from '@mui/icons-material/Settings';
import './Footer.css';
export type FooterProps = {
	setCurrentView: React.Dispatch<React.SetStateAction<string>>;
};
import { GeneralContext } from '../../../context/general';
const constants = require('../../../constants.js');
const Footer: FunctionComponent<FooterProps> = ({ setCurrentView }) => {
	const { alertDispatch, setOpen } = useContext(GeneralContext);
	return (
		<Grid
			style={{
				display: 'flex',
				justifyContent: 'flex-end',
				width: '100%',
				alignContent: 'center',
				marginTop: 10,
			}}
		>
			<Tooltip title="Settings">
				<IconButton
					onClick={() => setCurrentView(constants.routes.SETTINGS)}
					aria-label="Settings"
				>
					<SettingsIcon color="primary" />
				</IconButton>
			</Tooltip>
			<Tooltip title="Contact">
				<IconButton
					onClick={() => setCurrentView(constants.routes.CONTACT)}
					aria-label="Contact Us Link"
				>
					<ChatIcon color="primary" />
				</IconButton>
			</Tooltip>
		</Grid>
	);
};

export default Footer;
