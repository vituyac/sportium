import {createAsyncThunk} from '@reduxjs/toolkit';
import {api} from '@shared/api';
import {userActions} from '@entities/User/model/slices';
import {fetchUserData} from '@entities/User/model/services/fetchUserData';

export const uploadUserAvatar = createAsyncThunk(
	'user/uploadUserAvatar',
	async (file: File, thunkAPI) => {
		try {
			const formData = new FormData();
			formData.append('file', file);

			const response = await api.post('/users/me/avatar/', formData, {
				authRequired: true,
				headers: {
					'Content-Type': 'multipart/form-data',
				},
			});

			thunkAPI.dispatch(userActions.setAuthData(response.data));

			await thunkAPI.dispatch(fetchUserData());

			return response.data;
		} catch (e: any) {
			console.error('Ошибка при загрузке аватара', e.response);
			return thunkAPI.rejectWithValue(e.response?.data || 'Ошибка загрузки аватара');
		}
	}
);
