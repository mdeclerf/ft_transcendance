import { Controller, Inject, Get, Res} from '@nestjs/common';
import { GameService } from './game.service';
import { Game } from '../typeorm/entities/game.entity';
import { Response } from 'express';

@Controller('game')
export class GameController {
@Inject(GameService)
	private readonly service: GameService;

	@Get("")
	public getChat() : Promise<Game[]> {
		return this.service.getGame();
	}

}
