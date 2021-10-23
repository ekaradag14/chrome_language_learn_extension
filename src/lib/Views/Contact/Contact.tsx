import React, { FunctionComponent, useState, useContext } from 'react';
import { Grid } from '@mui/material';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { BasicSelect } from '../../components/Utilities/BasicSelect';
import { GeneralContext } from '../../../context/general';
import './Contact.css';
const topics = [
	{ value: 'support', label: 'Support' },
	{ value: 'suggestion', label: 'Suggestion' },
];

const constants = require('../../../constants.js');
const Contact: FunctionComponent<{}> = ({}) => {
	const [topic, setTopic] = useState();
	const [userMessage, setUserMessage] = useState('');
	const { alertDispatch, setOpen } = useContext(GeneralContext);
	const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setUserMessage(event.target.value);
	};
	return (
		<Grid
			style={{
				display: 'flex',
				flexDirection: 'column',
			}}
		>
			<BasicSelect
				label="About"
				selectValue={topic}
				setSelectValue={setTopic}
				options={topics}
			/>
			<TextField
				style={{ marginTop: 10 }}
				id="outlined-multiline-flexible"
				label="Your Message"
				multiline
				minRows={4}
				value={userMessage}
				onChange={handleChange}
			/>
			<Button
				color="primary"
				variant="contained"
				style={{ width: '50%', margin: 'auto', marginTop: 20 }}
				onClick={() =>
					alertDispatch(constants.alertMessages.SUCCESSFUL_CONTACT_US)
				}
			>
				Send
			</Button>
		</Grid>
	);
};

export default Contact;
