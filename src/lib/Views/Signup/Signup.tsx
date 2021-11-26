import React, { FunctionComponent, useState, useContext } from 'react';
import { Grid, Typography } from '@mui/material';
import TextField from '@mui/material/TextField';
import LoadingButton from '@mui/lab/LoadingButton';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import { signUpUserAPI } from '../../endpoints/user';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
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
	const [showPassword, setShowPassword] = useState(true);
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
		chrome.storage.local.set({
			userSettings: { targetLanguages: [], ignoreSpecialCharacters: false },
			bannedSites: [],
			isPremium: false,
			lastLanguageChange: Date.now() / 1000 - 90000,
		});

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
			<Grid
				style={{
					padding: 3,
					paddingTop: 10,
					textAlign: 'center',
					color: 'gray',
					fontSize: 20,
				}}
				item
				xs={12}
			>
				Signup
			</Grid>
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
			<Grid style={{ padding: 10, paddingTop: 0 }} item xs={12}>
				<FormControl style={{ margin: 0 }} variant="outlined">
					<InputLabel htmlFor="outlined-adornment-password">
						Password
					</InputLabel>
					<OutlinedInput
						id="outlined-multiline-flexible"
						name="password"
						label="Password"
						type={showPassword ? 'password' : 'text'}
						fullWidth
						value={credentials.password}
						onChange={handleChange}
						endAdornment={
							<InputAdornment position="end">
								<IconButton
									aria-label="toggle password visibility"
									onClick={() => setShowPassword((pS) => !pS)}
									onMouseDown={(e) => e.preventDefault()}
									edge="end"
								>
									{showPassword ? <VisibilityOff /> : <Visibility />}
								</IconButton>
							</InputAdornment>
						}
					/>
				</FormControl>
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
