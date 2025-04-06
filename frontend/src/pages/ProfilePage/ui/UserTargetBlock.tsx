import {Stack, Typography, useTheme} from '@mui/material';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import {BlockView} from '@pages/ProfilePage/ui/BlockView.tsx';
import {useSelector} from 'react-redux';
import {getUserAuthData} from '@entities/User/model/selectors.ts';

export const UserTargetBlock = () => {
	const theme = useTheme();
	const authData = useSelector(getUserAuthData);

	return (
		<>
			<BlockView sx={{borderColor: theme.palette.secondary.dark}}>
				<Stack direction={'row'} spacing={1} sx={{alignItems:'center'}}>
					<RocketLaunchIcon sx={{ color: theme.palette.secondary.dark }} />
					<Stack>
						<Typography variant={'body1'}>Моя цель:</Typography>
						<Typography variant={'body2'}>{authData?.training_goal ? authData.training_goal : 'Нет цели'}</Typography>
					</Stack>
				</Stack>
			</BlockView>
		</>
	);
};
