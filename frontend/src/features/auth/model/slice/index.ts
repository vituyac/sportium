import { combineReducers } from '@reduxjs/toolkit';
import login from './loginSlice';
import vkLogin from './vkLoginSlice';
import register from './registerSlice';
import reset from './resetPasswordSlice';
import confirm from './confirmRegisterSlice';
import forgotPassword from './forgotPasswordSlice';
import resetPassword from './resetPasswordSlice';

export const authReducer = combineReducers({
	login,
	vkLogin,
	register,
	reset,
	confirm,
	forgotPassword,
	resetPassword
});
