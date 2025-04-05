import React, {useEffect} from 'react';
import {Button} from '@mui/material';
import {initVKAuth, useVKLoginHandler} from '../../auth/model/services/vkAuth'
import { useTranslation } from 'react-i18next';

interface VKLoginButtonProps {
	onLoginSuccess: (data: any) => void;
	onLoginError: (error: any) => void;
}

export const VKLoginButton: React.FC<VKLoginButtonProps> = ({ onLoginSuccess, onLoginError }) => {
	const { t } = useTranslation();
	const { handleLogin } = useVKLoginHandler();

	useEffect(() => {
		initVKAuth();
	}, []);

	const handleClick = async () => {
		try {
			await handleLogin();
			onLoginSuccess(t('Успешный вход через VK')); // Можно передать любые данные
		} catch (error) {
			onLoginError(error);
		}
	};

	return (
		<Button
			variant="contained"
			color="primary"
			fullWidth
			disableElevation
			onClick={handleClick}
		>
			Войти с VK-ID
		</Button>
	);
};
