import { IconButton, Tooltip } from '@mui/material';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import {useThemeContext} from '@shared/lib/theme/useThemeContext.ts';

export const ThemeSwitcher = () => {
	const { mode, toggleTheme } = useThemeContext();

	return (
		<Tooltip title="Изменить тему">
			<IconButton color="inherit" onClick={toggleTheme}>
				{mode === 'dark' ? <Brightness7Icon color={'secondary'} /> : <Brightness4Icon color={'primary'} />}
			</IconButton>
		</Tooltip>
	);
};
