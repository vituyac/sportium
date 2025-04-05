import React from 'react';
import {Box, Button, Typography, useTheme} from '@mui/material';
import {AuthMode} from './AuthPanel';
import { useTranslation } from 'react-i18next';

interface AuthSwitcherProps {
	mode: AuthMode;
	onModeChange: (mode: AuthMode) => void;
}

const AuthSwitcher: React.FC<AuthSwitcherProps> = ({ mode, onModeChange }) => {
	const { t } = useTranslation();
	const handleClick = () => {
		onModeChange(mode !== 'register' ? 'register' : 'login');
	};

	const title = mode !== 'register' ? t('Добро пожаловать!') : t('С возвращением!');
	const description = mode !== 'register'
		? t('Для доступа к системе пройдите быструю регистрацию. Это откроет все функции и возможности сервиса.')
		: t('Если вы уже с нами, просто войдите в свой аккаунт. Если нет — самое время зарегистрироваться!');
	const buttonText = mode !== 'register' ? t('Регистрация') : t('Войти');
	const theme = useTheme();

	return (
		<Box
			sx={{
				width: {
					xs: '100%',
					sm: '50%'
				},
				height: {
					xs: '10%',
					sm: '100%'
				},
				zIndex: 2,
				background: theme.customPalette.gradientMain,
				position: {
					xs: 'relative',
					sm: 'absolute'
				},
				right: {
					sm: mode === 'login' ? 0 : mode === 'register' ? '50%' : 0, // Логика позиционирования
				},
				transition: {
					sm: 'right 0.5s'
				},
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
				justifyContent: 'center',
				textAlign: 'center',
				padding: {
					xs: 2,
					sm: 4,
					md: 6,
					lg: 8
				},
				gap: 2
			}}
		>
			<Typography variant={'h4'}
			            sx={{
										fontWeight: 'bold',
				            display: {
											xs: 'none',
                      sm: 'block'
				            }
			            }}
			>{title}</Typography>
			<Typography sx={{
				display: {
					xs: 'none',
					sm: 'block'
				}
			}}>{description}</Typography>
			<Button onClick={handleClick} variant="outlined" color={'primary'} fullWidth>
				{buttonText}
			</Button>
		</Box>
	);
};

export default AuthSwitcher;
