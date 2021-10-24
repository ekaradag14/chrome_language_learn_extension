import React, { FunctionComponent, useState } from 'react';
import { Grid, Typography } from '@mui/material';
import TextField from '@mui/material/TextField';
import LoadingButton from '@mui/lab/LoadingButton';
import LoginIcon from '@mui/icons-material/Login';
const constants = require('../../../constants.js');
import './Login.css';

export type LoginProps = {
	setCurrentView: React.Dispatch<React.SetStateAction<string>>;
};

const Login: FunctionComponent<LoginProps> = ({ setCurrentView }) => {
	const [credentials, setCredentials] = useState({
		email: '',
		password: '',
	});
	const [loading, setLoading] = useState(false);

	const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setCredentials((pS) => ({
			...pS,
			[event.target.name]: event.target.value,
		}));
	};
	function handleClick() {
		setLoading(true);
		setTimeout(() => {
			setLoading(false);
			setCurrentView(constants.routes.HOMEPAGE);
		}, 1000);
	}
	return (
		<Grid
			container
			rowSpacing={1}
			style={{ marginTop: 'auto', marginBottom: 'auto' }}
		>
			<Grid item xs={12}>
				<TextField
					id="user-mail-text-field"
					label="Email"
					type="email"
					name="email"
					fullWidth
					value={credentials.email}
					onChange={handleChange}
				/>
			</Grid>
			<Grid item xs={12}>
				<TextField
					id="outlined-multiline-flexible"
					label="Password"
					name="password"
					fullWidth
					value={credentials.password}
					onChange={handleChange}
				/>
			</Grid>
			<Grid item xs={12} textAlign="center">
				<p>
					Don't have an account?{' '}
					<b
						style={{ cursor: 'pointer' }}
						onClick={() => setCurrentView(constants.routes.SIGNUP)}
					>
						Signup
					</b>
				</p>
			</Grid>
			<Grid item xs={12} textAlign="center">
				<LoadingButton
					color="primary"
					variant="contained"
					id="send-button"
					loading={loading}
					onClick={handleClick}
					loadingPosition="start"
					startIcon={<LoginIcon />}
					style={{ width: '50%', margin: 'auto', marginTop: 10 }}
				>
					Login
				</LoadingButton>
			</Grid>
		</Grid>
	);
};

export default Login;
