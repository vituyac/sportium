import { createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '@shared/api';

export const confirmRegister = createAsyncThunk(
	'auth/confirm-register',
	async (confirmRegisterData: { email: string, code: string }, thunkAPI) => {
		try {
			const response = await api.post('/users/register/confirm/?lang=${i18next.language}', confirmRegisterData);
			console.log(response);
			return response.data;
		} catch (e: any) {
			console.log(e.response);
			return thunkAPI.rejectWithValue(e.response.data);
		}
	}
);
