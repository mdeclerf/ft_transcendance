import { Inject, UseGuards } from '@nestjs/common';
import {
	WebSocketGateway,
	OnGatewayInit,
	WebSocketServer,
	OnGatewayConnection,
	SubscribeMessage,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { CreateChatDto } from './typeorm/chat/chat.dto';
import { ChatService } from './typeorm/chat/chat.service';
import { Chat } from './typeorm/typeorm.module';

@WebSocketGateway({
	cors: {
		origin: "http://localhost:3000",
		methods: ["GET", "POST"],
	},
})

// @UseGuards(JwtAuthGuard)
@WebSocketGateway({ cors: true })
export class AppGateway
implements OnGatewayConnection
{
	constructor(@Inject(ChatService) private readonly chatService: ChatService) {}
		
	@WebSocketServer() server: Server;

	
	handleConnection(client: Socket) {
		this.server.setMaxListeners(0); // Is it really fixing the bug ? I don't know...
		this.server.once("chat_connection", (socket) => {
			this.chatService.getActiveRooms()
			.then(function(result){
				socket.emit("chat_connected", result);
			});
		})
	}

	@SubscribeMessage("chat_join_room")
	chatJoinRoom(client: Socket, room: any) {
		client.join(room);
		this.chatService.getRoom(room)
		.then(function(result){
			client.emit("chat_joined_room", result);
		});
	}

	@SubscribeMessage("chat_send_message")
	chatSendMessage(client: Socket, data: any) {
		let message : CreateChatDto = new CreateChatDto();
		message.body = data.message;
		message.room_number = data.room ? data.room : 0;
		message.createdAt = new Date();
		this.chatService.createMessage(message);
		client.to(data.room).emit("chat_receive_message", message);
	}

	@SubscribeMessage("chat_get_room")
	handleChannels(client: Socket) : void {
		this.chatService.getActiveRooms()
		.then(function(result){
			client.emit("chat_set_rooms", result);
		});
	}
}