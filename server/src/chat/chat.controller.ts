import { Body, Controller, Get, Inject, Param, Post, Req, UseGuards, Res } from '@nestjs/common';
import { CreateRoomDto } from 'src/typeorm';
import { AuthenticatedGuard } from '../auth/guards/intra-oauth.guard';
import { ChatService } from './chat.service';
import { PasswordDto } from '../utils/password.dto';
import * as bcrypt from 'bcrypt';
import { RequestWithUser } from 'src/utils/types';
import { Response } from 'express';

@Controller('chat')
export class ChatController {

	constructor(
		@Inject(ChatService) private readonly chatService: ChatService,
	) {}

	@Get('get_rooms')
	@UseGuards(AuthenticatedGuard)
	async getRooms() {
		const rooms = await this.chatService.getActiveRooms();
		return rooms;
	}

	@Get('rooms/:room_name/messages')
	async getRoomMessages(@Param('room_name') room_name: string, @Req() req: RequestWithUser) {
		const room = await this.chatService.getRoomByName(room_name);
		return this.chatService.getRoomMessages(room.id, req.user);
	}

	@Post('create_channel')
	async createChannel(@Body() roomDto: CreateRoomDto) {
		const room = await this.chatService.getRoomByName(roomDto.name);
		if (room)
			return true;
		this.chatService.createRoom(roomDto);
		return false;
	}

	@Post('set_password')
	async sendPassword(@Body() data: PasswordDto) {
		const hashedPassword = bcrypt.hashSync(data.password, '$2a$10$CwTycUXWue0Thq9StjUM0u');
		this.chatService.updateRoom({ name: data.name, password: hashedPassword });
	}

	@Post('check_password')
	async checkPassword(@Body() data: PasswordDto, @Res() res: Response) {
		const hashedPassword = bcrypt.hashSync(data.password, '$2a$10$CwTycUXWue0Thq9StjUM0u');
		const { hash: roomHash } = await this.chatService.getRoomByName(data.name);
		if (roomHash === hashedPassword) {
			return res.status(200).send();
		} else {
			return res.status(401).send();
		}
	}
}
