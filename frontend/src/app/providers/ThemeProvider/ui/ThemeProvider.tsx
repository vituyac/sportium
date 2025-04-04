import React, {useMemo, useState} from 'react';
import {ThemeProvider as MUIThemeProvider} from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import {darkTheme, lightTheme} from '@shared/config/theme';
import {LOCAL_STORAGE_THEME_KEY, ThemeContext} from '@shared/lib/theme/useThemeContext.ts';
import {useMediaQuery} from '@mui/material';

interface ThemeProviderProps {
	children: React.ReactNode;
}

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
	const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)'); // всегда вызываем
	const storedTheme = localStorage.getItem(LOCAL_STORAGE_THEME_KEY) as 'light' | 'dark' | null;

	const initialTheme = storedTheme ?? (prefersDarkMode ? 'dark' : 'light');

	const [mode, setMode] = useState<'light' | 'dark'>(initialTheme);

	const theme = useMemo(() => (mode === 'light' ? lightTheme : darkTheme), [mode]);

	const toggleTheme = () => {
		setMode((prev) => {
			const newMode = prev === 'light' ? 'dark' : 'light';
			localStorage.setItem(LOCAL_STORAGE_THEME_KEY, newMode);
			return newMode;
		});
	};

	return (
		<ThemeContext.Provider value={{ mode, toggleTheme }}>
			<MUIThemeProvider theme={theme}>
				<CssBaseline />
				{children}
			</MUIThemeProvider>
		</ThemeContext.Provider>
	);
};
