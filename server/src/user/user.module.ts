import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from '../auth/services/auth.service';
import { Game, User } from '../typeorm/';
import { TwoFactorAuthenticationController } from './2fa.controller';
import { UserController } from './user.controller';
import { TwoFactorAuthenticationService } from './2fa.service';
import { UserService } from './user.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, Game])],
  controllers: [UserController, TwoFactorAuthenticationController],
  providers: [UserService, TwoFactorAuthenticationService, AuthService]
})
export class UserModule {}
