import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../typeorm/';
import { UserDetails } from '../../utils/types';
import { IAuthService } from './auth';

@Injectable()
export class AuthService implements IAuthService {
	constructor(@InjectRepository(User) private userRepo: Repository<User>) {}

	async validateUser(details: UserDetails) {
		const { intraId } = details;
		const user = await this.userRepo.findOneBy({ intraId });
		if (user) {
			return user;
		}
		if (await this.userRepo.findOneBy({ username: details.username })) {
			let n = 0;
			let taken;
			do {
				n++;
				taken = await this.userRepo.findOneBy({ username: `${details.username}_${n}`});
			}
			while (taken);
			details.username = `${details.username}_${n}`;
		}
		return this.createUser(details);
	}

	createUser(details: UserDetails) {
		const user = this.userRepo.create(details);
		return this.userRepo.save(user);
	}

	findUser(intraId: string): Promise<User | undefined> {
		return this.userRepo.findOne({
			where: {
				intraId: intraId,
			},
		});
	}
}
