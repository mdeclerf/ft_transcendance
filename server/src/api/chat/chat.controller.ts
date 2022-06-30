import { Body, Controller, Get, Inject, Param, ParseIntPipe, Post } from '@nestjs/common';
import { CreateChatDto } from './chat.dto';
import { Chat } from './chat.entity';
import { ChatService } from './chat.service';

@Controller('chat')
export class ChatController {

	@Inject(ChatService)
	private readonly service: ChatService;

	@Get("")
	public getChat() : Promise<Chat[]> {
		return this.service.getChat();
	}
	
	@Get(':id')
	public getMessage(@Param('id', ParseIntPipe) id: number) : Promise<Chat> {
		return this.service.getMessage(id);
	}

	@Post()
	public createMessage(@Body() body: CreateChatDto): Promise<Chat> {
		return this.service.createMessage(body);
	}
}
