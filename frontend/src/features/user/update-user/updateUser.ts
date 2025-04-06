import { createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '@shared/api';
import { userActions } from '@entities/User/model/slices';
import { fetchUserData } from '@entities/User/model/services/fetchUserData';
import {User} from '@entities/User/types.ts';
import {tokenService} from '@shared/lib/tokenService/tokenService.ts';

export const updateUserData = createAsyncThunk(
	'user/updateUserData',
	async (data: Partial<User>, thunkAPI) => {
		try {
			const response = await api.put('/users/me/', data, {
				authRequired: true,
			});

			thunkAPI.dispatch(userActions.setAuthData(response.data));

			tokenService.setTokens({
				access: response.data.access,
			});

			await thunkAPI.dispatch(fetchUserData());

			return response.data;
		} catch (e: any) {
			console.error('Ошибка при обновлении пользователя', e.response);
			return thunkAPI.rejectWithValue(e.response?.data || 'Ошибка обновления');
		}
	}
);
