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
			title: 'Контент, который подстраивается под тебя',
			imageUrl: about1,
			text: 'Мы используем гибкий RAG-подход: упражнения и рецепты подбираются из базы, а затем ИИ соединяет их в осмысленный и структурированный план. Ты получаешь не просто список дел, а логичную стратегию тренировок и питания.',
			icon: icon1,
		},
		{
			title: 'Умная персонализация',
			imageUrl: about2,
			text: 'Зарегистрируйся и расскажи немного о себе: возраст, рост, вес и твоя цель — похудеть, набрать массу или просто поддерживать форму. Сайт автоматически подберёт программу, максимально подходящую именно тебе.',
			icon: icon2,
		},
		{
			title: 'План на неделю — без заморочек',
			imageUrl: about3,
			text: 'Sportium генерирует детальный недельный план: какие упражнения делать, что и когда есть, чтобы достичь своей цели. Всё составляется индивидуально и без лишней рутины — просто следуй плану.',
			icon: icon3,
		},
		{
			title: 'Живой диалог с ИИ',
			imageUrl: about4,
			text: 'Хочешь заменить упражнение или не любишь гречку? Просто напиши об этом в чате — система учтёт пожелания, адаптирует рекомендации и сформирует новый план на следующую неделю. Всё просто и удобно.',
			icon: icon4,
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
			<Typography color={'secondary'} sx={{textAlign: 'center', fontWeight: 'bold'}} variant={'h4'}>{t("Что умеет Sportium?")}</Typography>
			{blocks}
		</Container>
	)
}