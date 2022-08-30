import { Body, Controller, Get, Inject, Param, Post, Query, Req, Res, UseGuards } from '@nestjs/common';
import { CreateRoomDto } from 'src/typeorm';
import { AuthenticatedGuard } from '../auth/guards/intra-oauth.guard';
import { ChatService } from './chat.service';
import { PasswordDto } from '../utils/password.dto';
import * as bcrypt from 'bcrypt';
import { RequestWithUser } from 'src/utils/types';
import { Response } from 'express';
import { ChatGateway } from './chat.gateway';

@Controller('chat')
export class ChatController {

	constructor(
		@Inject(ChatService) private readonly chatService: ChatService,
		@Inject(ChatGateway) private readonly chatGateway: ChatGateway,
	) {}

	@Get('get_rooms')
	@UseGuards(AuthenticatedGuard)
	async getRooms(@Req() req: RequestWithUser) {
		const rooms = await this.chatService.getActiveRooms(req.user.id);
		return rooms;
	}

	@Get('rooms/:room_name/messages')
	async getRoomMessages(@Param('room_name') room_name: string, @Req() req: RequestWithUser) {
		const room = await this.chatService.getRoomByName(room_name);
		return this.chatService.getRoomMessages(room.id, req.user);
	}

	@Get('rooms/complete')
	@UseGuards(AuthenticatedGuard)
	complete(@Query('q') query: string, @Req() req: RequestWithUser) {
		return this.chatService.complete(query, req.user);
	}

	@Get('rooms/:room_name/type')
	async getRoomInfo(@Param('room_name') room_name: string) {
		const room = await this.chatService.getRoomByName(room_name);
		return room.type;
	}

	@Post('rooms/:room_name/join_room')
	joinRoom(@Param('room_name') room_name: string) {

	}

	@Post('create_channel')
	@UseGuards(AuthenticatedGuard)
	async createChannel(@Body() roomDto: CreateRoomDto, @Req() req: RequestWithUser) {
		const room = await this.chatService.getRoomByName(roomDto.name);
		if (room)
			return true;
		const created_room = await this.chatService.createRoom(roomDto);
		this.chatService.createChatUserIfNotExists({ room_id: created_room.id, user_id: req.user.id, status: 'owner' });
		return false;
	}

	@Post('set_password')
	async sendPassword(@Body() data: PasswordDto) {
		const hashedPassword = bcrypt.hashSync(data.password, '$2a$10$CwTycUXWue0Thq9StjUM0u');
		this.chatService.updateRoom({ name: data.name, password: hashedPassword });
	}

	@Post('check_password')
	@UseGuards(AuthenticatedGuard)
	async checkPassword(@Body() data: PasswordDto, @Res() res: Response, @Req() req: RequestWithUser) {
		const hashedPassword = bcrypt.hashSync(data.password, '$2a$10$CwTycUXWue0Thq9StjUM0u');
		const { hash: roomHash } = await this.chatService.getRoomByName(data.name);
		if (roomHash === hashedPassword) {
			const client = this.chatGateway.server.sockets.sockets.get(req.user.socketId);
			this.chatGateway.roomJoin(client, data.name);
			return res.status(200).send();
		} else {
			return res.status(401).send();
		}
	}

	@Get('rooms/:room_name/:username/get_chat_user_status')
	async getChatUserStatus(@Param('room_name') room_name: string, @Param('username') username: string, @Req() req: RequestWithUser) {
		// console.log("here");
		const currentRoom = await this.chatService.getRoomByName(room_name);
		// console.log(currentRoom.name);
		const chatUser = await this.chatService.getUserByName(username);
		// console.log(chatUser.username);
		return this.chatService.getChatUserStatus(chatUser, currentRoom);
	}
}
