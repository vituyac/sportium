import {StateSchema} from '@app/providers/StoreProvider/config/StateSchema.ts';

export const getUserAuthData = (state : StateSchema) => {
	return state.user.authData;
}
export const getUserLoadingData = (state : StateSchema) => {
	return state.user.isLoading;
}
