import {createTheme} from '@mui/material/styles';
import {linearProgressClasses} from '@mui/material/LinearProgress';
import {grey} from '@mui/material/colors';

export const darkTheme = createTheme({
	palette: {
		primary: {
			main: '#FEFFFC',
		},
		secondary: {
			main: '#B6FA64',
		},
		error:{
			main: '#D32F2F',
		},
		background: {
			default: '#181A1F',
		},
		blackColor: {
			main: '#191A24',
		}
	},
	customPalette: {
		gradientMain: 'linear-gradient(45deg, #3E5E24, #679740)',
		gradientSecondary: '',
	},
	shape: {
		borderRadius: 8,
	},
	typography: {
		fontFamily: `'Source Code Pro Variable', monospace`,
		allVariants: {
			color: '#FEFFFC',
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
		MuiTextField: {
			styleOverrides: {
				root: {
					'& .MuiInputBase-input': {
						color: '#FEFFFC',
					},
					'& .MuiInputLabel-root': {
						color: '#FEFFFC',
					},
					'& .MuiOutlinedInput-root': {
						'& fieldset': {
							borderColor: '#FEFFFC',
						},
						'&:hover fieldset': {
							borderColor: '#FEFFFC',
						},
						'&.Mui-focused fieldset': {
							borderColor: '#FEFFFC',
						},
					},
				},
			},
		},
	}
});