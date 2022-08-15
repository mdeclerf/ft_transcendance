import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Game, User } from '../typeorm/';
import { UserDetails } from '../utils/types';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
	constructor(
		@InjectRepository(User) private readonly userRepo: Repository<User>,
		@InjectRepository(Game) private readonly gameRepo: Repository<Game> ///
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

	async findMatches(id : number) {
		const player_1_games = await this.gameRepo.createQueryBuilder('game')
			.leftJoinAndSelect('game.player_1', 'player_1')
			.leftJoinAndSelect('game.player_2', 'player_2')
			.where('game.player_1 = :id OR game.player_2 = :id', { id: id })
			.getMany()

		// console.log(player_1_games);

		return player_1_games;
	}

	// SELECT * FROM game LEFT JOIN user ON game.player_1 = user.id OR game.player_2 = user.id WHERE game.player_1.id = id OR game.player_2.id = id;

	async setTwoFactorAuthenticationSecret(secret: string, userId: number) {
		return this.userRepo.update(userId, { twoFactorAuthenticationSecret: secret });
	}

	async enableTwoFactorAuthentication(userId: number) {
		return this.userRepo.update(userId, { isTwoFactorAuthenticationEnabled: true });
	}
}
