export type User = {
	id: string;
	intraId: string;
	photoURL: string;
	username: string;
	displayName: string;
	isTwoFactorAuthenticationEnabled: boolean;
	isSecondFactorAuthenticated: boolean;
}

export type NameChangeResponse = {
	taken: boolean;
	user: User;
}

export type UserResponse = {
	found: boolean;
	user: User;
}

export type ChatResponse = {
	body: string;
	user: User;
}

export type CurrentMatch = {
	key: string;
	player_1: string;
	player_2: string;
}