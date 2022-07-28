import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FriendlistController } from './friendlist.controller';
import { Friendlist } from './friendlist.entity';
import { FriendlistService } from './friendlist.service';

@Module({
	imports: [TypeOrmModule.forFeature([Friendlist])],
	controllers: [FriendlistController],
	providers: [FriendlistService],
	exports: [FriendlistService]
})
export class FriendlistModule {}
