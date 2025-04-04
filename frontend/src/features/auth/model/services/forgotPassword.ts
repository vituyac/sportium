import { createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '@shared/api';

export const forgotPassword = createAsyncThunk(
	'auth/forgotPassword',
	async ({email} :{email: string}, thunkAPI) => {
		try {
			const response = await api.post('/users/forgot-password/', { email });
			return response.data;
		} catch (e: any) {
			return thunkAPI.rejectWithValue(e.response.data);
		}
	}
);
