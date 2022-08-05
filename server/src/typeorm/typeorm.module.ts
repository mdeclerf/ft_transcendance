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
import { GameModule } from './game/game.module';
import { GameController } from './game/game.controller';
import { Game } from './game/game.entity';
import { RoomModule } from './room/room.module';
import { RoomController } from './room/room.controller';
import { Room } from './room/room.entity';

@Module({
	imports: [
		UserModule,
		SessionModule,
		ChatModule,
		ChatUserModule,
		FriendlistModule,
		GameModule,
		RoomModule
	],
	controllers: [
		UserController,
		SessionController,
		ChatController,
		ChatUserController,
		FriendlistController,
		GameController,
		RoomController
	],
	exports: [
		UserModule,
		SessionModule,
		ChatModule,
		ChatUserModule,
		FriendlistModule,
		GameModule,
		RoomModule
	]
})
export class OrmModule {}

export const entities = [User, Session, Chat, ChatUser, Friendlist, Game, Room];

export { User, Session, Chat, ChatUser, Friendlist, Game, Room };