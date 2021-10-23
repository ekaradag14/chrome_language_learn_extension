import { createTheme } from '@mui/material/styles';
import { green } from '@mui/material/colors';
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
		danger: green[500],
	},
	palette: {
		primary: {
			main: green[500],
		},
	},
});

export default theme;
