import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { resolve } from 'path';
import { Repository } from 'typeorm';
import { User } from '../typeorm.module';
import { CreateFriendlistDto } from './friendlist.dto';
import { Friendlist } from './friendlist.entity';

@Injectable()
export class FriendlistService {
	
	@InjectRepository(Friendlist)
	private readonly repository: Repository<Friendlist>;

	public getFriendlink(id: number): Promise<Friendlist> {
		return this.repository.findOneBy({id: id});
	}

	public getFriendlist(user: User): Promise<Friendlist[]> {
		return this.repository.find({
			where: [{user : user}],
			order: {createdAt: "ASC"}
		});
	}

	public getFriendOf(friend: User ): Promise<Friendlist[]> {
		return this.repository.find({
			where: [{friend : friend}],
			order: {createdAt: "ASC"}
		});
	}

	public isFriendWith(user: User, friend: User): Promise<boolean> {
		return this.repository.count({
			where: [
				{user: user,
				friend: friend}
			]
		}).then(function(size: number){
			return (size != 0);
		})
	}

	public createFriendlink(body: CreateFriendlistDto): Promise<Friendlist> {
		const friendlink: Friendlist = new Friendlist();

		friendlink.user = body.user;
		friendlink.friend = body.friend;
		return this.repository.save(friendlink);
	}
}
