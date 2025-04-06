import {Stack, Typography, LinearProgress} from '@mui/material';
import {BlockView} from './BlockView';
import {WorkoutBlock} from './WorkoutBlock';
import {Meal, mealTypeMap} from '../model/types';
import {useEffect, useState} from 'react';
import {markDone} from '../api/markDone';
import {PlanResponse} from '../model/types';

type Props = {
	meals: { [mealType: string]: Meal[] };
	progress: number;
	onUpdate: (plan: PlanResponse) => void;
};

export const DietCheckList = ({ meals, progress, onUpdate }: Props) => {
	const [localMeals, setLocalMeals] = useState(meals);

	useEffect(() => {
		setLocalMeals(meals);
	}, [meals]);

	const handleToggle = async (id: number) => {
		try {
			const updated = await markDone(id, 'dish');
			setLocalMeals(updated.plan.meals);
			onUpdate(updated);
		} catch (err) {
			console.error('Ошибка при отметке dish');
		}
	};

	return (
		<BlockView>
			<Stack spacing={2}>
				<Typography fontWeight={'bold'}>Питание на сегодня</Typography>
				<LinearProgress variant="determinate" value={progress} />
				<Stack spacing={1}>
					{Object.entries(localMeals).map(([mealType, dishes]) => (
						<Stack key={mealType} spacing={0.5}>
							<Typography fontStyle="italic">
								{mealTypeMap[mealType] || mealType}
							</Typography>
							{dishes.map(dish => (
								<WorkoutBlock
									key={dish.id}
									title={`${dish.dish} — ${dish.calories} ккал`}
									checked={dish.is_done}
									onChange={() => handleToggle(dish.id)}
								/>
							))}
						</Stack>
					))}
				</Stack>
			</Stack>
		</BlockView>
	);
};
