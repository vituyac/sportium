import {Container} from '@mui/material';
import {Outlet} from 'react-router';
import {ProfileSidebar} from '@pages/ProfilePage/ui/ProfileSidebar.tsx';
import {ProfileHeader} from '@pages/ProfilePage/ui/ProfileHeader.tsx';

export const ProfilePage = () => {
	return (
		<Container sx={{position: 'relative', overflow: 'hidden'}}>
			<ProfileHeader/>
			<ProfileSidebar/>
			<Outlet />
		</Container>
	);
};
