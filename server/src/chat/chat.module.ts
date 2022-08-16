import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Chat, Room } from '../typeorm/';
import { ChatGateway } from './chat.gateway';

@Module({
	imports: [
		TypeOrmModule.forFeature([Chat, Room])
	],
	controllers: [ChatController],
	providers: [ChatService, ChatGateway],
	exports: [ChatService, ChatGateway]
})
export class ChatModule {}
