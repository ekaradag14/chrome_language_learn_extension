import React, { FunctionComponent, useState, useContext } from 'react';
import { Grid } from '@mui/material';
import { TargetLanguage } from '../../components/TargetLanguage';
import { Frequency } from '../../components/Frequency';
import { Amount } from '../../components/Amount';
import './Homepage.css';
import LoadingButton from '@mui/lab/LoadingButton';
import SaveIcon from '@mui/icons-material/Save';
import { GeneralContext } from '../../../context/general';
import { saveSettingsAPI } from '../../endpoints/user';
const constants = require('../../../constants.js');
import { UserSettingsProps } from '../../modals';
const Homepage: FunctionComponent<{}> = () => {
	const [loading, setLoading] = useState(false);
	const { alertDispatch, setOpen } = useContext(GeneralContext);
	const [userSettings, setUserSettings] = useState<UserSettingsProps>({
		frequency: 1,
		amount: 1,
		targetLanguages: [],
	});
	const handleClick = async () => {
		setLoading(true);

		try {
			await saveSettingsAPI(userSettings);
		} catch (error) {
			console.log(error);
		}
		//Add check for body validation
		setTimeout(() => {
			setLoading(false);
			alertDispatch(constants.alertMessages.SUCCESSFUL_SAVE);
		}, 300);
	};
	const defaultArgs = {
		value: userSettings,
		setValue: setUserSettings,
	};
	return (
		<>
			<Frequency {...defaultArgs} />
			<Amount {...defaultArgs} />
			<TargetLanguage {...defaultArgs} />
			<LoadingButton
				color="primary"
				onClick={handleClick}
				loading={loading}
				loadingPosition="start"
				startIcon={<SaveIcon />}
				variant="contained"
				style={{ maxWidth: '50%', margin: '20px auto 0 auto' }}
			>
				Save
			</LoadingButton>
		</>
	);
};

export default Homepage;
