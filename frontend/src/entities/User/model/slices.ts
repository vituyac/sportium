import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {User, UserSchema} from '../types';

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
		}
	},
});

export const { actions: userActions } = userSlice;
export const { reducer: userReducer } = userSlice;