import {Link as RouterLink} from 'react-router';
import {Link, Stack, Typography} from '@mui/material';
import Logo from '@shared/assets/icons/Logo.svg?react';

export const LogoLink = () => {
	return (
		<Link
			underline="none"
			component={RouterLink}
			to='/'>
			<Stack direction={'row'} sx={{alignItems: 'center', gap: 1}}>
				<Logo/>
				<Typography sx={{fontWeight: 'bold'}}>SPORTIUM</Typography>
			</Stack>
		</Link>
		)
}