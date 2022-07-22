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

	public getRoom(room_id: number) : Promise<Chat[]> {
		return this.repository.find({
			where: [{room_number : room_id}],
			order: {createdAt: "ASC"}
		});
	}

	public getActiveRooms() : Promise<Chat[]> {
		return this.repository.createQueryBuilder('').select(['room_number']).orderBy('room_number').distinct().getRawMany();
	}

	public getMessage(id: number): Promise<Chat> {
		return this.repository.findOneBy({ message_id : id, });
	}

	//Add a message to the database from the DTO
	public createMessage(body: CreateChatDto) : Promise<Chat> {
		const message: Chat = new Chat();

		message.room_number = body.room_number;
		message.body = body.body;
		return this.repository.save(message);
	}

	//Return the last message of a given room
	public getLastMessage(room_id: number)  : Promise<Chat> {

		return this.repository.findOne({
			where: [{room_number : room_id}],
			order : {createdAt: 'DESC'}
			});
	}
}
