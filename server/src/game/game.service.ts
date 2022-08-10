import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Game } from '../typeorm';
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

  getCurrentGames() {
    
  }
}
