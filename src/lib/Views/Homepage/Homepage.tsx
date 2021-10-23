import React, { FunctionComponent, useState } from 'react';
import { Grid } from '@mui/material';
import { TargetLanguage } from '../../components/TargetLanguage';
import { Frequency } from '../../components/Frequency';
import './Homepage.css';
import LoadingButton from '@mui/lab/LoadingButton';
import SaveIcon from '@mui/icons-material/Save';
const Homepage: FunctionComponent<{}> = () => {
	const [loading, setLoading] = useState(false);

	function handleClick() {
		setLoading(true);
		setTimeout(() => setLoading(false), 1000);
	}
	return (
		<>
			<Frequency />
			<TargetLanguage />
			<LoadingButton
				color="primary"
				onClick={handleClick}
				loading={loading}
				loadingPosition="start"
				startIcon={<SaveIcon />}
				variant="contained"
				style={{ maxWidth: '50%', margin: '30px auto 0 auto' }}
			>
				Save
			</LoadingButton>
		</>
	);
};

export default Homepage;
