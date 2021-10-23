import React, { FunctionComponent, useState } from 'react';
import Button from '@mui/material/Button';
import SnackbarMUI from '@mui/material/Snackbar';
import Slide, { SlideProps } from '@mui/material/Slide';
import MuiAlert, { AlertProps } from '@mui/material/Alert';
type TransitionProps = Omit<SlideProps, 'direction'>;
const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
	props,
	ref
) {
	return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

import './Snackbar.css';

function TransitionLeft(props: TransitionProps) {
	return <Slide {...props} direction="right" />;
}
export type SnackbarProps = {
	open: boolean;
	setOpen: React.Dispatch<React.SetStateAction<boolean>>;
	autoHideDuration?: number;
	severity;
	message?: string;
};
const Snackbar: FunctionComponent<SnackbarProps> = ({
	open = false,
	setOpen,
	severity,
	autoHideDuration = 2000,
	message,
}) => {
	const handleClose = () => {
		setOpen(false);
	};
	return (
		<SnackbarMUI
			open={open}
			autoHideDuration={autoHideDuration}
			onClose={handleClose}
			transitionDuration={500}
			TransitionComponent={TransitionLeft}
		>
			<Alert
				onClose={() => {
					setOpen(false);
				}}
				severity="success"
			>
				{message}
			</Alert>
		</SnackbarMUI>
	);
};

export default Snackbar;
