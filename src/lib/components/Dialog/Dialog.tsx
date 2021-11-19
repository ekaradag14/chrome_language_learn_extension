import * as React from 'react';

import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Slide from '@mui/material/Slide';
import InfoRoundedIcon from '@mui/icons-material/InfoRounded';
import { TransitionProps } from '@mui/material/transitions';

const Transition = React.forwardRef(function Transition(
	props: TransitionProps & {
		children: React.ReactElement<any, any>;
	},
	ref: React.Ref<unknown>
) {
	return <Slide direction="up" ref={ref} {...props} />;
});
const BootstrapDialog = styled(Dialog)(({ theme }) => ({
	'& .MuiDialogContent-root': {
		padding: theme.spacing(1),
	},
	'& .MuiDialogActions-root': {
		padding: theme.spacing(1),
	},
}));

export interface DialogTitleProps {
	id: string;
	children?: React.ReactNode;
	onClose: () => void;
}

const BootstrapDialogTitle = (props: DialogTitleProps) => {
	const { children, onClose, ...other } = props;

	return (
		<DialogTitle sx={{ m: 0 }} {...other} style={{ height: '17px' }}>
			<InfoRoundedIcon color="primary" style={{ marginLeft: 'auto' }} />
			{children}
			{onClose ? (
				<IconButton
					aria-label="close"
					onClick={onClose}
					sx={{
						position: 'absolute',
						right: 8,
						top: 8,
						color: (theme) => theme.palette.grey[500],
					}}
				>
					<CloseIcon />
				</IconButton>
			) : null}
		</DialogTitle>
	);
};

const CustomizedDialogs = ({
	title,
	children,
	actionChildren,
	open,
	setOpen,
}) => {
	return (
		<BootstrapDialog
			TransitionComponent={Transition}
			onClose={() => setOpen(false)}
			aria-labelledby="customized-dialog-title"
			open={open}
		>
			<BootstrapDialogTitle
				id="customized-dialog-title"
				onClose={() => setOpen(false)}
			>
				{title}
			</BootstrapDialogTitle>
			<DialogContent dividers>{children}</DialogContent>
			<DialogActions>{actionChildren}</DialogActions>
		</BootstrapDialog>
	);
};

export default CustomizedDialogs;
