import {BrowserRouter, Route, Routes, useNavigate} from 'react-router';
import {Provider} from 'react-redux';
import {createStore, extraArg} from '@app/providers/StoreProvider/config/store';
import {HomePage} from '@pages/HomePage';
import {AuthPage} from '@pages/AuthPage';
import {ProfilePage} from '@pages/ProfilePage';
import {ProfileMain} from '@pages/ProfilePage/ui/ProfileMain';
import {AuthProvider} from '@app/providers/AuthProvider/ui/AuthProvider.tsx';
import {ThemeProvider} from '@app/providers/ThemeProvider';
import {useEffect} from 'react';
import {WorkoutPlans} from '@pages/ProfilePage/ui/WorkoutPlans.tsx';
import {AchievementsPage} from '@pages/AchievementsPage/AchievementsPage.tsx';

const store = createStore();

export const AppRouter = () => (
	<BrowserRouter>
		<InjectNavigate />
	</BrowserRouter>
);

const InjectNavigate = () => {
	const navigate = useNavigate();

	useEffect(() => {
		extraArg.navigate = navigate;
	}, [navigate]);

	return (
		<Provider store={store}>
			<ThemeProvider>
				<AuthProvider>
					<Routes>
						<Route path="/auth/:mode" element={<AuthPage />} />
						<Route path="/" element={<HomePage />} />
						<Route path="/achievements" element={<AchievementsPage />} />
						<Route path="/profile" element={<ProfilePage />}>
							<Route index element={<ProfileMain />} />
							<Route path="personal-plan" element={<WorkoutPlans />} />
						</Route>
					</Routes>
				</AuthProvider>
			</ThemeProvider>
		</Provider>
	);
};
