import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { tokenService } from '@shared/lib/tokenService/tokenService';
import { api } from '@shared/api/base';
import { userActions } from '@entities/User/model/slices';
import { LoadingPage } from '@pages/LoadingPage/LoadingPage';

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
	const dispatch = useDispatch();
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const initAuth = async () => {
			if (tokenService.isLogoutInProgress()) {
				tokenService.clearLogoutInProgress();
				setIsLoading(false);
				return;
			}

			const token = tokenService.getAccessToken();
			if (token) {
				try {
					const response = await api.get('/users/me/', { authRequired: true });
					dispatch(userActions.setAuthData(response.data));
				} catch {
					tokenService.clearTokens();
					dispatch(userActions.clearAuthData());
				}
			}
			setIsLoading(false);
		};

		initAuth();
	}, [dispatch]);

	if (isLoading) return <LoadingPage />;
	return <>{children}</>;
};