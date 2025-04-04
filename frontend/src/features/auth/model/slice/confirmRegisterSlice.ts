import { createSlice } from '@reduxjs/toolkit';
import { confirmRegister } from '../services/confirmRegister';

interface ConfirmState {
	loading: boolean;
	error: Record<string, string> | null;
	user: any,
}

const initialState: ConfirmState = {
	loading: false,
	error: null,
	user: null,
};

const confirmSlice = createSlice({
	name: 'confirm',
	initialState,
	reducers: {
		clearConfirmError(state) {
			state.error = null;
			state.user = null;
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(confirmRegister.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(confirmRegister.fulfilled, (state, action) => {
				state.loading = false;
				state.user = action.payload;
			})
			.addCase(confirmRegister.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload as Record<string, string>;
			});
	},
});

export const { clearConfirmError } = confirmSlice.actions;
export default confirmSlice.reducer;
