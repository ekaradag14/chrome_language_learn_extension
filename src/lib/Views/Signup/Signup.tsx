import React, { FunctionComponent, useState, useContext } from 'react';
import { Grid, Typography } from '@mui/material';
import TextField from '@mui/material/TextField';
import LoadingButton from '@mui/lab/LoadingButton';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import { signUpUserAPI } from '../../endpoints/user';
import { GeneralContext } from '../../../context/general';
import { generalErrorHandler } from '../../utils/errorHandler';
const constants = require('../../../constants.js');
import './Signup.css';

export type SignupProps = {
	setCurrentView: React.Dispatch<React.SetStateAction<string>>;
};

const Signup: FunctionComponent<SignupProps> = ({ setCurrentView }) => {
	const { alertDispatch } = useContext(GeneralContext);
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
	const signUpUser = async () => {
		if (credentials.password.length < 6) {
			alertDispatch({
				isOpen: true,
				message: 'Password must be at least 6 characters.',
				severity: 'warning',
			});
			return;
		}
		setLoading(true);
		let newUser;
		try {
			newUser = await (await signUpUserAPI(credentials)).json();
			if (!newUser.success) {
				throw { custom: true, message: newUser.error };
			}
		} catch (err) {
			generalErrorHandler(alertDispatch, err);
			setLoading(false);
			return;
		}
		if (newUser.success) {
			chrome.storage.local.set({
				userCredentials: {
					uid: newUser.data.uid,
				},
			});
		}
		setTimeout(() => {
			setLoading(false);
			alertDispatch({
				isOpen: true,
				message: 'Successful signup!',
				severity: 'success',
			});
			setCurrentView(constants.routes.HOMEPAGE);
		}, 500);
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
					type="password"
					name="password"
					fullWidth
					value={credentials.password}
					onChange={handleChange}
				/>
			</Grid>
			<Grid style={{ padding: 0 }} item xs={12} textAlign="center">
				<p style={{ margin: 0 }}>
					Already have an account?{' '}
					<b
						style={{ cursor: 'pointer' }}
						onClick={() => setCurrentView(constants.routes.LOGIN)}
					>
						Login
					</b>
				</p>
			</Grid>
			<Grid item xs={12} textAlign="center">
				<LoadingButton
					color="primary"
					variant="contained"
					id="send-button"
					loading={loading}
					onClick={signUpUser}
					loadingPosition="start"
					startIcon={<VpnKeyIcon />}
					style={{ width: '50%', margin: 'auto', marginTop: 10 }}
				>
					Signup
				</LoadingButton>
			</Grid>
		</Grid>
	);
};

export default Signup;
