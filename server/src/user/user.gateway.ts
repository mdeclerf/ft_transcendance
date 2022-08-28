import { Inject } from '@nestjs/common';
import { SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { UserService } from './user.service';

// @WebSocketGateway({ cors: true })
@WebSocketGateway({
	cors: {
		origin: "http://localhost:3000",
		methods: ["GET", "POST"],
	},
})
export class UserGateway {

	constructor(
		@Inject(UserService) private readonly userService: UserService,
	) {}
	@WebSocketServer() wss: Server;

	@SubscribeMessage('identity')
	async handleMessage(client: Socket, user_id: number) {
		await this.userService.addSocketId(user_id, client.id);
		client.emit('socket_saved');
		this.userService.setStatus(user_id, 'online');
		const ConnectedUser = await this.userService.findUserById(user_id);
		this.wss.sockets.emit("color_change", { status: 'online', user: ConnectedUser});
	}
}
