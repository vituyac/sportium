import {IconButton} from '@mui/material';
import {useThemeContext} from '@shared/lib/theme/useThemeContext.ts';
import {useTranslation} from 'react-i18next';
import LanguageIcon from '@shared/assets/icons/language.svg?react';
import LanguageRevertIcon from '@shared/assets/icons/language-revert.svg?react';

export const LangSwitcher = () => {
	const { mode } = useThemeContext();

	const { i18n } = useTranslation();

	const toggle = async () => {
		await i18n.changeLanguage(i18n.language === "ru" ? "en" : "ru");
	};

	return (
		<IconButton onClick={toggle} color={mode === 'light' ? 'primary': 'secondary'}>
			{
				i18n.language === "ru" ? (
					<LanguageIcon height="32px" width="32px" />
        ) : (
					<LanguageRevertIcon height="32px" width="32px" />
        )
			}
		</IconButton>
	)
}