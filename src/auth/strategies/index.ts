import { Strategy, Profile } from 'passport-42';
import { PassportStrategy } from '@nestjs/passport';
import { Inject, Injectable } from '@nestjs/common';
import { Profiler } from 'inspector';
import { AuthenticationProvider } from '../auth';

@Injectable()
export class IntraStrategy extends PassportStrategy(Strategy) {
	constructor(@Inject('AUTH_SERVICE') private readonly authService: AuthenticationProvider) {
		super({
			clientID: process.env.INTRA_CLIENT_ID,
			clientSecret: process.env.INTRA_CLIENT_SECRET,
			callbackURL: process.env.INTRA_CALLBACK_URL,
		});
	}

	async validate(accessToken: string, refreshToken: string, profile: Profile) {
		const { username, id } = profile;
		console.log(username, id);
		const details = { id, username };
		await this.authService.validateUser(details)
	}
}
