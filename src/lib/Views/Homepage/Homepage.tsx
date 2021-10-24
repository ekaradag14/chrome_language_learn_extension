import React, { FunctionComponent, useState, useContext } from 'react';
import { Grid } from '@mui/material';
import { TargetLanguage } from '../../components/TargetLanguage';
import { Frequency } from '../../components/Frequency';
import { Amount } from '../../components/Amount';
import './Homepage.css';
import LoadingButton from '@mui/lab/LoadingButton';
import SaveIcon from '@mui/icons-material/Save';
const constants = require('../../../constants.js');
import { GeneralContext } from '../../../context/general';
const Homepage: FunctionComponent<{}> = () => {
	const [loading, setLoading] = useState(false);
	const { alertDispatch, setOpen } = useContext(GeneralContext);
	function handleClick() {
		setLoading(true);
		setTimeout(() => {
			setLoading(false);
			alertDispatch(constants.alertMessages.SUCCESSFUL_SAVE);
		}, 1000);
	}
	return (
		<>
			<Frequency />
			<Amount />
			<TargetLanguage />
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
