import {createTheme} from '@mui/material/styles';

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