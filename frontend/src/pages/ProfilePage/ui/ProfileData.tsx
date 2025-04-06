import {Stack} from '@mui/material';
import {BlockView} from '@pages/ProfilePage/ui/BlockView.tsx';
import {ProfileBaseBlock} from '@pages/ProfilePage/ui/ProfileBaseBlock.tsx';
import {UserTargetBlock} from '@pages/ProfilePage/ui/UserTargetBlock.tsx';
import {SocialMediaBlocks} from '@pages/ProfilePage/ui/SocialMediaBlocks.tsx';
import {UserValueBlocks} from '@pages/ProfilePage/ui/UserValueBlocks.tsx';

export const ProfileData = () => {
	return (
		<>
			<BlockView>
				<Stack spacing={2}>
					<ProfileBaseBlock/>
					<UserTargetBlock/>
					<UserValueBlocks/>
					<SocialMediaBlocks/>
				</Stack>
			</BlockView>
		</>
	);
};
