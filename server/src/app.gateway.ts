import { Inject } from '@nestjs/common';
import {
	WebSocketGateway,
	OnGatewayInit,
	WebSocketServer,
	OnGatewayConnection,
	OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { AppService } from './app.service';
import { CreateChatDto } from './api/chat/chat.dto';
import { ChatService } from './api/chat/chat.service';

@WebSocketGateway({
	cors: {
		origin: "http://localhost:3000",
		methods: ["GET", "POST"],
	},
})

@WebSocketGateway({ cors: true })
export class AppGateway
implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
	constructor(@Inject(ChatService) private appService: AppService, private readonly chatService: ChatService) {}
		
	@WebSocketServer() server: Server;
	users: number = 0;

	afterInit(server: Server) {
	}

	handleDisconnect(client: Socket) {
		console.log(`User Disconnected: ${client.id}`);
		this.users--;
		client.emit("disconnected");
	}

	handleConnection(client: Socket, ...args: any[]) {
		this.server.once("connection", (socket) => {
			console.log(`User Connected: ${socket.id}`);

			socket.once("join_room", (data) => {
				socket.join(data);
			});

			socket.on("send_message", (data) => {
				let message : CreateChatDto = new CreateChatDto();
				message.body = data.message;
				message.room_number = data.room;
				this.chatService.createMessage(message);
				socket.to(data.room).emit("receive_message", data);
			});
		});
	}
}
