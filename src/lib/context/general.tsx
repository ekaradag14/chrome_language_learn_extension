import { createContext, useState, useReducer, useMemo } from 'react';
import { Snackbar } from '../components/Utilities/Snackbar';
export type ContextProps = {
	alert: {
		isOpen: boolean;
		message: string;
		severity: string;
	};
	alertDispatch;
	alertClear;
	alertMessages;
	openDialog;
	closeDialog;
	modals;
	openModal;
	closeModal;
	setModals;
};
export const GeneralContext = createContext<ContextProps>({
	alert: {
		isOpen: false,
		message: '',
		severity: 'success',
	},
	alertDispatch = () => null,
	alertClear = () => null,
	alertMessages = () => null,
	openDialog = () => null,
	closeDialog = () => null,
	modals = () => null,
	openModal = () => null,
	closeModal = () => null,
	setModals = () => null,
});

const GeneralContextProvider = ({
	children,
}: {
	children: React.ReactNode;
}) => {
	const [alert, setAlert] = useState<{
		isOpen: boolean;
		message: string;
		severity: string;
	}>({
		isOpen: false,
		message: '',
		severity: 'success',
	});
	const [dialogs, setDialogs] = useState([]);
	const [modals, setModals] = useState({});

	const value = useMemo(() => {
		const alertDispatch = (
			message = 'Something has gone wrong, please try again.',
			severity = 'error',
			time = undefined
		) => {
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
		};

		const alertClear = () => {
			setAlert({ ...alert, isOpen: false });
		};
		const open = (data) => {
			setDialogs((prevState) => [...prevState, data]);
		};
		const closeDialog = (id) => {
			setDialogs((prevState) => prevState.filter((item) => item.id !== id));
		};
		const closeModal = (id) => {
			let temp = modals;
			if (!temp?.[id]) {
				return false;
			}
			delete temp?.[id];
			setModals(Object.keys(temp)?.length > 0 ? temp : null);
		};
		const openModal = (id) => {
			setModals((pS) => ({ ...pS, [id]: { open: true } }));
		};

		return {
			alertDispatch,
			alertClear,
			open,
			closeDialog,
			closeModal,
			openModal,
		};
	}, [alert]);

	return (
		<GeneralContext.Provider value={value}>
			{children}

			{alert.isOpen && <Snackbar {...alert} open={} setOpen={alertClear} />}
		</GeneralContext.Provider>
	);
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

export default GeneralContextProvider;
