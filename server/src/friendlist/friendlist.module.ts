import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Friendlist } from "../typeorm/typeorm.module";
import { FriendlistController } from "./controllers/friendlist.controller";
import { FriendlistService } from "./services/friendlist.service";

@Module({
	controllers: [FriendlistController],
	providers: [
		{
			provide: 'FRIENDLIST_SERVICE',
			useClass: FriendlistService,
		},
	],
	imports: [
		TypeOrmModule.forFeature([Friendlist])
	]
})
export class FriendlistModule {}