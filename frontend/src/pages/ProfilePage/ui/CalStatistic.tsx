import {Grid, Stack, Typography} from '@mui/material';

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
						<Typography variant={'h6'} color={'blackColor.main'}>{received} ккал</Typography>
						<Typography variant={'body2'} color={'blackColor.main'}>Получено за <br/> неделю</Typography>
					</Stack>
				</Grid>
				<Grid size={4}>
					<Stack>
						<Typography variant={'h6'} color={'blackColor.main'}>{burned} ккал</Typography>
						<Typography variant={'body2'} color={'blackColor.main'}>Ккал <br/> потрачено</Typography>
					</Stack>
				</Grid>
				<Grid size={4}>
					<Stack>
						<Typography variant={'h6'} color={'secondary.dark'}>+{delta} ккал</Typography>
						<Typography variant={'body2'} color={'blackColor.main'}>Ккал <br/> Набрано</Typography>
					</Stack>
				</Grid>
			</Grid>
		</>
	);
};
