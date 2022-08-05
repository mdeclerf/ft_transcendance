import { Request } from "express";
import { User } from "../typeorm/typeorm.module";

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
	room: number;
	user: User;
}
