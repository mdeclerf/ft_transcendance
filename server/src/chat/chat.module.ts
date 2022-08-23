import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Chat, Game, Room, Subscription, User } from '../typeorm/';
import { ChatGateway } from './chat.gateway';
import { UserService } from 'src/user/user.service';

@Module({
	imports: [
		TypeOrmModule.forFeature([Chat, Room, User, Game, Subscription]),
	],
	controllers: [ChatController],
	providers: [ChatService, ChatGateway, UserService],
	exports: [ChatService, ChatGateway]
})
export class ChatModule {}
