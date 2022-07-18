import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../../typeorm/typeorm.module';
import { UserDetails } from '../../../utils/types';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
	constructor(
		@InjectRepository(User) private readonly userRepo: Repository<User>
	) {}

	async updateOne(details: UserDetails) {
		const { intraId } = details;
		const user = await this.userRepo.findOne({
			where: {
				intraId: intraId,
			}
		});
		if (user) {
			this.userRepo.update({ intraId }, details);
			// console.log(`${details.username} updated`);
		}
	}

	findUserByUsername(username: string): Promise<User | undefined> {
		return this.userRepo.findOne({
			where: {
				username: username,
			},
		});
	}

	async setTwoFactorAuthenticationSecret(secret: string, userId: number) {
		return this.userRepo.update(userId, { twoFactorAuthenticationSecret: secret });
	}

	async enableTwoFactorAuthentication(userId: number) {
		return this.userRepo.update(userId, { isTwoFactorAuthenticationEnabled: true });
	}
}
