import { Module } from '@nestjs/common';
import { ChatModule } from './chat/chat.module';
import { FriendlistModule } from './friendlist/friendlist.module';

@Module({
	imports: [ChatModule, FriendlistModule],
})
export class ApiModule {}