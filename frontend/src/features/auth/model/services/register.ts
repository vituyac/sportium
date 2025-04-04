import { createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '@shared/api';

export const register = createAsyncThunk(
	'auth/register',
	async (userData: { username: string, email: string; password: string; confirm: string }, thunkAPI) => {
		try {
			const response = await api.post('/users/register/', userData);
			console.log(response);
			return response.data;
		} catch (e: any) {
			console.log(e.response);
			return thunkAPI.rejectWithValue(e.response.data);
		}
	}
);
