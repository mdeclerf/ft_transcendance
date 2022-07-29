import { createTheme } from '@mui/material/styles';

const theme_2 = {
    palette: {
        primary: {
            main: '#53e466',
        },
        secondary: {
            main: '#E4536F',
        },
        error: {
            main: '#8053E4',
        },
        background: {
            default: '#faf5f7',
        },
    },
    sidebarWidth: 240
} as const;

type CustomTheme = {
    [Key in keyof typeof theme_2]: typeof theme_2[Key]
}

declare module '@mui/material/styles/createTheme' {
    interface Theme extends CustomTheme { }
    interface ThemeOptions extends CustomTheme { }
}

export default createTheme(theme_2);