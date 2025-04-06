import {createTheme} from '@mui/material/styles';
import {linearProgressClasses} from '@mui/material/LinearProgress';
import {grey} from '@mui/material/colors';

export const lightTheme = createTheme({
	palette: {
		primary: {
			main: '#191A24',
			dark: '#191A24'
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
	components: {
		MuiLinearProgress: {
			styleOverrides: {
				root: {
					height: 10,
					borderRadius: 5,
				},
				colorPrimary: {
					[`&.${linearProgressClasses.colorPrimary}`]: {
						backgroundColor: grey[200],
					},
				},
				bar: {
					borderRadius: 5,
				},
				barColorPrimary: {
					backgroundColor: '#A0E859',
				},
			},
		},
	}
});