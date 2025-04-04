import { createSlice } from '@reduxjs/toolkit';
import { resetPassword } from '../services/resetPassword';

interface ResetState {
	loading: boolean;
	error: Record<string, string> | null;
	detail: string | null;
}

const initialState: ResetState = {
	loading: false,
	error: null,
	detail: null
};

const resetSlice = createSlice({
	name: 'reset',
	initialState,
	reducers: {
		clearResetError(state) {
			state.error = null;
			state.detail = null;
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(resetPassword.pending, (state) => {
				state.loading = true;
				state.error = null;
				state.detail = null;
			})
			.addCase(resetPassword.fulfilled, (state, action) => {
				state.loading = false;
				state.detail = action.payload;
			})
			.addCase(resetPassword.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload as Record<string, string>;
			});
	},
});

export const { clearResetError } = resetSlice.actions;
export default resetSlice.reducer;
