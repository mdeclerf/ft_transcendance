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

export type ChatRoom = {
	name: string;
}

export type CurrentMatch = {
	key: string;
	player_1: string;
	player_2: string;
}

export type Message = {
	side: 'left' | 'right';
	message: string;
	sender: User;
}

export type MessageGroup = {
	side: 'left' | 'right';
	messages: string[];
	sender: User;
}