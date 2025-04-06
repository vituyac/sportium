import {api} from '@shared/api';
import {PlanResponse} from '../model/types';

export const markDone = async (item_id: number, item_type: 'dish' | 'task'): Promise<PlanResponse> => {
	const response = await api.post<PlanResponse>(
		'/assistant/plan/mark-done/',
		{ item_id, item_type },
		{ authRequired: true }
	);
	return response.data;
};
