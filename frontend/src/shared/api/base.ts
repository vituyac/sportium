import axios from 'axios';
import { tokenService } from '../lib/tokenService/tokenService.ts';

export const BACKEND_URL = 'https://crocodailo.ru'

export const api = axios.create({
	baseURL: `${BACKEND_URL}/api`,
	headers: {
		'Content-Type': 'application/json',
	},
});

// === Access Token ===
api.interceptors.request.use((config) => {
	const token = tokenService.getAccessToken();

	if (config.authRequired && token && config.headers) {
		config.headers.Authorization = `Bearer ${token}`;
	}

	return config;
});

// === Refresh Token ===
let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
	failedQueue.forEach((prom) => {
		if (error) {
			prom.reject(error);
		} else {
			prom.resolve(token);
		}
	});
	failedQueue = [];
};

api.interceptors.response.use(
	(response) => response,
	async (error) => {
		const originalRequest = error.config;

		if (error.response?.status === 401 && !originalRequest._retry) {
			if (isRefreshing) {
				return new Promise((resolve, reject) => {
					failedQueue.push({ resolve, reject });
				})
					.then((token) => {
						originalRequest.headers.Authorization = `Bearer ${token}`;
						return api(originalRequest);
					})
					.catch((err) => Promise.reject(err));
			}

			originalRequest._retry = true;
			isRefreshing = true;

			try {
				const refresh = tokenService.getRefreshToken();
				const res = await axios.post(
					`${api.defaults.baseURL}/users/refresh/`,
					{"test": "test"},
					{
						headers: {
							Authorization: `Bearer ${refresh}`,
						},
					}
				);
				console.log(res);
				const newAccess = res.data.access;
				const newRefresh = res.data.refresh;
				tokenService.setTokens({ access: newAccess, refresh: newRefresh });

				processQueue(null, newAccess);
				originalRequest.headers.Authorization = `Bearer ${newAccess}`;
				return api(originalRequest);
			} catch (err) {
				processQueue(err, null);
				tokenService.clearTokens();
				return Promise.reject(err);
			} finally {
				isRefreshing = false;
			}
		}

		return Promise.reject(error);
	}
);
