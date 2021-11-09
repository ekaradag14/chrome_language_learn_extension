import { createTheme } from '@mui/material/styles';
import { blue } from '@mui/material/colors';

declare module '@mui/material/styles' {
	interface Theme {
		status: {
			danger: string;
		};
	}
	// allow configuration using `createTheme`
	interface ThemeOptions {
		status?: {
			danger?: string;
		};
	}
}

const theme = createTheme({
	status: {
		danger: 'black',
	},
	palette: {
		primary: {
			main: '#a12e75',
			contrastText: '#fff',
		},
	},
});

export default theme;
