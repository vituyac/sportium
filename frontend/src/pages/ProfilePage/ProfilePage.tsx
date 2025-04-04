import {Box} from '@mui/material';
import {Outlet} from 'react-router';
import {ProfileSidebar} from '@pages/ProfilePage/ui/ProfileSidebar.tsx';

export const ProfilePage = () => {
	return (
		<Box>
			<ProfileSidebar/>
			<Outlet />
		</Box>
	);
};
