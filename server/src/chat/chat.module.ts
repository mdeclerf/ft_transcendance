import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Chat, Room } from '../typeorm';

@Module({
	providers: [
		{
			provide: 'CHAT_SERVICE',
			useClass: ChatService,
		},
	],
	controllers: [ChatController],
	imports: [
		TypeOrmModule.forFeature([Chat, Room])
	]
})
export class ChatModule {}
