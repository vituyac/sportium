import { useContext, createContext } from 'react';

type ThemeMode = 'light' | 'dark';

export const ThemeContext = createContext<{
	mode: ThemeMode;
	toggleTheme: () => void;
}>({
	mode: 'light',
	toggleTheme: () => {},
});

export const useThemeContext = () => useContext(ThemeContext);

export const LOCAL_STORAGE_THEME_KEY = 'theme';