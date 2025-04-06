export interface User {
	id: string;
	username: string;
	first_name: string;
	last_name: string;
	middle_name: string;
	date_of_birth: string;
	email: string;
	image: string;
	vk_id: string;
	height: number;
	weight: number;
	training_goal: string;
	gender: string;
}

export interface UserSchema {
	authData?: User;
	isLoading?: boolean;
}
