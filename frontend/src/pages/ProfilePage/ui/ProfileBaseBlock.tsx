import {Avatar, Grid, Stack, Typography} from '@mui/material';
import {useSelector} from 'react-redux';
import {getUserAuthData} from '@entities/User/model/selectors.ts';

export const ProfileBaseBlock = () => {
	const authData = useSelector(getUserAuthData);

	return (
		<>
			<Grid container direction={'row'} sx={{alignItems: 'center'}} spacing={2}>
				<Grid size={4} sx={{justifyContent: 'center', display: 'flex'}}>
					<Avatar alt="Remy Sharp" src={ authData?.image } sx={{width: '80px', height: '80px'}} />
				</Grid>
				<Grid size={8}>
					<Stack spacing={1}>
						<Typography fontWeight={'bold'} variant={'h6'}>{authData?.first_name} {authData?.last_name}</Typography>
						<Typography>{authData?.date_of_birth ? authData?.date_of_birth : 'xx.xx.xxxx'}</Typography>
					</Stack>
				</Grid>
			</Grid>
		</>
	);
};
