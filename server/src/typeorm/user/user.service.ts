import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UserService {

	@InjectRepository(User)
	private readonly repository: Repository<User>

	public getUserById(id: number): Promise<User>
	{
		return this.repository.findOneBy({id: id});
	}

	public getUsers(): Promise<User[]>
	{
		return this.repository.find({order: {id: 'ASC'}})
	}
}
