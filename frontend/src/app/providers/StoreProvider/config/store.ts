import { configureStore } from '@reduxjs/toolkit';
import { userReducer } from '@entities/User/model/slices';
import { authReducer } from '@features/auth/model/slice';
import { NavigateFunction } from 'react-router';

export const createStore = (navigate: NavigateFunction) =>
	configureStore({
		reducer: {
			user: userReducer,
			auth: authReducer,
		},
		middleware: (getDefaultMiddleware) =>
			getDefaultMiddleware({
				thunk: {
					extraArgument: { navigate },
				},
			}),
	});

export type RootState = ReturnType<ReturnType<typeof createStore>['getState']>;
export type AppDispatch = ReturnType<typeof createStore>['dispatch'];
