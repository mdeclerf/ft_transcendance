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
