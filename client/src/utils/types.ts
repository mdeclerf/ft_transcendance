export type User = {
	id: string;
	intraId: string;
	status: string;
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

export type AutoCompleteResult = {
	username: string;
	photoURL: string;
	displayName: string;
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

export type UserQueryResponse = {
	found: boolean;
	user: User;
	games: Game[];
}

export type ChatResponse = {
	body: string;
	user: User;
}

export type Message = {
	room: Room;
	body: string;
	user: User;
}

export type Room = {
	name: string;
	type: 'public' | 'protected' | 'private';
}

export type MessageGroup = {
	side: 'left' | 'right';
	messages: string[];
	user: User;
}

export type CurrentMatch = {
	key: string;
	player_1: string;
	player_2: string;
}

export type Ranking = {
	user : User;
	victories : number;
	losses : number;
	ratio : number;
}

export type GameJoinRoomData = {
	room: string;
	user: User;
}
