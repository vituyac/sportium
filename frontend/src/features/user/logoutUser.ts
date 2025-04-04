import { createAsyncThunk } from '@reduxjs/toolkit';
import { tokenService } from '@shared/lib/tokenService/tokenService';
import { userActions } from '@entities/User/model/slices';
import { NavigateFunction } from 'react-router';

interface ThunkExtra {
	navigate: NavigateFunction;
}

export const logoutUser = createAsyncThunk<void, void, { extra: ThunkExtra }>(
	'user/logout',
	async (_, thunkAPI) => {
		const { navigate } = thunkAPI.extra;

		tokenService.setLogoutInProgress();
		tokenService.clearTokens();
		thunkAPI.dispatch(userActions.clearAuthData());
		navigate('/auth/login');
	}
);
