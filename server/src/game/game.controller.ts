import { Controller, Inject, Get} from '@nestjs/common';
import { GameService } from './game.service';
import { Game } from '../typeorm/entities/game.entity';

@Controller('game')
export class GameController {
@Inject(GameService)
	private readonly service: GameService;

	@Get("")
	public getChat() : Promise<Game[]> {
		return this.service.getGame();
	}
}
