import { Module } from '@nestjs/common';
import { ChatModule } from './chat/chat.module';
import { FriendlistModule } from './friendlist/friendlist.module';
import { ChatUserModule } from './chat_user/chat_user.module';

@Module({
	imports: [ChatModule, FriendlistModule, ChatUserModule],
})
export class ApiModule {}