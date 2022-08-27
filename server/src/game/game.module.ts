import { Module } from '@nestjs/common';
import { GameGateway } from './game.gateway';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Blocklist, Game, Subscription, User } from '../typeorm/';
import { GameController } from './game.controller';
import { GameService } from './game.service';
import { UserService } from 'src/user/user.service';

@Module({
  imports: [ TypeOrmModule.forFeature([User, Game, Subscription, Blocklist])],
  controllers: [GameController],
  providers: [GameGateway, GameService, UserService],
  exports: [GameService]
})
export class GameModule {}