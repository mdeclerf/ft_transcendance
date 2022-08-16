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

export type Game = {
	player_1 : User;
	player_2 : User;
	player_1_score : number;
	player_2_score : number;
	mode : string;
}

export type Result = {
	x : string,
	y : number
}

export type UserResponse = {
	found: boolean;
	user: User;
	games: Game[];
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

export type Leader = {
	games: Game[];
}
