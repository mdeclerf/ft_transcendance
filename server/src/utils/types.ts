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
		this.socket_id = "";
		this.socket_id_opponent = "";
		this.login = "";
		this.login_opponent = "";
		this.mode = "";
		this.score = 0;
		this.score_opponent = 0;
		this.has_won = false;
	}

	public socket_id : string;
	public socket_id_opponent : string;
	public login : string;
	public login_opponent : string;
	public mode : string;
	public score : number;
	public score_opponent : number;
	public has_won : boolean;
}
