import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { UserController } from './user/user.controller';
import { User } from './user/user.entity';
import { SessionModule } from './session/session.module';
import { SessionController } from './session/session.controller';
import { Session } from './session/session.entity';
import { ChatModule } from './chat/chat.module';
import { ChatController } from './chat/chat.controller';
import { Chat } from './chat/chat.entity';
import { ChatUserModule } from './chat_user/chat_user.module';
import { ChatUserController } from './chat_user/chat_user.controller';
import { ChatUser } from './chat_user/chat_user.entity';
import { FriendlistModule } from './friendlist/friendlist.module';
import { FriendlistController } from './friendlist/friendlist.controller';
import { Friendlist } from './friendlist/friendlist.entity';

@Module({
	imports: [
		UserModule,
		SessionModule,
		ChatModule,
		ChatUserModule,
		FriendlistModule
	],
	controllers: [
		UserController,
		SessionController,
		ChatController,
		ChatUserController,
		FriendlistController
	],
	exports: [
		UserModule,
		SessionModule,
		ChatModule,
		ChatUserModule,
		FriendlistModule
	]
})
export class OrmModule {}

export const entities = [User, Session, Chat, ChatUser, Friendlist];

export { User, Session, Chat, ChatUser, Friendlist };