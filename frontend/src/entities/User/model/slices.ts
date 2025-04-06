import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {User, UserSchema} from '../types';
import {fetchUserData} from '@entities/User/model/services/fetchUserData.ts';

const initialState: UserSchema = {};

const userSlice = createSlice({
	name: 'user',
	initialState,
	reducers: {
		setAuthData: (state, action: PayloadAction<User>) => {
			state.authData = action.payload;
			console.log(state.authData);
		},
		clearAuthData: (state) => {
			state.authData = undefined;
		},
	},
	extraReducers: (builder) => {
		builder.addCase(fetchUserData.fulfilled, (state, action) => {
			state.authData = action.payload;
			state.isLoading = false;
		});
		builder.addCase(fetchUserData.pending, (state) => {
			state.isLoading = true;
		});
		builder.addCase(fetchUserData.rejected, (state, action) => {
			state.authData = undefined;
			state.isLoading = false;
		});
	},
});

export const { actions: userActions } = userSlice;
export const { reducer: userReducer } = userSlice;