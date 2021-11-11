import React, {
	FunctionComponent,
	useState,
	useContext,
	useEffect,
} from 'react';
import { Grid } from '@mui/material';
import TextField from '@mui/material/TextField';
import LoadingButton from '@mui/lab/LoadingButton';
import SendIcon from '@mui/icons-material/Send';
import { BasicSelect } from '../../components/Utilities/BasicSelect';
import { GeneralContext } from '../../../context/general';
import * as modals from '../../modals';
import './Contact.css';
import { generalErrorHandler } from '../../utils/errorHandler';
import { sendContactMessageAPI } from '../../endpoints/contact';
const topics = [
	{ value: 'support', label: 'Support' },
	{ value: 'suggestion', label: 'Suggestion' },
	{ value: 'other', label: 'Other' },
];
const emptyUserMessage: modals.ContactUsMessage = {
	topic: '',
	body: '',
	email: '',
};
const constants = require('../../../constants.js');
const Contact: FunctionComponent<{}> = ({}) => {
	const [userMessage, setUserMessage] =
		useState<modals.ContactUsMessage>(emptyUserMessage);
	const [topic, setTopic] = useState();
	const [loading, setLoading] = useState(false);

	const { alertDispatch } = useContext(GeneralContext);
	const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setUserMessage((pS) => ({
			...pS,
			[event.target.name]: event.target.value,
		}));
	};
	const handleClick = async () => {
		if (!isFormValid(userMessage, alertDispatch)) {
			return;
		}
		setLoading(true);
		let data;
		try {
			data = await (await sendContactMessageAPI(userMessage)).json();
		} catch (err) {
			generalErrorHandler(alertDispatch, err);
			setLoading(false);
			return;
		}

		if (data.code !== 200) {
			setTimeout(() => {
				generalErrorHandler(alertDispatch, data);
				setLoading(false);
				return;
			}, 500);
		} else {
			setLoading(false);
			setUserMessage(emptyUserMessage);
			setTopic(null);
			alertDispatch(constants.alertMessages.SUCCESSFUL_CONTACT_US);
		}
	};

	useEffect(() => {
		if (topic) {
			setUserMessage((pS) => ({ ...pS, topic }));
		}
	}, [topic]);
	return (
		<Grid container rowSpacing={1} style={{ margin: 'auto' }}>
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

const isEmailValid = (email) => {
	const emailCheckRegex = /\S+@\S+\.\S+/;
	return emailCheckRegex.test(email);
};

const isFormValid = (userMessage, alertDispatch) => {
	let isValid = true;
	if (userMessage.topic.length === 0 || userMessage.body.length === 0) {
		alertDispatch(constants.alertMessages.UNFILLED_FIELDS);
		isValid = false;
	} else if (!isEmailValid(userMessage.email)) {
		alertDispatch(constants.alertMessages.BAD_EMAIL);
		isValid = false;
	}
	return isValid;
};
export default Contact;
