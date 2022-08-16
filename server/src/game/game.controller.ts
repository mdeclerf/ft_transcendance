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

	@Get('leaderboard')
	async getLeader(@Res() res: Response) {
		const leader = await this.service.findLeader();
		console.log("in controller");
		return res.json( leader );
	}
}
