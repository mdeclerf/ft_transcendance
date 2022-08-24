import { Inject } from '@nestjs/common';
import { WebSocketGateway, SubscribeMessage } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { ChatService } from './chat.service';
import { RoomInfo } from '../utils/types';
import { CreateChatDto, Room } from '../typeorm/';

@WebSocketGateway({
	cors: {
		origin: "http://localhost:3000",
		methods: ["GET", "POST"],
	},
})

@WebSocketGateway({ cors: true })
export class ChatGateway
{
	constructor(
		@Inject(ChatService) private readonly chatService: ChatService,
	) {}

	@SubscribeMessage('room_join')
	connect(client: Socket, room: string) {
		client.join(room);
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

		client.broadcast.emit('room_switched');
		client.emit('room_switched');
	}

	@SubscribeMessage('message_send')
	messageSend(socket: Socket, message: CreateChatDto) {
		this.chatService.createMessage(message);
		const { room } = message;
		socket.broadcast.to(room.name).emit('new_message', message);
	}
}
