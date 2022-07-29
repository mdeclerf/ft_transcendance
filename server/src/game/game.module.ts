import { Module } from '@nestjs/common';
import { GameGateway } from './game.gateway';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Game } from './game.entity';
import { GameController } from './game.controller';
import { GameService } from './game.service';

@Module({
  imports: [TypeOrmModule.forRoot({
	type: 'postgres',
	host: 'localhost',
	username: 'user',
	password: '123',
	database: 'game',
	entities: [Game],
	synchronize: true,
  }),
  TypeOrmModule.forFeature([Game]),],
  controllers: [GameController],
  providers: [GameGateway, GameService],
})

export class GameModule {}
