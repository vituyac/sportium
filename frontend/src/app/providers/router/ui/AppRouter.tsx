import { BrowserRouter, Routes, Route, useNavigate } from 'react-router';
import { Provider } from 'react-redux';
import { createStore } from '@app/providers/StoreProvider/config/store';
import { HomePage } from '@pages/HomePage';
import { AuthPage } from '@pages/AuthPage';
import { ProfilePage } from '@pages/ProfilePage';
import { ProfileMain } from '@pages/ProfilePage/ui/ProfileMain';
import { ProfileFavorites } from '@pages/ProfilePage/ui/ProfileFavorites';
import {AuthProvider} from '@app/providers/AuthProvider/ui/AuthProvider.tsx';
import {ThemeProvider} from '@app/providers/ThemeProvider';

export const AppRouter = () => {
	return (
		<BrowserRouter>
			<WithStore />
		</BrowserRouter>
	);
};

const WithStore = () => {
	const navigate = useNavigate();
	const store = createStore(navigate);

	return (
		<Provider store={store}>
			<ThemeProvider>
				<AuthProvider>
					<Routes>
						<Route path="/auth/:mode" element={<AuthPage />} />
						<Route path="/" element={<HomePage />} />
						<Route path="/profile" element={<ProfilePage />}>
							<Route index element={<ProfileMain />} />
							<Route path="favorite" element={<ProfileFavorites />} />
						</Route>
					</Routes>
				</AuthProvider>
			</ThemeProvider>
		</Provider>
	);
};
