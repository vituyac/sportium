import React from 'react';
import {Box, Button, Container, Grid, Stack, Typography} from '@mui/material';
import greenCloudBottom from '@shared/assets/images/green-cloud2.png';
import greenCloudTop from '@shared/assets/images/green-cloud.png';
import GroupLines from '@shared/assets/images/group-lines.svg?react';
import SportItemSvg from '@shared/assets/images/sport-item.svg?react';
import SportWomenSvg from '@shared/assets/images/sport-women.svg?react';
import {useTranslation} from 'react-i18next';
import BoltIcon from '@mui/icons-material/Bolt';

type HeroProps = {
	onScrollDown?: () => void;
};

export const Hero: React.FC<HeroProps> = ({ onScrollDown }) => {
	const { t } = useTranslation();

	return (
		<Box sx={{
			position: 'relative',
			overflow: 'hidden'
		}}>
			<Box sx={{
				position: 'absolute',
				height: '100vh',
				width: '100%',
			}}>
				<Box
					sx={{
						position: 'absolute',
						top: 0,
						left: 0,
						width: '100%',
						height: '100%',
						backgroundSize: '100% 400%',
						backgroundImage: `url(${greenCloudBottom})`,
						backgroundRepeat: 'no-repeat',
						zIndex: -1,
					}}
				/>
				<Box
					sx={{
						position: 'absolute',
						top: 0,
						left: 0,
						width: '100%',
						height: '100%',
						backgroundSize: '100% auto',
						backgroundImage: `url(${greenCloudTop})`,
						backgroundRepeat: 'no-repeat',
						zIndex: -1,
					}}
				/>
				<GroupLines style={{position: 'absolute', width: '50%', height: '100%'}}/>
			</Box>
			<Container sx={(theme) => ({
				position: 'relative',
				zIndex: 2,
				height: '100vh',
				'&::after': {
					content: '""',
					position: 'absolute',
					bottom: 0,
					left: 0,
					width: '100%',
					height: '1px',
					backgroundColor: theme.palette.secondary.main,
					zIndex: 10,
				},
			})}>
				<Grid  container sx={{
					height: '100vh',
				}}>
					<Grid size={{xs: 12, sm: 6}} sx={{
						display: 'flex',
						flexDirection: 'column',
						justifyContent: 'center',
						position: 'relative'
					}}>
						<Stack spacing={4} sx={{position: 'absolute', top: '41%'}}>
							<Typography variant={'h4'} color={'primary'}>{t("Sportium - твой персональный гид в мире фитнеса")}</Typography>
							<Typography color={'primary'}>{t("Ты ставишь цель — мы выдаём готовую программу на неделю. Тренировки, питание, рекомендации — всё под тебя и без лишних заморочек. Регистрируйся и начинай путь к лучшей версии себя!")}</Typography>
							<Button onClick={onScrollDown} disableElevation variant={'contained'} color={'primary'} sx={{ alignSelf: 'flex-start' }} endIcon={<BoltIcon />}>{t("Подробнее")}</Button>
						</Stack>
					</Grid>
					<Grid size={6} sx={{
						display: {
							xs: 'none',
              sm: 'flex'
						},
						flexDirection: 'column',
						alignItems: 'center',
						justifyContent: 'center',
						height: '100%',
						position: 'relative',
					}}>
						<SportWomenSvg style={{ position: 'absolute',
							maxWidth: 'auto',
							height: '100%',
							zIndex: -1
						}} />
						<SportItemSvg style={{ position: 'absolute',
							top: '5%',
							maxWidth: 'auto',
							height: '80%',
							zIndex: -2
						}}/>
					</Grid>
				</Grid >
			</Container>
		</Box>
	)
}
