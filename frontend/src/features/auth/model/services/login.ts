import {createAsyncThunk} from '@reduxjs/toolkit';
import {api} from '@shared/api';
import {userActions} from '@entities/User/model/slices';
import {tokenService} from '@shared/lib/tokenService/tokenService.ts';
import i18next from 'i18next';
import {fetchUserData} from '@entities/User/model/services/fetchUserData.ts';

export const login = createAsyncThunk(
	'auth/login',
	async ({ email, password }: { email: string; password: string }, thunkAPI) => {
		try {
			const response = await api.post(`/users/login/?lang=${i18next.language}`, { email, password });
			thunkAPI.dispatch(userActions.setAuthData(response.data));
			tokenService.setTokens({
				access: response.data.access,
				refresh: response.data.refresh,
			});
			await thunkAPI.dispatch(fetchUserData());
			console.log(response);
		} catch (e: any) {
			console.log(e.response);
			return thunkAPI.rejectWithValue(e.response.data);
		}
	}
);
