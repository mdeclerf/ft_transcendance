import { PassportSerializer } from "@nestjs/passport";
import { Injectable } from "@nestjs/common";
import { User } from 'src/typeorm'

@Injectable()
export class SessionSerializer extends PassportSerializer {
	constructor() {  }

	serializeUser(user: User, done: Function) {
		done(null, user);
	}

	deserializeUser(user: User, done: Function) {
		const userDb;
		done(null, userDb)
	}
}