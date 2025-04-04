import {createTheme} from '@mui/material/styles';

export const lightTheme = createTheme({
	palette: {
		primary: {
			main: '#191A24',
		},
		secondary: {
			main: '#B6FA64',
			dark: '#A0E859'
		},
		error:{
			main: '#D32F2F',
		},
		background: {
			default: '#FAFCF7',
		},
	},
	customPalette: {
		gradientMain: 'linear-gradient(45deg, #CAF28D, #8BD94D)',
		gradientSecondary: '',
	},
	shape: {
		borderRadius: 8,
	},
	typography: {
		fontFamily: `'Source Code Pro Variable', monospace`,
		allVariants: {
			color: '#191A24',
		},
	},
});