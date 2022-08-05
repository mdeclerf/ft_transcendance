import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Room } from '../typeorm.module';
import { CreateChatDto } from './chat.dto';
import { Chat } from './chat.entity';

@Injectable()
export class ChatService {

	@InjectRepository(Chat)
	private readonly repository: Repository<Chat>;

	//get all the table
	public	getChat() : Promise<Chat[]> {
		return this.repository.find();
	}

	//Return every message of a room
	public getRoom(room_id: number) : Promise<Chat[]> {
		const result = this.repository.createQueryBuilder('chat')
			.leftJoinAndSelect('chat.user', 'user')
			.where('chat.room_id = :id', { id: room_id })
			.orderBy('chat.createdat', 'ASC')
			.getMany();
		return result;
	}

	//Return every room with at least 1 message(s)
	public getActiveRooms() : Promise<Chat[]> {
		return this.repository.createQueryBuilder('')
		.select(['room_id', "MAX(createdat) as createdAt"])
		.groupBy('room_id')
		.orderBy('createdat', 'DESC')
		.getRawMany();
	}

	public getMessage(id: number): Promise<Chat> {
		return this.repository.findOneBy({ message_id : id, });
	}

	//Add a message to the database from the DTO
	public createMessage(body: CreateChatDto) : Promise<Chat> {
		const message: Chat = new Chat();

		message.room = body.room;
		message.body = body.body;
		message.user = body.user;
		return this.repository.save(message);
	}

	//Return the last message of a given room
	public getLastMessage(room: Room)  : Promise<Chat> {

		return this.repository.findOne({
			where: [{room : room}],
			order : {createdAt: 'DESC'}
			});
	}
}
