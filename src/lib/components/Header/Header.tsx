import React, { FunctionComponent, useState } from 'react';
import { Grid } from '@mui/material';
import FormControlLabel from '@mui/material/FormControlLabel';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import { styled } from '@mui/material/styles';
import Switch from '@mui/material/Switch';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';

import lightTheme from '../../../lightTheme';
import darkTheme from '../../../darkTheme';

import './Header.css';
const constants = require('../../../constants.js');
export type HeaderProps = {
	currentView: string;
	setCurrentView: React.Dispatch<React.SetStateAction<string>>;
	setTheme: React.Dispatch<React.SetStateAction<typeof lightTheme>>;
};

const Header: FunctionComponent<HeaderProps> = ({
	setTheme,
	currentView,
	setCurrentView,
}) => {
	return (
		<Grid
			style={{
				display: 'flex',
				justifyContent: 'space-between',
				width: '100%',
				alignContent: 'center',
				marginBottom: 10,
			}}
		>
			{currentView !== constants.routes.LOGIN && (
				<>
					{currentView === constants.routes.HOMEPAGE ? (
						<Tooltip title="Logout">
							<IconButton
								onClick={() => setCurrentView(constants.routes.LOGIN)}
								aria-label="Logout"
							>
								<LogoutRoundedIcon color="primary" />
							</IconButton>
						</Tooltip>
					) : (
						<IconButton
							onClick={() => setCurrentView(constants.routes.HOMEPAGE)}
							aria-label="Logout"
						>
							<ArrowBackIosIcon color="primary" />
						</IconButton>
					)}
				</>
			)}
			<img src="icon.png" style={{ width: 30, height: 30 }} />
			<FormControlLabel
				label=""
				style={{ margin: 0 }}
				control={
					<Android12Switch
						onChange={(e) =>
							e.target.checked ? setTheme(lightTheme) : setTheme(darkTheme)
						}
						defaultChecked
					/>
				}
			/>
		</Grid>
	);
};

const Android12Switch = styled(Switch)(({ theme }) => ({
	padding: 8,

	'& .MuiSwitch-track': {
		borderRadius: 22 / 2,

		'&:before, &:after': {
			content: '""',
			position: 'absolute',
			top: '50%',
			transform: 'translateY(-50%)',
			width: 16,
			height: 16,
		},
		'&:before': {
			backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 24 24"><path fill="${encodeURIComponent(
				theme.palette.primary.contrastText
			)}" d="m6.05 4.14-.39-.39c-.39-.39-1.02-.38-1.4 0l-.01.01c-.39.39-.39 1.02 0 1.4l.39.39c.39.39 1.01.39 1.4 0l.01-.01c.39-.38.39-1.02 0-1.4zM3.01 10.5H1.99c-.55 0-.99.44-.99.99v.01c0 .55.44.99.99.99H3c.56.01 1-.43 1-.98v-.01c0-.56-.44-1-.99-1zm9-9.95H12c-.56 0-1 .44-1 .99v.96c0 .55.44.99.99.99H12c.56.01 1-.43 1-.98v-.97c0-.55-.44-.99-.99-.99zm7.74 3.21c-.39-.39-1.02-.39-1.41-.01l-.39.39c-.39.39-.39 1.02 0 1.4l.01.01c.39.39 1.02.39 1.4 0l.39-.39c.39-.39.39-1.01 0-1.4zm-1.81 15.1.39.39c.39.39 1.02.39 1.41 0 .39-.39.39-1.02 0-1.41l-.39-.39c-.39-.39-1.02-.38-1.4 0-.4.4-.4 1.02-.01 1.41zM20 11.49v.01c0 .55.44.99.99.99H22c.55 0 .99-.44.99-.99v-.01c0-.55-.44-.99-.99-.99h-1.01c-.55 0-.99.44-.99.99zM12 5.5c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zm-.01 16.95H12c.55 0 .99-.44.99-.99v-.96c0-.55-.44-.99-.99-.99h-.01c-.55 0-.99.44-.99.99v.96c0 .55.44.99.99.99zm-7.74-3.21c.39.39 1.02.39 1.41 0l.39-.39c.39-.39.38-1.02 0-1.4l-.01-.01a.9959.9959 0 0 0-1.41 0l-.39.39c-.38.4-.38 1.02.01 1.41z" /></svg>')`,
			left: 12,
		},
		'&:after': {
			backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 24 24"><path fill="${encodeURIComponent(
				theme.palette.primary.contrastText
			)}" d="M12.43 2.3c-2.38-.59-4.68-.27-6.63.64-.35.16-.41.64-.1.86C8.3 5.6 10 8.6 10 12c0 3.4-1.7 6.4-4.3 8.2-.32.22-.26.7.09.86 1.28.6 2.71.94 4.21.94 6.05 0 10.85-5.38 9.87-11.6-.61-3.92-3.59-7.16-7.44-8.1z" /></svg>')`,
			right: 12,
		},
	},
	'& .MuiSwitch-thumb': {
		boxShadow: 'none',
		width: 16,
		height: 16,
		margin: 2,
	},
}));

export default Header;
