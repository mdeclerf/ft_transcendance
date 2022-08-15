import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { resolve } from 'path';
import { Repository } from 'typeorm';
import { CreateFriendlistDto } from './DTOs/friendlist.dto';
import { Friendlist } from './entities/friendlist.entity';

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

	public isFriendWith(user_id: number, friend_id: number): Promise<boolean> {
		return this.repository.count({
			where: [
				{user_id: user_id,
				friend_id: friend_id}
			]
		}).then(function(size: number){
			return (size != 0);
		})
	}

	public createFriendlink(body: CreateFriendlistDto): Promise<Friendlist> {
		const friendlink: Friendlist = new Friendlist();

		friendlink.user_id = body.user_id;
		friendlink.friend_id = body.friend_id;
		return this.repository.save(friendlink);
	}
}
