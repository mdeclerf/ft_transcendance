import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from 'src/auth/services/auth.service';
import { Game, User } from '../typeorm/typeorm.module';
import { TwoFactorAuthenticationController } from './controllers/user/2fa.controller';
import { UserController } from './controllers/user/user.controller';
import { TwoFactorAuthenticationService } from './services/user/2fa.service';
import { UserService } from './services/user/user.service';

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
