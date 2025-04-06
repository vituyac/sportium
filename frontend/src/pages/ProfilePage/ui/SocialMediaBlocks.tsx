import {Grid, Typography} from '@mui/material';
import {SocialMediaBlock} from '@pages/ProfilePage/ui/SocialMediaBlock.tsx';
import AttachEmailIcon from '@mui/icons-material/AttachEmail';
import VkIcon from '@shared/assets/icons/vk.svg?react';
import {useSelector} from 'react-redux';
import {getUserAuthData} from '@entities/User/model/selectors.ts';

export const SocialMediaBlocks = () => {
	const authData = useSelector(getUserAuthData);

	return (
		<>
			<Typography>Мои контакты</Typography>
			<Grid container spacing={1}>
				<Grid size={12}>
					{authData?.vk_id ? (
						<SocialMediaBlock icon={VkIcon} title={'VK'} value={'@' + authData.vk_id}/>
					) : (
						<SocialMediaBlock icon={VkIcon} title={'VK'} value={'Не указан'}/>
					)}
				</Grid>
				<Grid size={12}>
					{authData?.email ? (
						<SocialMediaBlock icon={AttachEmailIcon} title={'Email'} value={authData.email}/>
					) : (
						<SocialMediaBlock icon={AttachEmailIcon} title={'Email'} value={'Не указан'}/>
					)}
				</Grid>
			</Grid>
		</>
	);
};
