export interface User {
	id: string;
	username: string;
	email: string;
	image: string;
}

export interface UserSchema {
	authData?: User;
}
