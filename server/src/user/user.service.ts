import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Game, User} from '../typeorm/';
import { UserDetails, Ranking } from '../utils/types';
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

	async setTwoFactorAuthenticationSecret(secret: string, userId: number) {
		return this.userRepo.update(userId, { twoFactorAuthenticationSecret: secret });
	}

	async enableTwoFactorAuthentication(userId: number) {
		return this.userRepo.update(userId, { isTwoFactorAuthenticationEnabled: true });
	}

	async findLeader() {
		const games = await this.gameRepo.createQueryBuilder('game')
			.leftJoinAndSelect('game.player_1', 'player_1')
			.leftJoinAndSelect('game.player_2', 'player_2')
			.getMany()

		let leaderBoard = new Map<string, Ranking>();
		for (let i = 0; i < games.length; i++)
		{
			leaderBoard.set(games[i].player_1.intraId, {user: games[i].player_1, victories: 0});
			leaderBoard.set(games[i].player_2.intraId, {user: games[i].player_2, victories: 0});
		}

		for (let i = 0; i < games.length; i++)
		{
			if (games[i].player_1_score > games[i].player_2_score)
			{
				let tmp : number = leaderBoard.get(games[i].player_1.intraId).victories;
				tmp ++ ;
				leaderBoard.set(games[i].player_1.intraId, {user: games[i].player_1, victories: tmp} );
			}
			if (games[i].player_2_score > games[i].player_1_score)
			{
				let tmp : number = leaderBoard.get(games[i].player_2.intraId).victories;
				tmp ++ ;
				leaderBoard.set(games[i].player_2.intraId, {user: games[i].player_2, victories: tmp} );
			}
		}

		let ret: Ranking[] = [];

		leaderBoard.forEach((value) => {
			let tmp : Ranking = {user : value.user, victories : value.victories};
			ret.push(tmp);
			// console.log(`${key} | ${value}`);
		});

		// for (let i = 0; i < ret.length; i ++)
		// 	console.log(ret[i]);

		return ret;
	}
}
