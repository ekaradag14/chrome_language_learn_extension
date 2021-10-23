import { createContext, useState, useReducer, useMemo } from 'react';
import { Snackbar } from '../lib/components/Utilities/Snackbar';
import { AlertColor } from '@mui/material/Alert';
const constants = require('../constants.js');
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
		const alertDispatch = (data) => {
			if (data.time) {
				data = { ...data, autoHideDuration: data.time };
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
			alertMessages: constants.alertMessages,
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
