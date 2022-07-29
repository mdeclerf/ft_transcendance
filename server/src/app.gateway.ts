import { Inject, UseGuards } from '@nestjs/common';
import {
	WebSocketGateway,
	OnGatewayInit,
	WebSocketServer,
	OnGatewayConnection,
	OnGatewayDisconnect,
	SubscribeMessage,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { CreateChatDto } from './typeorm/chat/chat.dto';
import { ChatService } from './typeorm/chat/chat.service';

@WebSocketGateway({
	cors: {
		origin: "http://localhost:3000",
		methods: ["GET", "POST"],
	},
})

// @UseGuards(JwtAuthGuard)
@WebSocketGateway({ cors: true })
export class AppGateway
implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
	constructor(@Inject(ChatService) private readonly chatService: ChatService) {}
		
	@WebSocketServer() server: Server;
	// users: number = 0;

	afterInit(server: Server) {
	}

	handleDisconnect(client: Socket) {
		// this.users--;
		// console.log(`User Disconnected: ${client.id} and there is ${this.users} clients connected`);
		client.emit("disconnected");
	}

	handleConnection(client: Socket, ...args: any[]) {
		this.server.once("connection", (socket) => {
			// if (this.users <= 0)
			// 	this.users = 0;
			// this.users++;
			this.chatService.getActiveRooms()
			.then(function(result){
				socket.emit("connected", result);
			});
			// console.log(`User Connected: ${socket.id} and there is ${this.users} clients connected`);

			socket.on("join_room", (data) => {
				socket.join(data);
				this.chatService.getRoom(data)
				.then(function(result){
					socket.emit("joined_room", result);
				});
			});

			socket.on("send_message", (data) => {
				let message : CreateChatDto = new CreateChatDto();
				message.body = data.message;
				message.room_number = data.room ? data.room : 0;
				message.createdAt = new Date();
				this.chatService.createMessage(message);
				socket.to(data.room).emit("receive_message", message);
				//console.log(message);
			});
		});
	}

	@SubscribeMessage("get_room")
	handleChannels(client: Socket) : void {
		//console.log("heyy");
		this.chatService.getActiveRooms()
		.then(function(result){
			client.emit("set_rooms", result);
		});
	}
}