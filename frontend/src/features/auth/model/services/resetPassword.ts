import { createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '@shared/api';

export const resetPassword = createAsyncThunk(
	'auth/resetPassword',
	async (resetPasswordData: {email: string, code: string, password: string, confirm: string },  thunkAPI) => {
		try {
			const response = await api.post('/users/reset-password/', resetPasswordData );
			return response.data;
		} catch (e: any) {
			return thunkAPI.rejectWithValue(e.response.data);
		}
	}
);
