import {Box, Card, CardContent, CardMedia, Stack, Typography, Button} from '@mui/material';

export interface AchievementItemProps {
	name: string;
	birthDate: string;
	age: number;
	goal: string;
	images: string[];
	date: string;
}

export const AchievementItem = ({ name, birthDate, age, goal, images, date }: AchievementItemProps) => {
	return (
		<Card sx={{ maxWidth: 345, backgroundColor: '#1e1e1e', color: '#fff', borderRadius: 4 }}>
			<CardContent>
				<Stack spacing={1}>
					<Typography variant="h6">{name}</Typography>
					<Typography variant="body2" color="gray">{birthDate} ({age} лет)</Typography>
					<Box sx={{ backgroundColor: '#2e2e2e', padding: 1, borderRadius: 2 }}>
						<Typography variant="body2">🎯 Цель: {goal}</Typography>
					</Box>
					<Stack direction="row" spacing={1}>
						{images.map((src, idx) => (
							<CardMedia
								key={idx}
								component="img"
								height="140"
								image={src}
								alt={`progress-${idx}`}
								sx={{ borderRadius: 2 }}
							/>
						))}
					</Stack>
					<Button variant="contained" color="success" fullWidth sx={{ mt: 2 }}>
						Посмотреть программу тренировок 💪
					</Button>
					<Typography variant="caption" color="gray" textAlign="right">
						Дата публикации: {date}
					</Typography>
				</Stack>
			</CardContent>
		</Card>
	);
};
