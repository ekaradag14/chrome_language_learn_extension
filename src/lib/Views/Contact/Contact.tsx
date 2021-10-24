import React, { FunctionComponent, useState, useContext } from 'react';
import { Grid } from '@mui/material';
import TextField from '@mui/material/TextField';
import LoadingButton from '@mui/lab/LoadingButton';
import SendIcon from '@mui/icons-material/Send';
import { BasicSelect } from '../../components/Utilities/BasicSelect';
import { GeneralContext } from '../../../context/general';

import './Contact.css';
const topics = [
	{ value: 'support', label: 'Support' },
	{ value: 'suggestion', label: 'Suggestion' },
	{ value: 'other', label: 'Other' },
];

const constants = require('../../../constants.js');
const Contact: FunctionComponent<{}> = ({}) => {
	const [userMessage, setUserMessage] = useState({
		topic: '',
		body: '',
		email: '',
	});
	const [topic, setTopic] = useState();
	const [loading, setLoading] = useState(false);

	const { alertDispatch, setOpen } = useContext(GeneralContext);
	const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setUserMessage((pS) => ({
			...pS,
			[event.target.name]: event.target.value,
		}));
	};
	function handleClick() {
		setLoading(true);
		setTimeout(() => {
			setLoading(false);
			alertDispatch(constants.alertMessages.SUCCESSFUL_CONTACT_US);
		}, 1000);
	}
	return (
		<Grid container rowSpacing={1}>
			<Grid item xs={12}>
				<BasicSelect
					label="About"
					selectValue={topic}
					setSelectValue={setTopic}
					options={topics}
				/>
			</Grid>
			<Grid item xs={12}>
				<TextField
					id="user-mail-text-field"
					label="Your Mail"
					type="email"
					name="email"
					fullWidth
					value={userMessage.email}
					onChange={handleChange}
				/>
			</Grid>
			<Grid item xs={12}>
				<TextField
					id="outlined-multiline-flexible"
					label="Your Message"
					multiline
					name="body"
					minRows={3}
					fullWidth
					value={userMessage.body}
					onChange={handleChange}
				/>
			</Grid>

			<Grid item xs={12} textAlign="center">
				<LoadingButton
					color="primary"
					variant="contained"
					id="send-button"
					loading={loading}
					onClick={handleClick}
					loadingPosition="start"
					startIcon={<SendIcon />}
					style={{ width: '50%', margin: 'auto', marginTop: 10 }}
				>
					Send
				</LoadingButton>
			</Grid>
		</Grid>
	);
};

export default Contact;
