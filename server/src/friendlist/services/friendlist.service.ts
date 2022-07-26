import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm'
import { Friendlist } from '../../typeorm/typeorm.module'
import { Repository } from 'typeorm';

@Injectable()
export class FriendlistService {
	constructor(
		@InjectRepository(Friendlist) private readonly friendlistRepo: Repository<Friendlist>
	) {}
}