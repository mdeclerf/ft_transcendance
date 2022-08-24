import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from '../auth/services/auth.service';
import { Game, Subscription, User } from '../typeorm/';
import { TwoFactorAuthenticationController } from './2fa.controller';
import { UserController } from './user.controller';
import { TwoFactorAuthenticationService } from './2fa.service';
import { UserService } from './user.service';
import { UserGateway } from './user.gateway';

@Module({
  imports: [TypeOrmModule.forFeature([User, Game, Subscription])],
  controllers: [UserController, TwoFactorAuthenticationController],
  providers: [UserService, TwoFactorAuthenticationService, AuthService, UserGateway]
})
export class UserModule {}
