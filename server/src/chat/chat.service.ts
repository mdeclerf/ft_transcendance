import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Blocklist, Chat, CreateChatDto, CreateRoomDto, Room, User } from '../typeorm/';
import { Repository } from 'typeorm';
import { PasswordDto } from 'src/utils/password.dto';

@Injectable()
export class ChatService {

	constructor(
		@InjectRepository(Chat) private readonly chatRepo: Repository<Chat>,
		@InjectRepository(Room) private readonly roomRepo: Repository<Room>,
		@InjectRepository(User) private readonly userRepo: Repository<User>,
		@InjectRepository(Blocklist) private readonly blockRepo: Repository<Blocklist>,
	) {
		this.roomRepo.upsert({ name: 'general', type: 'public' }, ["name"]);
	}

	//get all the table
	public	getChat() : Promise<Chat[]> {
		return this.chatRepo.find();
	}

	//select * from users left join blocklist on blocklist.blockee_id = users.id where blocklist.blocker_id = 1;
	//Return every message of a room
	public async getRoomMessages(room_id: number, user: User) : Promise<Chat[]> {
		//const blocklist = await this.blockRepo.createQueryBuilder('blocklist')
		//	.leftJoinAndSelect('blocklist.blockee', 'blockee')
		//	.where('blocklist.blocker = :id', { id: user.id })
		//	.getMany()
		//console.log(blocklist.map((blockEntry) => { return (blockEntry.blockee) }));
		const blocklist = await this.userRepo.createQueryBuilder('users')
			.leftJoinAndSelect('users.blocking', 'blocker')
			.where('blocker.blocker = :id', { id: user.id })
			.getMany()
		console.log(blocklist);
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
			.orderBy('room.id', 'ASC')
			.getMany();
	}

	async getRoomOrCreate(name: string): Promise<Room> {
		await this.roomRepo.createQueryBuilder()
		.insert()
		.orIgnore()
		.into(Room)
		.values({name, type: 'public'})
		.execute();
		return this.roomRepo.findOneBy({ name: name });
	}

	public createRoom(body: CreateRoomDto): Promise<Room> {
		return this.roomRepo.save(body);
	}

	async updateRoom(data: PasswordDto) {
		const room = await this.roomRepo.findOneBy({ name: data.name });
		return this.roomRepo.update(room.id, { hash: data.password, type: 'protected' });
	}
}
