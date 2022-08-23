import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from 'src/user/user.service';
import { Game, Session, Subscription, User } from '../typeorm/';
import { AuthController } from './controllers/auth.controller';
import { AuthService } from './services/auth.service';
import { IntraStrategy } from './strategies/intra-oauth.strategy';
import { SessionSerializer } from './utils/Serializer';

@Module({
	controllers: [AuthController],
	providers: [
		IntraStrategy,
		SessionSerializer,
		AuthService,
		UserService
	],
	imports: [
		TypeOrmModule.forFeature([User, Session, Game, Subscription])
	]
})
export class AuthModule {}
