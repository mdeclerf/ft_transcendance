import { PassportSerializer } from "@nestjs/passport";
import { Inject, Injectable } from "@nestjs/common";
import { User } from "../../typeorm/";
import { Done } from "../../utils/types";
import { IAuthService } from "../services/auth";
import { AuthService } from "../services/auth.service";

@Injectable()
export class SessionSerializer extends PassportSerializer {
	constructor(@Inject(AuthService) private readonly authService: IAuthService) {
		super();
	}

	serializeUser(user: User, done: Done) {
		done(null, user);
	}

	async deserializeUser(user: User, done: Done) {
		const userDB = await this.authService.findUser(user.intraId);
		return userDB ? done(null, userDB) : done(null, null);
	}
}
