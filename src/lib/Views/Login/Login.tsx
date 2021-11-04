import React, { FunctionComponent, useState, useContext } from 'react';
import { Grid, Typography } from '@mui/material';
import TextField from '@mui/material/TextField';
import LoadingButton from '@mui/lab/LoadingButton';
import LoginIcon from '@mui/icons-material/Login';
import { signInWithEmailAndPassword } from 'firebase/auth'; // New import
import * as firebase from '../../firebaseInit';
import './Login.css';
import { GeneralContext } from '../../../context/general';
import { generalErrorHandler } from '../../utils/errorHandler';
const constants = require('../../../constants.js');

export type LoginProps = {
	setCurrentView: React.Dispatch<React.SetStateAction<string>>;
};

const Login: FunctionComponent<LoginProps> = ({ setCurrentView }) => {
	const [credentials, setCredentials] = useState({
		email: 'test2@test2.com',
		password: '123456',
	});

	const { alertDispatch } = useContext(GeneralContext);
	const [loading, setLoading] = useState(false);

	const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setCredentials((pS) => ({
			...pS,
			[event.target.name]: event.target.value,
		}));
	};
	const handleClick = async () => {
		setLoading(true);

		let userCredentials;
		try {
			userCredentials = await signInWithEmailAndPassword(
				firebase.auth,
				credentials.email,
				credentials.password
			);
		} catch (err) {
			generalErrorHandler(alertDispatch, err);
			setLoading(false);
			return;
		}
		if (userCredentials.user.uid) {
			setTimeout(() => {
				setLoading(false);
				chrome.storage.local.set({
					userCredentials: {
						email: userCredentials.user.email,
						uid: userCredentials.user.uid,
					},
				});
				setCurrentView(constants.routes.HOMEPAGE);
			}, 500);
		}
	};
	return (
		<Grid
			container
			rowSpacing={1}
			style={{ marginTop: 'auto', marginBottom: 'auto' }}
		>
			<Grid style={{ padding: 10 }} item xs={12}>
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
			<Grid style={{ padding: 10 }} item xs={12}>
				<TextField
					id="outlined-multiline-flexible"
					label="Password"
					name="password"
					type="password"
					fullWidth
					value={credentials.password}
					onChange={handleChange}
				/>
			</Grid>
			<Grid style={{ padding: 0 }} item xs={12} textAlign="center">
				<p style={{ margin: 0 }}>
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
