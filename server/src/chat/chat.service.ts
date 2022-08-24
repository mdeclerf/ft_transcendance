import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Chat, CreateChatDto, CreateRoomDto, Room } from '../typeorm/';
import { Repository } from 'typeorm';

@Injectable()
export class ChatService {

	constructor(
		@InjectRepository(Chat) private readonly chatRepo: Repository<Chat>,
		@InjectRepository(Room) private readonly roomRepo: Repository<Room>,
	) {
		this.roomRepo.upsert({ name: 'general', type: 0 }, ["name"]);
	}

	//get all the table
	public	getChat() : Promise<Chat[]> {
		return this.chatRepo.find();
	}

	//Return every message of a room
	public getRoomMessages(room_id: number) : Promise<Chat[]> {
		const result = this.chatRepo.createQueryBuilder('chat')
			.leftJoinAndSelect('chat.user', 'user')
			.where('chat.room_id = :id', { id: room_id })
			.orderBy('chat.createdat', 'ASC')
			.getMany();
		return result;
	}

	public getMessage(id: number): Promise<Chat> {
		return this.chatRepo.findOneBy({ message_id : id, });
	}

	//Add a message to the database from the DTO
	public async createMessage(body: CreateChatDto) : Promise<Chat> {
		body.room = await this.getRoomByName(body.room.name);
		return this.chatRepo.save(body);
	}

	//Return the last message of a given room
	public getLastMessage(room: Room): Promise<Chat> {

		return this.chatRepo.findOne({
			where: [{room : room}],
			order : {createdAt: 'DESC'}
			});
	}

	public getRoomByName(name: string): Promise<Room> {
		return this.roomRepo.findOneBy({ name: name });
	}

	public getRoomById(id: number): Promise<Room> {
		return this.roomRepo.findOneBy({ id: id });
	}

	public getActiveRooms() : Promise<Room[]> {
		return this.roomRepo.createQueryBuilder('room')
			.select('room.name')
			.orderBy('room.id', 'ASC')
			.getMany();
	}

	async getRoomOrCreate(name: string): Promise<Room> {
		await this.roomRepo.createQueryBuilder()
		.insert()
		.orIgnore()
		.into(Room)
		.values({name, type: 0}) //type should be 'public' be it won't compile idk why
		.execute();
		return this.roomRepo.findOneBy({ name: name });
	}

	public createRoom(body: CreateRoomDto): Promise<Room> {
		return this.roomRepo.save(body);
	}
}
