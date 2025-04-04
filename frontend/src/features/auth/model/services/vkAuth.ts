import {useAppDispatch} from '@shared/lib/hooks';
import {useNavigate} from 'react-router';
import {vkLogin} from '@features/auth/model/services/vkLogin';
import * as VKIDSDK from '@vkid/sdk';

export const initVKAuth = () => {
	VKIDSDK.Config.init({
		app: 53363269,
		redirectUrl: window.location.origin,
		responseMode: VKIDSDK.ConfigResponseMode.Callback,
		source: VKIDSDK.ConfigSource.LOWCODE,
		scope: 'email',
	});
};

export const useVKLoginHandler = () => {
	const dispatch = useAppDispatch();
	const navigate = useNavigate();

	const handleLogin = async (): Promise<void> => {
		try {

			// @ts-ignore
			const { code, device_id } = await VKIDSDK.Auth.login();
			const res = await VKIDSDK.Auth.exchangeCode(code, device_id);
			console.log('VK токены:', res);

			// @ts-ignore
			const resultAction = await dispatch(vkLogin({ access_token: res.access_token }));

			if (vkLogin.fulfilled.match(resultAction)) {
				navigate('/');
			} else {
				throw new Error('VK login не прошёл');
			}
		} catch (error) {
			console.error('Ошибка авторизации VK:', error);
			throw error; // пробрасываем наружу
		}
	};

	return { handleLogin };
};