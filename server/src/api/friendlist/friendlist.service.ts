import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateFriendlistDto } from './friendlist.dto';
import { Friendlist } from './friendlist.entity';

@Injectable()
export class FriendlistService {
	
	@InjectRepository(Friendlist)
	private readonly repository: Repository<Friendlist>;

	public getFriendlink(id: number): Promise<Friendlist> {
		return this.repository.findOneBy({id: id});
	}

	public getFriendlist(user_id: number): Promise<Friendlist[]> {
		return this.repository.find({
			where: [{user_id : user_id}],
			order: {createdAt: "ASC"}
		});
	}

	public getFriendOf(friend_id: number): Promise<Friendlist[]> {
		return this.repository.find({
			where: [{friend_id : friend_id}],
			order: {createdAt: "ASC"}
		});
	}

	public createFriendlink(body: CreateFriendlistDto): Promise<Friendlist> {
		const friendlink: Friendlist = new Friendlist();

		friendlink.user_id = body.user_id;
		friendlink.friend_id = body.friend_id;
		return this.repository.save(friendlink);
	}
}
