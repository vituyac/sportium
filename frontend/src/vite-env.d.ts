declare module '@mui/material/styles' {
	interface Theme {
		customPalette: {
			gradientMain: string;
			gradientSecondary: string;
		};
	}
	interface ThemeOptions {
		customPalette?: {
			gradientMain?: string;
			gradientSecondary?: string;
		};
	}

	interface Palette {
		contentColor: {
			head: string;
			body: string;
			secondary: string;
		};
		blackColor: {
			main: string;
		};
	}

	interface PaletteOptions {
		contentColor?: {
			head?: string;
			body?: string;
			secondary?: string;
		};
		blackColor?: {
			main?: string;
		};
	}
}
