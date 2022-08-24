import { Body, Controller, Get, Inject, Param, Post, UseGuards } from '@nestjs/common';
import { retry } from 'rxjs';
import { CreateRoomDto } from 'src/typeorm';
import { AuthenticatedGuard } from '../auth/guards/intra-oauth.guard';
import { ChatService } from './chat.service';

@Controller('chat')
export class ChatController {

	constructor(
		@Inject(ChatService) private readonly chatService: ChatService,
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

	@Post('create_channel')
	async createChannel(@Body() roomDto: CreateRoomDto) {
		const room = await this.chatService.getRoomByName(roomDto.name);
		if (room)
			return ;
		return this.chatService.createRoom(roomDto);
	}
}
