import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Blocklist, Game, Subscription, User} from '../typeorm/';
import { UserDetails, Ranking } from '../utils/types';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
	constructor(
		@InjectRepository(User) private readonly userRepo: Repository<User>,
		@InjectRepository(Game) private readonly gameRepo: Repository<Game>,
		@InjectRepository(Subscription) private readonly subRepo: Repository<Subscription>,
		@InjectRepository(Blocklist) private readonly blockRepo: Repository<Blocklist>,
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

	findUserById(id: number): Promise<User | undefined> {
		return this.userRepo.findOneBy({ id: id });
	}

	async findMatches(id : number) {
		const player_1_games = await this.gameRepo.createQueryBuilder('game')
			.leftJoinAndSelect('game.player_1', 'player_1')
			.leftJoinAndSelect('game.player_2', 'player_2')
			.where('game.player_1 = :id OR game.player_2 = :id', { id: id })
			.getMany()
		return player_1_games;
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
		});

		return ret;
	}

	async addFriend(userId: number, friendUserId: number) {
		const sub = this.subRepo.create();
		sub.subscriber = await this.userRepo.findOneBy({ id: userId });
		sub.subscribedTo = await this.userRepo.findOneBy({ id: friendUserId });
		await this.subRepo.save(sub);
	}

	async getFriends(userId: number) {
		const subscriptions = await this.subRepo.createQueryBuilder('subscription')
			.leftJoinAndSelect('subscription.subscriber', 'subscriber')
			.leftJoinAndSelect('subscription.subscribedTo', 'subscribedTo')
			.where('subscriber.id = :id', { id: userId })
			.getMany()

		return subscriptions;
	}

	async isFriend(userId: number, friendId: number) {
		const result = await this.subRepo.createQueryBuilder('subscription')
			.leftJoinAndSelect('subscription.subscriber', 'subscriber')
			.leftJoinAndSelect('subscription.subscribedTo', 'subscribedTo')
			.where('subscriber.id = :userId AND subscribedTo.id = :friendId', { userId, friendId})
			.getOne();
		
		return result !== null;
	}

	async blockUser(userId: number, blockeeId: number) {
		const block = this.blockRepo.create();
		block.blocker = await this.userRepo.findOneBy({ id: userId });
		block.blockee = await this.userRepo.findOneBy({ id: blockeeId });
		await this.blockRepo.save(block);
	}

	async isBlocked(userId: number, blockeeId: number) {
		const result = await this.blockRepo.createQueryBuilder('blocklist')
			.leftJoinAndSelect('blocklist.blocker', 'blocker')
			.leftJoinAndSelect('blocklist.blockee', 'blockee')
			.where('blocker.id = :userId AND blockee.id = :blockeeId', { userId, blockeeId})
			.getOne();
		
		return result !== null;
	}

	async complete(query: string) {
		const result = await this.userRepo.createQueryBuilder()
			.where('username like :name', { name: `%${query}%` })
			.orWhere('LOWER(display_name) like LOWER(:displayName)', { displayName: `%${query}%` })
			.getMany();

			
		const usernames = result.map((user) => {
			return { username: user.username, photoURL: user.photoURL, displayName: user.displayName };
		});

		return usernames;
	}

	async setStatus(userId: number, status: 'online' | 'offline' | 'in_game') {
		const user = await this.userRepo.findOneBy({ id: userId });
		user.status = status;

		this.userRepo.save(user);
	}

	async setTwoFactorAuthenticationSecret(secret: string, userId: number) {
		return this.userRepo.update(userId, { twoFactorAuthenticationSecret: secret });
	}

	async enableTwoFactorAuthentication(userId: number) {
		return this.userRepo.update(userId, { isTwoFactorAuthenticationEnabled: true, isSecondFactorAuthenticated: true });
	}

	async disableTwoFactorAuthentication(userId: number) {
		return this.userRepo.update(userId, { isTwoFactorAuthenticationEnabled: false, isSecondFactorAuthenticated: false, twoFactorAuthenticationSecret: null });
	}

	async secondFactorAuthenticate(userId: number, state: boolean) {
		return this.userRepo.update(userId, { isSecondFactorAuthenticated: state });
	}

	async addSocketId(user_id: number, socketId: string) {
		return this.userRepo.update(user_id, { socketId });
	}
	
	async findUserBySocketId(socketId: string) {
		return this.userRepo.findOneBy({ socketId });
	}
}
