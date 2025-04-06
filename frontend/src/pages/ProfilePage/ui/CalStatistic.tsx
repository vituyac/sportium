import {Grid, Stack, Typography, useTheme} from '@mui/material';
import {useSelector} from 'react-redux';
import {getUserAuthData} from '@entities/User/model/selectors.ts';
import React from 'react';

interface CalStatisticProps{
	received: number;
	burned: number;
	delta: number;
}

export const CalStatistic: React.FC<CalStatisticProps> = ({ burned, delta, received }) => {
	return (
		<>
			<Grid container sx={{textAlign: 'center'}}>
				<Grid size={4}>
					<Stack>
						<Typography variant={'h6'} color={'primary'}>{received} ккал</Typography>
						<Typography variant={'body2'} color={'primary'}>Получено за <br/> неделю</Typography>
					</Stack>
				</Grid>
				<Grid size={4}>
					<Stack>
						<Typography variant={'h6'} color={'primary'}>{burned} ккал</Typography>
						<Typography variant={'body2'} color={'primary'}>Ккал <br/> потрачено</Typography>
					</Stack>
				</Grid>
				<Grid size={4}>
					<Stack>
						<Typography variant={'h6'} color={'secondary.dark'}>+{delta} ккал</Typography>
						<Typography variant={'body2'} color={'primary'}>Ккал <br/> Набрано</Typography>
					</Stack>
				</Grid>
			</Grid>
		</>
	);
};
