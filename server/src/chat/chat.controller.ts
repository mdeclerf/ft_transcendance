import { Body, Controller, Get, Inject, Param, Post, UseGuards } from '@nestjs/common';
import { CreateRoomDto } from 'src/typeorm';
import { AuthenticatedGuard } from '../auth/guards/intra-oauth.guard';
import { ChatService } from './chat.service';
import { PasswordDto } from '../utils/password.dto';
import * as bcrypt from 'bcrypt';

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
			return true;
		this.chatService.createRoom(roomDto);
		return false;
	}

	@Post('send_password')
	async sendPassword(@Body() password: PasswordDto) {
		const hashedPassword = bcrypt.hashSync(password.password, '$2a$10$CwTycUXWue0Thq9StjUM0u')
		this.chatService.updateRoom({ name: password.name, password: hashedPassword });
	}
}
