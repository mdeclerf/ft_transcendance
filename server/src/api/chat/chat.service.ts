import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateChatDto } from './chat.dto';
import { Chat } from './chat.entity';

@Injectable()
export class ChatService {

	@InjectRepository(Chat)
	private readonly repository: Repository<Chat>;

	public	getChat() : Promise<Chat[]> {
		return this.repository.find();
	}


	public getMessage(id: number): Promise<Chat> {
		return this.repository.findOneBy({ message_id : id, });
	}

	public createMessage(body: CreateChatDto) : Promise<Chat> {
		const message: Chat = new Chat();

		message.room_number = body.room_number;
		message.body = body.body;
		return this.repository.save(message);
	}

	public copyMessage(body: CreateChatDto) : Chat {
		const message: Chat = new Chat();
		message.room_number = body.room_number;
		message.body = body.body;
		message.createdAt = body.createdAt;
		return message;
	}
	
}
