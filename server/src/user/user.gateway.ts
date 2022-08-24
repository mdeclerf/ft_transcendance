import { Inject } from '@nestjs/common';
import { SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { UserService } from './user.service';

@WebSocketGateway({ cors: true })
export class UserGateway {

	constructor(
		@Inject(UserService) private readonly userService: UserService,
	) {}

	@SubscribeMessage('identity')
	handleMessage(client: Socket, user_id: number) {
		this.userService.addSocketId(user_id, client.id);
	}
}
