import React, {
	FunctionComponent,
	useState,
	useContext,
	useEffect,
} from 'react';

import { TargetLanguage } from '../../components/TargetLanguage';
import { Frequency } from '../../components/Frequency';
import { Amount } from '../../components/Amount';
import './Homepage.css';
import LoadingButton from '@mui/lab/LoadingButton';
import InfoRoundedIcon from '@mui/icons-material/InfoRounded';
import SaveIcon from '@mui/icons-material/Save';
import { GeneralContext } from '../../../context/general';
import { saveSettingsAPI } from '../../endpoints/user';
const constants = require('../../../constants.js');
import { UserSettingsProps } from '../../modals';
import { Dialog } from '../../components/Dialog';

const Homepage: FunctionComponent<{
	userSettings: UserSettingsProps;
	languageIsChangeable: boolean;
	isUserPremium: boolean;
	setUserSettings;
	setLanguageIsChangeable;
}> = ({
	userSettings,
	setUserSettings,
	languageIsChangeable,
	setLanguageIsChangeable,
	isUserPremium,
}) => {
	const [loading, setLoading] = useState(false);

	const { alertDispatch, setOpen } = useContext(GeneralContext);
	const [renderKey, setRenderKey] = useState(0);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const handleClick = async () => {
		if (languageIsChangeable) {
			setIsModalOpen(true);
		} else {
			saveSettings(false);
		}
	};

	const saveSettings = async (hasLanguageChanged: boolean) => {
		setLoading(true);

		let settings;
		try {
			settings = (await (await saveSettingsAPI(userSettings)).json()).data;
			chrome.storage.local.set({ userSettings: settings });

			setUserSettings(settings);
		} catch (error) {
			console.log(error);
		}
		//Add check for body validation
		if (hasLanguageChanged) {
			!isUserPremium && setLanguageIsChangeable(false);
			chrome.storage.local.set({
				lastLanguageChange: Math.floor(Date.now() / 1000),
			});
		}

		setTimeout(() => {
			setRenderKey(renderKey + 1);
			setLoading(false);
			setIsModalOpen(false);
			alertDispatch(constants.alertMessages.SUCCESSFUL_SAVE);
		}, 300);
	};

	const defaultArgs = {
		value: userSettings,
		setValue: setUserSettings,
	};

	return (
		<div style={{ display: 'flex', flexDirection: 'column' }} key={renderKey}>
			<Frequency isUserPremium={isUserPremium} {...defaultArgs} />
			<TargetLanguage
				isUserPremium={isUserPremium}
				ignoreSpecialCharacters={userSettings.ignoreSpecialCharacters}
				languageIsChangeable={languageIsChangeable}
				{...defaultArgs}
			/>

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
			<Dialog
				open={isModalOpen}
				setOpen={setIsModalOpen}
				title={null}
				children={
					<div
						style={{
							display: 'flex',
							flexDirection: 'column',
						}}
					>
						<p style={{ fontSize: 14, color: 'gray' }}>
							You can only change your language once in a day.
						</p>
					</div>
				}
				actionChildren={
					<LoadingButton
						color="primary"
						onClick={() => saveSettings(true)}
						loading={loading}
						loadingPosition="start"
						startIcon={<SaveIcon />}
						variant="contained"
						style={{ maxWidth: '60%', margin: 'auto' }}
					>
						Save
					</LoadingButton>
				}
			/>
		</div>
	);
};

export default Homepage;
