import { Request } from "express";
import { Room, User } from "../typeorm/";

export interface RequestWithUser extends Request {
	user: User;
}

export type UserDetails = {
	username?: string;
	intraId?: string;
	displayName?: string;
	photoURL?: string;
}

export type Done = (err: Error, user: User) => void;

export class GameDetails{

	constructor() {
		this.player_1 = {};
		this.player_2 = {};
		this.player_1_score = 0;
		this.player_2_score = 0;
		this.mode = "";
	}

	public player_1 : UserDetails;
	public player_2 : UserDetails;
	public player_1_score : number;
	public player_2_score : number;
	public mode : string;
}

export type dataType = {
	message: string;
	room: string;
	user: User;
}

export type RoomInfo = {
	prevRoom: string;
	room: string;
}

export type Game = {
	player_1 : UserDetails;
	player_2 : UserDetails;
	player_1_score : number;
	player_2_score : number;
	mode : string;
}
