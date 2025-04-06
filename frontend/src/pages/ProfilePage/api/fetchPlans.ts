import { PlansResponse } from '../model/types';
import {api} from '@shared/api';

export const fetchPlans = async (week: 'this' | 'next'): Promise<PlansResponse> => {
	const response = await api.post<PlansResponse>(
		'/assistant/plan/',
		{ week },
		{ authRequired: true }
	);
	return response.data;
};
