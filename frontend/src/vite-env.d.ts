/// <reference types="vite/client" />
/// <reference types="vite-plugin-svgr/client" />

declare module '@fontsource-variable/source-code-pro';

declare module '*.svg' {
	import * as React from 'react';
	export const ReactComponent: React.FC<React.SVGProps<SVGSVGElement>>;
	const src: string;
	export default src;
}
import '@mui/material/styles';
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
	}

	interface PaletteOptions {
		contentColor?: {
			head?: string;
			body?: string;
			secondary?: string;
		};
	}
}

declare module 'axios' {
	interface AxiosRequestConfig {
		authRequired?: boolean;
	}
}