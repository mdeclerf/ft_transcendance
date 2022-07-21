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