import {PlanResponse} from '../model/types';
import {api} from '@shared/api';

export const fetchPlan = async (): Promise<PlanResponse> => {
	const response = await api.post<PlanResponse>(
		'/assistant/plan/today/',
		{ week: 'this' },
		{ authRequired: true }
	);
	console.log(response);
	return response.data;
};
