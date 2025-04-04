import { createSlice } from '@reduxjs/toolkit';
import { vkLogin } from '../services/vkLogin';

interface VkLoginSliceState {
	loading: boolean;
	error: Record<string, string> | null;
	user: any;
}

const initialState: VkLoginSliceState = {
	loading: false,
	error: null,
	user: null,
};

const vkLoginSlice = createSlice({
	name: 'login',
	initialState,
	reducers: {
		clearLoginError(state) {
			state.error = null;
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(vkLogin.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(vkLogin.fulfilled, (state, action) => {
				state.loading = false;
				state.user = action.payload;
			})
			.addCase(vkLogin.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload as Record<string, string>;
			});
	},
});

export const { clearLoginError } = vkLoginSlice.actions;
export default vkLoginSlice.reducer;
