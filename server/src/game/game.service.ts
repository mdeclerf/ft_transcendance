import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Game } from '../typeorm/';
import { GameDetails } from '../utils/types';

@Injectable()
export class GameService {
 constructor(
   @InjectRepository(Game) private gameRepository: Repository<Game>,
 ) {}
 async createMessage(game: Game): Promise<Game> {
   return await this.gameRepository.save(game);
  }

  async getGame(): Promise<Game[]> {
    return await this.gameRepository.find();
  }

  async createUser(details: GameDetails) : Promise<Game>{
	const user = this.gameRepository.create(details);
	return await this.gameRepository.save(user);
}

async findLeader() {
  const leaderBoard = await this.gameRepository.createQueryBuilder('game')
    .leftJoinAndSelect('game.player_1', 'player_1')
    .leftJoinAndSelect('game.player_2', 'player_2')
    .getMany()
  console.log("in service");
  return leaderBoard;
}

}
