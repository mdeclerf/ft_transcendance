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
	}

	handleConnection(client: Socket, ...args: any[]) {
		this.server.on("connection", (socket) => {
			console.log(`User Connected: ${socket.id}`);

			socket.on("join_room", (data) => {
				socket.join(data);
			});

			socket.on("send_message", (data) => {
				let message : CreateChatDto = new CreateChatDto();
				message.body = data.message;
				this.chatService.createMessage(message);
				socket.to(data.room).emit("receive_message", data);
			});
		});
	}
}
