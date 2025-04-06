import {api} from '@shared/api';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { User } from '../../types';

export const fetchUserData = createAsyncThunk<User, void>(
	'user/fetchUserData',
	async (_, thunkAPI) => {
		try {
			const response = await api.get('/users/me/', { authRequired: true });
			return response.data;
		} catch (error: any) {
			return thunkAPI.rejectWithValue(error.response?.data || 'Unknown error');
		}
	}
);