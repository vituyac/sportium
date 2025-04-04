import { createSlice } from '@reduxjs/toolkit';
import { login } from '../services/login';

interface LoginState {
	loading: boolean;
	error: Record<string, string> | null;
	user: any;
}

const initialState: LoginState = {
	loading: false,
	error: null,
	user: null,
};

const loginSlice = createSlice({
	name: 'login',
	initialState,
	reducers: {
		clearLoginError(state) {
			state.error = null;
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(login.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(login.fulfilled, (state, action) => {
				state.loading = false;
				state.user = action.payload;
			})
			.addCase(login.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload as Record<string, string>;
			});
	},
});

export const { clearLoginError } = loginSlice.actions;
export default loginSlice.reducer;
