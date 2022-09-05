import { Controller, Inject, Get, Res, UseGuards} from '@nestjs/common';
import { GameService } from './game.service';
import { Game } from '../typeorm/entities/game.entity';
import { AuthenticatedGuard } from 'src/auth/guards/intra-oauth.guard';

@Controller('game')
export class GameController {
@Inject(GameService)
	private readonly service: GameService;

	@Get("")
	@UseGuards(AuthenticatedGuard)
	public getChat() : Promise<Game[]> {
		return this.service.getGame();
	}

}
