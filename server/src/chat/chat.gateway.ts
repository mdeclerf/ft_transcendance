import { Inject } from '@nestjs/common';
import { WebSocketGateway, SubscribeMessage, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';
import { UserService } from '../user/user.service';
import { RoomInfo } from '../utils/types';
import { CreateChatDto, User, SetUserStatusDto } from '../typeorm/';
import { v4 as uuidv4 } from 'uuid';

@WebSocketGateway({
		cors: {
			origin: "http://localhost:3000",
			methods: ["GET", "POST"],
		},
	})
export class ChatGateway
{
	constructor(
		@Inject(ChatService) private readonly chatService: ChatService,
		@Inject(UserService) private readonly userService: UserService,
	) {}

	@WebSocketServer()
	server: Server;

	@SubscribeMessage('room_active')
	async roomActive(client: Socket, room_name: string) {
		client.join(room_name);
		const sockets = Array.from(this.server.sockets.adapter.rooms.get(room_name));
		const users = await Promise.all(sockets.map(async (socketId) => {
			return await this.userService.findUserBySocketId(socketId);
		}));
		const currentUser = await this.userService.findUserBySocketId(client.id);
		client.broadcast.to(room_name).emit('room_user_active', currentUser);
		client.emit('room_users', users);
	}

	@SubscribeMessage('room_inactive')
	async roomInactive(client: Socket, room_name: string) {
		client.leave(room_name);
		const currentUser = await this.userService.findUserBySocketId(client.id);
		client.broadcast.to(room_name).emit('room_user_inactive', currentUser);
	}

	@SubscribeMessage('room_switch')
	async roomSwitch(client: Socket, roomInfo: RoomInfo) {
		const { prevRoom, room } = roomInfo;
		if (prevRoom) {
			client.leave(prevRoom);
			this.roomInactive(client, prevRoom);
		}
		if (room) {
			this.roomActive(client, room);
			client.join(room);
		}
	}

	@SubscribeMessage('set_status')
	async setStatus(client: Socket, chat_user: SetUserStatusDto) {
		if (chat_user.user_id && chat_user.room_name) {
			const chatUser = await this.chatService.getUserById(chat_user.user_id);
			const currentRoom = await this.chatService.getRoomByName(chat_user.room_name);
			if (chatUser && currentRoom)
				if (await this.chatService.updateStatus(chatUser, currentRoom, chat_user.status))
					this.server.to(chatUser.socketId).emit(`${chat_user.status}_added`);
		}
	}

	@SubscribeMessage('room_created')
	async roomCreated(client: Socket, room: string) {
		client.emit('new_room', { name: room });
		const currentUser = await this.userService.findUserBySocketId(client.id);
		const rooms = await this.chatService.getActiveRooms(currentUser.id);
		let index = 0;
		for (let i = 0; i < rooms.length; i++) {
			if (rooms[i].name === room) {
				index = i;
				break;
			}
		}
		client.emit('autoswitch_room', index);
	}

	@SubscribeMessage('room_join')
	async roomJoin(client: Socket, room_name: string) {
		const currentUser = await this.userService.findUserBySocketId(client.id);
		const room_entry = await this.chatService.getRoomByName(room_name);
		if (currentUser) // Fix or not fix I do not know.....
			await this.chatService.createChatUserIfNotExists({ room_id: room_entry.id, user_id: currentUser.id, status: 'user'});
		this.roomCreated(client, room_name);
		this.roomActive(client, room_name);
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
		this.server.to(invitedUser.socketId).emit("make_game_room", unique_id);
		this.server.to(invitingUser.socketId).emit("make_game_room", unique_id);
	}
}
