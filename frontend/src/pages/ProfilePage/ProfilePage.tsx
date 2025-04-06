import { Box } from '@mui/material';
import { drawerWidth, ProfileSidebar } from '@pages/ProfilePage/ui/ProfileSidebar';
import { ProfileHeader } from '@pages/ProfilePage/ui/ProfileHeader';
import { Outlet } from 'react-router';

export const ProfilePage = () => {
	return (
		<Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
			<ProfileHeader />
			<Box sx={{ display: 'flex', flexGrow: 1 }}>
				<ProfileSidebar />
				<Box
					sx={{
						flexGrow: 1,
						p: 2,
					}}
				>
					<Outlet />
				</Box>
			</Box>
		</Box>
	);
};
