import { Chat } from './entities/chat.entity';
import { ChatUser } from './entities/chat_user.entity';
import { Subscription } from './entities/subscription.entity';
import { Game } from './entities/game.entity';
import { Room } from './entities/room.entity';
import { Session } from './entities/session.entity';
import { User } from './entities/user.entity';
import { CreateChatDto } from "./DTOs/chat.dto";
import { CreateChatUserDto } from "./DTOs/chat_user.dto";
import { CreateSubscriptionDto } from "./DTOs/subscription.dto";
import { CreateGameDto } from "./DTOs/game.dto";
import { CreateRoomDto } from "./DTOs/room.dto";
import { CreateUserDto } from "./DTOs/user.dto";

export const entities = [Chat, ChatUser, Subscription, Game, Room, Session, User];

export { Chat, ChatUser, Subscription, Game, Room, Session, User, CreateChatDto, CreateChatUserDto, CreateSubscriptionDto, CreateGameDto, CreateRoomDto, CreateUserDto };