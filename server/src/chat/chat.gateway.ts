import { Inject } from '@nestjs/common';
import { WebSocketGateway, SubscribeMessage } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { ChatService } from './chat.service';
import { RoomInfo } from '../utils/types';
import { CreateChatDto } from '../typeorm/';

@WebSocketGateway({
	cors: {
		origin: "http://localhost:3000",
		methods: ["GET", "POST"],
	},
})

// @UseGuards(JwtAuthGuard)
@WebSocketGateway({ cors: true })
export class ChatGateway
{
	constructor(
		@Inject(ChatService) private readonly chatService: ChatService,
	) {}

	@SubscribeMessage('chat_connection')
	connect(client: Socket) {
		const { channel } = client.handshake.query;
		client.join(channel);
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
}
