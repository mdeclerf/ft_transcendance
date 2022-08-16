import { Module } from '@nestjs/common';
import { GameGateway } from './game.gateway';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Game } from '../typeorm/';
import { GameController } from './game.controller';
import { GameService } from './game.service';

@Module({
  imports: [ TypeOrmModule.forFeature([Game])],
  controllers: [GameController],
  providers: [GameGateway, GameService],
  exports: [GameService]
})
export class GameModule {}