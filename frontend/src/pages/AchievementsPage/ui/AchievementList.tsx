import {Grid} from '@mui/material';
import {AchievementItem} from './AchievementItem';

const data = [
	{
		name: 'Клименко Никита',
		birthDate: '02.04.2005',
		age: 20,
		goal: 'Набрать мышечную массу и подтянуть тело',
		images: ['/images/nikita1.png'], // путь к картинке
		date: '05.04.2025',
	},
	{
		name: 'Кистерёв Виктор',
		birthDate: '23.02.2005',
		age: 20,
		goal: 'Набрать мышечную массу',
		images: ['/images/viktor1.png'],
		date: '05.04.2025',
	},
	{
		name: 'Чупахин Дмитрий',
		birthDate: '08.11.2004',
		age: 21,
		goal: 'Не потерять набранную форму',
		images: ['/images/dmitriy1.png', '/images/dmitriy2.png'],
		date: '05.04.2025',
	},
];

export const AchievementList = () => {
	return (
		<Grid container spacing={4} padding={4}>
			{data.map((item, index) => (
				<Grid key={index}>
					<AchievementItem {...item} />
				</Grid>
			))}
		</Grid>
	);
};
