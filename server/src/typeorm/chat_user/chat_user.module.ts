import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatUserController } from './chat_user.controller';
import { ChatUser } from './chat_user.entity';
import { ChatUserService } from './chat_user.service';

@Module({
	imports: [TypeOrmModule.forFeature([ChatUser])],
	controllers: [ChatUserController],
	providers: [ChatUserService],
	exports: [ChatUserService]
})
export class ChatUserModule {}
