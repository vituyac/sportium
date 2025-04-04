export const tokenService = {
	getAccessToken: () => localStorage.getItem('access_token'),
	getRefreshToken: () => localStorage.getItem('refresh_token'),

	setTokens: ({ access, refresh }: { access: string; refresh: string }) => {
		localStorage.setItem('access_token', access);
		localStorage.setItem('refresh_token', refresh);
	},

	clearTokens: () => {
		localStorage.removeItem('access_token');
		localStorage.removeItem('refresh_token');
	},

	setLogoutInProgress: () => localStorage.setItem('logout_in_progress', 'true'),
	clearLogoutInProgress: () => localStorage.removeItem('logout_in_progress'),
	isLogoutInProgress: () => localStorage.getItem('logout_in_progress') === 'true',
};
