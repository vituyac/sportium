import React from 'react';
import {Stack, Typography} from '@mui/material';
import {BlockView} from '@pages/ProfilePage/ui/BlockView.tsx';

type UserValueBlockProps = {
	title: string | null,
	value: any,
	valueType: string | null,
};

export const UserValueBlock: React.FC<UserValueBlockProps> = ({ title, value, valueType }) => {

	return (
		<BlockView sx={{p: 1, alignItems: 'center', display: 'flex', width: '100%'}}>
			<Stack sx={{width: '100%'}}>
				<Typography variant={'body1'}>{title}</Typography>
				<Typography sx={{fontWeight: 'bold'}} variant={'body2'}>{value? value : 'Не указано'}</Typography>
				<Typography variant={'body2'}>{valueType}</Typography>
			</Stack>
		</BlockView>
	);
};
