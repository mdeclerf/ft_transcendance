import { Strategy, Profile } from 'passport-42';
import { PassportStrategy } from '@nestjs/passport';
import { Inject, Injectable } from '@nestjs/common';
import { IAuthService } from '../services/auth';
import { AuthService } from '../services/auth.service';

@Injectable()
export class IntraStrategy extends PassportStrategy(Strategy, '42') {
	constructor(@Inject(AuthService) private readonly authService: IAuthService) {
		super({
			clientID: process.env.INTRA_CLIENT_ID,
			clientSecret: process.env.INTRA_CLIENT_SECRET,
			callbackURL: process.env.INTRA_CALLBACK_URL,
			scope: 'public',
		});
	}

	async validate(accessToken: string, refreshToken: string, profile: Profile) {
		const { id: intraId, username, displayName, photos } = profile;
		const photoURL = photos[0].value;
		const details = { intraId, username, displayName, photoURL };
		return this.authService.validateUser(details);
	}
}