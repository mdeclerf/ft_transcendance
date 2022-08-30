import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from '../auth/services/auth.service';
import { Blocklist, Chat, ChatUser, Game, Room, Subscription, User } from '../typeorm/';
import { TwoFactorAuthenticationController } from './2fa.controller';
import { UserController } from './user.controller';
import { TwoFactorAuthenticationService } from './2fa.service';
import { UserService } from './user.service';
import { UserGateway } from './user.gateway';
import { ChatService } from 'src/chat/chat.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, Game, Subscription, Blocklist, Chat, Room, ChatUser])],
  controllers: [UserController, TwoFactorAuthenticationController],
  providers: [UserService, TwoFactorAuthenticationService, AuthService, UserGateway, ChatService]
})
export class UserModule {}
