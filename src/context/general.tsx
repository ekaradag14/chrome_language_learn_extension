import { createContext, useState, useReducer, useMemo } from 'react';
import { Snackbar } from '../lib/components/Utilities/Snackbar';
import { AlertColor } from '@mui/material/Alert';
export type ContextProps = {
	alert: {
		message: string;
		severity: AlertColor;
	};
	alertDispatch;
	alertClear;
	alertMessages;
	open;
	setOpen;
	// openDialog;
	// closeDialog;
	// modals;
	// openModal;
	// closeModal;
	// setModals;
};
const alertMessages = {
	UNAUTHORIZED: {
		isOpen: true,
		message:
			'You are unauthorized, please login again to terminate your process.',
		severity: 'error',
	},
	LIMIT_OVERFLOW: {
		isOpen: true,
		message: 'Your usage limit has been reached.',
		severity: 'error',
	},
	SUCCESSFUL_SAVE: {
		isOpen: true,
		message: `Item saved successfully.`,
		severity: 'success',
	},
	SUCCESSFUL_DELETE: {
		isOpen: true,
		message: 'Item deleted successfully.',
		severity: 'success',
	},
};
export const GeneralContext = createContext<ContextProps>(null);
// {
// 	alert: {
// 		message: '',
// 		severity: 'success',
// 	},
// 	alertDispatch: () => console.log('hola'),
// 	alertClear: () => null,
// 	alertMessages: () => null,
// 	open: false,
// 	setOpen: () => null,

// 	// openDialog = () => null,
// 	// closeDialog = () => null,
// 	// modals = () => null,
// 	// openModal = () => null,
// 	// closeModal = () => null,
// 	// setModals = () => null,
// }
const GeneralContextProvider = ({
	children,
}: {
	children: React.ReactNode;
}) => {
	const [alert, setAlert] = useState<ContextProps['alert']>({
		message: '',
		severity: 'success',
	});
	const [isSnackbarOpen, setIsSnackbarOpen] = useState(false);
	const [dialogs, setDialogs] = useState([]);
	const [modals, setModals] = useState({});
	//In order to avoid re-creation of functions in every render we use useMemo
	const value = useMemo(() => {
		const alertDispatch = (
			message = 'Something has gone wrong, please try again.',
			severity = 'error',
			time = undefined
		) => {
			console.log('hello');
			let data;
			if (typeof message !== 'object') {
				data = {
					isOpen: true,
					message: message,
					severity: severity,
				};
			} else {
				data = message;
			}

			if (time) {
				data = { ...data, autoHideDuration: time };
			}
			setAlert(data);
			setIsSnackbarOpen(true);
		};

		const alertClear = () => {
			setIsSnackbarOpen(false);
		};
		// const open = (data) => {
		// 	setDialogs((prevState) => [...prevState, data]);
		// };
		// const closeDialog = (id) => {
		// 	setDialogs((prevState) => prevState.filter((item) => item.id !== id));
		// };
		// const closeModal = (id) => {
		// 	let temp = modals;
		// 	if (!temp?.[id]) {
		// 		return false;
		// 	}
		// 	delete temp?.[id];
		// 	setModals(Object.keys(temp)?.length > 0 ? temp : null);
		// };
		// const openModal = (id) => {
		// 	setModals((pS) => ({ ...pS, [id]: { open: true } }));
		// };

		return {
			alertDispatch,
			alertClear,
			alertMessages,
			setOpen: setIsSnackbarOpen,
			open: isSnackbarOpen,
			alert,
			// closeDialog,
			// closeModal,
			// openModal,
		};
	}, [alert]);

	return (
		<GeneralContext.Provider
			value={{
				...value,
			}}
		>
			{children}

			<Snackbar
				alert={alert}
				open={isSnackbarOpen}
				setOpen={setIsSnackbarOpen}
			/>
		</GeneralContext.Provider>
	);
};

export default GeneralContextProvider;
