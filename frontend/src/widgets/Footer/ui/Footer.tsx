import {Box, Container, Grid, IconButton, Stack, Typography, useTheme} from '@mui/material';
import TelegramIcon from '@mui/icons-material/Telegram';
import GitHubIcon from '@mui/icons-material/GitHub';
import VkIcon from '@shared/assets/icons/vk.svg?react';
import HandsHeart from '@shared/assets/images/hands-heart.svg?react';
import BackgroundFooter from '@shared/assets/images/footer-bg.png';
import {FeedbackForm} from '@features/feedback-form/ui/FeedbackForm.tsx';
import { useTranslation } from 'react-i18next';
import {LogoLink} from '@shared/ui/LogoLink/LogoLink.tsx';

export const Footer = () =>{
	const theme = useTheme();
	const { t } = useTranslation();
	return (
		<Box sx={{
			boxShadow: `0px 0px 10px ${theme.palette.secondary.main}`,
			borderTopRightRadius: 32,
			borderTopLeftRadius: 32,
			overflow: 'hidden'
		}}>
			<Container sx={{py: 4, position: 'relative', }}>
				<Box
					sx={{
						position: 'absolute',
						top: '0%',
						left: 0,
						width: '100%',
						height: '100%',
						backgroundSize: '120% auto',
						backgroundImage: `url(${BackgroundFooter})`,
						backgroundRepeat: 'no-repeat',
						zIndex: -1,
					}}
				/>
				<Grid container spacing={4}>
					<Grid size={{xs: 12, sm: 7}}>
						<Stack spacing={2}>
							<LogoLink/>
							<Typography>{t("Данный проект разработан студентами ЛГТУ в рамках хакатона в образовательных и исследовательских целях.")}</Typography>
							<Typography>{t("Связь с нами:")} </Typography>
							<Stack direction="row" spacing={2}>
								<IconButton color={'primary'}>
									<TelegramIcon/>
								</IconButton>
								<IconButton color={'primary'}>
									<GitHubIcon/>
								</IconButton>
								<IconButton color={'primary'}>
									<VkIcon height={'24px'} width={'24px'} fill={ theme.palette.primary.main }/>
								</IconButton>
							</Stack>
							<Typography>{t("© 2025 LOGO. Разработано студентами ЛГТУ")}</Typography>
							<HandsHeart/>
						</Stack>
					</Grid>
					<Grid size={{xs: 12, sm: 5}}>
						<FeedbackForm />
					</Grid>
				</Grid>
			</Container>
		</Box>
	);
};
