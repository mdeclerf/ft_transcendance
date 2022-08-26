import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Blocklist, Chat, ChatUser, CreateChatDto, CreateChatUserDto, CreateRoomDto, Room, User } from '../typeorm/';
import { Repository } from 'typeorm';
import { PasswordDto } from 'src/utils/password.dto';

@Injectable()
export class ChatService {

	constructor(
		@InjectRepository(Chat) private readonly chatRepo: Repository<Chat>,
		@InjectRepository(Room) private readonly roomRepo: Repository<Room>,
		@InjectRepository(User) private readonly userRepo: Repository<User>,
		@InjectRepository(Blocklist) private readonly blockRepo: Repository<Blocklist>,
		@InjectRepository(ChatUser) private readonly chatUserRepo: Repository<ChatUser>,
	) {
		this.roomRepo.upsert({ name: 'general', type: 'public' }, ["name"]);
	}

	//get all the table
	getChat() : Promise<Chat[]> {
		return this.chatRepo.find();
	}

	//select * from users left join blocklist on blocklist.blockee_id = users.id where blocklist.blocker_id = 1;
	//Return every message of a room
	async getRoomMessages(room_id: number, user: User) : Promise<Chat[]> {
		//const blocklist = await this.blockRepo.createQueryBuilder('blocklist')
		//	.leftJoinAndSelect('blocklist.blockee', 'blockee')
		//	.where('blocklist.blocker = :id', { id: user.id })
		//	.getMany()
		//console.log(blocklist.map((blockEntry) => { return (blockEntry.blockee) }));
		const blocklist = await this.userRepo.createQueryBuilder('users')
			.leftJoinAndSelect('users.blocking', 'blocker')
			.where('blocker.blocker = :id', { id: user.id })
			.getMany();
		const result = this.chatRepo.createQueryBuilder('chat')
			.leftJoinAndSelect('chat.user', 'user')
			.where('chat.room_id = :id', { id: room_id })
			.orderBy('chat.createdat', 'ASC')
			.getMany();
		return result;
	}

	getMessage(id: number): Promise<Chat> {
		return this.chatRepo.findOneBy({ message_id : id, });
	}

	//Add a message to the database from the DTO
	async createMessage(body: CreateChatDto) : Promise<Chat> {
		body.room = await this.getRoomByName(body.room.name);
		return this.chatRepo.save(body);
	}

	//Return the last message of a given room
	getLastMessage(room: Room): Promise<Chat> {

		return this.chatRepo.findOne({
			where: [{room : room}],
			order : {createdAt: 'DESC'}
			});
	}

	getRoomByName(name: string): Promise<Room> {
		return this.roomRepo.findOneBy({ name: name });
	}

	getRoomById(id: number): Promise<Room> {
		return this.roomRepo.findOneBy({ id: id });
	}

	async getActiveRooms(userId: number) {
		return await this.roomRepo.createQueryBuilder('room')
			.leftJoinAndSelect('room.chat_user', 'chat_user')
			.where('chat_user.user_id = :id', { id: userId })
			.orderBy('chat_user.join_date', 'ASC')
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

	createRoom(room: CreateRoomDto): Promise<Room> {
		return this.roomRepo.save(room);
	}

	async createChatUserIfNotExists(chatUser: CreateChatUserDto) {
		const entry = this.chatUserRepo.create({
			room: await this.roomRepo.findOneBy({ id: chatUser.room_id }),
			user: await this.userRepo.findOneBy({ id: chatUser.user_id}),
			status: chatUser.status,
		});
		this.chatUserRepo.createQueryBuilder()
			.insert()
			.orIgnore()
			.into(ChatUser)
			.values(entry)
			.execute();
	}

	async updateRoom(data: PasswordDto) {
		const room = await this.roomRepo.findOneBy({ name: data.name });
		return this.roomRepo.update(room.id, { hash: data.password, type: 'protected' });
	}

	async complete(query: string) {
		const result = await this.roomRepo.createQueryBuilder()
			.where('name like :name', { name: `%${query}%` })
			.getMany();

		return result.map(({ name, type }) => {
			return ({ name, type })
		});
	}
}
