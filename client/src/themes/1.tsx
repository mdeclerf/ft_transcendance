// https://dragoshmocrii.com/material-ui-custom-theme-and-typescript/
import { createTheme } from '@mui/material/styles';

const theme_1 = {
    palette: {
        primary: {
            main: '#3C35CF', 
        },
        secondary: {
            main: '#ED127C', 
        },
        error: {
            main: '#ed1212',
        },
        background: {
            default: '#E6EEE8',
        },
    },

	sidebarWidth: 240
} as const;

type CustomTheme = {
	[Key in keyof typeof theme_1]: typeof theme_1[Key]
}
declare module '@mui/material/styles/createTheme' {
    interface Theme extends CustomTheme { }
    interface ThemeOptions extends CustomTheme { }
}
export default createTheme(theme_1);
