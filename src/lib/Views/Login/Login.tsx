import React, { FunctionComponent, useState, useContext } from 'react';
import { Grid, Typography } from '@mui/material';
import TextField from '@mui/material/TextField';
import LoadingButton from '@mui/lab/LoadingButton';
import LoginIcon from '@mui/icons-material/Login';
import { signInWithEmailAndPassword } from 'firebase/auth'; // New import
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import * as firebase from '../../firebaseInit';
import './Login.css';
import { GeneralContext } from '../../../context/general';
import { generalErrorHandler } from '../../utils/errorHandler';
import { getUserStorageDataAPI } from '../../endpoints/user';
// import ReCAPTCHA from 'react-google-recaptcha';
const constants = require('../../../constants.js');

export type LoginProps = {
	setCurrentView: React.Dispatch<React.SetStateAction<string>>;
	setUserSettings: React.Dispatch<React.SetStateAction<any>>;
	setLanguageIsChangeable: React.Dispatch<React.SetStateAction<boolean>>;
};

const Login: FunctionComponent<LoginProps> = ({
	setCurrentView,
	setUserSettings,
	setLanguageIsChangeable,
}) => {
	const [credentials, setCredentials] = useState({
		email: '',
		password: '',
	});
	const [showPassword, setShowPassword] = useState(true);
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
		let idToken, userCredentials, userData;

		try {
			userCredentials = await signInWithEmailAndPassword(
				firebase.auth,
				credentials.email,
				credentials.password
			);
			idToken = await firebase.auth.currentUser.getIdToken(true);
			userData = await (await getUserStorageDataAPI(idToken)).json();
		} catch (err) {
			generalErrorHandler(alertDispatch, err);
			setLoading(false);
			return;
		}
		if (userData) {
			const { settings, bannedSites, isPremium, lastLanguageChange } =
				userData.data;

			chrome.storage.local.set({
				userSettings: settings,
				bannedSites,
				isPremium,
				lastLanguageChange,
			});
			setUserSettings(settings);
			setLanguageIsChangeable(
				Math.floor(Date.now() / 1000) - parseInt(lastLanguageChange) > 86400 ||
					isPremium === true
			);
		}
		if (idToken) {
			chrome.storage.local.set({
				userCredentials: {
					uid: userCredentials.user.uid,
				},
			});
			setTimeout(() => {
				setLoading(false);
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
				Login
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
