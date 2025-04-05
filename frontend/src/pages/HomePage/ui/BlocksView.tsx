import React from 'react';
import {Container, Typography} from '@mui/material';
import {useTranslation} from 'react-i18next';
import {BlockView} from '@widgets/BlockView/ui/BlockView.tsx';
import about1 from '@shared/assets/images/about1.svg?url';
import about2 from '@shared/assets/images/about2.svg?url';
import about3 from '@shared/assets/images/about3.svg?url';
import about4 from '@shared/assets/images/about4.svg?url';
import icon1 from '@shared/assets/icons/list-block.svg?react';
import icon2 from '@shared/assets/icons/profile-block.svg?react';
import icon3 from '@shared/assets/icons/zal-block.svg?react';
import icon4 from '@shared/assets/icons/sms-block.svg?react';

export const BlocksView: React.FC = () => {
	const { t } = useTranslation();

	const data = [
		{
			title: t('Умная персонализация'),
			imageUrl: about1,
			text: t('Зарегистрируйся и расскажи немного о себе: возраст, рост, вес и твоя цель — похудеть, набрать массу или просто поддерживать форму. Мы автоматически подберём программу, максимально подходящую именно тебе.'),
			icon: icon2,
		},
		{
			title: t('План на неделю без заморочек'),
			imageUrl: about3,
			text: t('Sportium создаст для вас детальный недельный план: какие упражнения необходимо выполнять, а так же рацион питания. Всё составляется индивидуально для достижения ваших целей без лишней рутины — просто следуй плану.'),
			icon: icon1,
		},
		{
			title: t('Управление планом с ИИ'),
			imageUrl: about4,
			text: t('Хочешь заменить сложное упражнение или не любишь гречку? Просто напиши об этом в чате — система учтёт пожелания, адаптирует рекомендации и сформирует новый план на неделю. Всё просто и удобно.'),
			icon: icon4,
		},
		{
			title: t('Вдохновляй и вдохновляйся результатами других'),
			imageUrl: about2,
			text: t('Прошёл весь план? Сбросил пару кило или прокачал выносливость? Поделись своим прогрессом с друзьями прямо из личного кабинета. Можно отправить ссылку на свой план, выложить фото результата или просто похвастаться, какой ты красавчик.'),
			icon: icon3,
		},
	]

	const blocks = data.map((item, index) => (
		<BlockView
			key={item.title}
			image={item.imageUrl}
			title={item.title}
			text={item.text}
			reverse={index % 2 === 0}
			icon={item.icon}
		/>
	));

	return (
		<Container sx={() => ({
			zIndex: 2,
			display: 'flex',
			flexDirection: 'column',
			gap: 4,
			pb: 4
		})}>
			<Typography color={'secondary.dark'} sx={{textAlign: 'center', fontWeight: 'bold'}} variant={'h4'}>{t("Что умеет Sportium?")}</Typography>
			{blocks}
		</Container>
	)
}