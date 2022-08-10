import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Session, User } from '../typeorm';
import { AuthController } from './controllers/auth.controller';
import { AuthService } from './services/auth.service';
import { IntraStrategy } from './strategies/intra-oauth.strategy';
import { SessionSerializer } from './utils/Serializer';

@Module({
	controllers: [AuthController],
	providers: [
		IntraStrategy,
		SessionSerializer,
		{
			provide: 'AUTH_SERVICE',
			useClass: AuthService,
		},
	],
	imports: [
		TypeOrmModule.forFeature([User, Session])
	]
})
export class AuthModule {}
