import { configureStore } from '@reduxjs/toolkit';
import { userReducer } from '@entities/User/model/slices';
import { authReducer } from '@features/auth/model/slice';
import { NavigateFunction } from 'react-router';

type ExtraArg = {
	navigate: NavigateFunction;
};

// делаем глобальный extraArg, чтобы потом можно было "вживить" navigate
export const extraArg: ExtraArg = {
	navigate: () => {}, // ← заглушка
};

export const createStore = (navigate?: NavigateFunction) => {
	if (navigate) {
		extraArg.navigate = navigate;
	}

	return configureStore({
		reducer: {
			user: userReducer,
			auth: authReducer,
		},
		middleware: (getDefaultMiddleware) =>
			getDefaultMiddleware({
				thunk: {
					extraArgument: extraArg,
				},
			}),
	});
};

export type RootState = ReturnType<ReturnType<typeof createStore>['getState']>;
export type AppDispatch = ReturnType<typeof createStore>['dispatch'];
