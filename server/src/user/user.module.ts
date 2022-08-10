import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from 'src/auth/services/auth.service';
import { Game, User } from '../typeorm';
import { TwoFactorAuthenticationController } from './2fa.controller';
import { UserController } from './user.controller';
import { TwoFactorAuthenticationService } from './2fa.service';
import { UserService } from './user.service';

@Module({
	controllers: [UserController, TwoFactorAuthenticationController],
	providers: [
		{
			provide: 'USER_SERVICE',
			useClass: UserService,
		},
		{
			provide: '2FA_SERVICE',
			useClass: TwoFactorAuthenticationService,
		},
		{
			provide: 'AUTH_SERVICE',
			useClass: AuthService,
		},
	],
	imports: [
		TypeOrmModule.forFeature([User, Game])
	]
})
export class UserModule {}
