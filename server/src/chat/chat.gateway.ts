import { Inject } from '@nestjs/common';
import { WebSocketGateway, SubscribeMessage, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';
import { UserService } from '../user/user.service';
import { RoomInfo } from '../utils/types';
import { CreateChatDto, Room, User } from '../typeorm/';
import { UserController } from 'src/user/user.controller';
import { v4 as uuidv4 } from 'uuid';

// @WebSocketGateway({
// 	cors: {
// 		origin: "http://localhost:3000",
// 		methods: ["GET", "POST"],
// 	},
// })

// @UseGuards(JwtAuthGuard)
@WebSocketGateway({ cors: true })
export class ChatGateway
{
	constructor(
		@Inject(ChatService) private readonly chatService: ChatService,
		@Inject(UserService) private readonly userService: UserService,
	) {}

	@WebSocketServer()
	server: Server;

	@SubscribeMessage('room_join')
	connect(client: Socket, room: string) {
		client.join(room);
		// console.log(this.server.sockets.adapter.rooms.get(room));
	}

	@SubscribeMessage('room_switch')
	roomSwitch(client: Socket, roomInfo: RoomInfo) {
		const { prevRoom, room } = roomInfo;
		if (prevRoom) {
			client.leave(prevRoom);
		}
		if (room) {
			client.join(room);
		}
	}

	@SubscribeMessage('message_send')
	messageSend(socket: Socket, message: CreateChatDto) {
		this.chatService.createMessage(message);
		const { room } = message;
		socket.broadcast.to(room.name).emit('new_message', message);
	}

	@SubscribeMessage('invited')
	async invitation(client: Socket, message: number[]) {
		const invitingUser: User = await this.userService.findUserById(message[0]);
		const invitedUser: User = await this.userService.findUserById(message[1]);
		this.server.to(invitedUser.socketId).emit("invitation_alert", invitingUser);
	}

	@SubscribeMessage('invitation_accepted')
	async invitationAccepted(client: Socket, message: number[]) {
		const invitingUser: User = await this.userService.findUserById(message[0]);
		const invitedUser: User = await this.userService.findUserById(message[1]);
		const unique_id = uuidv4();
		// console.log(`inviting ${invitingUser.username} ${invitingUser.socketId}`);
		// console.log(`invited ${invitedUser.username} ${invitedUser.socketId}`);
		this.server.to(invitedUser.socketId).emit("make_game_room", unique_id);
		this.server.to(invitingUser.socketId).emit("make_game_room", unique_id);
	}
}
