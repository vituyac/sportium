import React, { useState } from 'react';
import {
	Grid,
	Card,
	CardContent,
	Typography,
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	Button, Stack
} from '@mui/material';
import {mealTypeMap} from '@pages/ProfilePage/model/types.ts';
import {WorkoutBlock} from '@pages/ProfilePage/ui/WorkoutBlock.tsx';
import {CalStatistic} from '@pages/ProfilePage/ui/CalStatistic.tsx';

type Meal = {
	id: number;
	dish: string;
	calories: number;
	is_done: boolean;
};

type WorkoutTask = {
	id: number;
	task: string;
	burned_calories: number;
	is_done: boolean;
};

type Workout = {
	category: string;
	tasks: WorkoutTask[];
};

type CaloriesSummary = {
	received: number;
	burned: number;
	delta: number;
};

type DayPlan = {
	meals: {
		[mealType: string]: Meal[];
	};
	workout: Workout[];
	calories_summary: CaloriesSummary;
};

type WeeklyPlan = {
	[day: string]: DayPlan;
};

type WeeklyPlanGridProps = {
	weekly_plan: WeeklyPlan;
};

const weekDaysMap: Record<string, string> = {
	monday: 'Понедельник',
	tuesday: 'Вторник',
	wednesday: 'Среда',
	thursday: 'Четверг',
	friday: 'Пятница',
	saturday: 'Суббота',
	sunday: 'Воскресенье'
};

const WeeklyPlanGrid: React.FC<WeeklyPlanGridProps> = ({ weekly_plan }) => {
	const [selectedDay, setSelectedDay] = useState<{
		dayData: DayPlan;
		dayName: string;
	} | null>(null);

	const handleOpen = (dayData: DayPlan, dayName: string) => {
		setSelectedDay({ dayData, dayName });
	};

	const handleClose = () => {
		setSelectedDay(null);
	};

	return (
		<Grid container spacing={2}>
			{Object.entries(weekly_plan).map(([dayKey, dayData]) => (
				<Grid size={{
					xs: 12, sm:6, md:4
				}} key={dayKey}>
					<Card  elevation={5} onClick={() => handleOpen(dayData, weekDaysMap[dayKey])} sx={{ cursor: 'pointer', borderRadius: 2 }}>
						<CardContent>
							<Typography sx={{
								pb: 1,
								textAlign: 'center'
							}} color={'primary.dark'} variant="h6">{weekDaysMap[dayKey]}</Typography>
							<CalStatistic
								burned={dayData.calories_summary.burned}
								delta={dayData.calories_summary.delta}
								received={dayData.calories_summary.received}
							/>
						</CardContent>
					</Card>
				</Grid>
			))}

			<Dialog open={!!selectedDay} onClose={handleClose}>
				<DialogTitle>
					<Stack>
						<Typography color={'primary.dark'} sx={{pb: 1, textAlign: 'center'}} variant={'h5'}>{selectedDay?.dayName}</Typography>
						<CalStatistic
							burned={selectedDay?.dayData.calories_summary.burned ? selectedDay.dayData.calories_summary.burned : 0}
							delta={selectedDay?.dayData.calories_summary.delta ? selectedDay.dayData.calories_summary.delta : 0}
							received={selectedDay?.dayData.calories_summary.received ? selectedDay.dayData.calories_summary.received : 0}
						/>
					</Stack>
				</DialogTitle>
				<DialogContent dividers>
					{selectedDay && (
						<>
							<Typography color={'secondary.dark'} variant="h6" sx={{pb: 1, textAlign: 'center'}}>Приёмы пищи</Typography>
							{Object.entries(selectedDay.dayData.meals).map(([mealType, meals]) => (
								<Stack key={mealType} style={{ marginBottom: 10 }} spacing={1}>
									<Typography color={'primary.dark'} variant="subtitle1"><b>{mealTypeMap[mealType] || mealType}:</b></Typography>
									{meals.map((meal) => (
										<WorkoutBlock key={meal.id} checked={meal.is_done} title={`${meal.dish} — ${meal.calories} ккал`}/>
									))}
								</Stack>
							))}

							<Typography color={'secondary.dark'} variant="h6" sx={{pb: 1, textAlign: 'center'}}>Тренировки</Typography>
							{selectedDay.dayData.workout.map((work, idx) => (
								<Stack key={idx} style={{ marginBottom: 10 }} spacing={1}>
									<Typography color={'primary.dark'} variant="subtitle1"><b>{work.category}:</b></Typography>
									{work.tasks.map((task) => (
										<WorkoutBlock key={task.id} checked={task.is_done} title={`${task.task} — ${task.burned_calories} ккал`}/>
									))}
								</Stack>
							))}
						</>
					)}
				</DialogContent>
				<DialogActions>
					<Button onClick={handleClose}>Закрыть</Button>
				</DialogActions>
			</Dialog>
		</Grid>
	);
};

export default WeeklyPlanGrid;
