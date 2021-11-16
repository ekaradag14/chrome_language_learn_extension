import React, {
	FunctionComponent,
	useState,
	useContext,
	useEffect,
} from 'react';
import { Grid } from '@mui/material';
import { TargetLanguage } from '../../components/TargetLanguage';
import { Frequency } from '../../components/Frequency';
import { Amount } from '../../components/Amount';
import './Homepage.css';
import LoadingButton from '@mui/lab/LoadingButton';
import SaveIcon from '@mui/icons-material/Save';
import { GeneralContext } from '../../../context/general';
import Checkbox from '@mui/material/Checkbox';
import { saveSettingsAPI } from '../../endpoints/user';
const constants = require('../../../constants.js');
import { UserSettingsProps } from '../../modals';
const Homepage: FunctionComponent<{
	userSettings: UserSettingsProps;
	setUserSettings;
}> = ({ userSettings, setUserSettings }) => {
	const [loading, setLoading] = useState(false);
	const { alertDispatch, setOpen } = useContext(GeneralContext);

	const handleClick = async () => {
		setLoading(true);

		try {
			await saveSettingsAPI(userSettings);
			chrome.storage.local.set({ userSettings });
		} catch (error) {
			console.log(error);
		}
		//Add check for body validation
		setTimeout(() => {
			setLoading(false);
			// alertDispatch(constants.alertMessages.SUCCESSFUL_SAVE);
		}, 300);
	};
	const handleCheckChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setUserSettings((pS) => ({
			...pS,
			ignoreSpecialCharacters: event.target.checked,
		}));
	};
	const defaultArgs = {
		value: userSettings,
		setValue: setUserSettings,
	};

	return (
		<>
			<Frequency {...defaultArgs} />

			<TargetLanguage {...defaultArgs} />
			<Grid
				container
				justifyContent="center"
				display="flex"
				flexDirection="row"
			>
				<Grid item sm={1}>
					<Checkbox
						inputProps={{ 'aria-label': 'Checkbox demo' }}
						style={{ padding: 5 }}
						checked={userSettings.ignoreSpecialCharacters}
						onChange={handleCheckChange}
						sx={{ '& .MuiSvgIcon-root': { fontSize: 21 } }}
					/>
				</Grid>
				<Grid item sm={9} margin="auto 0">
					<em style={{ color: 'gray' }}>Ignore Special Characters</em>
				</Grid>
			</Grid>
			<LoadingButton
				color="primary"
				onClick={handleClick}
				loading={loading}
				loadingPosition="start"
				startIcon={<SaveIcon />}
				variant="contained"
				style={{ maxWidth: '50%', margin: '10px auto 0 auto' }}
			>
				Save
			</LoadingButton>
		</>
	);
};

export default Homepage;
