import { createSlice } from '@reduxjs/toolkit';
import { forgotPassword } from '../services/forgotPassword';

interface ForgotPasswordState {
	loading: boolean;
	error: Record<string, string> | null;
	detail: any,
}

const initialState: ForgotPasswordState = {
	loading: false,
	error: null,
	detail: null,
};

const forgotPasswordSlice = createSlice({
	name: 'forgotPassword',
	initialState,
	reducers: {
		clearForgotPasswordError(state) {
			state.error = null;
			state.detail = null;
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(forgotPassword.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(forgotPassword.fulfilled, (state, action) => {
				state.loading = false;
				state.detail = action.payload;
			})
			.addCase(forgotPassword.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload as Record<string, string>;
			});
	},
});

export const { clearForgotPasswordError } = forgotPasswordSlice.actions;
export default forgotPasswordSlice.reducer;
