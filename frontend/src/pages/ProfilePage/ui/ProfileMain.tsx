import {Grid} from '@mui/material';
import {ProfileData} from '@pages/ProfilePage/ui/ProfileData.tsx';
import {WorkoutCheckList} from '@pages/ProfilePage/ui/WorkoutCheckList.tsx';
import {DietCheckList} from '@pages/ProfilePage/ui/DietCheckList.tsx';
import {useEffect, useState} from 'react';
import {DayPlan, PlanResponse} from '@pages/ProfilePage/model/types.ts';
import {fetchPlan} from '@pages/ProfilePage/api/fetchDayPlan.ts';

export const ProfileMain = () => {
	const [plans, setPlan] = useState<DayPlan | null>(null);
	const [progress, setProgress] = useState<{ meals: number; workout: number }>({ meals: 0, workout: 0 });
	const [setDetail] = useState<string>('');

	useEffect(() => {
		const getPlan = async () => {
			try {
				const data: PlanResponse = await fetchPlan();

				if ('detail' in data) {
					// @ts-ignore
					setDetail(data.detail);
					setPlan(null);
					setProgress({ meals: 0, workout: 0 });
				} else {
					setPlan(data.plan);
					setProgress(data.progress);
				}
			} catch (error) {
				console.error('Error fetching plans:', error);
			}
		};
		getPlan();
	}, []);

	const handlePlanUpdate = (updated: PlanResponse) => {
		if ('plan' in updated) {
			setPlan(updated.plan);
			setProgress(updated.progress);
		}
	};

	return (
		<Grid container sx={{p: 2}} spacing={2}>
			<Grid size={{
				lg: 4,
				md: 6,
				xs: 12
			}}>
				<ProfileData />
			</Grid>
			<Grid size={{
				lg: 4,
				md: 6,
				xs: 12
			}}>
				<WorkoutCheckList workouts={plans?.workout || []} progress={progress.workout} onUpdate={handlePlanUpdate} />
			</Grid>
			<Grid size={{
				lg: 4,
				md: 6,
				xs: 12
			}}>
				<DietCheckList
					meals={plans?.meals || {}}
					progress={progress.meals}
					onUpdate={handlePlanUpdate}
				/>
			</Grid>
		</Grid>
	);
}