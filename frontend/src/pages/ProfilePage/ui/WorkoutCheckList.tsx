import {WorkoutBlock} from './WorkoutBlock';
import {PlanResponse, Workout} from '../model/types';
import {markDone} from '../api/markDone';
import {useEffect, useState} from 'react';
import {BlockView} from '@pages/ProfilePage/ui/BlockView.tsx';
import {LinearProgress, Stack, Typography} from '@mui/material';

type Props = {
	workouts: Workout[];
	progress: number;
	onUpdate: (plan: PlanResponse) => void;
};

export const WorkoutCheckList = ({ workouts, progress, onUpdate }: Props) => {
	const [localWorkouts, setLocalWorkouts] = useState(workouts);

	useEffect(() => {
		setLocalWorkouts(workouts);
	}, [workouts]);

	const handleToggle = async (id: number) => {
		try {
			const updated = await markDone(id, 'task');

			// @ts-ignore
			setLocalWorkouts(updated.plan.workout);
			onUpdate(updated);
		} catch {
			console.error('Ошибка при отметке task');
		}
	};

	return (
		<BlockView>
			<Stack spacing={2}>
				<Typography fontWeight="bold">Тренировка на сегодня</Typography>
				<LinearProgress variant="determinate" value={progress} />
				<Stack spacing={1}>
					{localWorkouts.map((w, idx) => (
						<Stack key={idx} spacing={1}>
							<Typography fontWeight="medium">{w.category}</Typography>
							{w.tasks.map(task => (
								<WorkoutBlock
									key={task.id}
									title={`${task.task} — ${task.burned_calories} ккал`}
									checked={task.is_done}
									onChange={() => handleToggle(task.id)}
								/>
							))}
						</Stack>
					))}
				</Stack>
			</Stack>
		</BlockView>
	);
};
