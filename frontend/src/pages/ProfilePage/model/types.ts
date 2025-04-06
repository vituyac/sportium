export const mealTypeMap: Record<string, string> = {
	breakfast_1: 'Первый завтрак',
	breakfast_2: 'Второй завтрак',
	lunch: 'Обед',
	snack: 'Перекус',
	dinner: 'Ужин'
};


export type Meal = {
	id: number;
	dish: string;
	calories: number;
	is_done: boolean;
};

export type WorkoutTask = {
	id: number;
	task: string;
	burned_calories: number;
	is_done: boolean;
};

export type Workout = {
	category: string;
	tasks: WorkoutTask[];
};

export type CaloriesSummary = {
	received: number;
	burned: number;
	delta: number;
};

export type DayPlan = {
	meals: {
		[mealType: string]: Meal[];
	};
	workout: Workout[];
	calories_summary: CaloriesSummary;
};

export type PlansResponse =
	| { detail: string }
	| { weekly_plan: { [day: string]: DayPlan } };

export type PlanResponse =
	| { detail: string }
	| {
	day: string;
	date: string;
	plan: DayPlan;
	progress: {
		meals: number;
		workout: number;
	};
};

