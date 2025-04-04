import { createSlice } from '@reduxjs/toolkit';
import { register } from '../services/register';

interface RegisterState {
	user: any;
	loading: boolean;
	error: Record<string, string> | null;
}

const initialState: RegisterState = {
	user: null,
	loading: false,
	error: null,
};

export const registerSlice = createSlice({
	name: 'register',
	initialState,
	reducers: {
		clearRegisterError(state) {
			state.error = null;
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(register.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(register.fulfilled, (state, action) => {
				state.loading = false;
				state.user = action.payload;
			})
			.addCase(register.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload as Record<string, string>;
			});
	},
});

export const { clearRegisterError } = registerSlice.actions;
export default registerSlice.reducer;
