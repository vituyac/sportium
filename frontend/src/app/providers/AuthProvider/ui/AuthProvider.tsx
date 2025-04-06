// AuthProvider.tsx (примерно)
import React, {useEffect} from 'react';
import {useAppDispatch} from '@shared/lib/hooks';
import {fetchUserData} from '@entities/User/model/services/fetchUserData';
import {LoadingPage} from '@pages/LoadingPage/LoadingPage';
import {useSelector} from 'react-redux';
import {getUserLoadingData} from '@entities/User/model/selectors.ts';

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
	const dispatch = useAppDispatch();
	const isLoading = useSelector(getUserLoadingData);

	useEffect(() => {
		dispatch(fetchUserData());
	}, [dispatch]);

	if (isLoading) {
		return <LoadingPage />;
	}

	return <>{children}</>;
};
