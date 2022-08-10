import { Controller, Get, Inject, Param, UseGuards } from '@nestjs/common';
import { AuthenticatedGuard } from '../auth/guards/intra-oauth.guard';
import { ChatService } from './chat.service';

@Controller('chat')
export class ChatController {

	constructor(
		@Inject('CHAT_SERVICE') private readonly chatService: ChatService,
	) {}

	@Get('get_rooms')
	@UseGuards(AuthenticatedGuard)
	getRooms() {
		return this.chatService.getActiveRooms();
	}

	@Get('rooms/:room_name/messages')
	async getRoomMessages(@Param('room_name') room_name: string) {
		const room = await this.chatService.getRoomByName(room_name);
		return this.chatService.getRoomMessages(room.id);
	}
}
