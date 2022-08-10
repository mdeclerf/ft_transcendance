import { Inject, UseGuards } from '@nestjs/common';
import {
	WebSocketGateway,
	OnGatewayConnection,
	SubscribeMessage,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { dataType } from 'src/utils/types';
import { CreateChatDto } from '../typeorm/chat/chat.dto';
import { ChatService } from '../typeorm/chat/chat.service';
import { RoomService } from '../typeorm/room/room.service'

@WebSocketGateway({
	cors: {
		origin: "http://localhost:3000",
		methods: ["GET", "POST"],
	},
})

// @UseGuards(JwtAuthGuard)
@WebSocketGateway({ cors: true })
export class ChatGateway
implements OnGatewayConnection
{
	constructor(
		@Inject(ChatService) private readonly chatService: ChatService,
		@Inject(RoomService) private readonly roomService: RoomService
	) {}

	handleConnection(client: Socket) {
		// console.log(`new socket ${client.id}`);
	}

	@SubscribeMessage("chat_connect")
	handleConnect(client: Socket) {
		this.roomService.getActiveRooms()
		.then((result) => {
			console.log('new chat connection, current rooms: ', result);
			client.emit("chat_connected", result);
		});
	}

	@SubscribeMessage("chat_join_room")
	async chatJoinRoom(client: Socket, room: string) {
		const res = await this.roomService.getRoomOrCreate(room)

		this.chatService.getRoom(res.id)
		.then((result) => {
			console.log('result: ', result);
			client.emit("chat_joined_room", result);
		})
	}

	@SubscribeMessage("chat_send_message")
	async chatSendMessage(client: Socket, data: dataType) {
		console.log(data);
		const { message, room, user } = data;
		let msg : CreateChatDto = new CreateChatDto();
		msg.body = message;
		msg.room = await this.roomService.getRoomByName(room);
		msg.user = user;
		this.chatService.createMessage(msg);
		client.to(room.toString()).emit("chat_receive_message", msg);
	}

	@SubscribeMessage("chat_get_room")
	handleChannels(client: Socket) : void {
		this.chatService.getActiveRooms()
		.then((result) => {
			client.emit("chat_set_rooms", result);
		});
	}
}