import {createAsyncThunk} from '@reduxjs/toolkit';
import {api} from '@shared/api';
import {userActions} from '@entities/User/model/slices';
import {tokenService} from '@shared/lib/tokenService/tokenService.ts';
import {fetchUserData} from '@entities/User/model/services/fetchUserData.ts';

export const vkLogin = createAsyncThunk(
	'auth/vkLogin',
	async ({ access_token }: { access_token: string }, thunkAPI) => {
		try {
			const response = await api.post('/users/login/vk/?lang=${i18next.language}', { access_token });
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
